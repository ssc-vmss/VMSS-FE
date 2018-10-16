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
            <el-select v-model="form.type" @change="handleChangeType">
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
        <el-table :data="warnList" style="width: 100%">
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
          <el-table-column v-if="type!=='3'" align="center" prop="createTime" width="200" label="创建时间">
          </el-table-column>
          <el-table-column v-if="type==='3'" align="center" prop="startTime" width="200" label="违规开始时间">
          </el-table-column>
          <el-table-column v-if="type==='3'" align="center" prop="endTime" width="200" label="违规结束时间">
          </el-table-column>
        </el-table>
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
      warnList: [],
      total: 1,
      currPage: 1,
      type: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取信息s
    fetchData() {
      this.listLoading = true
      // 获取定位信息
      getPageQuery(this.form).then(response => {
        if (response.data.total) {
          this.warnList = []
          this.type = this.form.type
          response.data.rows.map((item, index) => {
            this.warnList.push(item)
          })
          this.total = response.data.total
          this.listLoading = false
        } else {
          this.$message({
            type: 'warning',
            message: '该查询条件下无数据'
          })
          this.warnList = []
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
