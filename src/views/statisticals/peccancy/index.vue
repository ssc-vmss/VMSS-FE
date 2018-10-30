<template>
  <div class="app-container">
    <div class="searchbox">
      <el-form inline>
        <el-form-item label="违章时间">
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
            <!-- <el-option label="按车辆" value="2">按车辆</el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-input clearable v-model="searchTxt" placeholder="可选关键字" style="width:120px"></el-input> -->
          <el-select v-if="searchType==1" v-model="driverId" clearable filterable remote :remote-method="getDrivers" :loading="driversLoading" placeholder="请输入关键词">
            <el-option v-for="item in drivers" :key="item.id" :label="item.userName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="toSearch" :loading="loading">查询</el-button>
      </el-form>
    </div>
    <div id="totalbox" v-show="!searchType"></div>
    <div id="driverbox" v-show="!searchType||searchType==1"></div>
  </div>
</template>

<script>
import { statisticalAcidentTotalByDate,statisticalAcidentDriverByDate,statisticalAcidentVehicleByDate } from '@/api/statisticals'
import { statisticalPeccancyByType,statisticalPeccancyByDriver,statisticalPeccancyByDriverDetail } from '@/api/statisticals'
import {parseTime} from '@/utils'
import { getInfoList as getDriverList } from '@/api/driver'

const PeccancyType=['闯红灯','超速','压线','违章停车','其他']

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
      drivers: [],
      driverId:'',
      driversLoading:false,
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
    getDrivers(query) {
      if (query != '') {
        this.optionsLoading = true;
        getDriverList({ userName: query }).then(response => {
          this.drivers = response.data.rows;
          this.optionsLoading = false;
        })
      }
    },
    formatData(querydata){
      let ids=[],FDatas=[],data=querydata;

      data.forEach((item,index)=>{
        ids.includes(item.driverId)?'':ids.push(item.driverId)
      })
      ids.forEach((item,index)=>{
        let obj={};
        data.forEach((ditem,dindex)=>{
          if(ditem.driverId==item){
            if(obj['driverId']){
              obj['t'+ditem.type]=ditem.num;
              obj['amount']=ditem.amount;
            }else{
              obj['driverId']=item
              obj['driverName']=ditem.driverName;
              obj['t'+ditem.type]=ditem.num;
              obj['amount']=ditem.amount;
            }
          }
        })
        FDatas.push(obj);
      })
      this.driverData=FDatas;
    },
    initCharts(){
      this.initChartsOption();

      this.totalChart=echarts.init(document.getElementById('totalbox'));
      this.totalChart.setOption(this.totalOption);
      this.driverChart=echarts.init(document.getElementById('driverbox'));
      this.driverChart.setOption(this.driverOption);

      this.getChartsData();
    },
    initChartsOption(){
      this.totalOption={
        title: {
            text: '违章类型总计',
            show:true,
            left:'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer : {
            type : 'shadow'
          }
        },
        legend: {top:'10%'},
        grid:{top:'25%'},
        xAxis: [
          {type: 'category',name:'',data:PeccancyType}
        ],
        yAxis: [
          {gridIndex: 0,name:'次数',minInterval: 1}
        ],
        dataset:{
          dimensions: ['type','num'],
          source:[],
        },
        series: [
          {type: 'bar',name:'总计',barMaxWidth:50},
        ]
      };

      this.driverOption={
        title: {
            text: '驾驶员违章统计',
            show:true,
            left:'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer : {
            type : 'shadow'
          }
        },
        legend: {top:'10%'},
        grid:[{left:70,top:'20%',bottom:80}],
        dataZoom:[
          {
            id: 'dataZoomX',
            show:true,
            type: 'slider',
            xAxisIndex: 0,
            orient:'horizontal',
            filterMode: 'filter',
            start: 30,
            end: 70
          },
        ],
        xAxis: [
          {type: 'category', gridIndex: 0,name:'姓名'},
        ],
        yAxis: [
          {gridIndex: 0,name:'次数',minInterval: 1},
        ],
        dataset:{
          dimensions: ['driverName','t0','t1','t2','t3','t4' ],
          source:[]
        },
        series: [
          {type: 'bar',name:'闯红灯'},
          {type: 'bar',name:'超速'},
          {type: 'bar',name:'压线'},
          {type: 'bar',name:'违章停车'},
          {type: 'bar',name:'其他'},
        ]
      };
    },
    getChartsData(){
      let params={startTime:this.startTime,endTime:this.endTime}

      if(this.searchType==1)params.driverId=this.driverId;
      // if(this.searchType==2)params.vehiclePlateNumber=this.searchTxt;

      this.totalChart.showLoading();
      statisticalPeccancyByType(params).then(Response=>{
        let datas=[];

        PeccancyType.forEach((val,index)=>{
          let theval=Response.data.rows.find((item,cindex)=>item.type==index)
          if(theval){
            datas.push(theval)
          }else{
            datas.push({type:index,num:0})
          }
        })

        this.totalChart.hideLoading();
        this.totalChart.setOption({
          dataset:{
            source:datas
          },
        })
      })

      this.driverChart.showLoading();
      statisticalPeccancyByDriverDetail(params).then(Response=>{
        this.driverChart.hideLoading();
        this.formatData(Response.data.rows);

        this.driverChart.setOption({
          dataset:{
            source:this.driverData
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
  margin:20px auto 40px;
}
#totalbox,#driverbox,#vehiclebox{
  display: inline-block;
  width:45%;
  min-width: 500px;
  height:400px;
}
</style>

