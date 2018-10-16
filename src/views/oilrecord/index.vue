<template>
  <div class="app-container">
    <el-row class="toptools" type="flex" justify="space-between">
      <el-col :span="6">
        <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </el-col>
      <div>
        <el-select v-model="searchType" style="width:120px">
          <el-option label="油卡编号" value="1"></el-option>
        </el-select>
        <el-input v-model="searchTxt" placeholder="请输入内容" size="medium" style="width:200px" />
        <el-button size="medium" type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
      </div>
    </el-row>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit>
      <el-table-column label="车牌号码" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehiclePlateNumber }}
        </template>
      </el-table-column>
      <el-table-column label="驾驶员姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverName }}
        </template>
      </el-table-column>
      <el-table-column label="油卡编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fuelcardNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加油时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加油地点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.place }}</span>
        </template>
      </el-table-column>
      <el-table-column label="油价" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.uniPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加油升数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.volume }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="toDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>
    <el-dialog :visible.sync="dialogFormVisible" title="添加加油记录信息" width="620px" @close="closeDialog('ruleForm')">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="车牌号码" prop="vehiclePlateNumber">
              <el-select v-model="form.vehiclePlateNumber" clearable filterable remote placeholder="请输入关键词">
                <el-option v-for="item in vehiclearray" :key="item.id" :label="item.plateNumber" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="驾驶员姓名" prop="driverName">
              <el-input v-model="form.driverName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="油卡编号" prop="fuelcardNo">
              <el-input type="number" v-model.number="form.fuelcardNo" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="加油时间" prop="createTime">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="form.createTime" type="datetime" class="datetime-picker" placeholder="选择时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="加油地点" prop="place">
              <el-input v-model="form.place" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="油价" prop="uniPrice">
              <el-input v-model="form.uniPrice" auto-complete="off">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="加油升数" prop="volume">
              <el-input-number controls-position="right" v-model="form.volume" :min="0" :max="500">
              </el-input-number>
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
import { getOilRecord, addInfo, editInfo, delInfo } from '@/api/oilrecord'
import { getInfoList } from '@/api/vehicle'

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
        vehiclePlateNumber: '',
        driverName: '',
        fuelcardNo: '',
        createTime: '',
        place: '',
        uniPrice: '',
        volume: ''
      },
      rules: {
        enterpriseName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        fuelcardNo: [
          { required: true, message: '请输入油卡编号', trigger: 'blur' }
        ],
        totalAmount: [
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
      vehiclearray: []
    }
  },
  watch: {
    page() {
      this.fetchData()
    }
  },
  created() {
    this.fetchVehicle()
    this.fetchData()
  },
  methods: {
    // 获取车辆信息
    fetchVehicle() {
      getInfoList({ pageNo: 1, pageSize: 1000 }).then(response => {
        this.vehiclearray = response.data.rows
        this.total = response.data.total
      })
    },
    handleCreate() {
      this.resetForm()
      this.dialogFormVisible = true
    },
    closeDialog(formName) {
      this.editact = false
    },
    resetForm() {
      this.form = {
        vehiclePlateNumber: '',
        driverName: '',
        fuelcardNo: '',
        createTime: '',
        place: '',
        uniPrice: '',
        volume: ''
      }
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
      getOilRecord(params).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
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
    toEdit(data) {
      data.type = data.type + ''
      this.form = Object.assign({}, data)
      this.dialogFormVisible = true
      this.editact = true
    },
    saveData() {
      const data = this.form
      if (this.editact) {
        editInfo(data).then(response => {
          this.dialogFormVisible = false
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.fetchData()
        })
        return
      }
      addInfo(data).then(response => {
        if (response.status === 200) {
          this.dialogFormVisible = false
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.fetchData()
        }
      })
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
.toptools {
  margin-bottom: 20px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 200px;
}
</style>

