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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mychart-box {
  width: 100%;
  height: 400px;
  // border: 1px solid red;
}
</style>
