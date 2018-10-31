<template>
  <div class="app-container">
    <div class="searchbox">
      <el-form inline>
        <el-form-item label="查询时间范围">
          <el-date-picker v-model="searchDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" @change="handleChangeRange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车牌号码">
          <el-select v-model="searchDriverName" clearable filterable remote placeholder="请输入关键词">
            <el-option v-for="(item,index) in vehicleArray" :key="index" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
      </el-form>
    </div>
    <div ref="speedall" class="echart-box"></div>
    <div ref="speeddetail" class="echart-box"></div>
  </div>
</template>

<script>
import { getVehicleStatistics, getVehicleDetailAll } from '@/api/warn'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      searchDate: [`${parseTime(new Date(Date.now() - 3600 * 1000 * 24 * 30)).split(' ')[0]} 00:00:00`, `${parseTime(new Date()).split(' ')[0]} 00:00:00`],
      searchDriverName: [],
      startTime: '',
      endTime: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      speedallChart: null,
      speedallOption: {},
      speedall: { plateNumber: [], count: [] },
      detailPlateNumber: '',
      speeddetailChart: null,
      speeddetailOption: {},
      speeddetail: { count: [], createTime: [] },
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
      this.speedallChart = echarts.init(this.$refs.speedall)
      this.speeddetailChart = echarts.init(this.$refs.speeddetail)
      this.initChartsOption()
      this.getChartsData()
      this.speedallChart.setOption(this.speedallOption)
      this.speedallChart.on('click', (param) => {
        if (param.name !== '' && param.name !== this.detailPlateNumber) {
          this.detailPlateNumber = param.name
          this.handleShowDetail()
        }
      })
    },
    initChartsOption() {
      this.speedallOption = {
        color: ['#49978A', '#7FE0CD', '#9BCA48', '#fbb263', '#5B98B4', '#51559D'],
        title: {
          text: '无单违规统计',
          show: true,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '查看{b}无单违规次数详情'
        },
        xAxis: [
          {
            gridIndex: 0,
            name: '次数',
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
      this.param = { startTime: this.searchDate[0], endTime: this.searchDate[1], plateNumber: this.searchDriverName, type: '3' }
      if (!this.searchDriverName) {
        delete this.param.plateNumber
      }
      this.speedall = { plateNumber: [], count: [] }
      this.speedallChart.showLoading({
        text: '加载中',
        color: '#008080'
      })
      getVehicleStatistics(this.param).then(response => {
        if (response.data) {
          this.speedallChart.hideLoading()
          response.data.rows.forEach(element => {
            this.speedall.plateNumber.push(element.plateNumber)
            this.speedall.count.push(element.count)
          })
          if (!this.vehicleArray.length) {
            this.vehicleArray = this.speedall.plateNumber
          }
          this.detailPlateNumber = this.speedall.plateNumber[0]
          this.speedallChart.setOption({
            yAxis: { data: this.speedall.plateNumber },
            series: { data: this.speedall.count }
          })
          if (response.data.rows.length) {
            this.handleShowDetail()
          } else {
            this.speeddetailChart.clear()
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
      this.speeddetailOption = {
        title: {
          text: `${this.detailPlateNumber}无单违规次数详情`,
          show: true,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}次'
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
          name: '次数',
          minInterval: 1
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
      this.speeddetailChart.setOption(this.speeddetailOption)
      this.speeddetail = { count: [], createTime: [] }
      this.param = { startTime: this.searchDate[0], endTime: this.searchDate[1], plateNumber: this.detailPlateNumber, type: '3' }
      getVehicleDetailAll(this.param).then(response => {
        response.data.rows.forEach(element => {
          element.createTime = element.createTime.split(' ')[0]
          this.speeddetail.count.push(element.count)
          this.speeddetail.createTime.push(element.createTime)
        })
        this.speeddetailChart.setOption({
          series: { data: this.speeddetail.count },
          xAxis: { data: this.speeddetail.createTime }
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

