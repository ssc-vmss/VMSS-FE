<template>
  <div class="app-container">
    <el-row class="toptools"  type="flex" justify="space-between">
      <el-col :span="6"><el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button></el-col>
      <div><el-input  placeholder="请输入内容" prefix-icon="el-icon-search" size="medium" style="width:200px" /><el-button size="medium" type="primary" icon="el-icon-search">搜索</el-button></div>
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
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="设备编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.sex }}
        </template>
      </el-table-column>
      <el-table-column label="生产厂商" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.idNO }}</span>
        </template>
      </el-table-column>


      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small">修改</el-button>
          <el-button type="text" size="small" @click="toDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="1000" style="text-align:right;margin-top:20px"></el-pagination>
    <!-- add from -->
    <el-dialog title="添加驾驶员信息" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" :label-width="formLabelWidth">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" :label-width="formLabelWidth">
              <el-input v-model="form.idNO" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" :label-width="formLabelWidth">
              <el-input v-model="form.phone" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="准驾车型" :label-width="formLabelWidth">
             <el-select v-model="form.licenseType" placeholder="请选择准驾车型">
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
              <el-date-picker  v-model="form.joinTime" type="date" placeholder="选择日期" style="width:200px"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible:false,
      form: {
          name: '',
          sex: [],
          idNO: '',
          phone: '',
          licenseType: [],
          joinTime: ''
        },
        formLabelWidth: '80px',
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    toDel(id){
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
    handleCreate(){
      this.dialogFormVisible = true
    },
    fetchData() {
      this.listLoading = true

      setTimeout(()=>{
        this.list=[

        ]
        this.listLoading = false
      },1500)
      return;

      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
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

