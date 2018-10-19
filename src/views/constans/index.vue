<template>
  <div class="view">
    <div :class="{remove:!isshowleftbox}" class="left-box" ref="leftbox">
      <div class="conf-box">
        <h4 class="conf-h">未监控车辆</h4>
        <div class="conf-form">
          <el-tabs v-model="tabIndex" @tab-click="handleChangeTab" class="tab">
            <el-tab-pane label="按车牌号码">
              <div v-if="!unMonitorList.length" class="empty-box">
                无未监控车辆
              </div>
              <div v-else class="checkbox">
                <el-checkbox :indeterminate="isUnMonitorindeterminate" v-model="isUnMonitorCheckedAll" @change="unMonitorCheckAllChange">全选</el-checkbox>
                <el-checkbox-group class="scrollBox" v-model="unMonitorIds" @change="unMonitorVehicleChange">
                  <el-checkbox :class="{search:vehicle.id == searchVehicle}" v-for="(vehicle,index) in unMonitorList" v-model="vehicle.id" :key="index" :label="vehicle.id">{{ vehicle.plateNumber }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <el-select v-model="searchVehicle" clearable filterable remote placeholder="请输入关键词" @change="handleSelectNumber">
                <el-option v-for="item in unMonitorList" :key="item.id" :label="item.plateNumber" :value="item.id"></el-option>
              </el-select>
              <button :disabled="!(unMonitorIds.length||searchVehicle)&&tabIndex=='0'" class="btn" @click="handleMonitor">监控</button>
            </el-tab-pane>
            <el-tab-pane label="按车辆状态">
              <div class="conf-form-row">
                <el-checkbox-group v-model="states" class="singleline-checkbox">
                  <el-checkbox label="1">执行任务中</el-checkbox>
                  <el-checkbox label="2">警告</el-checkbox>
                  <el-checkbox label="3">空闲</el-checkbox>
                  <el-checkbox label="0">离线</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="btn-padding">
                <button :disabled="!states.length&&tabIndex=='1'" class="btn" @click="handleMonitor">监控</button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="list-box" v-if="tabIndex == '0'">
        <h4 class="conf-h">当前监控车辆：</h4>
        <button :disabled="!monitorIds.length" class="btn" @click="handleFinish">结束</button>
        <div v-if="!monitorList.length" class="empty-box">
          无监控车辆
        </div>
        <div v-else class="checkbox">
          <el-checkbox v-if="monitorList.length" :indeterminate="isMonitorindeterminate" v-model="isMonitorCheckedAll" @change="monitorCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="monitorIds" @change="monitorVehicleChange">
            <el-checkbox v-for="(vehicle,index) in monitorList" v-model="vehicle.id" :key="index" :label="vehicle.id">{{ vehicle.plateNumber }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="arrow-left" @click="handleIsShowLeftBox">
      <i :class="[isshowleftbox?'el-icon-d-arrow-left':'el-icon-d-arrow-right']"></i>
    </div>
    <div class="right-box" ref="rightbox">
      <div class="map-left-btn">
        <button v-if="isMapView" class="btn" @click="handleChangeView">表格视图</button>
        <button v-else class="btn" @click="handleChangeView">地图视图</button>
      </div>
      <b-map-component v-show="isMapView" ref="map" @handleGetLocation="handleGetLocation"></b-map-component>
      <div v-if="!isMapView">
        <el-table class="table-view" :data="locationList" :max-height="tableHeight">
          <el-table-column align="center" type="index" width="100" label="序号">
          </el-table-column>
          <el-table-column align="center" prop="plateNumber" width="150" label="车牌号">
          </el-table-column>
          <el-table-column align="center" prop="plateBrand" width="100" label="车辆品牌">
          </el-table-column>
          <el-table-column align="center" prop="speed" width="100" label="速度(km/h)">
          </el-table-column>
          <el-table-column align="center" prop="state" width="100" label="状态">
          </el-table-column>
          <el-table-column align="center" prop="driverName" width="150" label="驾驶员姓名">
          </el-table-column>
          <el-table-column align="center" prop="createTime" width="200" label="定位时间">
          </el-table-column>
          <el-table-column align="center" prop="location" label="点位(经度,纬度)">
          </el-table-column>
        </el-table>
        <!-- <pagination :page-size='10' :current-page='1' :total='total'></pagination> -->
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader'
import MyTable from '@/components/Mytable'
import Pagination from '@/components/pagination'
import BMapComponent from './BMapComponent'
import { getInfoList } from '@/api/vehicle'
import { getRecordList } from '@/api/record'
import { getNewPointList } from '@/api/points'

export default {
  components: {
    Loader, MyTable, Pagination, BMapComponent
  },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 230 || document.body.clientHeight - 230,
      tabIndex: '',
      searchVehicle: '',
      list: {
        id: '',
        speed: '',
        state: '',
        driverId: '',
        driverName: '',
        posTime: '',
        vehicleId: '',
        plateNumber: '',
        plateType: '',
        plateBrand: '',
        volume: '',
        orgId: '',
        createTime: '',
        location: '',
        lng: '',
        lat: ''
      },
      isMapView: true, // 显示方式
      isshowleftbox: true,
      oldPointsList: [],
      newPointsList: [],
      isUnMonitorindeterminate: true,
      isMonitorindeterminate: true,
      isUnMonitorCheckedAll: false,
      isMonitorCheckedAll: false,
      vehiclearray: [],
      unMonitorIds: [],
      monitorIds: [],
      unMonitorList: [],
      monitorList: [],
      headerList: ['序号', '速度', '状态', '驾驶员姓名', '定位时间', '车牌号', '车辆品牌', '排量', '点位(经度,纬度)'],
      locationList: [],
      states: [], // 车辆状态
      total: 0, // 总页数
      monitoredIdsArray: [], // 已监控车辆id数组
      count: 0,
      interval: null, // 定时器
      listLoading: true, // 列表加载状态
      param: {},
      paramString: ''
    }
  },
  created() {
    this.fetchVehicle()
  },
  mounted() {
    const that = this;
    window.onresize = function () {
      that.tableHeight = document.documentElement.clientHeight - 230 || document.body.clientHeight - 230
    }
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {
    fetchVehicle() {
      // 获取车辆信息
      getInfoList({ pageNo: 1, pageSize: 1000 }).then(response => {
        this.vehiclearray = response.data.rows
      })
      // 获取已监控车辆列表
      setTimeout(() => {
        getRecordList().then(response => {
          if (!response.data.rows.length) {
            this.unMonitorList = this.vehiclearray
            return
          }
          // 将所有已监控车辆Id字符串用逗号隔开变成数组
          this.monitoredIdsArray = response.data.rows[0].vehicleId.split(',')
          // 遍历所有车辆列表
          this.vehiclearray.forEach(vehicle => {
            // 遍历已监控车辆Id数组
            this.monitoredIdsArray.forEach(id => {
              // 通过已监控id获取车辆信息
              if (id === vehicle.id) {
                // 添加到已监控列表
                this.monitorList.push(vehicle)
              }
            })
          })
        })
        setTimeout(() => {
          if (this.monitorList.length) {
            this.getMonitoredPoint()
          }
          this.unMonitorList = this.vehiclearray.filter(vehicle =>
            !this.monitorList.some(
              monitor => monitor.id === vehicle.id
            )
          )
        }, 100)
      }, 100)
    },
    // 将已监控车辆id已选的数组刷新点位
    getMonitoredPoint() {
      // let paramString = ''
      // let param = null
      this.paramString = ''
      this.monitorList.forEach((vehicle, index) => {
        if (index === this.monitorList.length - 1) {
          this.paramString += vehicle.id
        } else {
          this.paramString += `${vehicle.id},`
        }
      })
      if (this.tabIndex === '1') {
        this.param = { state: this.paramString }
      } else {
        this.param = { vehicleId: this.paramString }
      }
      this.getNewPoint(this.param)
      if (this.total) {
        this.interval = setInterval(() => {
          this.getNewPoint(this.param)
          console.log('this.count', this.count++)
        }, 5000)
      }
    },
    // 获取最新点位列表
    getNewPoint(param) {
      getNewPointList(param).then(response => {
        this.newPointsList = response.data.rows
        this.locationList = JSON.parse(JSON.stringify(response.data.rows))
        if (this.locationList.length === 0) {
          clearInterval(this.interval)
          this.$refs.map.map.clearOverlays()
        } else {
          this.locationList.forEach(location => {
            if (location.state === '0') {
              location.state = '离线'
            } else if (location.state === '1') {
              location.state = '执行任务中'
            } else if (location.state === '2') {
              location.state = '警告'
            } else if (location.state === '3') {
              location.state = '空闲'
            }
          })
          this.total = response.data.total
          // 设置地图的中心点
          this.$refs.map.setZoom(this.newPointsList)
          console.log('param.action', param.action)
          // if (param.action) {
            var allOverlay = this.$refs.map.map.getOverlays()
            console.log("allOverlay", allOverlay.length)
            console.log("this.oldPointsList", this.oldPointsList)
            const pointsList = JSON.parse(JSON.stringify(this.newPointsList))
            if (this.count > 0) {
              for (var j = 0; j < this.oldPointsList.length;) {
                var flag = true
                for (var k = 0; k < this.newPointsList.length; k++) {
                  // 同车同点位
                  if (this.oldPointsList[j].vehicleId === this.newPointsList[k].vehicleId) {
                    flag = false
                    if (this.oldPointsList[j].location === this.newPointsList[k].location) {
                      this.newPointsList.splice(k, 1)
                    } else {
                      for (var m = 0; m < allOverlay.length; m++) {
                        if (`${allOverlay[m].point.lng}` === this.oldPointsList[j].lng &&
                          `${allOverlay[m].point.lat}` === this.oldPointsList[j].lat) {
                          this.$refs.map.map.removeOverlay(allOverlay[m])
                        }
                      }
                    }
                    break
                  } else {
                    flag = true
                  }
                }
                if (flag) {
                  this.$refs.map.map.removeOverlay(allOverlay[j])
                }
                j++
              }
            }
            this.oldPointsList = pointsList
          // }
          // 添加覆盖物到地图
          this.$refs.map.addMarker(this.newPointsList)
        }
      })
    },
    //  切换标签页
    handleChangeTab() {
      if (this.tabIndex === '0') {
        console.log(this.param)
        this.oldPointsList = []
        clearInterval(this.interval)
        // this.oldPointsList = []
        // this.newPointsList = []
        // this.monitorIds = []
        // this.monitorList = []
        this.$refs.map.map.clearOverlays()
        setTimeout(() => {
          this.getMonitoredPoint()
        }, 100)
      }
    },
    // 点击建议项里的车牌号
    handleSelectNumber(data) {
      let searchVehicleIndex = -1
      this.unMonitorList.forEach((vehicle, index) => {
        if (data === vehicle.id) {
          console.log(11111111)
          searchVehicleIndex = index
        }
      })
      const scrollTop = this.unMonitorList.length * searchVehicleIndex
      document.getElementsByClassName('scrollBox')[0].scrollTop = scrollTop
      // this.searchVehicle = data.plateNumber
    },
    // 点击监控
    handleMonitor(index) {
      clearInterval(this.interval)
      this.param = { action: '1' }
      // let paramString = ''
      this.paramString = ''
      if (this.tabIndex === '1') {
        this.states.map((state, index) => {
          if (index === this.states.length - 1) {
            this.paramString += state
          } else {
            this.paramString += `${state},`
          }
        })
        this.param.state = this.paramString
      } else {
        if (this.unMonitorIds.indexOf(this.searchVehicle) === -1) {
          this.unMonitorIds.push(this.searchVehicle)
        }
        this.unMonitorIds.forEach(id => {
          this.unMonitorList.forEach((vehicle, index) => {
            if (id === vehicle.id) {
              this.monitorList.push(vehicle)
              this.unMonitorList.splice(index, 1)
            }
          })
        })
        this.monitorList.map((vehicle, index) => {
          if (index === this.monitorList.length - 1) {
            this.paramString += vehicle.id
          } else {
            this.paramString += `${vehicle.id},`
          }
        })
        this.param.vehicleId = this.paramString
      }
      console.log(123)
      this.getNewPoint(this.param)
      this.interval = setInterval(() => {
        delete this.param.action
        console.log('this.count', this.count++)
        this.getNewPoint(this.param)
      }, 5000)
      this.monitorIds = []
    },
    // 点击结束
    handleFinish() {
      clearInterval(this.interval)
      this.monitorIds.forEach(id => {
        this.monitorList.forEach((vehicle, index) => {
          if (id === vehicle.id) {
            this.monitorList.splice(index, 1)
            this.unMonitorList.push(vehicle)
          }
        })
      })
      this.param = { action: '1' }
      if (this.monitorList.length) {
        // let paramString = ''
        this.paramString = ''
        this.monitorList.forEach((vehicle, index) => {
          if (index === this.monitorList.length - 1) {
            this.paramString += vehicle.id
          } else {
            this.paramString += `${vehicle.id},`
          }
        })
        if (this.tabIndex === '1') {
          this.param.state = this.paramString
        } else {
          this.param.vehicleId = this.paramString
        }
      } else {
        this.param.vehicleId = 'NA'
        this.$refs.map.map.clearOverlays()
        clearInterval(this.interval)
      }
      this.getNewPoint(this.param)
      if (this.monitorList.length) {
        this.interval = setInterval(() => {
          delete this.param.action
          console.log('this.count', this.count++)
          this.getNewPoint(this.param)
        }, 5000)
      }
      this.unMonitorIds = []
      this.monitorIds = []
    },
    // 点击隐藏或显示左边菜单栏
    handleIsShowLeftBox() {
      if (this.isshowleftbox) {
        this.$refs.leftbox.style.display = 'none'
        this.$refs.rightbox.style.width = '100%'
      } else {
        this.$refs.leftbox.style.display = ''
        this.$refs.rightbox.style.width = 'calc(100% - 325px)'
      }
      this.isshowleftbox = !this.isshowleftbox
    },
    // 点击全选未监控车辆
    unMonitorCheckAllChange() {
      this.unMonitorIds = this.isUnMonitorCheckedAll ? this.unMonitorList.map(item => {
        return item.id
      }) : []
      this.isUnMonitorindeterminate = false
    },
    // 点击全选当前监控车辆
    monitorCheckAllChange() {
      this.monitorIds = this.isMonitorCheckedAll ? this.monitorList.map(item => {
        return item.id
      }) : []
      this.isMonitorindeterminate = false
    },
    // 选中未监控车辆列表改变时全选的状态
    unMonitorVehicleChange(value) {
      if (value) {
        this.isUnMonitorCheckedAll = value.length === this.unMonitorList.length
        this.isUnMonitorindeterminate = value.length > 0 && value.length < this.unMonitorList.length
      }
    },
    // 选中当前监控车辆列表改变时全选的状态
    monitorVehicleChange(value) {
      if (value) {
        this.isMonitorCheckedAll = value.length === this.monitorList.length
        this.isMonitorindeterminate = value.length > 0 && value.length < this.monitorList.length
      }
    },
    handleChangeView() {
      this.isMapView = !this.isMapView
    },
    handleGetLocation(location) {
      this.list.location = location
    }
  }
}
</script>
<style lang="scss" scoped>
.map-left-btn {
  z-index: 999;
  position: absolute;
  bottom: 15px;
  .btn {
    opacity: 0.7;
    border-radius: 15px;
    padding: 5px;
    width: 70px;
    height: 40px;
    margin-left: 10px;
  }
}
.el-select {
  padding: 0 5px;
  width: 80%;
}
.tab{
  padding: 0 10px;
}
</style>
