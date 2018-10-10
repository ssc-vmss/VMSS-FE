<template>
  <div class="view">
    <Carloader v-if="listLoading" />
    <div v-else>
      <div class="top-box">
        <el-form inline>
          <el-form-item label="驾驶员姓名">
            <el-input v-model="driverName" placeholder="输入驾驶员姓名"></el-input>
          </el-form-item>
          <el-form-item label="车牌号码">
            <el-input v-model="plateNumber" placeholder="输入车牌号码"></el-input>
          </el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button @click="clear">重置</el-button>
        </el-form>
      </div>
      <div class="bottom-box">
        <my-table ref="mytable" :header="headerList" :tableData="warnList"></my-table>
        <pagination :page-size="10" @handleJumpPage="handleJumpPage" :current-page="currPage" :total="total"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getPageQuery } from '@/api/warn'
import Carloader from '@/components/loader'
import MyTable from '@/components/Mytable'
import Pagination from '@/components/pagination'

export default {
  components: {
    Carloader, MyTable, Pagination
  },
  data() {
    return {
      driverName: '',
      plateNumber: '',
      listLoading: true, // 列表加载状态
      headerList: ['序号', '创建时间', '速度', '车牌号码', '驾驶员姓名', '报警信息', '点位(经度,纬度)'],
      warnList: [],
      total: 1,
      currPage: 1,
      param: { pageNo: this.currPage }
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
      getPageQuery(this.param).then(response => {
        if (response.data) {
          this.warnList = []
          response.data.rows.map((item, index) => {
            item.id = index + 1
            delete item.driverId
            delete item.vehicleId
            delete item.orgId
            delete item.type
            this.warnList.push(item)
          })
          this.total = response.data.total
          this.listLoading = false
        }
      })
    },
    // 点击查询
    query() {
      if (this.driverName && this.plateNumber) {
        this.param = { driverName: this.driverName, plateNumber: this.plateNumber }
      } else if (this.plateNumber) {
        this.param = { plateNumber: this.plateNumber }
      } else if (this.driverName) {
        this.param = { driverName: this.driverName }
      } else {
        this.param = { pageNo: this.currPage }
      }
      this.fetchData()
    },
    // 点击清空
    clear() {
      this.driverName = ''
      this.plateNumber = ''
    },
    // 分页组件传入当前页进行分页查询
    handleJumpPage(currPage) {
      this.currPage = currPage
      this.param = { pageNo: this.currPage }
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
  height: 45px;
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
