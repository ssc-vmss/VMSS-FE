<template>
  <div class="app-container">
    <el-row class="toptools" type="flex" justify="space-between">
      <el-col :span="6">
        <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </el-col>
      <div>
        <!-- <el-input  placeholder="请输入内容" prefix-icon="el-icon-search" size="medium" style="width:200px" /><el-button size="medium" type="primary" icon="el-icon-search">搜索</el-button> -->
        <!-- <el-input v-model="searchTxt">
          <el-select slot="prepend" v-model="searchType" style="width:120px">
            <el-option label="姓名" value="1"></el-option>
            <el-option label="准驾车型" value="2"></el-option>
          </el-select>
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">查询</el-button>
        </el-input> -->
        <el-select v-model="searchType" style="width:120px">
          <el-option label="姓名" value="1"></el-option>
          <el-option label="准驾车型" value="2"></el-option>
        </el-select>
        <el-select v-if="searchType==2" v-model="driverSearchType" multiple collapse-tags style="width:180px">
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
        <el-input v-else v-model="searchTxt" placeholder="请输入内容" style="width:180px"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="toSearch">查询</el-button>
      </div>
    </el-row>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit :max-height="tableHeight">
      <!-- <el-table-column type="expand">
        <template slot-scope="scope">
        </template>
      </el-table-column> -->
      <el-table-column align="center" width="200" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.sex }}
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="准驾车型" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverLicenseType }}
        </template>
      </el-table-column>
      <el-table-column label="入职时间" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
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
    <el-dialog :title="dialogTitle+'驾驶员信息'" :visible.sync="dialogFormVisible" width="600px" @close="closeDialog('ruleForm')">
      <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="userId">
              <el-select v-model="form.userId" clearable filterable remote :remote-method="searchUser" :loading="optionsLoading" @change="setUser" @clear="clearUser" placeholder="请输入关键词">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" :disabled="true" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="准驾车型" prop="driverLicenseType">
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
            <el-form-item label="入职时间" prop="startTime">
              <el-date-picker v-model="form.startTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="驾驶证编号" prop="driverLicenseNumber">
              <el-input v-model="form.driverLicenseNumber" auto-complete="off"></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
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
import { getInfoList, addInfo, editInfo, delInfo, getUserList } from '@/api/driver'

export default {
  data() {
    let validateIDCard = (rule, value, callback) => {
      if (!/^\d{17}[\dx]$/i.test(value)) {
        callback(new Error('请输入正确的身份证号'));
      } else {
        callback();
      }
    };
    let validateMobile = (rule, value, callback) => {
      if (!/^1\d{10}$/.test(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    }
    return {
      dialogTitle: '添加',
      tableHeight: document.documentElement.clientHeight - 210 || document.body.clientHeight - 210,
      list: [],
      listLoading: true,
      searchTxt: '',
      searchType: '1',
      driverSearchType: [],
      dialogFormVisible: false,
      editact: false,
      options: [],
      optionsLoading: false,
      editUserName: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      form: {
        userName: '',
        sex: '',
        idCard: '',
        mobile: '',
        driverLicenseType: '',
        driverLicenseNumber: '',
        startTime: ''
      },
      rules: {
        userId: [
          { required: true, message: '请输入姓名', trigger: 'change' },
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: validateIDCard, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        driverLicenseType: [
          { required: true, message: '请选择准驾类型', trigger: 'change' },
        ]
      },
      formLabelWidth: '120px',
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
    resetForm() {
      this.form = {
        userName: '',
        userId: '',
        sex: '',
        idCard: '',
        mobile: '',
        driverLicenseType: '',
        driverLicenseNumber: '',
        startTime: ''
      }
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    searchUser(query) {//获取用户
      if (query) {
        this.optionsLoading = true;
        getUserList({ name: query }).then(response => {
          this.options = response.data.rows;
          this.optionsLoading = false;
        })
      }
    },
    setUser(val) {
      if (!val) return;
      let user = this.options.find(item => {
        return item.id == val
      })
      this.form.userName = user.name;
      this.form.mobile = user.mobile;
    },
    clearUser() {
      this.form.userName = ''
      this.form.mobile = ''
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
          })
          this.fetchData()
        })
      }).catch(() => {
      })
    },
    closeDialog(formName) {
      this.editact = false
      this.dialogTitle = '添加'
      this.form.userName = this.editUserName
      this.$refs[formName].resetFields()
    },
    handleCreate() {
      console.log('this.form:', this.form)
      // this.clearUser();
      // this.resetForm();
      this.form = {};
      this.dialogFormVisible = true
      console.log('this.form:', this.form)

    },
    toSearch() {
      if (this.page > 1) {
        this.page = 1;
      } else {
        this.fetchData();
      }
    },
    fetchData() {
      this.listLoading = true
      let params = { pageNo: this.page, pageSize: this.pageSize },
        searchType = this.searchType,
        driverSearchType = this.driverSearchType,
        searchTxt = this.searchTxt;

      switch (searchType) {
        case '1':
          params.userName = searchTxt
          break;
        case '2':
          params.driverLicenseType = driverSearchType.join();
          break;
        default:
          break;
      }


      getInfoList(params).then(response => {
        this.list = response.data.rows||[]
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
      console.log('data:', data)
      // this.form=data;
      // this.form.userId=data.userName;
      // this.options=[{id:data.userId,name:data.userName}]
      // this.dialogFormVisible=true;
      // this.editact=true;
      this.editUserName = data.userName;
      this.$nextTick(function () {
        // this.form=data;
        this.form = Object.assign({}, data);
        this.options = [{ id: data.userId, name: data.userName }]
        this.dialogFormVisible = true;
        this.editact = true;
        this.dialogTitle = "修改";
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 160px;
}
</style>

