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
                <el-autocomplete valueKey="plateNumber" @select="handleSelectNumber" :fetch-suggestions="handleFetchNumber" trigger-on-focus v-model="searchPlateNumber" placeholder="输入车牌号搜索"></el-autocomplete>
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
import { getInfoList } from '@/api/vehicle'
import { getPointList } from '@/api/points'

export default {
  components: {
    Loader, BMapComponent
  },
  data() {
    return {
      plateNumber: '',
      startTime: '',
      endTime: '',
      searchPlateNumber: '',
      searchId: '',
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
  created() {
    this.fetchVehicle()
  },
  methods: {
    // 获取车辆信息
    fetchVehicle() {
      getInfoList({ pageNo: 1, pageSize: 1000 }).then(response => {
        this.vehiclearray = response.data.rows
        this.total = response.data.total
      })
    },
    // 查询
    handleQuery() {
      let isExistence = false
      this.vehiclearray.forEach(vehicle => {
        if (this.searchPlateNumber === vehicle.plateNumber) {
          this.searchId = vehicle.id
          isExistence = true
        }
      })
      if (!isExistence) {
        this.searchPlateNumber = ''
        this.$message({
          type: 'warning',
          message: '车牌号不存在'
        })
      } else {
        // 判断开始时间是否大于结束时间
        if (this.startTime > this.endTime) {
          this.$message({
            type: 'warning',
            message: '开始时间不能大于结束时间'
          })
          return
        }
        // 将日期时间字符串格式化成日期时间格式
        const startTime = new Date(this.startTime)
        const endTime = new Date(this.endTime)
        console.log(this.startTime)
        console.log(typeof this.startTime)
        // 计算开始时间和结束时间之间的间隔，以天为单位
        const timeInterval = parseInt((endTime - startTime) / 1000 / (24 * 60 * 60))
        // 判断开始时间和结束时间之间的间隔是否大于十天
        if (timeInterval > 10) {
          this.$message({
            type: 'warning',
            message: '开始时间与结束时间之间的间隔不能超过十天'
          })
          return
        }
        getPointList({ vehicleId: this.searchId, startTime: this.startTime, endTime: this.endTime }).then(response => {
          if (response.data) {
            this.pointsList = response.data.rows
            console.log('this.pointsList', this.pointsList)
            this.$refs.map.list = this.pointsList
            this.$refs.map.ready()
            this.$refs.map.setZoom(this.pointsList)
          }
        })
      }
    },
    // 清空
    handleClear() {
      this.searchPlateNumber = ''
      this.startTime = ''
      this.endTime = ''
      this.$refs.map.map.clearOverlays()
    },
    // 输入车牌号时获取相似车牌号提供输入建议
    handleFetchNumber(querystring, callback) {
      const results = []
      this.vehiclearray.forEach(vehicle => {
        const reg = new RegExp(querystring.toLowerCase())
        if (vehicle.plateNumber.toLowerCase().match(reg) !== null) {
          results.push(vehicle)
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
