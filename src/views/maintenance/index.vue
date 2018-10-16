<template>
  <div class="app-container">
    <el-row class="toptools"  type="flex" justify="space-between">
      <el-col :span="6"><el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button></el-col>
      <div>
        <el-select v-model="searchType" style="width:120px">
          <el-option label="车牌号" value="1"></el-option>
          <!-- <el-option label="SIM卡" value="2"></el-option>
          <el-option label="绑定车辆" value="3"></el-option> -->
        </el-select>
        <el-input v-model="searchTxt" placeholder="请输入内容" size="medium" style="width:200px" />
        <el-button size="medium" type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
      </div>
    </el-row>
    <el-table
      :max-height="tableHeight"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit>
      <el-table-column label="车牌号码" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehiclePlateNumber }}
        </template>
      </el-table-column>
      <el-table-column label="企业名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.enterpriseName }}
        </template>
      </el-table-column>
      <el-table-column label="车辆维修状态" align="center">
        <template slot-scope="scope">
          {{ statusName(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="报修人姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.repaireReporterName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报修日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reportDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="送修人姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.senderReporterName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="送修日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sendDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修保养" align="center">
        <template slot-scope="scope">
          <span>{{ typeName(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修项目" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.repairProject }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修厂家" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.manufactorId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="验收人姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.checkReporterName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆验收结果" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.checkResult }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100"  align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="toDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>
    <!-- add from -->
    <el-dialog :title="dialogTitle+'维修保养信息'" :visible.sync="dialogFormVisible" width="800px" @close="closeDialog('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号码" prop="vehicleId" :label-width="formLabelWidth">
              <el-select v-model="form.vehicleId" clearable filterable remote :remote-method="getVehicles" :loading="vehiclesLoading" placeholder="请输入关键词">
                <el-option
                  v-for="item in vehicles"
                  :key="item.id"
                  :label="item.plateNumber"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="enterpriseName" :label-width="formLabelWidth">
              <el-input v-model="form.enterpriseName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆维修状态" prop="status" :label-width="formLabelWidth">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="未维修" :value="0"></el-option>
                <el-option label="维修中" :value="1"></el-option>
                <el-option label="已维修" :value="2"></el-option>
                <el-option label="已验收" :value="3"></el-option>
                <!-- <el-option label="注销" :value="4"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修人姓名" prop="repaireReporterName" :label-width="formLabelWidth">
              <el-input v-model="form.repaireReporterName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报修日期" prop="reportDate" :label-width="formLabelWidth">
              <el-date-picker v-model="form.reportDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="送修人姓名" prop="senderReporterName" :label-width="formLabelWidth">
              <el-input v-model="form.senderReporterName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="送修日期" prop="sendDate" :label-width="formLabelWidth">
              <el-date-picker v-model="form.sendDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修保养" prop="type" :label-width="formLabelWidth">
              <el-select v-model="form.type" placeholder="请选择状态">
                <el-option label="小修" :value="0"></el-option>
                <el-option label="大修" :value="1"></el-option>
                <el-option label="保养" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="维修项目" prop="repairProject" :label-width="formLabelWidth">
              <el-input v-model="form.repairProject" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修厂家" prop="manufactorId" :label-width="formLabelWidth">
              <el-input v-model="form.manufactorId" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="维修金额" prop="amount" :label-width="formLabelWidth">
              <!-- <el-input type="number" v-model="form.amount" auto-complete="off"></el-input> -->
              <el-input-number v-model="form.amount" :min="0" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收人姓名" prop="checkReporterName" :label-width="formLabelWidth">
              <el-input v-model="form.checkReporterName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆验收结果" prop="checkResult" :label-width="formLabelWidth">
              <el-input v-model="form.checkResult" auto-complete="off"></el-input>
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
import { getInfoList,addInfo,editInfo,delInfo } from '@/api/maintenance'
import { getInfoList as getVehicleList } from '@/api/vehicle'

export default {
  data() {
    let validataSendDate=(rule,value,callback)=>{
      if(value){
        if(this.form.reportDate&&(new Date(value)-new Date(this.form.reportDate)<0)){
          callback('送修日期不能早于报修日期');
        }else{
          callback();
        }
      }else{
        callback();
      }
    };
    return {
      dialogTitle:'添加',
      tableHeight:document.documentElement.clientHeight-230||document.body.clientHeight-230,
      list: null,
      listLoading: true,
      searchType:'1',
      searchTxt:'',
      dialogFormVisible:false,
      vehicles:[],
      vehiclesLoading:false,
      form: {
        amount: '',
        checkReporterName: '',
        checkResult: '',
        enterpriseName:'',
        manufactorId:'',
        repairProject: '',
        repaireReporterName: '',
        reportDate: '',
        sendDate:'',
        senderReporterName:'',
        status:'',
        type:'',
        vehiclePlateNumber:'',
        vehicleId:''
      },
      rules: {
        vehicleId:[
          { required: true, message: '请选择维修车辆', trigger: 'blur' },
        ],
        sendDate:[
          { validator: validataSendDate, trigger: 'blur' }
        ]
      },
      formLabelWidth: '100px',
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
  mounted(){
    const that=this;
    window.onresize=function(){
      that.tableHeight=document.documentElement.clientHeight-230||document.body.clientHeight-230
    }
  },
  beforeDestroy(){
    window.onresize="";
  },
  methods: {
    getVehicles(query){
      if(query){
        this.optionsLoading=true;
        getVehicleList({plateNumber:query}).then(response=>{
          this.vehicles=response.data.rows;
          this.optionsLoading=false;
        })
      }
    },
    statusName(status){
      switch (status) {
        case 0:
          return '未维修';
          break;
        case 1:
          return '维修中';
          break;
        case 2:
          return '已维修';
          break;
        case 3:
          return '已验收';
          break;
        // case 4:
        //   return '注销';
        //   break;
        default:
          break;
      }
    },
    typeName(type){
      switch (type) {
        case 0:
          return '小修';
          break;
        case 1:
          return '大修';
          break;
        case 2:
          return '保养';
          break;
        default:
          break;
      }
    },
    handleCreate(){
      this.resetForm();
      this.dialogFormVisible = true
    },
    closeDialog(formName) {
      this.editact = false;
      this.dialogTitle="添加";
    },
    resetForm() {
      this.form = {
        amount: '',
        checkReporterName: '',
        checkResult: '',
        enterpriseName:'',
        manufactorId:'',
        repairProject: '',
        repaireReporterName: '',
        reportDate: '',
        sendDate:'',
        senderReporterName:'',
        status:'',
        type:'',
        vehiclePlateNumber:'',
        vehicleId:''
      }
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    toSearch(){
      if(this.page>1){
        this.page=1;
      }else{
        this.fetchData();
      }
    },
    fetchData() {
      this.listLoading = true;
      let params={pageNo:this.page,pageSize:this.pageSize},
          searchType=this.searchType,
          searchTxt=this.searchTxt;

      switch (searchType) {
          case '1':
            params.vehiclePlateNumber=searchTxt
            break;
          // case '2':
          //   params.simNo=searchTxt
          //   break;
          // case '3':
          //   params.plateNumber=searchTxt
          //   break;
          default:
            break;
        }

      getInfoList(params).then(response => {
        this.list = response.data.rows;
        this.total=response.data.total;
        this.listLoading = false
      })
    },
    addData(formName) {
      this.searchType=null;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveData();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    toEdit(data){
      console.log('data:',data)
      this.vehicles=[{plateNumber:data.vehiclePlateNumber,id:data.vehicleId}]
      // data.status+='';
      // data.type=data.type+'';
      // this.form=data;
      this.form=Object.assign({},data);
      console.log('this.form:',this.form)
      this.dialogFormVisible=true;
      this.editact=true;
      this.dialogTitle="修改";
    },
    saveData(){
      let data=this.form;

      if(this.editact){
        editInfo(data).then(response=>{
          this.dialogFormVisible=false;
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
.toptools{
  margin-bottom: 20px;
}
</style>

