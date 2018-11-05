<template>
  <div class="app-container">
    <el-row class="toptools" type="flex" justify="space-between">
      <el-col :span="6">
        <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </el-col>
      <div>
        <el-select v-model="searchType" style="width:120px">
          <el-option label="驾驶员姓名" value="1"></el-option>
        </el-select>
        <el-input v-model="searchTxt" placeholder="请输入内容" size="medium" style="width:200px" />
        <el-button size="medium" type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
      </div>
    </el-row>
    <el-table :max-height="tableHeight" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit>
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
          <span>{{ scope.row.unitPrice }}</span>
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
    <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>
    <el-dialog :visible.sync="dialogFormVisible" :title="isAdd?'添加加油记录信息':'编辑加油记录信息'" width="600px" @close="closeDialog">
      <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vehicleId" label="车牌号码">
              <el-select v-model="form.vehicleId" clearable filterable remote placeholder="请输入关键词">
                <el-option v-for="item in vehicleArray" :key="item.id" :label="item.plateNumber" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="driverId" label="驾驶员姓名">
              <el-select v-model="form.driverId" clearable filterable remote placeholder="请输入关键词">
                <el-option v-for="item in driverArray" :key="item.id" :label="item.userName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="fuelcardId" label="油卡编号">
              <el-select v-model="form.fuelcardId" clearable filterable remote placeholder="请输入关键词">
                <el-option v-for="item in fuelCardArray" :key="item.id" :label="item.fuelcardNo" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="加油时间" prop="createTime">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="form.createTime" type="datetime" class="datetime-picker" placeholder="选择时间"></el-date-picker>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item prop="place" label="加油地点">
              <el-input v-model="form.place" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="unitPrice" label="油价">
              <el-input-number v-model="form.unitPrice" :min="0" :controls="false">
                <template slot="append">元</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="volume" label="加油升数">
              <el-input-number v-model="form.volume" :min="0" :controls="false">
                <template slot="append">升</template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addData('ruleForm')">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getInfoList as getOilRecordList, addInfo, editInfo, delInfo } from '@/api/oilrecord'
import { getInfoList as getVehicleList } from '@/api/vehicle'
import { getInfoList as getDriverList } from '@/api/driver'
import { getInfoList as getFuelCardList } from '@/api/fuelcard'

export default {
  data() {
    const validateUnitPrice = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('油价必须大于0'))
      } else {
        callback()
      }
    }
    const validateVolume = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('加油升数必须大于0'))
      } else {
        callback()
      }
    }
    return {
      tableHeight: 200||document.documentElement.clientHeight - 210 || document.body.clientHeight - 210,
      list: null,
      listLoading: true,
      searchType: '1',
      searchTxt: '',
      dialogFormVisible: false,
      form: {
        id: '',
        vehicleId: '',
        driverId: '',
        fuelcardId: '',
        place: '',
        unitPrice: 0,
        volume: 0
      },
      rules: {
        vehicleId: [
          { required: true, message: '请输入车牌号码', trigger: 'blur' }
        ],
        driverId: [
          { required: true, message: '请输入驾驶员姓名', trigger: 'blur' }
        ],
        fuelcardId: [
          { required: true, message: '请输入加油卡编号', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, type: 'number', message: '请输入油价', trigger: 'blur' },
          { validator: validateUnitPrice, trigger: 'blur' }
        ],
        volume: [
          { required: true, type: 'number', message: '请输入加油升数', trigger: 'blur' },
          { validator: validateVolume, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      page: 1,
      pageSize: 10,
      total: 0,
      vehicleArray: [],
      driverArray: [],
      fuelCardArray: [],
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
    mounted() {
      const that = this;
      window.onresize = function () {
        that.tableHeight = document.documentElement.clientHeight - 210 || document.body.clientHeight - 210;
      }
    },
    beforeDestroy() {
      window.onresize = "";
    },
    fetchDataList() {
      // 获取车辆信息
      getVehicleList().then(response => {
        this.vehicleArray = response.data.rows
      })
      // 获取驾驶员信息
      getDriverList().then(response => {
        this.driverArray = response.data.rows
      })
      // 获取加油卡信息
      getFuelCardList().then(response => {
        this.fuelCardArray = response.data.rows
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
      getOilRecordList(params).then(response => {
        this.list = response.data.rows||[]
        this.total = response.data.total
        this.listLoading = false
      })
    },
    closeDialog() {
      this.$refs['ruleForm'].resetFields()
      if (this.isAdd) {
        this.isAdd = false
      } else if (this.isEdit) {
        this.isEdit = false
      }
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveData()
        } else {
          return false
        }
      })
    },
    toEdit(data) {
      this.form.id = data.id
      this.form.vehicleId = data.vehicleId
      this.form.driverId = data.driverId
      this.form.fuelcardId = data.fuelcardId
      this.form.place = data.place
      this.form.unitPrice = data.unitPrice
      this.form.volume = data.volume
      this.dialogFormVisible = true
      this.isEdit = true
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
.el-input-number {
  width: 100%;
}
</style>

