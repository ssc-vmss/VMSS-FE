<template>
  <div class="app-container">
    <div class="searchbox">
      <el-form inline>
        <el-form-item label="事故时间">
          <el-date-picker
            v-model="searchDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="统计开始日期"
            end-placeholder="统计结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="searchType" placeholder="可选类型" style="width:120px">
            <el-option label="按驾驶员" value="1">按驾驶员</el-option>
            <el-option label="按车辆" value="2">按车辆</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="searchTxt" placeholder="可选关键字" style="width:120px"></el-input>
        </el-form-item>
        <el-button @click="toSearch" :loading="loading">查询</el-button>
      </el-form>
    </div>
    <div id="totalbox" v-show="!searchType"></div>
    <div id="driverbox" v-show="!searchType||searchType==1"></div>
    <div id="vehiclebox" v-show="!searchType||searchType==2"></div>
  </div>
</template>

<script>
import { statisticalAcidentTotalByDate,statisticalAcidentDriverByDate,statisticalAcidentVehicleByDate } from '@/api/statisticals'
import {parseTime} from '@/utils'

export default {
  data() {
    return {
      loading:false,
      searchDate:[new Date(Date.now()-3600*1000*24*180),new Date()],
      searchType:'',
      searchTxt:'',
      totalChart:'',
      listData:null,
      totalOption:'',
      driverChart:'',
      driverData:null,
      driverOption:'',
      vehicleChart:'',
      vehicleData:null,
      vehicleOption:'',
      startTime:'',
      endTime:'',
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      }
    }
  },
  mounted(){
    this.startTime=parseTime(this.searchDate[0]);
    this.endTime=parseTime(this.searchDate[1]);

    this.initCharts();
  },
  methods: {
    initCharts(){
      this.initChartsOption();

      this.totalChart=echarts.init(document.getElementById('totalbox'));
      this.totalChart.setOption(this.totalOption);
      this.driverChart=echarts.init(document.getElementById('driverbox'));
      this.driverChart.setOption(this.driverOption);
      this.vehicleChart=echarts.init(document.getElementById('vehiclebox'));
      this.vehicleChart.setOption(this.vehicleOption);

      this.getChartsData();
    },
    initChartsOption(){
      this.totalOption={
        title: {
            text: '事故类型总计',
            show:true,
            left:'center'
        },
        tooltip: {},
        legend: {top:'10%'},
        grid:{top:'25%'},
        xAxis: [
          {type: 'category',name:'月份'}
        ],
        yAxis: [
          {gridIndex: 0,name:'次数',minInterval: 1}
        ],
        dataset:{
          dimensions: ['happenTime', 'majorAccident', 'oversizeAccident', 'generalAccident','minorAccident'],
          source:[]
        },
        series: [
          {type: 'bar',name:'重大事故'},
          {type: 'bar',name:'特大事故'},
          {type: 'bar',name:'一般事故'},
          {type: 'bar',name:'轻微事故'},
        ]
      };

      this.driverOption={
        title: {
            text: '驾驶员事故统计',
            show:true,
            left:'center'
        },
        tooltip: {},
        legend: {type:'scroll',orient:'vertica',right:0,top:'middle'},
        // dataZoom:[{type: 'slider',filterMode: 'empty',yAxisIndex:[0,1]}],
        grid:[{height:'35%',top:'20%',right:'30%',containLabel:true},{height:'35%',top:'65%',bottom:'5%',right:'30%',containLabel:true}],
        xAxis: [
          {type: 'category', gridIndex: 0,name:'姓名'},
          {type: 'category', gridIndex: 1,name:'姓名'}
        ],
        yAxis: [
          {gridIndex: 0,name:'人数',minInterval: 1},
          {gridIndex: 1,name:'元'}
        ],
        dataset:{
          dimensions: ['driverName', 'number', 'lossAmount', 'otherAmount','deadNumber','seriousNumbe','myAmout'],
          source:[]
        },
        series: [
          {type: 'bar',name:'事故人数'},
          {type: 'bar',name:'损失金额',xAxisIndex:1,yAxisIndex:1},
          {type: 'bar',name:'对方赔偿金额',xAxisIndex:1,yAxisIndex:1},
          {type: 'bar',name:'死亡人数'},
          {type: 'bar',name:'重伤人数'},
          {type: 'bar',name:'我方赔偿金额',xAxisIndex:1,yAxisIndex:1}
        ]
      };

      this.vehicleOption={
        title: {
            text: '车辆事故统计',
            show:true,
            left:'center'
        },
        tooltip: {},
        legend: {type:'scroll',orient:'vertica',right:0,top:'middle'},
        grid:[{height:'35%',top:'20%',right:'30%',containLabel:true},{height:'35%',top:'65%',bottom:'5%',right:'30%',containLabel:true}],
        xAxis: [
          {type: 'category', gridIndex: 0,name:'车牌'},
          {type: 'category', gridIndex: 1,name:'车牌'}
        ],
        yAxis: [
          {gridIndex: 0,name:'人数',minInterval: 1},
          {gridIndex: 1,name:'元'}
        ],
        dataset:{
          dimensions: ['plateNum', 'number', 'lossAmount', 'otherAmount','deadNumber','seriousNumbe','myAmout'],
          source:[]
        },
        series: [
          {type: 'bar',name:'事故人数',label:{show:true}},
          {type: 'bar',name:'损失金额',xAxisIndex:1,yAxisIndex:1},
          {type: 'bar',name:'对方赔偿金额',xAxisIndex:1,yAxisIndex:1},
          {type: 'bar',name:'死亡人数'},
          {type: 'bar',name:'重伤人数'},
          {type: 'bar',name:'我方赔偿金额',xAxisIndex:1,yAxisIndex:1}
        ]
      };
    },
    getChartsData(){
      let params={startTime:this.startTime,endTime:this.endTime}

      if(this.searchType==1)params.driverName=this.searchTxt;
      if(this.searchType==2)params.vehiclePlateNumber=this.searchTxt;

      this.totalChart.showLoading();
      statisticalAcidentTotalByDate(params).then(Response=>{
        this.totalChart.hideLoading();
        this.totalChart.setOption({
          dataset:{
            source:Response.data.rows
          },
        })
      })

      this.driverChart.showLoading();
      statisticalAcidentDriverByDate(params).then(Response=>{
        this.driverChart.hideLoading();
        this.driverChart.setOption({
          dataset:{
            source:Response.data.rows
          },
        })
      })

      this.vehicleChart.showLoading();
      statisticalAcidentVehicleByDate(params).then(Response=>{
        this.vehicleChart.hideLoading();
        this.vehicleChart.setOption({
          dataset:{
            source:Response.data.rows
          },
        })
      })
    },
    toSearch(){
      if(!this.searchDate){
        this.$message({
          message: '请选择统计日期',
          type: 'warning'
        });
        return;
      }

      this.startTime=parseTime(this.searchDate[0]);
      this.endTime=parseTime(this.searchDate[1]);

      this.getChartsData();
    },
  }

}
</script>

<style lang="scss" scoped>
.searchbox{
  margin:20px auto 80px;
}
#totalbox,#driverbox,#vehiclebox{
  display: inline-block;
  width:45%;
  min-width: 500px;
  height:400px;
}
</style>

