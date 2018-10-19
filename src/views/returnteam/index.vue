<template>
  <div class="app-container">
    <el-row class="toptools" type="flex" justify="space-between">
      <el-col :span="6">
        <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </el-col>
      <div>
        <el-select v-model="searchType" style="width:120px">
          <el-option label="司机姓名" value="1"></el-option>
        </el-select>
        <el-input v-model="searchTxt" placeholder="请输入内容" size="medium" style="width:200px" />
        <el-button size="medium" type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
      </div>
    </el-row>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit>
      <el-table-column label="派遣单号" align="center">
        <template slot-scope="scope">
          {{ scope.row.dispatchId }}
        </template>
      </el-table-column>
      <el-table-column label="车牌号码" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehiclePlateNumber }}
        </template>
      </el-table-column>
      <el-table-column label="司机姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverName }}
        </template>
      </el-table-column>
      <el-table-column label="使用人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.caruser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="始发地" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.origin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目的地" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.destination }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.useDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返回日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.returnDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归队时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.returnTime }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>
    <el-dialog :visible.sync="dialogFormVisible" :title="isAdd?'添加归队记录信息':'编辑归队记录信息'" width="620px" @close="handleCancle">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="派遣单号" prop="vehiclePlateNumber">
              <el-select v-model="form.dispatchId" clearable filterable remote placeholder="请输入车牌号码">
                <el-option v-for="item in dispatchArray" :key="item.id" :label="item.id" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="车牌号码" prop="vehiclePlateNumber">
              <el-select v-model="form.vehicleId" clearable filterable remote placeholder="请输入车牌号码">
                <el-option v-for="item in vehicleArray" :key="item.id" :label="item.plateNumber" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="司机姓名" prop="driverName">
              <el-select v-model="form.driverId" clearable filterable remote placeholder="请输入驾驶员姓名">
                <el-option v-for="item in driverArray" :key="item.id" :label="item.userName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getInfoList as getReturnTeamList, addInfo, delInfo } from '@/api/returnteam'
import { getDispatchList } from '@/api/dispatch'
import { getInfoList as getVehicleList } from '@/api/vehicle'
import { getInfoList as getDriverList } from '@/api/driver'

export default {
  data() {
    const validateTotalAmount = (rule, value, callback) => {
      if (value === '' && this.form.remainAmount !== '') {
        callback(new Error('请输入总金额'))
      } else if (value !== '' && value <= 0) {
        callback(new Error('总金额须大于0'))
      } else {
        callback()
      }
    }
    const validateRemainAmount = (rule, value, callback) => {
      if (value !== '' && value > this.form.totalAmount) {
        callback(new Error('余额不能大于总金额'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      searchType: '1',
      searchTxt: '',
      dialogFormVisible: false,
      form: {
        dispatchId: '',
        vehicleId: '',
        driverId: ''
      },
      rules: {
        vehicleId: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        driverId: [
          { required: true, message: '请输入油卡编号', trigger: 'blur' }
        ],
        fuelcardId: [
          { validator: validateTotalAmount, trigger: 'blur' }
        ],
        remainAmount: [
          { validator: validateRemainAmount, trigger: 'blur' }
        ]
      },
      formLabelWidth: '90px',
      page: 1,
      pageSize: 10,
      total: 0,
      dispatchArray: [],
      vehicleArray: [],
      driverArray: [],
      isAdd: false,
      isEdit: false
    }
  },
  watch: {
    page() {
      this.fetchData()
    }
  },
  created() {
    this.fetchDataList()
    this.fetchData()
  },
  methods: {
    fetchDataList() {
      // 获取派遣单信息
      getDispatchList().then(response => {
        this.dispatchArray = response.data.rows
      })
      // 获取车辆信息
      getVehicleList().then(response => {
        this.vehicleArray = response.data.rows
      })
      // 获取驾驶员信息
      getDriverList().then(response => {
        this.driverArray = response.data.rows
      })
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.isAdd = true
    },
    handleCurrentChange(val) {
      this.page = val
    },
    toSearch() {
      if (this.page > 1) {
        this.page = 1
      } else {
        this.fetchData()
      }
    },
    fetchData() {
      this.listLoading = true
      const params = { pageNo: this.page, pageSize: this.pageSize }
      const searchType = this.searchType
      const searchTxt = this.searchTxt
      switch (searchType) {
        case '1':
          params.fuelcardNo = searchTxt
          break
        default:
          break
      }
      getReturnTeamList(params).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleCancle() {
      if (this.isAdd) {
        this.isAdd = false
      } else if (this.isEdit) {
        this.isEdit = false
      }
      this.dialogFormVisible = false
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    saveData() {
      const data = this.form
      if (this.isEdit) {
        editInfo(data).then(response => {
          this.dialogFormVisible = false
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.fetchData()
          this.isEdit = false
        })
      } else {
        addInfo(data).then(response => {
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
    toDel(id) {
      this.$confirm('您确定要删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delInfo({ id }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 200px;
}
</style>

