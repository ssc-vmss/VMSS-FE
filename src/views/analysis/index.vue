<template>
  <div class="view">
    <div :class="{remove:!isshowleftbox}" class="left-box">
      <div class="conf-box">
        <h4 class="conf-h">查询轨迹</h4>
        <div class="conf-form">
          <div class="conf-form">
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>车牌号</span>
                <span class="required-span">*</span>
              </div>
              <input class="conf-form-input" v-model="plateNumber" type="text" placeholder="请输入车牌号">
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>开始时间</span>
              </div>
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="startTime" type="datetime" class="datetime-picker" placeholder="选择时间"></el-date-picker>
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>结束时间</span>
              </div>
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="endTime" type="datetime" class="datetime-picker" placeholder="选择时间"></el-date-picker>
            </div>
          </div>
          <div class="btn-padding">
            <button class="btn" @click="handleQuery">查询</button>
            <button class="btn" @click="handleClear">清空</button>
          </div>
        </div>
      </div>
      <div class="list-box">
        <h4 class="conf-h">历史轨迹数据</h4>
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
      <!-- <b-map-component ref="map" @handleGetLocation="handleGetLocation"></b-map-component> -->
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader'
import BMapComponent from './BMapComponent'
import { getPointList } from '@/api/points'

export default {
  components: {
    Loader, BMapComponent
  },
  data() {
    return {
      plateNumbers: [],
      plateNumber: '',
      startTime: '',
      endTime: '',
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
      pointsList: null,
      vehicleIndex: -1,
      isindeterminate: true,
      ischeckedall: false,
      vehiclearray: [
        { id: '0', number: '川A4661561' },
        { id: '1', number: '川C4564965' },
        { id: '2', number: '渝A7484414' },
        { id: '3', number: '粤A4558587' },
        { id: '4', number: '川C4567777' },
        { id: '5', number: '渝B4848448' }],
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
    // this.fetchData()
  },
  methods: {
    // 查询
    handleQuery() {
      console.log(this.plateNumber)
      console.log(this.startTime)
      console.log(this.endTime)
    },
    // 清空
    handleClear() {
      this.plateNumber = ''
      this.startTime = ''
      this.endTime = ''
    },
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
    // 获取区域列表
    fetchData() {
      // 未加载时显示加载动画
      this.listLoading = true
      getPointList().then(response => {
        let resData
        if (response.data) {
          resData = response.data.rows.map(item => {
            let { id, speed, state, driverId, driverName, posTime, vehicleId, plateNumber, plateType, plateBrand, volume, orgId, createTime, location, lng, lat } = item;
            return { id, speed, state, driverId, driverName, posTime, vehicleId, plateNumber, plateType, plateBrand, volume, orgId, createTime, location, lng, lat }
          })
          this.pointsList = resData
          console.log(this.pointsList)
          this.pointsList.map(point => {
            this.plateNumbers.push(point.plateNumber)
          })
          this.vehicle
        }
        this.listLoading = false
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
      if (this.vehicleIndex === -1) {
        this.vehicleIndex = index
      } else {
        this.vehicleIndex = -1
      }
      console.log(this.pointsList)
      console.log(typeof this.pointsList)
      this.$refs.map.setZoom(this.pointsList)
      this.$refs.map.addMarker(this.pointsList)
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
    // handleVehicleChange(value) {
    //   this.ischeckedall = value.length === this.vehiclearray.length
    //   this.isindeterminate = value.length > 0 && value.length < this.vehiclearray.length
    // },
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
