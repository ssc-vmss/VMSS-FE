<template>
  <div class="app-container">
    <div class="searchbox">

    </div>
    <div id="totalbox"></div>
    <div id="driverbox"></div>
    <div id="vehiclebox"></div>
  </div>
</template>

<script>
import { statisticalAcidentTotalByDate,statisticalAcidentDriverByDate,statisticalAcidentVehicleByDate } from '@/api/statisticals'

export default {
  data() {
    return {
      listData:null,
      driverData:null,
      vehicleData:null
    }
  },
  created() {
    this.getDatas();

  },
  mounted(){
    // this.init();
  },
  methods: {
    getDatas(){
      let params={startTime:'2018-06-01 00:00:00',endTime:'2018-11-01 00:00:00'}
      statisticalAcidentTotalByDate(params).then(Response=>{
        this.listData=Response.data.rows;
        this.total();
      })
      statisticalAcidentDriverByDate(params).then(Response=>{
        this.driverData=Response.data.rows;
        this.driver();
      })
      statisticalAcidentVehicleByDate(params).then(Response=>{
        this.vehicleData=Response.data.rows;
        this.vehicle();
      })
    },
    total(){
      var myChart = echarts.init(document.getElementById('totalbox'));
      var option = {
        title: {
            text: '事故统计',
            show:false
        },
        tooltip: {},
        legend: {},
        xAxis: [
          {type: 'category', gridIndex: 0}
        ],
        yAxis: [
          {gridIndex: 0}
        ],
        dataset:{
          dimensions: ['happenTime', 'majorAccident', 'oversizeAccident', 'generalAccident','minorAccident'],
          source:this.listData
        },
        series: [
          {type: 'line',name:'重大事故'},
          {type: 'line',name:'特大事故'},
          {type: 'line',name:'一般事故'},
          {type: 'line',name:'轻微事故'},
        ]
      };
      myChart.setOption(option);
    },
    driver(){
      var myChart = echarts.init(document.getElementById('driverbox'));
      var option = {
        title: {
            text: '事故统计',
            show:false
        },
        tooltip: {},
        legend: {},
        xAxis: [
          {type: 'category', gridIndex: 0}
        ],
        yAxis: [
          {gridIndex: 0}
        ],
        dataset:{
          dimensions: ['driverName', 'number', 'lossAmount', 'otherAmount','deadNumber','seriousNumbe','myAmout'],
          source:this.driverData
        },
        series: [
          {type: 'bar',name:'事故人数'},
          {type: 'bar',name:'损失金额'},
          {type: 'bar',name:'对方赔偿金额'},
          {type: 'bar',name:'死亡人数'},
          {type: 'bar',name:'重伤人数'},
          {type: 'bar',name:'我方赔偿金额'}
        ]
      };
      myChart.setOption(option);
    },
    vehicle(){
      var myChart = echarts.init(document.getElementById('vehiclebox'));
      var option = {
        title: {
            text: '事故统计',
            show:false
        },
        tooltip: {},
        legend: {},
        xAxis: [
          {type: 'category', gridIndex: 0}
        ],
        yAxis: [
          {gridIndex: 0}
        ],
        dataset:{
          dimensions: ['plateNum', 'number', 'lossAmount', 'otherAmount','deadNumber','seriousNumbe','myAmout'],
          source:this.vehicleData
        },
        series: [
          {type: 'bar',name:'事故人数'},
          {type: 'bar',name:'损失金额'},
          {type: 'bar',name:'对方赔偿金额'},
          {type: 'bar',name:'死亡人数'},
          {type: 'bar',name:'重伤人数'},
          {type: 'bar',name:'我方赔偿金额'}
        ]
      };
      myChart.setOption(option);
    }
  }

}
</script>

<style lang="scss" scoped>
#totalbox,#driverbox,#vehiclebox{
  display: inline-block;
  margin-left: 100px;
  width:400px;
  height:400px;
}
</style>

