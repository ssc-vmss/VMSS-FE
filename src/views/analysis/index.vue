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
              </div>
              <div class="search-vehicle">
                <el-autocomplete valueKey="number" @select="handleSelectNumber" :fetch-suggestions="handleFetchNumber" v-model="vehicle.number" placeholder="输入车牌号搜索"></el-autocomplete>
              </div>
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
      </div>
    </div>
    <div class="arrow-left" @click="handleIsShowLeftBox">
      <i :class="[isshowleftbox?'el-icon-d-arrow-left':'el-icon-d-arrow-right']"></i>
    </div>
    <div class="right-box">
      <b-map-component ref="map"></b-map-component>
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
      vehicle: { id: '', number: '' },
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
        { id: 'dfbbb464c900431b9d728491117004f9', number: '川A111114' },
        { id: '681af98e12ed4fa2b95b81d252032a55', number: '川A11111' },
        { id: 'f9b99a7954324a389009631801ef5042', number: '川A222222' }
      ],
      vehicleIds: []
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
    // 查询
    handleQuery() {
      let isExistence = false
      this.vehiclearray.map(vehicle => {
        if (this.vehicle.number === vehicle.number) {
          isExistence = true
        }
      })
      if (!isExistence) {
        this.vehicle = { id: '', number: '' }
        this.$message({
          type: 'warning',
          message: '车牌号不存在'
        })
      } else {
        getPointList({ vehicleId: this.vehicle.id }).then(response => {
          let resData
          if (response.data) {
            resData = response.data.rows.map(item => {
              const { id, speed, state, driverId, driverName, posTime, vehicleId, plateNumber, plateType, plateBrand, volume, orgId, createTime, location, lng, lat } = item
              return { id, speed, state, driverId, driverName, posTime, vehicleId, plateNumber, plateType, plateBrand, volume, orgId, createTime, location, lng, lat }
            })
            this.pointsList = resData
            this.$refs.map.list = this.pointsList
            this.$refs.map.ready()
          }
        })
      }
    },
    // 清空
    handleClear() {
      this.vehicle = { id: '', number: '' }
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
    // 点击隐藏或显示左边菜单栏
    handleIsShowLeftBox() {
      if (this.isshowleftbox) {
        document.getElementsByClassName('left-box')[0].style.display = 'none'
      } else {
        document.getElementsByClassName('left-box')[0].style.display = ''
      }
      this.isshowleftbox = !this.isshowleftbox
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
