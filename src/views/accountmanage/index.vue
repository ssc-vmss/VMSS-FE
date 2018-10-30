<template>
  <div class="app-container">
    <el-row class="toptools" type="flex" justify="space-between">
      <el-col :span="6">
        <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </el-col>
      <!-- <div>
        <el-select v-model="searchType" style="width:120px">
          <el-option label="用户账号" value="1"></el-option>
          <el-option label="姓名" value="2"></el-option>
          <el-option label="手机号码" value="3"></el-option>
        </el-select>
        <el-select v-if="searchType==2" v-model="vehicleSearchType" multiple collapse-tags style="width:180px">
          <el-option v-for="(item,index) in vechileType" :label="item.type" :value="item.value" :key="index"></el-option>
        </el-select>
        <el-input v-else v-model="searchTxt" placeholder="请输入内容" style="width:180px"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="toSearch">查询</el-button>
      </div> -->
    </el-row>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit :max-height="tableHeight">
      <el-table-column align="center" label="用户账号">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="密码">
        <template slot-scope="scope">
          {{ pswd(scope.row.password) }}
        </template>
      </el-table-column> -->
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="部门名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.departmentName }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <button class="btn" @click="toEdit(scope.row)">修改</button>
          <button class="btn" @click="toDel(scope.row.id)">删除</button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>

    <!-- add from -->
    <el-dialog :title="dialogTitle+'用户信息'" :visible.sync="dialogFormVisible" width="600px" @close="closeDialog('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号" prop="account" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.account"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
              <el-input type="password" v-model="form.password" auto-complete="off" placeholder="不修改请留空"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="confirmPassword" :label-width="formLabelWidth">
              <el-input type="password" v-model="form.confirmPassword" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.mobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="departmentName" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.departmentName" auto-complete="off"></el-input>
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
import { getInfoList, addInfo, editInfo, delInfo } from '@/api/account'
import { Base64 } from 'js-base64';

export default {
  watch: {
    page() {
      this.fetchData();
    }
  },
  data() {
    let regPassword=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    let validataPassword=(rule,value,callback)=>{
      if(!this.editact&&value===''){
        callback('请输入密码');
      }else if(value!==''&&!regPassword.test(value)){
        callback('密码须为字母+数字的6~16位混合组合');
      }else {
        callback();
      }
    };
    let validataConfirmPassword=(rule,value,callback)=>{
        if(value!==this.form.password){
          callback('确认密码和密码不一致');
        }else{
          callback();
        }
    };
    let validataMobile=(rule,value,callback)=>{
      if(value!==''&&!/^1\d{10}$/.test(value)){
        callback(new Error('请输入正确手机号'));
      }else{
        callback();
      }
    };
    return {
      dialogTitle:'添加',
      tableHeight:document.documentElement.clientHeight-210||document.body.clientHeight-210,
      list: [],
      listLoading: true,
      dialogFormVisible:false,
      editact:false,
      searchType:'',
      searchTxt:'',
      options:[],
      optionsLoading:false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      form: {
        account: '',
        departmentName: '',
        mobile: '',
        name: '',
        password: '',
        confirmPassword:''
      },
      rules: {
        account: [
          { type: 'string', required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
           { validator: validataPassword, trigger: 'blur' }
        ],
        confirmPassword:[
          { validator: validataConfirmPassword, trigger: 'blur' }
        ],
        mobile:[
          { validator: validataMobile, trigger: 'blur' }
        ]
      },
      formLabelWidth: '80px',
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {

  },
  created() {
    this.fetchData()
  },
  mounted(){
    const that=this;
    window.onresize=function(){
      that.tableHeight=document.documentElement.clientHeight-210||document.body.clientHeight-210
    }
  },
  beforeDestroy(){
    window.onresize="";
  },
  methods: {
    pswd(pswd){
      return Base64.decode(pswd)
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
    handleCreate() {
      this.resetForm();
      this.dialogFormVisible = true
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.editact = false;
      this.dialogTitle="添加";
    },
    resetForm() {
      this.form = {
        account: '',
        departmentName: '',
        mobile: '',
        name: '',
        password: '',
        confirmPassword:''
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
      this.listLoading = true
      let params={pageNo:this.page,pageSize:this.pageSize},
          searchType=this.searchType,
          vehicleSearchType=this.vehicleSearchType,
          searchTxt=this.searchTxt;

          switch (searchType) {
            case '1':
              params.account=searchTxt
              break;
            case '2':
              params.name=vehicleSearchType.join()
              break;
            case '3':
              params.mobile=searchTxt
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
    toEdit(data) {
      data.password='';
      data.confirmPassword='';
      this.form = Object.assign({},data);
      this.dialogFormVisible = true;
      this.editact = true;
      this.dialogTitle="修改";
    },
    saveData() {
      let data,{id,account,departmentName,mobile,name,password} = this.form;
      data={id,account,departmentName,mobile,name};
      if(password!='')data.password=Base64.encode(data.password);
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

