<template>
  <div class="view">
    <div :class="{remove:!isshowleftbox}" class="left-box">
      <div class="conf-box">
        <h4 class="conf-h">定位信息</h4>
        <div class="conf-form">
          <div class="conf-form-row">
            <span class="conf-form-label">车辆状态</span>
            <el-checkbox-group v-model="state" class="singleline-checkbox">
              <el-checkbox label="1">运动</el-checkbox>
              <el-checkbox label="2">静止</el-checkbox>
              <el-checkbox label="0">离线</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="conf-form-row">
            <span class="conf-form-label">精准查车</span>
            <div class="search-vehicle">
              <el-autocomplete valueKey="number" @select="handleSelectNumber" :fetch-suggestions="handleFetchNumber" v-model="vehicle.number" placeholder="输入车牌号搜索"></el-autocomplete>
            </div>
          </div>
        </div>
        <div class="btn-padding">
          <button class="btn" @click="query">查询</button>
        </div>
      </div>
      <div class="list-box">
      </div>
    </div>
    <div class="arrow-left" @click="handleIsShowLeftBox">
      <i :class="[isshowleftbox?'el-icon-d-arrow-left':'el-icon-d-arrow-right']"></i>
    </div>
    <div class="right-box">
      <my-table></my-table>
    </div>
  </div>
</template>

<script>
import { getPageQuery } from '@/api/points'
import MyTable from '@/components/Mytable'
export default {
  components: {
    MyTable
  },
  data() {
    return {
      state: [],
      vehicle: { id: '', number: '' },
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
        { id: 'dfbbb464c900431b9d728491117004f9', number: '川A111114' },
        { id: '681af98e12ed4fa2b95b81d252032a55', number: '川A11111' },
        { id: 'f9b99a7954324a389009631801ef5042', number: '川A222222' }],
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
  methods: {
    // 点击隐藏或显示左边菜单栏
    handleIsShowLeftBox() {
      if (this.isshowleftbox) {
        document.getElementsByClassName('left-box')[0].style.display = 'none'
      } else {
        document.getElementsByClassName('left-box')[0].style.display = ''
      }
      this.isshowleftbox = !this.isshowleftbox
    },
    // 输入车牌号时获取相似车牌号提供输入建议
    handleFetchNumber(querystring, callback) {
      const results = this.vehiclearray.filter(vehicle => {
        if (vehicle.number.toLowerCase().indexOf(querystring.toLowerCase()) === 0) {
          return vehicle
        }
      })
      callback(results)
    },
    // 点击建议项里的车牌号
    handleSelectNumber(data) {
      this.vehicle = JSON.parse(JSON.stringify(data))
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
    query() {
      console.log(this.state)
      console.log(this.vehicle.number)
      getPageQuery().then(response => {
        let resData
        if (response.data) {
          resData = response.data.rows.map(item => {
            let { id, speed, state, driverId, driverName, posTime, vehicleId, plateNumber, plateType, plateBrand, volume, orgId, createTime, location, lng, lat, equipmentNum } = item;
            return { id, speed, state, driverId, driverName, posTime, vehicleId, plateNumber, plateType, plateBrand, volume, orgId, createTime, location, lng, lat, equipmentNum }
          })
          this.newPointsList = resData
          this.showMonitorVehicles()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
