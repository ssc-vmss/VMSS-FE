<template>
  <div class="app-container">
    <el-row class="toptools" type="flex" justify="space-between">
      <el-col :span="6">
        <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </el-col>
      <div>
        <el-select v-model="searchType" style="width:120px">
          <el-option label="车牌号" value="1"></el-option>
          <el-option label="驾驶员" value="2"></el-option>
        </el-select>
        <el-input v-model="searchTxt" placeholder="请输入内容" size="medium" style="width:200px" />
        <el-button size="medium" type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
      </div>
    </el-row>
    <el-table :max-height="tableHeight" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit>
      <el-table-column label="车牌号码" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehiclePlateNumber }}
        </template>
      </el-table-column>
      <el-table-column label="驾驶员姓名" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.driverName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.happenTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故地点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.place }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故程度" align="center">
        <template slot-scope="scope">
          <span>{{ degreeName(scope.row.degree) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故责任" align="center">
        <template slot-scope="scope">
          <span>{{ accidentLiabilityName(scope.row.accidentLiability) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故内容" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故人数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="死亡人数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deadNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重伤人数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seriousNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理机构" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mechanism }}</span>
        </template>
      </el-table-column>
      <el-table-column label="责任认定" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.respConfirm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="损失金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lossAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="我方赔偿金额" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.myAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对方赔偿金额" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.otherAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保险公司赔偿金额" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.insuranceAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="达成协议" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reachAgreement }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事故类型" align="center">
        <template slot-scope="scope">
          <span>{{ typeName(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="70" align="center">
        <template slot-scope="scope">
          <button class="btn" @click="toEdit(scope.row)">修改</button>
          <!-- <el-button type="text" size="small" @click="toDel(scope.row.id)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>
    <!-- add from -->
    <el-dialog :title="dialogTitle+'事故信息'" :visible.sync="dialogFormVisible" width="1100px" @close="closeDialog('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="8">
            <el-form-item label="车牌号码" prop="vehicleId">
              <el-select v-model="form.vehicleId" clearable filterable remote :remote-method="getVehicles" :loading="vehiclesLoading" placeholder="请输入关键词">
                <el-option v-for="item in vehicles" :key="item.id" :label="item.plateNumber" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶员姓名" prop="driverId">
              <el-select v-model="form.driverId" clearable filterable remote :remote-method="getDrivers" :loading="vehiclesLoading" placeholder="请输入关键词">
                <el-option v-for="item in drivers" :key="item.id" :label="item.userName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事故时间" prop="happenTime">
              <el-date-picker v-model="form.happenTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="事故地点" prop="place">
              <el-input v-model="form.place" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事故程度" prop="degree">
              <el-select v-model="form.degree" placeholder="请选择事故程度">
                <el-option label="轻微事故" :value="0"></el-option>
                <el-option label="一般事故" :value="1"></el-option>
                <el-option label="重大事故" :value="2"></el-option>
                <el-option label="特大事故" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="事故发生内容" prop="conten">
              <el-input v-model="form.content" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事故责任" prop="accidentLiability">
              <el-select v-model="form.accidentLiability" placeholder="请选择事故责任">
                <el-option label="无责" :value="0"></el-option>
                <el-option label="次责" :value="1"></el-option>
                <el-option label="同责" :value="2"></el-option>
                <el-option label="全责" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="事故人数" prop="number">
              <el-input-number v-model="form.number" auto-complete="off" :min="0" :precision="0" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="死亡人数" prop="deadNumber">
              <el-input-number v-model="form.deadNumber" auto-complete="off" :min="0" :precision="0" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重伤人数" prop="seriousNumber">
              <el-input-number v-model="form.seriousNumber" auto-complete="off" :min="0" :precision="0" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="处理机构" prop="mechanism">
              <el-input v-model="form.mechanism" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任认定" prop="respConfirm">
              <el-input v-model="form.respConfirm" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="损失金额" prop="lossAmount">
              <!-- <el-input v-model="form.lossAmount" auto-complete="off"></el-input> -->
              <el-input-number v-model="form.lossAmount" :min="0" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="我方赔偿金额" prop="myAmount">
              <!-- <el-input v-model="form.myAmount" auto-complete="off"></el-input> -->
              <el-input-number v-model="form.myAmount" :min="0" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对方赔偿金额" prop="otherAmount">
              <!-- <el-input v-model="form.otherAmount" auto-complete="off"></el-input> -->
              <el-input-number v-model="form.otherAmount" :min="0" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保险公司赔偿金额" prop="insuranceAmount">
              <!-- <el-input v-model="form.insuranceAmount" auto-complete="off"></el-input> -->
              <el-input-number v-model="form.insuranceAmount" :min="0" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="达成协议 " prop="reachAgreement">
              <el-input v-model="form.reachAgreement" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事故类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择事故责任">
                <el-option label="未结案" :value="0"></el-option>
                <el-option label="已结案" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getInfoList, addInfo, editInfo, delInfo } from '@/api/accident'
import { getInfoList as getVehicleList } from '@/api/vehicle'
import { getInfoList as getDriverList } from '@/api/driver'

export default {
  data() {
    return {
      dialogTitle: '添加',
      tableHeight: document.documentElement.clientHeight - 210 || document.body.clientHeight - 210,
      list: [],
      listLoading: true,
      searchType: '1',
      searchTxt: '',
      dialogFormVisible: false,
      vehicles: [],
      drivers: [],
      vehiclesLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      form: {
        accidentLiability: '',
        content: '',
        deadNumber: '',
        degree: '',
        driverId: '',
        driverName: '',
        happenTime: '',
        insuranceAmount: '',
        lossAmount: '',
        mechanism: '',
        myAmount: '',
        number: '',
        otherAmount: '',
        place: '',
        reachAgreement: '',
        respConfirm: '',
        seriousNumber: '',
        type: 0,
        vehicleId: '',
        vehiclePlateNumber: ''
      },
      rules: {
        happenTime: [
          { required: true, message: '请选择事故时间', trigger: 'blur' },
        ],
        driverId: [
          { required: true, message: '请选择事故驾驶员', trigger: 'blur' },
        ],
        vehicleId: [
          { required: true, message: '请选择事故车辆', trigger: 'blur' },
        ],
        degree:[
          { required: true, message: '请选择事故程度', trigger: 'change' },
        ]
      },
      formLabelWidth: '130px',
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    page() {
      this.fetchData();
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    const that = this;
    window.onresize = function () {
      that.tableHeight = document.documentElement.clientHeight - 210 || document.body.clientHeight - 210
    }
  },
  beforeDestroy() {
    window.onresize = "";
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
    degreeName(val) {
      switch (val) {
        case 0:
          return '轻微事故';
          break;
        case 1:
          return '一般事故';
          break;
        case 2:
          return '重大事故';
          break;
        case 3:
          return '特大事故';
          break;
        default:
          break;
      }
    },
    accidentLiabilityName(val) {
      switch (val) {
        case 0:
          return '无责';
          break;
        case 1:
          return '次责';
          break;
        case 2:
          return '同责';
          break;
        case 3:
          return '全责';
          break;
        default:
          break;
      }
    },
    typeName(val) {
      switch (val) {
        case 0:
          return '未结案';
          break;
        case 1:
          return '已结案';
          break;
        default:
          break;
      }
    },
    handleCreate() {
      this.resetForm();
      this.dialogFormVisible = true
    },
    closeDialog(formName) {
      this.editact = false;
      this.dialogTitle = "添加";
    },
    resetForm() {
      this.form = {
        accidentLiability: '',
        content: '',
        deadNumber: '',
        degree: '',
        driverId: '',
        driverName: '',
        happenTime: '',
        insuranceAmount: '',
        lossAmount: '',
        mechanism: '',
        myAmount: '',
        number: '',
        otherAmount: '',
        place: '',
        reachAgreement: '',
        respConfirm: '',
        seriousNumber: '',
        type: 0,
        vehicleId: '',
        vehiclePlateNumber: ''
      }
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    toSearch() {
      if (this.page > 1) {
        this.page = 1;
      } else {
        this.fetchData();
      }
    },
    fetchData() {
      this.listLoading = true;
      let params = { pageNo: this.page, pageSize: this.pageSize },
        searchType = this.searchType,
        searchTxt = this.searchTxt;

      switch (searchType) {
        case '1':
          params.vehiclePlateNumber = searchTxt
          break;
        case '2':
          params.driverName = searchTxt
          break;
        default:
          break;
      }

      getInfoList(params).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false
      })
    },
    addData(formName) {
      this.searchType = null;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveData();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    toEdit(data) {
      this.vehicles = [{ plateNumber: data.vehiclePlateNumber, id: data.vehicleId }];
      this.drivers = [{ userName: data.driverName, id: data.driverId }];
      // data.accidentLiability+='';
      // data.degree+='';
      // data.type=data.type+'';
      // this.form=data;
      this.form = Object.assign({}, data);
      this.dialogFormVisible = true;
      this.editact = true;
      this.dialogTitle = "修改";
    },
    saveData() {
      let data = this.form;

      if (this.editact) {
        editInfo(data).then(response => {
          this.dialogFormVisible = false;
          this.$message({
            message: response.message,
            type: 'success'
          });
          this.fetchData();
        });
        return;
      }
      addInfo(data).then(response => {
        if (response.status == 200) {
          this.dialogFormVisible = false;
          this.$message({
            message: response.message,
            type: 'success'
          });
          this.fetchData();
        }
      })
    },
    toDel(id) {
      this.$confirm('您确定要删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delInfo({ id }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchData();
        })
      }).catch(() => {
      });
    },
  }

}
</script>

<style lang="scss" scoped>
.el-input-number{
  width: 100%;
}
</style>

