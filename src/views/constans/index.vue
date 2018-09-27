<template>
  <div class="view">
    <div :class="{remove:!isshowleftbox}" class="left-box" ref="leftbox">
      <div class="conf-box">
        <h4 class="conf-h">未监控车辆</h4>
        <div class="conf-form">
          <el-tabs v-model="tabIndex">
            <el-tab-pane label="按车牌号码">
              <div v-if="!unMonitorList.length" class="empty-box">
                暂无车辆
              </div>
              <div v-else class="checkbox">
                <el-checkbox v-if="unMonitorList.length" :indeterminate="isUnMonitorindeterminate" v-model="isUnMonitorCheckedAll" @change="unMonitorCheckAllChange">全选</el-checkbox>
                <el-checkbox-group class="scrollBox" v-model="unMonitorIds" @change="unMonitorVehicleChange">
                  <el-checkbox :class="{search:vehicle.plateNumber == searchVehicle}" v-for="(vehicle,index) in unMonitorList" v-model="vehicle.id" :key="index" :label="vehicle.id">{{ vehicle.plateNumber }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <el-autocomplete valueKey="plateNumber" @select="handleSelectNumber" :fetch-suggestions="handleFetchNumber" trigger-on-focus v-model="searchVehicle" placeholder="输入车牌号搜索"></el-autocomplete>
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
            </el-tab-pane>
          </el-tabs>
          <div class="btn-padding">
            <button :disabled="(!unMonitorIds.length&&tabIndex=='0')||(!states.length&&tabIndex=='1')" class="btn" @click="handleMonitor">监控</button>
          </div>
        </div>
      </div>
      <div class="list-box">
        <h4 class="conf-h">当前监控车辆</h4>
        <button :disabled="!monitorIds.length" class="btn" @click="handlePause">暂停</button>
        <button :disabled="!monitorIds.length" class="btn" @click="handleFinish">结束</button>
        <div class="checkbox">
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
      <div v-show="!isMapView">
        <my-table :header="headerList" :tableData="locationList"></my-table>
        <pagination :page-size='10' :current-page='1' :total='total'></pagination>
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
import { getPageQuery, getNewPointList, addPoint } from '@/api/points'

export default {
  components: {
    Loader, MyTable, Pagination, BMapComponent
  },
  data() {
    return {
      tabIndex: '',
      searchVehicle: '',
      isSelected: false,
      isChecked: false,
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
      newPointsList: null,
      vehicleIndex: -1,
      isUnMonitorindeterminate: true,
      isMonitorindeterminate: true,
      isUnMonitorCheckedAll: false,
      isMonitorCheckedAll: false,
      vehiclearray: [
        { id: 'f9b99a7954324a389009631801ef5042', plateNumber: '川A22222' },
        { id: '681af98e12ed4fa2b95b81d252032a55', plateNumber: '川A11111' },
        { id: '1db6ccad42a5467f94d8da5d188866c7', plateNumber: '川A11v12' },
        { id: 'f9b99a7954324a38r409631801ef5042', plateNumber: '川A2z222' },
        { id: '6c4af98e12ed4fa2b95b81d252032a55', plateNumber: '川A111u1' },
        { id: '1db6ccad17a5m97f94d8da5d188866c7', plateNumber: '川Artr22' },
        { id: 'f9b99a79o5324a389009631801ef5042', plateNumber: '川A2but2' },
        { id: '681af98e12ed4j9a2b95b81d52032a55', plateNumber: '川Aasvv1' },
        { id: '1ds6ccad17a5467f94d8da5d188866c7', plateNumber: '川Avd122' },
        { id: 'f9b99a7954324a3890096vbgbggf5042', plateNumber: '川A2hc22' },
        { id: '681aegtyn2ed4fa2b95b81d252032a55', plateNumber: '川A1m7w1' },
        { id: '1db6ccad17a54myfdsay665d188866c7', plateNumber: '川Aaxw22' },
        { id: 'f9b9fsebdbfdbyijnyhyuk8i01ef5042', plateNumber: '川Amiyg2' },
        { id: '681affsd52ed4km888j681d252032a55', plateNumber: '川Afew11' },
        { id: '1db6ccdef4fby7j76nbtda5d188866c7', plateNumber: '川Aask22' }
      ],
      unMonitorIds: [],
      monitorIds: [],
      unMonitorList: [],
      monitorList: [],
      headerList: ['id', '速度', '状态', '驾驶员id', '驾驶员姓名', 'posTime', '车辆id', '车牌号', '车牌类型', 'plateBrand', 'volume', '组织id', '创建时间', '点位', '起点', '终点', '设备号'],
      locationList: [],
      states: [], // 车辆状态
      total: 0 // 总页数
    }
  },
  created() {
    this.fetchVehicle()
  },
  methods: {

    fetchVehicle() {
      // 获取车辆信息
      getInfoList({ pageNo: 1, pageSize: 1000 }).then(response => {
        this.vehiclearray = response.data.rows
        this.unMonitorList = this.vehiclearray
        this.total = response.data.total
      })
      // 获取已监控车辆列表
      // getRecordList().then(response => {
      //   console.log(response)
      //   this.monitorList = response.data.rows
      // })
      // this.unMonitorList = this.vehiclearray
    },
    // 输入车牌号时获取相似车牌号提供输入建议
    handleFetchNumber(querystring, callback) {
      const results = []
      this.unMonitorList.forEach(vehicle => {
        const reg = new RegExp(querystring.toLowerCase())
        if (vehicle.plateNumber.toLowerCase().match(reg) !== null) {
          results.push(vehicle)
        }
      })
      callback(results)
    },
    // 点击建议项里的车牌号
    handleSelectNumber(data) {
      const scrollBoxHeight = document.getElementsByClassName('scrollBox')[0].offsetHeight
      let searchVehicleIndex = -1
      this.unMonitorList.forEach((vehicle, index) => {
        if (data.plateNumber === vehicle.plateNumber) {
          searchVehicleIndex = index
        }
      })
      const scrollTop = this.unMonitorList.length * searchVehicleIndex
      document.getElementsByClassName('scrollBox')[0].scrollTop = scrollTop
      this.searchVehicle = data.plateNumber
    },
    // 点击监控
    handleMonitor() {
      // if (this.) {

      // }
      let paramString = ''
      if (this.tabIndex === '1') {
        console.log(0)
        this.states.map((state, index) => {
          if (index === this.states.length - 1) {
            console.log(1)
            paramString += state
          } else {
            console.log(2)
            paramString += `${state},`
          }
        })
        const param = { state: paramString }
        // if (this.isMapView) {
        console.log(3)
        this.getNewPoint(param)
        // } else {
        console.log(4)
        this.getPage(param)
        // }
      } else {
        console.log(5)
        this.unMonitorIds.forEach(id => {
          this.unMonitorList.forEach((vehicle, index) => {
            if (id === vehicle.id) {
              console.log(6)
              this.monitorList.push(vehicle)
              this.unMonitorList.splice(index, 1)
            }
          })
        })
        this.unMonitorIds.map((id, index) => {
          if (index === this.unMonitorIds.length - 1) {
            console.log(7)
            paramString += id
          } else {
            console.log(8)
            paramString += `${id},`
          }
        })
        const param = { vehicleId: paramString }
        // if (this.isMapView) {
        console.log(9)
        this.getNewPoint(param)
        // } else {
        console.log(1)
        this.getPage(param)
        // }
      }
    },
    // 获取定位信息列表
    getPage(param) {
      getPageQuery(param).then(response => {
        console.log('reaponse', response)
        this.locationList = response.data.rows
        this.locationList.forEach((location, index) => {
          location.id = index + 1
        })
        console.log('this.locationList', this.locationList)
        this.total = response.data.total
      })
    },
    // 获取最新点位列表
    getNewPoint(param) {
      this.$refs.map.map.clearOverlays()
      getNewPointList(param).then(response => {
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: response.message
          })
        }
        this.newPointsList = response.data.rows
        this.$refs.map.setZoom(this.newPointsList)
        this.$refs.map.addMarker(this.newPointsList)
      })
      this.isMonitorCheckedAll = true
      this.monitorCheckAllChange()
    },
    // 点击暂停
    handlePause() {
      console.log('点击暂停')
    },
    // 点击结束
    handleFinish() {
      this.monitorIds.forEach(id => {
        this.monitorList.forEach((vehicle, index) => {
          if (id === vehicle.id) {
            this.monitorList.splice(index, 1)
            this.unMonitorList.push(vehicle)
          }
        })
      })
      let paramString = ''
      let param = null
      this.monitorList.forEach((vehicle, index) => {
        if (index === this.monitorList.length - 1) {
          paramString += vehicle.id
        } else {
          paramString += `${vehicle.id},`
        }
      })
      if (this.tabIndex === '1') {
        param = { state: paramString }
      } else {
        param = { vehicleId: paramString }
      }
      this.getNewPoint(param)
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
</style>
