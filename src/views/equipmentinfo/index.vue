<template>
  <div class="app-container">
    <el-row class="toptools"  type="flex" justify="space-between">
      <el-col :span="6"><el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button></el-col>
      <!-- <div><el-input  placeholder="请输入内容" prefix-icon="el-icon-search" size="medium" style="width:200px" /><el-button size="medium" type="primary" icon="el-icon-search">搜索</el-button></div> -->
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="设备类型" width="95">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column label="设备型号" align="center">
        <template slot-scope="scope">
          {{ scope.row.unitType }}
        </template>
      </el-table-column>
      <el-table-column label="生产厂商" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.manufactor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SIM卡" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.simNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备状态" align="center">
        <template slot-scope="scope">
          <span>{{ typeName(scope.row.type) }}</span>
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
    <el-dialog title="添加车载设备信息" :visible.sync="dialogFormVisible" width="600px" @close="closeDialog('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备型号" prop="unitType" :label-width="formLabelWidth">
              <el-input v-model="form.unitType" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备厂家" prop="manufactor" :label-width="formLabelWidth">
              <el-input v-model="form.manufactor" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="SIM卡" prop="simNo" :label-width="formLabelWidth">
              <el-input v-model="form.simNo" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="simNo" :label-width="formLabelWidth">
              <el-select v-model="form.type" placeholder="请选择车辆状态">
                <el-option label="正常" value="1"></el-option>
                <el-option label="注销" value="2"></el-option>
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
import { getInfoList,addInfo,editInfo,delInfo } from '@/api/equipment'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible:false,
      form: {
        unitType: '',
        manufactor: '',
        simNo: '',
        type:''
      },
      rules: {
        unitType: [
          { required: true, message: '请输入设备型号', trigger: 'blur' },
        ],
        manufactor:[
          { required: true, message: '请输入设备厂家', trigger: 'blur' },
        ],
        simNo:[
          { required: true, message: '请输入设备SIM卡', trigger: 'blur' },
        ],
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
        manufactor: '',
        unitType: '',
      }
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    fetchData() {
      this.listLoading = true;
      let params={pageNo:this.page,pageSize:this.pageSize}
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
      data.type=data.type+'';
      this.form=data;
      this.dialogFormVisible=true;
      this.editact=true;
    },
    saveData(){
      let {id,unitType,manufactor,simNo,type}=this.form;
      let data={id,unitType,manufactor,simNo,type};

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

