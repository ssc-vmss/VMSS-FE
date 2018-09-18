<template>
  <div class="view">
    <div :class="{remove:!isshowleftbox}" class="left-box">
      <div class="conf-box">
        <h4 class="conf-h">全部车辆</h4>
        <div class="conf-form">
          <div class="checkbox">
            <el-checkbox :indeterminate="isindeterminate" v-model="ischeckedall" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="vehicleIds" @change="handleVehicleChange">
              <el-checkbox v-for="(vehicle,index) in vehiclearray" :disabled="monitorList.indexOf(vehicle)>-1" v-model="vehicle.number" :checked="searchVehicle&&searchVehicle.number==vehicle.number" :key="index" :label="vehicle.id" @change="handleCheckChange">{{ vehicle.number }}</el-checkbox>
            </el-checkbox-group>
            <div class="search-vehicle">
              <el-autocomplete valueKey="number" @select="handleSelectNumber" :fetch-suggestions="handleFetchVehicle" v-model="searchVehicle.number" :trigger-on-focus="false" placeholder="输入车牌号搜索"></el-autocomplete>
              <div v-if="searchVehicle.number">
                <button v-show="isSelected" class="btn" @click="handleCheckVehicle">选中</button>
                <button v-show="isChecked" class="btn" @click="handleCancleCheckVehicle">取消选中</button>
              </div>
            </div>
          </div>
          <div class="btn-padding">
            <button :disabled="vehicleIndex>-1" class="btn" @click="handleMonitor">监控</button>
            <button :disabled="vehicleIndex==-1" class="btn" @click="handlePause">暂停</button>
            <button :disabled="vehicleIndex==-1" class="btn" @click="handleFinish">结束</button>
          </div>
        </div>
      </div>
      <div class="list-box">
        <h4 class="conf-h">当前监控车辆</h4>
        <loader v-if="listLoading"></loader>
        <div v-else class="list">
          <ul>
            <li v-for="(vehicle,index) in monitorList" :class="{selected:vehicleIndex == index}" :key="index" @click="handleSelectVehicle(index)">{{ vehicle.number }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="arrow-left" @click="handleIsShowLeftBox">
      <i :class="[isshowleftbox?'el-icon-d-arrow-left':'el-icon-d-arrow-right']"></i>
    </div>
    <div class="right-box">
      <b-map-component ref="map" @handleGetLocation="handleGetLocation"></b-map-component>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader'
import BMapComponent from './BMapComponent'
import { getNewPointList, addPoint } from '@/api/points'

export default {
  components: {
    Loader, BMapComponent
  },
  data() {
    return {
      searchVehicle: { id: '', number: '' },
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
      listLoading: false, // 列表加载状态
      isshowleftbox: true,
      newPointsList: null,
      vehicleIndex: -1,
      isindeterminate: true,
      ischeckedall: false,
      vehiclearray: [
        { id: 'f9b99a7954324a389009631801ef5042', number: '川A22222' },
        { id: '681af98e12ed4fa2b95b81d252032a55', number: '川A11111' },
        { id: '1db6ccad17a5467f94d8da5d188866c7', number: '川A111122' }
      ],
      vehicleIds: [],
      monitorList: []
    }
  },
  watch: {
    'searchVehicle': {
      handler(newVal) {
        this.handleSearchChange()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  methods: {
    // 搜索框内容改变时
    handleSearchChange() {
      this.isSelected = false
      this.isChecked = false
      this.vehiclearray.map((vehicle, index) => {
        if (vehicle.number === this.searchVehicle.number) {
          this.isSelected = true
          if (this.vehicleIds.indexOf(vehicle.id) > -1) {
            this.isChecked = true
          }
        }
      })
    },
    // 输入车牌号时获取相似车牌号提供输入建议
    handleFetchVehicle(querystring, callback) {
      let results = this.vehiclearray.filter(vehicle => {
        if (vehicle.number.toLowerCase().indexOf(querystring.toLowerCase()) === 0) {
          return vehicle
        }
      })
      callback(results)
    },
    // 点击建议项里的车牌号
    handleSelectNumber(data) {
      this.searchVehicle = JSON.parse(JSON.stringify(data))
    },
    // 点击选中当前搜索车辆
    handleCheckVehicle() {
      this.vehicleIds.push(this.searchVehicle.id)
      this.isSelected = false
      this.isChecked = true
    },
    // 点击取消选中当前搜索车辆
    handleCancleCheckVehicle() {
      this.isSelected = true
      this.isChecked = false
      this.vehicleIds.map((id, index) => {
        if (this.searchVehicle.id === id) {
          this.vehicleIds.splice(index, 1)
        }
      })
    },
    // 显示当前所有监控车辆
    showMonitorVehicles() {
      this.$refs.map.setZoom(this.newPointsList)
      this.$refs.map.addMarker(this.newPointsList)
    },
    // 点击监控
    handleMonitor() {
      this.monitorList = this.vehiclearray.filter((vehicle, index) => {
        if (this.vehicleIds.indexOf(vehicle.id) > -1) {
          return this.vehiclearray[index].number
        }
      })
      this.searchVehicle = { id: '', number: '' }
      let idsString = ''
      this.vehicleIds.map((id, index) => {
        if (index === this.vehicleIds.length - 1) {
          idsString += id
        } else {
          idsString += `${id},`
        }
      })
      this.getNewPoint(idsString)
    },
    // 点击暂停
    handlePause() {
      console.log('点击暂停')
    },
    // 点击结束
    handleFinish() {
      this.vehicleIds.map((id, index) => {
        if (this.monitorList[this.vehicleIndex].id === id) {
          this.vehicleIds.splice(index, 1)
          // this.newPointsList.splice(index, 1)
        }
      })
      this.searchVehicle = this.monitorList[this.vehicleIndex]
      this.monitorList.splice(this.vehicleIndex, 1)
      this.newPointsList.splice(this.vehicleIndex, 1)
      this.vehicleIndex = -1
      this.$refs.map.map.clearOverlays()
      this.showMonitorVehicles()
    },
    // 获取最新点位列表
    getNewPoint(idsString) {
      getNewPointList({ vehicleId: idsString }).then(response => {
        let resData
        if (response.data) {
          resData = response.data.rows.map(item => {
            let { id, speed, state, driverId, driverName, posTime, vehicleId, plateNumber, plateType, plateBrand, volume, orgId, createTime, location, lng, lat } = item;
            return { id, speed, state, driverId, driverName, posTime, vehicleId, plateNumber, plateType, plateBrand, volume, orgId, createTime, location, lng, lat }
          })
          this.newPointsList = resData
          this.showMonitorVehicles()
        }
      })
    },
    // 点击隐藏或显示左边菜单栏
    handleIsShowLeftBox() {
      if (this.isshowleftbox) {
        document.getElementsByClassName('left-box')[0].style.display = 'none'
      } else {
        document.getElementsByClassName('left-box')[0].style.display = ''
      }
      this.isshowleftbox = !this.isshowleftbox
    },
    // 点击监控车辆列表
    handleSelectVehicle(index) {
      this.searchVehicle = { id: '', number: '' }
      if (this.vehicleIndex === index) {
        this.vehicleIndex = -1
        this.showMonitorVehicles()
        // this.$refs.map.map.clearOverlays()
      } else {
        this.vehicleIndex = index
        this.$refs.map.setZoom([this.newPointsList[this.vehicleIndex]])
        this.$refs.map.addMarker([this.newPointsList[this.vehicleIndex]])
      }
    },
    // 点击全选
    handleCheckAllChange() {
      this.vehicleIds = this.ischeckedall ? this.vehiclearray.map(item => {
        return item.id
      }) : []
      this.isindeterminate = false
      this.searchVehicle = { id: '', number: '' }
    },
    // 点击车辆列表的单选框
    handleCheckChange() {
      this.searchVehicle = { id: '', number: '' }
    },
    // 选中车辆列表改变时全选的状态
    handleVehicleChange(value) {
      if (value) {
        this.ischeckedall = value.length === this.vehiclearray.length
        this.isindeterminate = value.length > 0 && value.length < this.vehiclearray.length
      }
    },
    handleGetLocation(location) {
      this.list.location = location
    }
  }
}
</script>
<style lang="scss" scoped>
.search-vehicle {
  position: relative;
  .btn {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    padding: 2px 10px;
    margin: 10px 15px;
  }
}
</style>
