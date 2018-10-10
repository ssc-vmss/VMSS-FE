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
      <el-dialog :visible="isAdd" title="新增阈值" center width="25%" @close="clearForm">
        <el-form v-model="form">
          <el-form-item label="阈值" label-width="100px">
            <el-input-number controls-position="right" v-model="form.threshold" :max="60"></el-input-number>
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
          <el-button type="primary" @click="add">提交</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible="isEdit" title="修改阈值" center width="25%" @close="clearForm">
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
          <el-button type="primary" @click="update">提交</el-button>
        </div>
      </el-dialog>
    </div>
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
      headerList: ['序号', '阈值', '状态', '创建时间'],
      tableData: [],
      thresholdList: [],
      isAdd: false, // 是否新增
      isEdit: false, // 是否修改
      form: {
        id: '',
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
          this.tableData = []
          response.data.rows.map((item, index) => {
            item.id = index + 1
            if (item.state === '0') {
              item.state = '停用'
            } else if (item.state === '1') {
              item.state = '启用'
            }
            this.tableData.push(item)
          })
          this.total = response.data.total
          this.listLoading = false
        }
      })
    },
    // 点击新增提交
    add() {
      addThreshold({ state: this.form.state, threshold: this.form.threshold }).then(response => {
        this.form = { state: '', threshold: '' }
        this.isAdd = false
        this.fetchData()
      })
    },
    // 点击修改提交
    update() {
      editThreshold({ id: this.form.id, state: this.form.state, threshold: this.form.threshold }).then(response => {
        this.form = { state: '', threshold: '' }
        this.isEdit = false
        this.fetchData()
      })
    },
    // 点击修改
    edit(index) {
      this.isEdit = true
      this.form.id = this.thresholdList[index].id
      this.form.threshold = this.thresholdList[index].threshold
      this.form.state = this.thresholdList[index].state
    },
    // 点击删除
    del(index) {
      delThreshold(this.thresholdList[index].id).then(response => {
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
.view {
  display: block;
}
.top-box {
  width: 100%;
  padding: 10px 20px 0 20px;
}
.conf-form-box {
  margin: 0 10px;
  display: flex;
}
.top-label {
  text-align: center;
  width: 200px;
  padding: 8px 0;
  margin: 0 0 0 10px;
}
</style>
