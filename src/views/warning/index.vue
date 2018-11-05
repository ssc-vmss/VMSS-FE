<template>
  <div class="app-container">
    <Carloader v-if="listLoading" />
    <div v-else>
      <el-form inline>
        <el-form-item label="车牌号码">
          <el-input v-model="form.plateNumber" placeholder="输入车牌号码"></el-input>
        </el-form-item>
        <el-form-item label="警告类型">
          <el-select v-model="form.type" @change="handleChangeType">
            <el-option label="区域报警" value="1"></el-option>
            <el-option label="防盗" value="2"></el-option>
            <el-option label="违规用车" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="query" size="medium">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form>
      <el-table :max-height="tableHeight" :data="warnList" style="width: 100%">
        <el-table-column align="center" type="index" width="100" label="序号">
        </el-table-column>
        <el-table-column align="center" prop="plateNumber" width="150" label="车牌号码">
        </el-table-column>
        <el-table-column align="center" prop="speed" width="150" label="速度(km/h)">
        </el-table-column>
        <el-table-column align="center" prop="common" label="报警内容">
        </el-table-column>
        <el-table-column v-if="type==='1'" align="center" prop="driverName" width="150" label="驾驶员姓名">
        </el-table-column>
        <el-table-column v-if="type!=='3'" align="center" prop="location" width="200" label="点位(经度,纬度)">
        </el-table-column>
        <el-table-column v-if="type!=='3'" align="center" prop="createTime" width="200" label="报警时间">
        </el-table-column>
        <el-table-column v-if="type==='3'" align="center" prop="startTime" width="200" label="违规开始时间">
        </el-table-column>
        <el-table-column v-if="type==='3'" align="center" prop="endTime" width="200" label="违规结束时间">
        </el-table-column>
      </el-table>
      <!-- <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" style="text-align:right;margin-top:20px"></el-pagination> -->
      <pagination :page-size="10" @handleJumpPage="handleJumpPage" :current-page="currPage" :total="total"></pagination>
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
      tableHeight: document.documentElement.clientHeight - 220 || document.body.clientHeight - 220,
      form: {
        plateNumber: '',
        type: '1',
        pageNo: 1
      },
      listLoading: true, // 列表加载状态
      warnList: [],
      currPage: 1,
      page: 1,
      pageSize: 10,
      total: 0,
      type: false,
      searchType: '1'
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    const that = this;
    window.onresize = function () {
      that.tableHeight = document.documentElement.clientHeight - 220 || document.body.clientHeight - 220
    }
  },
  methods: {
    // 获取信息
    fetchData() {
      this.listLoading = true
      // 获取定位信息
      getPageQuery(this.form).then(response => {
        this.warnList = []
        if (response.data.total) {
          this.type = this.form.type
          response.data.rows.map((item, index) => {
            this.warnList.push(item)
          })
        }
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleChangeType(val) {
      this.form.type = val
    },
    // 点击查询
    query() {
      if (this.form.plateNumber || this.form.type) {
        this.param = this.form
      } else {
        this.param = { pageNo: this.currPage }
      }
      this.currPage = 1
      this.fetchData()
    },
    // 点击清空
    clear() {
      this.form = { plateNumber: '', type: '1', pageNo: 1 }
    },
    // 分页组件传入当前页进行分页查询
    handleJumpPage(currPage) {
      this.currPage = currPage
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.page = val
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  display: block;
}
.conf-form-box {
  margin: 0 10px;
  display: flex;
}
.top-box {
  display: inline-block;
  padding: 20px;
  float: right;
}
</style>
