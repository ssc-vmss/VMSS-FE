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
                <el-select v-model="searchPlateNumber" clearable filterable remote placeholder="请输入关键词">
                  <el-option v-for="item in vehiclearray" :key="item.id" :label="item.plateNumber" :value="item.id"></el-option>
                </el-select>
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
      vehiclearray: [],
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
      if (!this.searchPlateNumber) {
        this.$message({
          type: 'warning',
          message: '车牌号不能为空'
        })
        return
      }
      window.clearTimeout(this.$refs.map.timer)
      this.$refs.map.index = 0
      this.$refs.map.map.clearOverlays()
      let isExistence = false
      this.vehiclearray.forEach(vehicle => {
        if (this.searchPlateNumber === vehicle.id) {
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
          if (response.data.rows.length) {
            this.pointsList = response.data.rows
            this.$refs.map.list = this.pointsList
            this.$refs.map.ready()
            this.$refs.map.setZoom(this.pointsList)
          } else {
            this.$message({
              type: 'info',
              message: '该查询条件没有轨迹'
            })
          }
        })
      }
    },
    // 清空
    handleClear() {
      this.searchPlateNumber = ''
      this.startTime = ''
      this.endTime = ''
      this.$refs.map.list = []
      this.$refs.map.isChecked = false
      this.$refs.map.speed = 2000
      window.clearTimeout(this.$refs.map.timer)
      this.$refs.map.map.clearOverlays()
      this.$refs.map.map.centerAndZoom(new BMap.Point(104.085145, 30.642301), 15) // 初始化地图,设置中心点坐标和地图级别
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
