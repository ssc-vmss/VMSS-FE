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
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      let myChart = echarts.init(this.$refs[this.chartName])
      myChart.setOption(this.option)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mychart-box{
  width: 100%;
  height: 400px;
  // border: 1px solid red;
}
</style>
