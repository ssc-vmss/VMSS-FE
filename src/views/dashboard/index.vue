<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="box1">
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">车辆数量</div>
          <div class="numeric-value">{{totalCount.vehicleCount||0}}</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">驾驶员数量</div>
          <div class="numeric-value">{{totalCount.driverCount||0}}</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">车载设备数量</div>
          <div class="numeric-value">{{totalCount.vehicleEquipmentCount||0}}</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">用车申请单</div>
          <div class="numeric-value">{{totalCount.completeApplication||0}}</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">派车单数量</div>
          <div class="numeric-value">{{totalCount.dispatchCount||0}}</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">事故违章数量</div>
          <div class="numeric-value">{{totalCount.acidentCount||0}}</div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
        <my-chart :option="option1" chartName="chart1"></my-chart>
      </el-col>
      <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
        <my-chart :option="option2" chartName="chart2"></my-chart>
      </el-col>
      <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
        <my-chart :option="option3" chartName="chart3"></my-chart>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <my-chart :option="option4" chartName="chart4"></my-chart>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <my-chart :option="option5" chartName="chart5"></my-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'
import MyChart from "@/components/myChart"
import { getAllCount } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  components: {
    MyChart
  },
  data() {
    return {
      option1: {},
      option2: {},
      option3: {},
      option4: {},
      option5: {},
      totalCount:''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.getChart()
    this.getTotalCount()
  },
  methods: {
    getTotalCount(){
      getAllCount().then(response=>{
        this.totalCount=response.data.rows[0]
      }).catch(error=>{

      })
    },
    getChart() {
      this.option1 = {
        color: ['#49978A', '#fbb263', '#5B98B4', '#A6E8A1'],
        title: {
          text: '车辆调度状态',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: '50',
          left: '10',
          data: ['执行任务', '警告', '空闲', '离线']
        },
        series: [
          {
            name: '车辆调度状态',
            type: 'pie',
            radius: '70%',
            center: ['50%', '55%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'inside',
                formatter: '{d}%',
                textStyle: {
                  align: 'center',
                  baseline: 'middle',
                  fontFamily: '微软雅黑',
                  fontSize: 15
                }
              }
            },
            // labelLine: {
            //   normal: {
            //     lineStyle: {
            //       color: 'rgba(0, 0, 0, 1)'
            //     },
            //     smooth: 0.2,
            //     length: 10,
            //     length2: 20
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: '#c23531',
            // shadowBlur: 200,
            //     shadowColor: 'rgba(0, 0, 0, 0.5)'
            //   }
            // },
            data: [
              { value: 33, name: '执行任务' },
              { value: 13, name: '警告' },
              { value: 185, name: '空闲' },
              { value: 23, name: '离线' }
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut'
          }
        ]
      }
      this.option2 = {
        color: ['#49978A', '#fbb263', '#5B98B4', '#A6E8A1'],
        title: {
          text: '警告信息',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: '50',
          left: '10',
          data: ['区域报警', '防盗', '违规用车']
        },
        series: [
          {
            name: '警告信息',
            type: 'pie',
            radius: '70%',
            center: ['50%', '55%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'inside',
                formatter: '{d}%',
                textStyle: {
                  align: 'center',
                  baseline: 'middle',
                  fontFamily: '微软雅黑',
                  fontSize: 15
                }
              }
            },
            // labelLine: {
            //   normal: {
            //     lineStyle: {
            //       color: 'rgba(0, 0, 0, 1)'
            //     },
            //     smooth: 0.2,
            //     length: 10,
            //     length2: 20
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: '#c23531',
            // shadowBlur: 200,
            //     shadowColor: 'rgba(0, 0, 0, 0.5)'
            //   }
            // },
            data: [
              { value: 25, name: '区域报警' },
              { value: 10, name: '防盗' },
              { value: 4, name: '违规用车' }
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut'
          }
        ]
      }
      this.option3 = {
        // title: {
        //   top: 20,
        //   text: '派车单归队情况',
        //   x: 'center'
        // },
        // tooltip: {
        //   trigger: 'item',
        //   formatter: "{b} : {c} ({d}%)"
        // },
        // legend: {
        //   orient: 'vertical',
        //   data: ['未归队', '已归队'],
        //   top: '50',
        //   right: '20'
        // },
        // series: [
        //   {
        //     name: '归队情况',
        //     type: 'pie',
        //     radius: '55%',
        //     center: ['50%', '60%'],
        //     data: [
        //       { value: 335, name: '未归队' },
        //       { value: 310, name: '已归队' }
        //     ],
        //     itemStyle: {
        //       emphasis: {
        //         shadowBlur: 10,
        //         shadowOffsetX: 0,
        //         shadowColor: 'rgba(0, 0, 0, 0.5)'
        //       }
        //     }
        //   }
        // ]
        color: ['#49978A', '#fbb263', '#5B98B4', '#A6E8A1'],
        title: {
          text: '派车单归队情况',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: '50',
          left: '10',
          data: ['未归队', '已归队']
        },
        series: [
          {
            name: '派车单归队情况',
            type: 'pie',
            radius: '70%',
            center: ['50%', '55%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'inside',
                formatter: '{d}%',
                textStyle: {
                  align: 'center',
                  baseline: 'middle',
                  fontFamily: '微软雅黑',
                  fontSize: 15
                }
              }
            },
            // labelLine: {
            //   normal: {
            //     lineStyle: {
            //       color: 'rgba(0, 0, 0, 1)'
            //     },
            //     smooth: 0.2,
            //     length: 10,
            //     length2: 20
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: '#c23531',
            //      shadowBlur: 200,
            //     shadowColor: 'rgba(0, 0, 0, 0.5)'
            //   }
            // },
            data: [
              { value: 35, name: '未归队' },
              { value: 30, name: '已归队' }
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut'
          }
        ]
      }
      this.option4 = {
        title: {
          text: '里程统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['里程数'],
          y: 'bottom'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            name: '月份'
          }
        ],
        yAxis: [
          {
            type: 'value',
            // splitArea: { show: true },
            name: 'km'
          }
        ],
        series: [
          {
            name: '里程数',
            type: 'line',
            data: [152.0, 134.9, 157.0, 230.2, 125.6, 176.7, 135.6, 162.2, 132.6, 200.0, 226.4, 113.3],
            itemStyle: {
              normal: {
                color: '#49978A',
                label: {
                  show: true
                }
              }
            }
          }
        ]
      }
      this.option5 = {
        title: {
          text: '加油统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['加油量', '耗油量'],
          y: 'bottom'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            name: '月份'
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitArea: { show: true },
            name: '升'
          }
        ],
        series: [
          {
            name: '加油量',
            type: 'line',
            data: [225.0, 146.9, 176.0, 223.2, 225.6, 176.7, 135.6, 162.2, 132.6, 230.0, 262.4, 153.3],
            itemStyle: {
              normal: {
                color: '#49978A'
              }
            }
          },
          {
            name: '耗油量',
            type: 'line',
            data: [224.6, 157.9, 194.0, 226.4, 258.7, 170.7, 175.6, 182.2, 148.7, 128.8, 267.0, 182.3],
            itemStyle: {
              normal: {
                color: '#fbb263'
              }
            }
          }
        ]
      }
      // this.option5 = {
      //   title: {
      //     text: '里程统计',
      //     x: 'center'
      //   },
      //   tooltip: {
      //     trigger: 'axis'
      //   },
      //   legend: {
      //     data: ['蒸发量', '降水量'],
      //     y: 'bottom'
      //   },
      //   calculable: true,
      //   xAxis: [
      //     {
      //       type: 'category',
      //       data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      //       name: '月份'
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value',
      //       splitArea: { show: true },
      //       name: 'km'
      //     }
      //   ],
      //   series: [
      //     {
      //       name: '蒸发量',
      //       type: 'line',
      //       data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
      //     },
      //     {
      //       name: '降水量',
      //       type: 'line',
      //       data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
      //     }
      //   ]
      // }
    },
    resolvePath(...paths) {
      return path.resolve(...paths)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-main {
  margin-left: 0;
}
.dashboard {
  &-container {
    margin: 30px;
    // background-color: rgba(248, 249, 251, 1);
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.numeric {
  &-box {
    text-align: center;
    padding: 20px 10px;
    margin: 10px;
    border: 1px solid rgba(0, 128, 128, 1);
    border-radius: 10px;
    // background: rgba(0, 128, 128,.1);
    cursor: pointer;
    &:hover {
      transform: scale(1.05);
      transition: 0.3s;
    }
  }
  &-label {
    color: #909399;
    padding: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    pointer-events: none;
    @media screen and (max-device-width: 450px) {
      font-size: 15px;
    }
  }
  &-value {
    font-weight: 400;
    font-size: 25px;
    padding: 5px;
    pointer-events: none;
  }
}
</style>
