<template>
  <div class="view">
    <Carloader v-if="listLoading" />
    <div v-else>
      <div class="top-box">
        <div class="button-padding">
          <el-button type="primary" @click="isAdd = true">新增</el-button>
        </div>
      </div>
      <div class="table-view">
        <my-table ref="mytable" :header="headerList" :tableData="tableData" :showOperation="true" @edit="edit" @del="del"></my-table>
        <pagination :page-size='10' @handleJumpPage="handleJumpPage" :current-page='currPage' :total='total'></pagination>
      </div>
      <el-dialog :visible="isAdd||isEdit" :title="isAdd?'新增防盗时间':'修改防盗时间'" center width="25%" @close="clearForm">
        <el-form v-model="form">
          <el-form-item label="开始时间" label-width="100px">
            <el-time-picker value-format="HH:mm:ss" v-model="form.startTime" class="time-picker" placeholder="选择时间"></el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间" label-width="100px">
            <el-time-picker value-format="HH:mm:ss" v-model="form.endTime" class="time-picker" placeholder="选择时间"></el-time-picker>
          </el-form-item>
          <el-form-item label="开启防盗" label-width="100px">
            <el-select v-model="form.state">
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="clearForm">取消</el-button>
          <el-button type="primary" @click="isAdd?add():update()">提交</el-button>
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
          this.guardList = JSON.parse(JSON.stringify(response.data.rows))
          this.tableData = []
          response.data.rows.map((item, index) => {
            item.id = index + 1
            this.tableData.push(item)
          })
          this.total = response.data.total
          this.listLoading = false
        }
      })
    },
    // 点击新增提交
    add() {
      addGuard(this.form).then(response => {
        this.clearForm()
        this.fetchData()
      })
    },
    // 点击修改提交
    update() {
      editGuard(this.form).then(response => {
        this.clearForm()
        this.fetchData()
      })
    },
    // 点击修改
    edit(index) {
      this.isEdit = true
      this.form = this.guardList[index]
    },
    // 点击删除
    del(index) {
      delGuard(this.guardList[index].id).then(response => {
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
      this.form = { startTime: '', endTime: '', state: '' }
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
.view {
  display: block;
}
.top-box {
  width: 100%;
  padding: 10px 20px 0 20px;
}
.el-select{
  width: 220px;
}
</style>
