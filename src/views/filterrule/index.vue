<template>
  <div class="app-container">
    <Carloader v-if="listLoading" />
    <div v-else>
      <el-row class="toptools" type="flex" justify="space-between">
        <el-col :span="6">
          <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="isAdd = true">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column align="center" type="index" label="序号">
        </el-table-column>
        <el-table-column align="center" prop="vehiclePlateNumber" label="车牌号码">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="事故创建时间">
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)">修改</el-button>
            <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :page-size='10' @handleJumpPage="handleJumpPage" :current-page='currPage' :total='total'></pagination>
      <el-dialog :visible="isAdd||isEdit" :title="isAdd?'新增过滤规则':'修改过滤规则'" center width="25%" @close="clearForm">
        <el-form v-model="form">
          <el-form-item label="车牌号码" label-width="100px">
            <el-select v-model="form.vehicleId" clearable filterable remote placeholder="请输入关键词">
              <el-option v-for="(item,index) in vehiclearray" :key="index" :label="item.plateNumber" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" label-width="100px">
            <el-select v-model="form.status">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
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
import { getFilterRuleList, addInfo, editInfo, delInfo } from '@/api/filterrule'
import { getInfoList } from '@/api/vehicle'
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
      headerList: ['序号', '车牌号码', '事故创建时间', '状态'],
      tableData: [],
      filterruleList: [],
      vehiclearray: [],
      isAdd: false, // 是否新增
      isEdit: false, // 是否修改
      form: {
        id: '',
        vehicleId: '',
        vehiclePlateNumber: '',
        status: ''
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
      this.fetchFilterRuleData()
      // 获取车辆信息
      getInfoList({ pageNo: 1, pageSize: 1000 }).then(response => {
        this.vehiclearray = response.data.rows
        this.total = response.data.total
      })
    },
    // 获取过滤规则信息
    fetchFilterRuleData() {
      this.listLoading = true
      getFilterRuleList().then(response => {
        if (response.data) {
          this.filterruleList = JSON.parse(JSON.stringify(response.data.rows))
          this.tableData = []
          response.data.rows.forEach((item, index) => {
            if (item.status === 1) {
              item.status = '启用'
            } else if (item.status === 2) {
              item.status = '禁用'
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
      this.vehiclearray.forEach(vehicle => {
        if (vehicle.id === this.form.vehicleId) {
          this.form.vehiclePlateNumber = vehicle.plateNumber
        }
      })
      addInfo(this.form).then(response => {
        this.clearForm()
        this.fetchFilterRuleData()
      })
    },
    // 点击修改提交
    update() {
      if (this.form.vehicleId === '') {
        this.$message({
          type: 'warning',
          message: '车牌号码不能为空'
        })
        return
      }
      this.vehiclearray.forEach(vehicle => {
        if (this.form.vehicleId === vehicle.id) {
          this.form.vehiclePlateNumber = vehicle.plateNumber
        }
      })
      if (this.form.status === '启用' || this.form.status === '1') {
        this.form.status = 1
      } else {
        this.form.status = 2
      }
      editInfo(this.form).then(response => {
        this.clearForm()
        this.fetchFilterRuleData()
      })
    },
    // 点击修改
    edit(id) {
      this.isEdit = true
      this.filterruleList.forEach((item, index) => {
        if (item.id === id) {
          this.form.id = this.filterruleList[index].id
          this.form.vehicleId = this.filterruleList[index].vehicleId
          this.form.status = this.tableData[index].status
          this.form.vehiclePlateNumber = this.filterruleList[index].vehiclePlateNumber
        }
      })
    },
    // 点击删除
    del(id) {
      delInfo({ id: id }).then(response => {
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.fetchFilterRuleData()
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
      this.form = { vehiclePlateNumber: '', status: '' }
    },
    // 分页组件传入当前页进行分页查询
    handleJumpPage(currPage) {
      this.currPage = currPage
      this.fetchFilterRuleData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
