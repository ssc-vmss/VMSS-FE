<template>
  <div class="app-container">
    <el-row class="toptools"  type="flex" justify="space-between">
      <el-col :span="6"><el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button></el-col>
      <div>
        <el-select v-model="searchType" style="width:120px">
          <el-option label="油卡编号" value="1"></el-option>
        </el-select>
        <el-input v-model="searchTxt" placeholder="请输入内容" size="medium" style="width:200px" />
        <el-button size="medium" type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
      </div>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit>
      <el-table-column label="企业名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.enterpriseName }}
        </template>
      </el-table-column>
      <el-table-column label="油卡编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fuelcardNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总计金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余余额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remainAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="油卡种类" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
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
    <el-dialog title="添加加油卡信息" :visible.sync="dialogFormVisible" width="600px" @close="closeDialog('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="enterpriseName" :label-width="formLabelWidth">
              <el-input v-model="form.enterpriseName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="油卡编号" prop="fuelcardNo" :label-width="formLabelWidth">
              <el-input v-model="form.fuelcardNo" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="总计金额" prop="totalAmount" :label-width="formLabelWidth">
              <el-input type="number" v-model.number="form.totalAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余余额" prop="remainAmount" :label-width="formLabelWidth">
              <el-input type="number" v-model="form.remainAmount" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="油卡种类" prop="type" :label-width="formLabelWidth">
              <el-input v-model="form.type" auto-complete="off"></el-input>
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
import { getInfoList,addInfo,editInfo,delInfo } from '@/api/oilcard'
import { getInfoList as getVehicleList } from '@/api/vehicle'

export default {
  data() {
    let validateTotalAmount = (rule, value, callback) => {
      if (value === ''&&this.form.remainAmount!='') {
        callback(new Error('请输入总金额'));
      }else if(value!=''&&value<=0){
        callback(new Error('总金额须大于0'));
      } else {
        callback();
      }
    };
    let validateRemainAmount = (rule, value, callback) => {
      if (value !== ''&&value>this.form.totalAmount) {
        callback(new Error('余额不能大于总金额'));
      } else {
        callback();
      }
    };
    return {
      list: null,
      listLoading: true,
      searchType:'1',
      searchTxt:'',
      dialogFormVisible:false,
      vehicles:[],
      vehiclesLoading:false,
      form: {
        enterpriseName: '',
        enterpriseNumber: '',
        fuelcardNo: '',
        remainAmount:'',
        totalAmount:'',
        type:''
      },
      rules: {
        enterpriseName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
        ],
        fuelcardNo:[
          { required: true, message: '请输入油卡编号', trigger: 'blur' },
        ],
        totalAmount:[
          { validator:validateTotalAmount, trigger: 'blur' },
        ],
        remainAmount:[
          { validator:validateRemainAmount, trigger: 'blur' },
        ]
      },
      formLabelWidth: '80px',
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
  methods: {
    getVehicles(query){
      if(query!=''){
        this.optionsLoading=true;
        getVehicleList({plateNumber:query}).then(response=>{
          this.vehicles=response.data.rows;
          this.optionsLoading=false;
        })
      }
    },
    typeName(status){
      switch (status) {
        case 1:
          return '正常';
          break;
        case 2:
          return '注销';
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
    },
    resetForm() {
      this.form = {
        enterpriseName: '',
        enterpriseNumber: '',
        fuelcardNo: '',
        remainAmount:'',
        totalAmount:'',
        type:''
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
            params.fuelcardNo=searchTxt
            break;
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
      this.vehicles=[{plateNumber:data.plateNumber,id:data.vehicleId}]
      data.type=data.type+'';
      // this.form=data;
      this.form=Object.assign({},data);
      this.dialogFormVisible=true;
      this.editact=true;
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

