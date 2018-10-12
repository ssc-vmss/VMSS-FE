<template>
  <div class="view">
    <Carloader v-if="listLoading" />
    <div v-else>
      <div class="top-box">
        <el-form inline>
          <el-form-item label="驾驶员姓名">
            <el-input v-model="form.driverName" placeholder="输入驾驶员姓名"></el-input>
          </el-form-item>
          <el-form-item label="车牌号码">
            <el-input v-model="form.plateNumber" placeholder="输入车牌号码"></el-input>
          </el-form-item>
          <el-form-item label="警告类型">
            <el-select v-model="form.type" clearable @change="handleChangeType">
              <el-option label="区域报警" value="1"></el-option>
              <el-option label="防盗" value="2"></el-option>
              <el-option label="违规用车" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="query" size="medium">查询</el-button>
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
      form: {
        driverName: '',
        plateNumber: '',
        type: '1',
        pageNo: 1
      },
      listLoading: true, // 列表加载状态
      headerList: ['序号', '创建时间', '速度(km/h)', '车牌号码', '驾驶员姓名', '报警信息', '点位(经度,纬度)', '警告类型'],
      warnList: [],
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
      getPageQuery(this.form).then(response => {
        if (response.data.total) {
          this.warnList = []
          response.data.rows.map((item, index) => {
            item.id = index + 1
            delete item.driverId
            delete item.vehicleId
            delete item.orgId
            if (item.type === '1') {
              item.type = '区域报警'
            } else if (item.type === '2') {
              item.type = '防盗'
            } else if (item.type === '3') {
              item.type = '违规用车'
            }
            this.warnList.push(item)
          })
          this.total = response.data.total
          this.listLoading = false
        } else {
          this.$message({
            type: 'warning',
            message: '该查询条件下无数据'
          })
          this.listLoading = false
        }
      })
    },
    handleChangeType(val) {
      this.form.type = val
    },
    // 点击查询
    query() {
      if (this.form.driverName || this.form.plateNumber || this.form.type) {
        this.param = this.form
      } else {
        this.param = { pageNo: this.currPage }
      }
      this.fetchData()
    },
    // 点击清空
    clear() {
      this.form = { driverName: '', plateNumber: '', type: '1', pageNo: 1 }
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
