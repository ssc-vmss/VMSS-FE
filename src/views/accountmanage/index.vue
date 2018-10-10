<template>
  <div>
    <!-- <Carloader v-if="listLoading" />
    <div v-else>
      <my-table ref="mytable" :header="headerList" :tableData="list"></my-table>
      <pagination :page-size='10' @handleJumpPage="handleJumpPage" :current-page='currPage' :total='total'></pagination>
    </div> -->
  </div>
</template>

<script>
import MyTable from '@/components/Mytable'
import { getApplyList } from '@/api/dispatch'
import Carloader from '@/components/loader'
import Pagination from '@/components/pagination'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    Carloader, Pagination, MyTable
  },
  data() {
    return {
      headerList: ['序号', 'ddid', '标题', '创建时间', '结束时间', 'processInstanceid', 'staffid', 'caruserid', 'caruser', 'msgSendStatus', '原因', '', '', '', '', '', '', '', '', '', ''],
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      total: 1,
      currPage: 1
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    toDel(id) {
      this.$confirm('您确定要删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => { })
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    fetchData() {
      this.listLoading = true
      getApplyList({ pageNo: this.currPage }).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
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
</style>

