<template>
  <div class="app-container">
    <div class="searchbox">
      <el-form inline>
        <el-form-item label="时间范围">
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
          <!-- <el-input clearable v-model="searchTxt" placeholder="可选关键字" style="width:120px"></el-input> -->
          <el-select v-if="searchType==2" v-model="vehicleId" clearable filterable remote :remote-method="getVehicles" :loading="vehiclesLoading" placeholder="请输入关键词" style="width:150px">
            <el-option v-for="item in vehicles" :key="item.id" :label="item.plateNumber" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-if="searchType==1" v-model="driverId" clearable filterable remote :remote-method="getDrivers" :loading="driversLoading" placeholder="请输入关键词" style="width:150px">
            <el-option v-for="item in drivers" :key="item.id" :label="item.userName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="toSearch" :loading="loading">查询</el-button>
      </el-form>
    </div>

    <div id="driverbox" v-show="!searchType||searchType==1"></div>
    <div id="vehiclebox" v-show="!searchType||searchType==2"></div>
  </div>
</template>

<script>
import { statisticalOilsDriverByDate,statisticalOilsVehicleByDate } from '@/api/statisticals'
import {parseTime} from '@/utils'
import { getInfoList as getVehicleList } from '@/api/vehicle'
import { getInfoList as getDriverList } from '@/api/driver'

export default {
  data() {
    return {
      loading:false,
      searchDate:[new Date(Date.now()-3600*1000*24*180),new Date()],
      searchType:'',
      searchTxt:'',
      vehicles: [],
      vehicleId:'',
      vehiclesLoading:false,
      drivers: [],
      driverId:'',
      driversLoading:false,
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
    getVehicles(query) {
      if (query != '') {
        this.optionsLoading = true;
        getVehicleList({ plateNumber: query }).then(response => {
          this.vehicles = response.data.rows;
          this.optionsLoading = false;
        })
      }
    },
    getDrivers(query) {
      if (query != '') {
        this.optionsLoading = true;
        getDriverList({ userName: query }).then(response => {
          this.drivers = response.data.rows;
          this.optionsLoading = false;
        })
      }
    },
    initCharts(){
      this.initChartsOption();

      this.driverChart=echarts.init(document.getElementById('driverbox'));
      this.driverChart.setOption(this.driverOption);
      this.vehicleChart=echarts.init(document.getElementById('vehiclebox'));
      this.vehicleChart.setOption(this.vehicleOption);

      this.getChartsData();
    },
    initChartsOption(){
      this.driverOption={
        title: {
            text: '驾驶员加油统计',
            show:true,
            left:'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer : {
            type : 'shadow'
          }
        },
        // legend: {type:'scroll',orient:'vertica',right:0,top:'middle'},
        // dataZoom:[{type: 'slider',filterMode: 'empty',yAxisIndex:[0,1]}],
        xAxis: [
          {type: 'category', gridIndex: 0,name:'姓名'}
        ],
        yAxis: [
          {gridIndex: 0,name:'升',minInterval: 1}
        ],
        dataset:{
          dimensions: ['driverName', 'volume'],
          source:[]
        },
        series: [
          {type: 'bar',name:'油量',barMaxWidth:50},
        ]
      };

      this.vehicleOption={
        title: {
            text: '车辆加油统计',
            show:true,
            left:'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer : {
            type : 'shadow'
          }
        },
        // legend: {type:'scroll',orient:'vertica',right:0,top:'middle'},
        // grid:[{left:70,right:150,top:'20%',bottom:'50%'},{left:70,top:'65%',bottom:'8%',right:'30%'}],
        xAxis: [
          {type: 'category', gridIndex: 0,name:'车牌'},
        ],
        yAxis: [
          {gridIndex: 0,name:'升',minInterval: 1},
        ],
        dataset:{
          dimensions: ['vehiclePlateNumber', 'volume'],
          source:[]
        },
        series: [
          {type: 'bar',name:'油量',barMaxWidth:50},
        ]
      };
    },
    getChartsData(){
      let params={startTime:this.startTime,endTime:this.endTime}

      if(this.searchType==1)params.driverId=this.driverId;
      if(this.searchType==2)params.vehicleId=this.vehicleId;

      this.driverChart.showLoading();
      statisticalOilsDriverByDate(params).then(Response=>{
        this.driverChart.hideLoading();
        this.driverChart.setOption({
          dataset:{
            source:Response.data.rows
          },
        })
      })

      this.vehicleChart.showLoading();
      statisticalOilsVehicleByDate(params).then(Response=>{
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

