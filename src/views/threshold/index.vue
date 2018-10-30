<template>
  <div class="app-container">
    <Carloader v-if="listLoading" />
    <div v-else>
      <el-row class="toptools" type="flex" justify="space-between">
        <el-col :span="6">
          <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="isAdd = true">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="thresholdList" style="width: 100%">
        <el-table-column align="center" type="index" width="100" label="序号">
        </el-table-column>
        <el-table-column align="center" prop="threshold" label="阈值(分钟)">
        </el-table-column>
        <el-table-column align="center" prop="state" label="状态">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <button class="btn" @click="edit(scope.row)">修改</button>
            <button class="btn" @click="del(scope.row.id)">删除</button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :page-size='10' @handleJumpPage="handleJumpPage" :current-page='currPage' :total='total'></pagination>
    </div>
    <el-dialog :visible="isAdd||isEdit" :title="isAdd?'新增阈值':'修改阈值'" center width="25%" @close="clearForm">
      <el-form v-model="form">
        <el-form-item label="阈值" label-width="100px">
          <el-input-number controls-position="right" v-model="form.threshold" :min="0" :max="60"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <el-select v-model="form.state">
            <el-option label="停用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearForm">取消</el-button>
        <el-button type="primary" @click="isAdd?add():update()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPageQuery, addThreshold, editThreshold, delThreshold } from '@/api/threshold'
import Carloader from '@/components/loader'
import MyTable from '@/components/Mytable'
import Pagination from '@/components/pagination'

export default {
  components: {
    Carloader, MyTable, Pagination
  },
  data() {
    return {
      listLoading: true, // 列表加载状态
      headerList: ['序号', '阈值(分钟)', '状态', '创建时间'],
      // tableData: [],
      thresholdList: [],
      isAdd: false, // 是否新增
      isEdit: false, // 是否修改
      form: {
        threshold: '',
        state: ''
      },
      total: 1,
      currPage: 1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取信息
    fetchData() {
      this.listLoading = true
      // 获取定位信息
      getPageQuery({ pageNo: this.currPage }).then(response => {
        if (response.data) {
          this.thresholdList = JSON.parse(JSON.stringify(response.data.rows))
          // this.tableData = []
          this.thresholdList.map((item, index) => {
            console.log(item.createTime)
            if (item.state === '0') {
              item.state = '停用'
            } else if (item.state === '1') {
              item.state = '启用'
            }
            // this.tableData.push(item)
          })
          this.total = response.data.total
          this.listLoading = false
        }
      })
    },
    // 点击新增提交
    add() {
      addThreshold(this.form).then(response => {
        this.clearForm()
        this.fetchData()
      })
    },
    // 点击修改提交
    update() {
      console.log('this.update')
      editThreshold(this.form).then(response => {
        this.clearForm()
        this.fetchData()
      })
    },
    // 点击修改
    edit(data) {
      this.isEdit = true
      this.form.id = data.id
      this.form.threshold = data.threshold
      if (data.state === '停用') {
        this.form.state = '0'
      } else {
        this.form.state = '1'
      }
    },
    // 点击删除
    del(id) {
      delThreshold(id).then(response => {
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.fetchData()
        }
      })
    },
    // 点击取消
    clearForm() {
      if (this.isAdd) {
        this.isAdd = false
      }
      if (this.isEdit) {
        this.isEdit = false
      }
      this.form = { threshold: '', state: '' }
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
.el-select {
  width: 200px;
}
</style>
