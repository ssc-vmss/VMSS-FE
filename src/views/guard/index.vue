<template>
  <div class="app-container">
    <Carloader v-if="listLoading" />
    <div v-else>
      <el-row class="toptools" type="flex" justify="space-between">
        <el-col :span="6">
          <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate('ruleForm')">添加</el-button>
        </el-col>
      </el-row>
      <el-table class="table-view" :data="guardList" :max-height="tableHeight">
        <el-table-column align="center" type="index" width="100" label="序号">
        </el-table-column>
        <el-table-column align="center" prop="state" label="开启防盗">
        </el-table-column>
        <el-table-column align="center" prop="startTime" label="防盗开始时间">
        </el-table-column>
        <el-table-column align="center" prop="endTime" label="防盗结束时间">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <my-table ref="mytable" :header="headerList" :tableData="tableData" :showOperation="true" @edit="edit" @del="del"></my-table> -->
      <pagination :page-size='10' @handleJumpPage="handleJumpPage" :current-page='currPage' :total='total'></pagination>
      <el-dialog :visible.sync="dialogFormVisible" :title="isAdd?'新增防盗时间':'修改防盗时间'" center width="25%" @close="closeDialog('ruleForm')">
        <el-form ref="ruleForm" :model="form" :rules="rules">
          <el-form-item prop="startTime" label="开始时间" label-width="100px">
            <el-time-picker value-format="HH:mm:ss" v-model="form.startTime" class="time-picker" placeholder="选择时间"></el-time-picker>
          </el-form-item>
          <el-form-item prop="endTime" label="结束时间" label-width="100px">
            <el-time-picker value-format="HH:mm:ss" v-model="form.endTime" class="time-picker" placeholder="选择时间"></el-time-picker>
          </el-form-item>
          <el-form-item prop="state" label="开启防盗" label-width="100px">
            <el-select v-model="form.state">
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addData('ruleForm')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPageQuery, addGuard, editGuard, delGuard } from '@/api/guard'
import Carloader from '@/components/loader'
import MyTable from '@/components/Mytable'
import Pagination from '@/components/pagination'

export default {
  components: {
    Carloader, MyTable, Pagination
  },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 210 || document.body.clientHeight - 210,
      listLoading: true, // 列表加载状态
      headerList: ['序号', '开启防盗', '防盗开始时间', '防盗结束时间', '创建时间'],
      tableData: [],
      guardList: [],
      isAdd: false, // 是否新增
      isEdit: false, // 是否修改
      form: {
        startTime: '',
        endTime: '',
        state: ''
      },
      total: 1,
      currPage: 1,
      dialogFormVisible: false,
      rules: {
        startTime: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请输入结束时间', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择是否开启防盗', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    const that = this
    window.onresize = () => {
      that.tableHeight = document.documentElement.clientHeight - 210 || document.body.clientHeight - 210
    }
  },
  methods: {
    // 获取信息
    fetchData() {
      this.listLoading = true
      // 获取定位信息
      getPageQuery({ pageNo: this.currPage }).then(response => {
        if (response.data) {
          this.guardList = JSON.parse(JSON.stringify(response.data.rows))
          this.tableData = []
          response.data.rows.map((item, index) => {
            this.tableData.push(item)
          })
          this.total = response.data.total
          this.listLoading = false
        }
      })
    },
    handleCreate(formName) {
      this.dialogFormVisible = true
      this.isAdd = true
    },
    saveData() {
      const data = this.form
      if (this.isEdit) {
        editGuard(data).then(response => {
          this.dialogFormVisible = false
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.fetchData()
          this.isEdit = false
        })
      } else {
        addGuard(data).then(response => {
          if (response.status === 200) {
            this.dialogFormVisible = false
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.fetchData()
            this.isAdd = false
          }
        })
      }
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveData()
        } else {
          return false
        }
      })
    },
    // 点击修改
    edit(data) {
      this.form = Object.assign({}, data)
      this.dialogFormVisible = true
      this.isEdit = true
    },
    // 点击删除
    del(id) {
      delGuard(id).then(response => {
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.fetchData()
        }
      })
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields()
      if (this.isAdd) {
        this.isAdd = false
      } else if (this.isEdit) {
        this.isEdit = false
      }
    },
    // 分页组件传入当前页进行分页查询
    handleJumpPage(currPage) {
      this.currPage = currPage
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px 20px 0 20px;
}
.el-select {
  width: 220px;
}
</style>
