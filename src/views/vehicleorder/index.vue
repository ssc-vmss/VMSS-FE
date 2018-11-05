<template>
  <div class="app-container">

    <el-tabs v-model="activeName" type="border-card" @tab-click="tabhandleClick">
      <!-- 调度申请单信息 -->
      <el-tab-pane label="调度申请单" name="first">
        <el-row class="toptools" type="flex" justify="end">
          <!-- <el-col :span="6"><el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="openDispatchDialog">添加</el-button></el-col> -->
          <div>
            <!-- <el-input v-model="applySearchTxt">
              <el-select slot="prepend" v-model="applySearchType" style="width:120px">
                <el-option label="用车人" value="1"></el-option>
                <el-option label="申请人" value="2"></el-option>
                <el-option label="调度状态" value="3"></el-option>
              </el-select>
              <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">查询</el-button>
            </el-input> -->
            <el-select v-model="applySearchType" style="width:120px">
              <el-option label="用车人" value="1"></el-option>
              <el-option label="申请人" value="2"></el-option>
              <el-option label="调度状态" value="3"></el-option>
              <el-option label="申请单号" value="4"></el-option>
            </el-select>
            <el-select clearable v-if="applySearchType==3" v-model="dispatchSearchType" style="width:180px">
              <el-option label="未派单" value="1"></el-option>
              <el-option label="已派单" value="2"></el-option>
              <el-option label="驳回" value="3"></el-option>
            </el-select>
            <el-input v-else v-model="applySearchTxt" placeholder="请输入内容" style="width:180px"></el-input>
            <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">查询</el-button>
          </div>
        </el-row>
        <el-table :max-height="tableHeight" v-loading="listLoading" :data="listData" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column label="调度状态" align="center">
            <template slot-scope="scope">
              {{ isDispatchFormat(scope.row.isDispatch) }}
            </template>
          </el-table-column>
          <el-table-column prop="caruser" label="用车人" width="100" align="center">
          </el-table-column>
          <el-table-column prop="useDate" label="用车时间" width="160" align="center">
          </el-table-column>
          <el-table-column prop="returnDate" label="预计返回时间" width="160" align="center">
          </el-table-column>
          <el-table-column prop="origin" label="始发地" align="center">
          </el-table-column>
          <el-table-column prop="destination" label="返回地" align="center">
          </el-table-column>
          <el-table-column prop="carDetail" label="用车明细" min-width="150" align="center">
            <template slot-scope="scope">
              <!-- {{scope.row.carDetail}} -->
              <div v-html="carDetailFormat(scope.row.carDetail)"></div>
            </template>
          </el-table-column>
          <el-table-column prop="staffName" label="申请人" align="center">
          </el-table-column>
          <el-table-column prop="department" label="用车人单位" min-width="110" align="center">
          </el-table-column>
          <el-table-column prop="reason" label="用车事由" align="center">
          </el-table-column>
          <!-- <el-table-column label="审批状态"  width="110" align="center">
            <template slot-scope="scope">
              {{ approvalStatus(scope.row.result) }}
            </template>
          </el-table-column> -->
          <el-table-column prop="ddid" align="center" label="申请单号" width="200">
          </el-table-column>
          <el-table-column label="备注" min-width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.demo }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope" v-if="scope.row.isDispatch==1">
              <button class="btn" @click="openDispatchDialog(scope.row)">调度</button>
              <button class="btn" @click="rejected(scope.row.ddid)">驳回</button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 派遣单信息 -->
      <el-tab-pane label="派遣单" name="second">
        <el-row class="toptools" type="flex" justify="end">
          <div>
            <el-input v-model="sendSearchTxt">
              <el-select slot="prepend" v-model="sendSearchType" style="width:120px">
                <!-- <el-option label="用车人" value="1"></el-option> -->
                <el-option label="车牌号" value="2"></el-option>
                <el-option label="驾驶员" value="3"></el-option>
                <el-option label="申请单号" value="4"></el-option>
              </el-select>
              <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">查询</el-button>
            </el-input>
          </div>
        </el-row>
        <el-table :max-height="tableHeight" v-loading="listLoading" :data="listData" element-loading-text="Loading" border fit>
          <!-- <el-table-column align="center" label="派遣单号" width="95">
            <template slot-scope="scope">
              {{ scope.row.LPNO }}
            </template>
          </el-table-column> -->
          <el-table-column label="调度状态" width="110" align="center">
            <template slot-scope="scope">
              {{ dispatchStatusFormat(scope.row.dispatchStatus) }}
            </template>
          </el-table-column>
          <el-table-column label="执行状态" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ doStatusFormat(scope.row.doStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="车牌号" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.vehiclePlateNumber }}
            </template>
          </el-table-column>
          <el-table-column label="驾驶员" align="center">
            <template slot-scope="scope">
              {{ scope.row.driverName }}
            </template>
          </el-table-column>

          <el-table-column label="用车人" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.caruser }}
            </template>
          </el-table-column>
          <el-table-column label="用车人单位" min-width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.department }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用车时间" width="160" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="调度时间" width="160" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column label="用车申请单号" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.applyId }}
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.demo }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope" v-if="(scope.row.doStatus!=2)&&(scope.row.doStatus!=3)&&(scope.row.doStatus!=5)">
              <!-- <el-button  type="text" size="small" @click="toEdit(scope.row.id,6)" >提醒</el-button> -->
              <button class="btn" v-if="scope.row.doStatus!=6" @click="toInvalidDispatch(scope.row.id,6,'取消')">取消</button>
              <button class="btn" @click="toInvalidDispatch(scope.row.id,5,'作废')">作废</button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-size="pageSize" :total="total" @current-change="pageCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>
    <!-- add dispatch dialog -->
    <el-dialog class="dispatchDialog" title="添加车辆调度信息" :visible.sync="dialogFormVisible" width="900px" :fullscreen="false" :before-close="closeDialog">
      <!-- <div style="display:none">
        <el-form :model="form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请单号" :label-width="formLabelWidth">
                <el-input v-model="form.LPNO" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用车人" :label-width="formLabelWidth">
                <el-input v-model="form.Color" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用车人单位" :label-width="formLabelWidth">
                <el-input v-model="form.Color" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用车时间" :label-width="formLabelWidth">
                <el-date-picker v-model="Color" type="datetime" placeholder="选择日期时间" style="width:200px"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="预计返回时间" :label-width="formLabelWidth">
              <el-date-picker v-model="Color" type="datetime" placeholder="选择日期时间" style="width:200px"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  label="用车类型" :label-width="formLabelWidth">
                <el-select multiple v-model="form.Type" placeholder="请选择车辆类型">
                  <el-option label="大型汽车" value="1"></el-option>
                  <el-option label="小型汽车" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">下一步</el-button>
        </div>
      </div> -->
      <div>
        <el-row :gutter="50" style="margin-bottom:10px">
          <el-col :span="12">
            <div><b>用车申请明细</b>：{{applyVehicleDetails.join('，')}}</div>
          </el-col>
          <el-col :span="12">
            <div style="text-align:right">
              <el-button type="success" size="mini" @click="groupData">组合</el-button>
              <el-button type="primary" size="mini" :loading="dispatchloading" :disabled="!this.selectData.length>0" @click="addNewDispath">派遣</el-button>
              <!-- <el-button type="warning" size="mini" @click="rejected(dispatchInfo.applyId)">驳回</el-button> -->
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <div style="margin-bottom:5px">
              <el-input v-model="vform.plateNumber" style="width:120px" placeholder="车牌" size="small"></el-input>
              <el-select v-model="vform.plateType" clearable placeholder="车辆类型" style="width:120px" size="small">
                <!-- <el-option label="大型汽车" value="0"></el-option>
                <el-option label="小型汽车" value="1"></el-option>
                <el-option label="摩托车" value="2"></el-option>
                <el-option label="拖拉机" value="3"></el-option>
                <el-option label="挂车" value="4"></el-option>
                <el-option label="新能源大型汽车" value="5"></el-option> -->
                <el-option v-for="(item,index) in vechileType" :label="item.type" :value="item.value" :key="index"></el-option>
              </el-select>
              <el-button @click="getVehicleDataFilter" size="small">查询</el-button>
            </div>
            <el-table height="200" class="vehicleTable" border ref="vehicleTable" :data="vform.vehicleData" highlight-current-row @current-change="vehicleCurrentChange" @row-dblclick="groupData">
              <el-table-column label="车牌号" prop="plateNumber" align="center"></el-table-column>
              <el-table-column label="车辆类型" prop="plateType" align="center">
                <template slot-scope="scope">
                  {{vehicleType(scope.row.plateType)}}
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :current-page.sync="vform.page" :page-size="vform.pageSize" :total="vform.total" @current-change="vPageCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>
          </el-col>
          <el-col :span="12">
            <div style="margin-bottom:5px">
              <el-input v-model="dform.userName" style="width:120px" placeholder="姓名" size="small"></el-input>
              <el-select v-model="dform.driverLicenseType" clearable placeholder="准驾类型" style="width:120px" size="small">
                <el-option label="A1" value="A1"></el-option>
                <el-option label="A2" value="A2"></el-option>
                <el-option label="A3" value="A3"></el-option>
                <el-option label="B1" value="B1"></el-option>
                <el-option label="B2" value="B2"></el-option>
                <el-option label="C1" value="C1"></el-option>
                <el-option label="C2" value="C2"></el-option>
                <el-option label="C3" value="C3"></el-option>
                <el-option label="C4" value="C4"></el-option>
              </el-select>
              <el-button @click="getDriverDataFilter" size="small">查询</el-button>
            </div>
            <el-table height="200" class="driverTable" border ref="driverTable" :data="dform.driverData" highlight-current-row @current-change="driverCurrentChange" @row-dblclick="groupData">
              <el-table-column label="驾驶员姓名" prop="userName" align="center"></el-table-column>
              <el-table-column label="性别" prop="sex" align="center"></el-table-column>
              <el-table-column label="准驾车型" align="center" prop="driverLicenseType"></el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :current-page.sync="dform.page" :page-size="dform.pageSize" :total="dform.total" @current-change="dPageCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>
          </el-col>
        </el-row>
        <!-- <div class="groupbox"><el-button type="primary" @click="groupData">组合</el-button></div> -->
        <!-- 组合数据 -->
        <el-table border :data="selectData">
          <el-table-column label="车牌号" prop="plateNumber" align="center"></el-table-column>
          <el-table-column label="驾驶员" prop="userName" align="center"></el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="delGroupData(scope.$index)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <!-- <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" :disabled="!this.selectData.length>0" @click="addNewDispath">确 定</el-button> -->
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getApplyList, editApplyStatus, getDispatchList, VehicleDataFilter, DriverDataFilter, addDispatch, editDispatch, delDispatch, invalidDispatch } from '@/api/dispatch'
import { vechileType } from '@/utils/constant'

