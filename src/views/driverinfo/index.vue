<template>
  <div class="app-container">
    <el-row class="toptools"  type="flex" justify="space-between">
      <el-col :span="6"><el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button></el-col>
      <div>
        <!-- <el-input  placeholder="请输入内容" prefix-icon="el-icon-search" size="medium" style="width:200px" /><el-button size="medium" type="primary" icon="el-icon-search">搜索</el-button> -->
        <el-input v-model="searchTxt">
          <el-select slot="prepend" v-model="searchType" style="width:120px">
            <el-option label="姓名" value="1"></el-option>
            <el-option label="准驾车型" value="2"></el-option>
          </el-select>
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">查询</el-button>
        </el-input>
      </div>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit>
      <el-table-column type="expand">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="95">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.sex }}
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="准驾车型">
        <template slot-scope="scope">
          {{ scope.row.driverLicenseType }}
        </template>
      </el-table-column>
      <el-table-column label="入职时间" width="120" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="toDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>
    <!-- add from -->
    <el-dialog title="添加驾驶员信息" :visible.sync="dialogFormVisible" width="600px" @close="closeDialog('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName" :label-width="formLabelWidth">
              <!-- <el-input v-model="form.userName" auto-complete="off"></el-input> -->
              <el-select v-model="form.userName" clearable filterable remote :remote-method="searchUser" :loading="optionsLoading" placeholder="请输入关键词">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" :label-width="formLabelWidth">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard" :label-width="formLabelWidth">
              <el-input v-model="form.idCard" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile" :label-width="formLabelWidth">
              <el-input v-model="form.mobile" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="准驾车型" prop="driverLicenseType" :label-width="formLabelWidth">
             <el-select v-model="form.driverLicenseType" placeholder="请选择准驾车型">
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
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职时间" :label-width="formLabelWidth">
              <el-date-picker  v-model="form.startTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width:180px"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="驾驶员编号" prop="driverLicenseNumber" :label-width="formLabelWidth">
              <el-input v-model="form.driverLicenseNumber" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="手机号" prop="mobile" :label-width="formLabelWidth">
              <el-input v-model="form.mobile" auto-complete="off"></el-input>
            </el-form-item>
          </el-col> -->
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
import { getInfoList,addInfo,editInfo,delInfo,getUserList } from '@/api/driver'

export default {
  data() {
    let validateIDCard=(rule, value, callback)=>{
      if(!/^\d{17}[\dx]$/i.test(value)){
        callback(new Error('请输入正确的身份证号'));
      }else{
        callback();
      }
    };
    let validateMobile=(rule,value,callback)=>{
      if(!/^1[34578]\d{9}$/.test(value)){
        callback(new Error('请输入正确手机号'));
      }else{
        callback();
      }
    }
    return {
      list: null,
      listLoading: true,
      searchTxt:'',
      searchType:'',
      dialogFormVisible:false,
      editact:false,
      options:[],
      optionsLoading:false,
      form: {
        userName: '',
        sex: '',
        idCard: '',
        mobile: '',
        driverLicenseType: '',
        driverLicenseNumber:'',
        startTime: ''
      },
      rules:{
        userName:[
          { required: true, message: '请输入姓名', trigger: 'change' },
        ],
        idCard:[
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: validateIDCard, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        driverLicenseType:[
           { required: true, message: '请选择准驾类型', trigger: 'change' },
        ],
        driverLicenseNumber:[
          { required: true, message: '请输入驾驶证编号', trigger: 'blur' },
        ]
      },
      formLabelWidth: '100px',
      page:1,
      pageSize:10,
      total:0
    }
  },
  computed:{
    testData(){
      return [{id:123}]
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
    resetForm(){
      this.form= {
        userName: '',
        sex: '',
        idCard: '',
        mobile: '',
        driverLicenseType: '',
        driverLicenseNumber:'',
        startTime: ''
      }
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    searchUser(query){//获取用户
      if(query!=''){
        this.optionsLoading=true;
        getUserList({name:query}).then(response=>{
          this.options=response.data.rows;
          this.optionsLoading=false;
        })
      }
    },
    toDel(id){
      this.$confirm('您确定要删除该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delInfo({id}).then(response=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.fetchData();
          })
        }).catch(() => {
        });
    },
    closeDialog(formName){
      this.editact=false;
      // this.$refs[formName].resetFields();
    },
    handleCreate(){
      this.resetForm();
      this.dialogFormVisible = true
    },
    fetchData() {
      this.listLoading = true
      let params={pageNo:this.page,pageSize:this.pageSize},
          searchType=this.searchType,
          searchTxt=this.searchTxt;

          if(searchTxt.trim()){
            switch (searchType) {
              case '1':
                params.userName=searchTxt
                break;
              case '2':
                params.driverLicenseType=searchTxt
                break;
              default:
                break;
            }
          }

      getInfoList(params).then(response => {
        this.list = response.data.rows
        this.total=response.data.total;
        this.listLoading = false
      })
    },
    addData(formName){
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
      this.form=data;
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
      addInfo(data).then(response=>{
        if(response.status==200){
          this.dialogFormVisible=false;
          this.$message({
            message: response.message,
            type: 'success'
          });
          this.fetchData();
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.toptools{
  margin-bottom: 20px;
}
</style>

