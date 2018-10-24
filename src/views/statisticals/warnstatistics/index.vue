<template>
  <div class="app-container">
    <div class="searchbox">
      <el-form inline>
        <el-form-item label="查询时间范围">
          <el-date-picker v-model="searchDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" @change="handleChangeRange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶员姓名">
          <el-select v-model="searchDriverName" clearable filterable remote placeholder="请输入关键词">
            <el-option v-for="(item,index) in driverArray" :key="index" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
      </el-form>
    </div>
    <div ref="warnall" class="echart-box"></div>
    <div ref="warndetail" class="echart-box"></div>
  </div>
</template>

<script>
import { getStatistics, getDetailAll } from '@/api/warn'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      searchDate: [`${parseTime(new Date(Date.now() - 3600 * 1000 * 24 * 30)).split(' ')[0]} 00:00:00`, `${parseTime(new Date()).split(' ')[0]} 00:00:00`],
      searchDriverName: '',
      startTime: '',
      endTime: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      warnallChart: null,
      warnallOption: {},
      warnall: { driverName: [], count: [] },
      detailPlateNumber: '',
      warndetailChart: null,
      warndetailOption: {},
      warndetail: { count: [], createTime: [] },
      param: {},
      driverArray: []
    }
  },
  mounted() {
    this.startTime = parseTime(this.searchDate[0])
    this.endTime = parseTime(this.searchDate[1])
    this.initCharts()
  },
  methods: {
    initCharts() {
      this.warnallChart = echarts.init(this.$refs.warnall)
      this.warndetailChart = echarts.init(this.$refs.warndetail)
      this.initChartsOption()
      this.getChartsData()
      this.warnallChart.setOption(this.warnallOption)
      this.warnallChart.on('click', (param) => {
        if (param.name !== '' && param.name !== this.detailPlateNumber) {
          this.detailPlateNumber = param.name
          this.handleShowDetail()
        }
      })
    },
    initChartsOption() {
      this.warnallOption = {
        color: ['#49978A', '#7FE0CD', '#9BCA48', '#fbb263', '#5B98B4', '#51559D'],
        title: {
          text: '报警信息统计',
          show: true,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '查看{b}报警次数详情'
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
          name: '驾驶员姓名',
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
      this.param = { startTime: this.searchDate[0], endTime: this.searchDate[1], driverName: this.searchDriverName, type: '1' }
      if (!this.searchDriverName) {
        delete this.param.driverName
      }
      this.warnall = { driverName: [], count: [] }
      this.warnallChart.showLoading({
        text: '加载中',
        color: '#008080'
      })
      getStatistics(this.param).then(response => {
        if (response.data) {
          this.warnallChart.hideLoading()
          response.data.rows.forEach(element => {
            this.warnall.driverName.push(element.driverName)
            this.warnall.count.push(element.count)
          })
          if (!this.driverArray.length) {
            this.driverArray = this.warnall.driverName
          }
          this.detailPlateNumber = this.warnall.driverName[0]
          this.warnallChart.setOption({
            yAxis: { data: this.warnall.driverName },
            series: { data: this.warnall.count }
          })
          if (response.data.rows.length) {
            this.handleShowDetail()
          } else {
            this.warndetailChart.clear()
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
      this.warndetailOption = {
        title: {
          text: `${this.detailPlateNumber}报警次数详情`,
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
      this.warndetailChart.setOption(this.warndetailOption)
      this.warndetail = { count: [], createTime: [] }
      this.param = { startTime: this.searchDate[0], endTime: this.searchDate[1], driverName: this.detailPlateNumber, type: '1' }
      getDetailAll(this.param).then(response => {
        response.data.rows.forEach(element => {
          element.createTime = element.createTime.split(' ')[0]
          this.warndetail.count.push(element.count)
          this.warndetail.createTime.push(element.createTime)
        })
        this.warndetailChart.setOption({
          series: { data: this.warndetail.count },
          xAxis: { data: this.warndetail.createTime }
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

