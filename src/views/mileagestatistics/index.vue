<template>
  <div class="app-container">
    <div class="searchbox">
      <el-form inline>
        <el-form-item label="查询时间范围">
          <el-date-picker v-model="searchDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" @change="handleChangeRange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车牌号码">
          <el-select v-model="searchPlateNumber" clearable filterable remote placeholder="请输入关键词">
            <el-option v-for="(item,index) in vehicleArray" :key="index" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
      </el-form>
    </div>
    <div ref="mileageall" class="echart-box"></div>
    <div ref="mileagedetail" class="echart-box"></div>
  </div>
</template>

<script>
import { getMileage, getMileageDetailAll } from '@/api/points'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      loading: false,
      searchDate: [`${parseTime(new Date(Date.now() - 3600 * 1000 * 24 * 30)).split(' ')[0]} 00:00:00`, `${parseTime(new Date()).split(' ')[0]} 00:00:00`],
      searchType: '',
      searchPlateNumber: '',
      totalChart: '',
      listData: null,
      totalOption: '',
      driverChart: '',
      driverData: null,
      driverOption: '',
      vehicleChart: '',
      vehicleData: null,
      vehicleOption: '',
      startTime: '',
      endTime: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      mileageallChart: null,
      mileageallOption: {},
      mileageall: { plateNumber: [], mileage: [] },
      detailPlateNumber: '',
      mileagedetailChart: null,
      mileagedetailOption: {},
      mileagedetail: { mileage: [], posTime: [] },
      param: {},
      vehicleArray: []
    }
  },
  mounted() {
    this.startTime = parseTime(this.searchDate[0])
    this.endTime = parseTime(this.searchDate[1])
    this.initCharts()
  },
  methods: {
    initCharts() {
      this.mileageallChart = echarts.init(this.$refs.mileageall)
      this.mileagedetailChart = echarts.init(this.$refs.mileagedetail)
      this.initChartsOption()
      this.getChartsData()
      this.mileageallChart.setOption(this.mileageallOption)
      this.mileageallChart.on('click', (param) => {
        if (param.name !== '' && param.name !== this.detailPlateNumber) {
          this.detailPlateNumber = param.name
          this.handleShowDetail()
        }
      })
    },
    initChartsOption() {
      this.mileageallOption = {
        color: ['#49978A', '#7FE0CD', '#9BCA48', '#fbb263', '#5B98B4', '#51559D'],
        title: {
          text: '里程统计',
          show: true,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '查看{b}里程详情'
        },
        legend: { top: '10%' },
        grid: { top: '25%' },
        xAxis: [
          {
            gridIndex: 0,
            name: '里程(km)',
            minInterval: 1,
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: {
          type: 'category',
          name: '车牌号码',
          splitLine: {
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            stack: 'chart',
            label: {
              normal: {
                position: 'right',
                show: true
              }
            }
          }
        ]
      }
    },
    getChartsData() {
      this.param = { startTime: this.searchDate[0], endTime: this.searchDate[1], plateNumber: this.searchPlateNumber }
      if (!this.searchPlateNumber) {
        delete this.param.plateNumber
      }
      this.mileageall = { plateNumber: [], mileage: [] }
      this.mileageallChart.showLoading({
        text: '加载中',
        color: '#008080'
      })
      getMileage(this.param).then(response => {
        if (response.data) {
          this.mileageallChart.hideLoading()
          response.data.rows.forEach(element => {
            this.mileageall.plateNumber.push(element.plateNumber)
            this.mileageall.mileage.push(element.mileage)
          })
          if (!this.vehicleArray.length) {
            this.vehicleArray = this.mileageall.plateNumber
          }
          this.detailPlateNumber = this.mileageall.plateNumber[0]
          this.mileageallChart.setOption({
            yAxis: { data: this.mileageall.plateNumber },
            series: { data: this.mileageall.mileage }
          })
          if (response.data.rows.length) {
            this.handleShowDetail()
          } else {
            this.mileagedetailChart.clear()
          }
        }
      })
    },
    toSearch() {
      if (!this.searchDate) {
        this.$message({
          message: '请选择查询时间范围',
          type: 'warning'
        })
        return
      }
      this.getChartsData()
    },
    handleShowDetail() {
      this.mileagedetailOption = {
        title: {
          text: `${this.detailPlateNumber}里程详情`,
          show: true,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}km'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            name: '日期'
          }
        ],
        yAxis: {
          type: 'value',
          name: '里程(km)'
        },
        series: [
          {
            type: 'line',
            label: {
              normal: {
                position: 'right',
                show: true
              }
            },
            color: '#49978A'
          }
        ]
      }
      this.mileagedetailChart.setOption(this.mileagedetailOption)
      this.mileagedetail = { mileage: [], posTime: [] }
      this.param = { startTime: this.searchDate[0], endTime: this.searchDate[1], plateNumber: this.detailPlateNumber }
      getMileageDetailAll(this.param).then(response => {
        response.data.rows.forEach(element => {
          element.posTime = element.posTime.split(' ')[0]
          this.mileagedetail.mileage.push(element.mileage)
          this.mileagedetail.posTime.push(element.posTime)
        })
        this.mileagedetailChart.setOption({
          series: { data: this.mileagedetail.mileage },
          xAxis: { data: this.mileagedetail.posTime }
        })
      })
    },
    handleChangeRange() {
      if (this.searchDate) {
        const timeInterval = parseInt((new Date(this.searchDate[1]) - new Date(this.searchDate[0])) / 1000 / (24 * 60 * 60))
        if (timeInterval > 30) {
          this.$message({
            type: 'warning',
            message: '查询时间范围不能大于30天'
          })
          this.searchDate = []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.searchbox {
  margin: 20px auto 80px;
}
.el-range-editor.el-input__inner {
  width: 400px;
}
.echart-box {
  display: inline-block;
  width: 49%;
  min-width: 500px;
  height: 300px;
}
</style>