export default {
  data() {
    return {
      vechileType: vechileType,
      tableHeight: document.documentElement.clientHeight - 280 || document.body.clientHeight - 280,
      listData: [],
      listLoading: false,
      dialogFormVisible: false,
      applySearchType: '1',
      applySearchTxt: '',
      dispatchSearchType: '1',
      sendSearchType: '2',
      sendSearchTxt: '',
      searchTxt: '',
      activeName: 'first',
      form: {
        LPNO: '',
        Color: '',
        Type: [],
        VehicleID: '',
        EngineNO: '',
        Load: '',
        BuyTime: '',
        Status: [],
        EnterpriseNO: '',
        VehicleNO: '',
        Emission: '',
        equipmentModel: [],
        equipmentID: ''
      },
      vform: {
        plateNumber: '',
        plateType: '',
        page: 1,
        pageSize: 10,
        total: 0,
        vehicleData: []
      },
      dform: {
        userName: '',
        driverLicenseType: '',
        page: 1,
        pageSize: 10,
        total: 0,
        driverData: [],
      },
      formLabelWidth: '120px',
      page: 1,
      pageSize: 10,
      total: 0,

      dispatchloading: false,
      dispatchInfo: {
        applyId: '',
        applyerId: '',
        useId: '',
        driverId: '',
        vehicleId: '',
      },
      applyVehicleDetails: [],
      selectData: [],
      selectTempData: {}
    }
  },
  watch: {
    page() {
      this.fetchData(this.activeName)
    },
    'vform.page': function () {
      this.getVehicleDataFilter();
    },
    'dform.page': function () {
      this.getDriverDataFilter();
    }
  },
  created() {
    this.fetchData(this.activeName)
  },
  mounted() {
    const that = this;
    window.onresize = function () {
      that.tableHeight = document.documentElement.clientHeight - 280 || document.body.clientHeight - 280
    }
  },
  beforeDestroy() {
    window.onresize = "";
  },
  methods: {
    closeDialog(done) {
      this.vform.vehicleData = [];
      this.dform.driverData = [];
      this.selectData = [];
      done();
    },
    carDetailFormat(value) {
      let html = '';
      value && JSON.parse(value).map(item => {
        html += `<div>${item.carType}：${item.carNum}辆</div>`
      })
      return html
    },
    tabhandleClick(tab) {//tab click
      this.activeName = tab.name;
      this.applySearchTxt = '';
      this.sendSearchTxt = '';
      this.total = 0;

      if (this.page != 1) {
        this.page = 1;
        return;
      }

      this.fetchData(tab.name)
    },
    approvalStatus(status) {//审批状态
      switch (status) {
        case '0':
          return '审批未通过'
          break;
        case '1':
          return '审批通过'
          break;
        default:
          break;
      }
    },
    isDispatchFormat(status) {//派单状态
      switch (status) {
        case 1:
          return '未派单'
          break;
        case 2:
          return '已派单'
          break;
        case 3:
          return '驳回'
          break;
        default:
          break;
      }
    },
    dispatchStatusFormat(status) {//调度状态
      switch (status) {
        case 1:
          return '未调度'
          break;
        case 2:
          return '正常执行'
          break;
        case 3:
          return '结束'
          break;
        default:
          break;
      }
    },
    doStatusFormat(status) {//执行状态
      switch (status) {
        case 1:
          return '未执行'
          break;
        case 2:
          return '执行中'
          break;
        case 3:
          return '已完成'
          break;
        case 4:
          return '任务等待'
          break;
        case 5:
          return '任务作废'
          break;
        case 6:
          return '任务取消'
          break;
        default:
          break;
      }
    },
    toEdit(id, val) {
      let data = { id, doStatus: val }
      editDispatch(data).then(response => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.fetchData();
      })
    },
    toDel(id) {
      this.$confirm('您确定要删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
      });
    },
    rejected(ddid) {//驳回申请
      let data = { ddids: ddid, isDispatch: 3 }
      this.$prompt(`请输入 驳回 原因`, '', {
        inputValidator: (txt) => {
          if (!txt || !(txt.trim()).length) {
            return '输入内容不能为空'
          }
          data.demo = txt
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            editApplyStatus(data).then(response => {
              this.fetchData();
              instance.confirmButtonLoading = false;
              this.dialogFormVisible = false;//调度对话框驳回
              done();
            }).catch(error => {
              instance.confirmButtonLoading = false;
            })
          } else {
            done();
          }
        }
      }).then(({ value }) => {

      }).catch()
    },
    openDispatchDialog(row) {
      this.dispatchInfo.applyId = row.ddid;
      this.dispatchInfo.applyerId = row.staffid;
      this.dispatchInfo.useId = row.caruserid;
      this.dispatchInfo.useName = row.caruser;
      this.dispatchInfo.taskDoStartTimes = row.useDate;
      this.dispatchInfo.taskDoEndTimes = row.returnDate;

      this.applyVehicleDetails = row.carDetail && JSON.parse(row.carDetail);
      this.applyVehicleDetails = this.applyVehicleDetails.map(item => {
        return `${item.carType}：${item.carNum}辆`
      })

      this.dialogFormVisible = true
      this.getVehicleDataFilter()
      this.getDriverDataFilter()
    },
    fetchData() {//获取申请单和派遣单数据
      this.listLoading = true;
      let params = { pageNo: this.page, pageSize: this.pageSize };

      if (this.activeName == 'first') {

        let applySearchType = this.applySearchType,
          applySearchTxt = this.applySearchTxt,
          dispatchSearchType = this.dispatchSearchType;

        switch (applySearchType) {
          case '1':
            params.caruser = applySearchTxt;
            break;
          case '2':
            params.staffName = applySearchTxt;
            break;
          case '3':
            params.isDispatch = dispatchSearchType;
            break;
          case '4':
            params.ddid = applySearchTxt;
            break;
          default:
            break;
        }

        getApplyList(params).then(response => {
          this.listData = response.data.rows||[]
          this.total = response.data.total;
          this.listLoading = false
        })
      } else {

        let sendSearchType = this.sendSearchType,
          sendSearchTxt = this.sendSearchTxt;

        switch (sendSearchType) {
          case '1':
            params.useName = sendSearchTxt;
            break;
          case '2':
            params.vehiclePlateNumber = sendSearchTxt;
            break;
          case '3':
            params.driverName = sendSearchTxt;
            break;
          case '4':
            params.applyId = sendSearchTxt;
            break;
          default:
            break;
        }

        getDispatchList(params).then(response => {
          this.listData = response.data.rows
          this.total = response.data.total;
          this.listLoading = false
        })
      }
    },
    pageCurrentChange(page) {
      this.page = page;
    },
    vPageCurrentChange(page) {
      this.vform.page = page;
    },
    dPageCurrentChange(page) {
      this.dform.page = page;
    },
    getVehicleDataFilter() {//获取可用车辆数据
      let { plateNumber, plateType, page: pageNo, pageSize } = this.vform;

      VehicleDataFilter({ applicationId: this.dispatchInfo.applyId, plateType, plateNumber, pageNo, pageSize }).then(response => {
        this.vform.vehicleData = response.data.rows;
        this.vform.total = response.data.total;
      })
    },
    getDriverDataFilter() {//获取可用驾驶员数据
      let { userName, driverLicenseType, page: pageNo, pageSize } = this.dform;
      DriverDataFilter({ applicationId: this.dispatchInfo.applyId, userName, driverLicenseType, pageNo, pageSize }).then(response => {
        this.dform.driverData = response.data.rows;
        this.dform.total = response.data.total;
      })
    },
    vehicleType(type) {//车辆类型名称
      let selectData = this.vechileType.find(item => {
        return item.value == type;
      })
      return selectData.type;

      // switch (type) {
      //   case 0:
      //     return '大型汽车'
      //     break;
      //   case 2:
      //     return '摩托车'
      //     break;
      //   case 3:
      //     return '拖拉机'
      //     break;
      //   case 4:
      //     return '挂车'
      //     break;
      //   case 5:
      //     return '新能源大型汽车'
      //     break;
      //   default:
      //     return '小型汽车'
      //     break;
      // }
    },
    vehicleCurrentChange(row) {//选择调度车辆
      this.selectTempData.vehicleId = row && row.id;
      this.selectTempData.plateNumber = row && row.plateNumber;
    },
    driverCurrentChange(row) {//选择调度驾驶员
      this.selectTempData.userName = row && row.userName;
      this.selectTempData.driverId = row && row.id;
    },
    groupData() {//添加组合
      if (!this.selectTempData.plateNumber || !this.selectTempData.userName) {
        this.$message({
          type: 'error',
          message: '车辆和司机都必选!'
        });
        return;
      }
      let found = this.selectData.find(item => {
        if (item.plateNumber == this.selectTempData.plateNumber || item.userName == this.selectTempData.userName) {
          return true;
        }
      });
      if (found) {
        this.$message({
          type: 'error',
          message: '车辆或司机已存在!'
        });
        return;
      }
      this.selectData.push(this.selectTempData);
      this.selectTempData = {};
      this.setCurrent("vehicleTable");
      this.setCurrent("driverTable");
    },
    delGroupData(index) {//删除组合
      this.selectData.splice(index, 1);
    },
    setCurrent(ref) {//清除选中行
      this.$refs[ref].setCurrentRow();
    },
    addNewDispath() {//新增调度
      let driverId = [], driverName = [], vehicleId = [], vehiclePlateNumber = [];
      this.selectData.map(item => {
        driverId.push(item.driverId);
        driverName.push(item.userName);
        vehicleId.push(item.vehicleId);
        vehiclePlateNumber.push(item.plateNumber);
      })

      this.dispatchInfo.driverId = driverId.join();
      this.dispatchInfo.driverName = driverName.join();
      this.dispatchInfo.vehicleId = vehicleId.join();
      this.dispatchInfo.vehiclePlateNumber = vehiclePlateNumber.join();


      let data=this.dispatchInfo;
      this.dispatchloading=true;
      addDispatch(data).then(response=>{
        this.selectData=[];
        this.dispatchloading=false;
        this.dialogFormVisible = false;
        this.tabhandleClick({name:'second'})
      }).catch(()=>{
        this.dispatchloading=false;
      })
    },
    toInvalidDispatch(id, val, opt) {//取消、废除调度
      let data = { id, doStatus: val, msg_send_status: 0 }
      this.$prompt(`请输入 ${opt} 原因`, '', {
        inputValidator: (txt) => {
          if (!txt || !(txt.trim()).length) {
            return '输入内容不能为空'
          }
          data.demo = txt
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            editDispatch(data).then(response => {
              this.fetchData();
              instance.confirmButtonLoading = false;
              done();
            })
          } else {
            done();
          }
        }
      }).then(({ value }) => {

      }).catch()
    }
  }
}
</script>

<style lang="scss" scoped>
.groupbox {
  text-align: center;
  margin: 20px auto;
  border-top: 1px solid;
  border-bottom: 1px solid;
  padding: 10px;
  border-color: cadetblue;
}
</style>
<style>
.driverTable .el-table__body tr.current-row > td,
.vehicleTable .el-table__body tr.current-row > td {
  background-color: #008080;
  color: #fff;
}
.dispatchDialog .el-dialog {
  margin-top: 10px !important;
}
.dispatchDialog .el-dialog__body {
  padding-top: 10px;
}
.dispatchDialog .el-dialog__header {
  border-bottom: 1px solid #d1dbe5;
}
.dispatchDialog .el-table td {
  padding: 8px;
}
</style>


