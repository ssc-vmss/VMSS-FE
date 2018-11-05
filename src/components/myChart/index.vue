<template>
  <div>
    <div :ref="chartName" class="mychart-box"></div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
    chartName: String,
    option: Object
  },
  data() {
    return {
      myChart: null
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.myChart = echarts.init(this.$refs[this.chartName])
      this.myChart.setOption(this.option)
    },
    showLoading() {
      this.myChart.showLoading()
    },
    hideLoading() {
      this.myChart.hideLoading()
    },
    pieSelect(index) {
      this.myChart.dispatchAction({
        type: 'pieSelect',
        seriesIndex: 0,
        dataIndex: index
      })
      this.myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: index
      })
      // console.log(1)
    },
    pieUnSelect(index) {
      this.myChart.dispatchAction({
        type: 'pieUnSelect',
        seriesIndex: 0,
        dataIndex: index
      })
      // console.log(2)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mychart-box {
  width: 96%;
  height: 260px;
  border: 1px solid rgba(245, 255, 250, 0.8);
  border-radius: 15px;
  margin: 10px;
  // padding: 10px;
  text-align: center;
  &:first-child {
    // margin-left: 0;
  }
}
</style>
