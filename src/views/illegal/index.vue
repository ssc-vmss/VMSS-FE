<template>
  <div class="app-container">
    <el-row class="toptools" type="flex" justify="space-between">
      <el-col :span="6">
        <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </el-col>
      <div>
        <el-select v-model="searchType" style="width:120px">
          <el-option label="车牌号" value="1"></el-option>
          <el-option label="驾驶员" value="2"></el-option>
        </el-select>
        <el-input v-model="searchTxt" placeholder="请输入内容" size="medium" style="width:200px" />
        <el-button size="medium" type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
      </div>
    </el-row>
    <el-table :max-height="tableHeight" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit>
      <el-table-column label="车牌号码" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehiclePlateNumber }}
        </template>
      </el-table-column>
      <el-table-column label="驾驶员姓名" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverName }}
        </template>
      </el-table-column>
      <el-table-column label="违章地点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.place }}</span>
        </template>
      </el-table-column>
      <el-table-column label="违章时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.happenTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="违章类型" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ typeName(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理机构" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mechanism }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ statusName(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="罚款金额" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="违章扣分" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.course }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <button class="btn" @click="toEdit(scope.row)">修改</button>
          <button class="btn" @click="toDel(scope.row.id)">删除</button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :current-page.sync="page" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>
    <!-- add from -->
    <el-dialog :title="dialogTitle+'违章信息'" :visible.sync="dialogFormVisible" width="600px" @close="closeDialog('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm"  :label-width="formLabelWidth">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号码" prop="vehicleId">
              <el-select v-model="form.vehicleId" clearable filterable remote :remote-method="getVehicles" :loading="vehiclesLoading" placeholder="请输入关键词">
                <el-option v-for="item in vehicles" :key="item.id" :label="item.plateNumber" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶员姓名" prop="driverId">
              <el-select v-model="form.driverId" clearable filterable remote :remote-method="getDrivers" :loading="vehiclesLoading" placeholder="请输入关键词">
                <el-option v-for="item in drivers" :key="item.id" :label="item.userName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="违章地点" prop="place">
              <el-input v-model="form.place" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="违章时间" prop="happenTime">
              <el-date-picker v-model="form.happenTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违章类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型">
                <el-option label="闯红灯" :value="0"></el-option>
                <el-option label="超速" :value="1"></el-option>
                <el-option label="压线" :value="2"></el-option>
                <el-option label="违章停车" :value="3"></el-option>
                <el-option label="其他" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理机构" prop="mechanism">
              <el-input v-model="form.mechanism" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="未处理" :value="0"></el-option>
                <el-option label="已经处理" :value="1"></el-option>
                <!-- <el-option label="注销" :value="2"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="罚款金额" prop="amount">
              <!-- <el-input v-model="form.amount" auto-complete="off"></el-input> -->
              <el-input-number v-model="form.amount" :min="0" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违章扣分" prop="course">
              <!-- <el-input v-model="form.course" auto-complete="off"></el-input> -->
              <el-input-number v-model="form.course" :min="0" :precision="0" :controls="false"></el-input-number>
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
import { getInfoList, addInfo, editInfo, delInfo } from '@/api/illegal'
import { getInfoList as getVehicleList } from '@/api/vehicle'
import { getInfoList as getDriverList } from '@/api/driver'

export default {
  data() {
    return {
      dialogTitle: '添加',
      tableHeight: document.documentElement.clientHeight - 210 || document.body.clientHeight - 210,
      list: [],
      listLoading: true,
      searchType: '1',
      searchTxt: '',
      dialogFormVisible: false,
      vehicles: [],
      drivers: [],
      vehiclesLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      form: {
        amount: '',
        course: '',
        driverId: '',
        driverName: '',
        happenTime: '',
        mechanism: '',
        place: '',
        status: 0,
        type: 4,
        vehicleId: '',
        vehiclePlateNumber: ''
      },
      rules: {
        driverId: [
          { required: true, message: '请输入驾驶员', trigger: 'blur' },
        ],
        vehicleId: [
          { required: true, message: '请输入车辆', trigger: 'blur' },
        ],
        happenTime: [
          { required: true, message: '请选择时间', trigger: 'blur' },
        ]
      },
      formLabelWidth: '120px',
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    page() {
      this.fetchData();
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    const that = this;
    window.onresize = function () {
      that.tableHeight = document.documentElement.clientHeight - 210 || document.body.clientHeight - 210
    }
  },
  beforeDestroy() {
    window.onresize = "";
  },
  methods: {
    getVehicles(query) {
      if (query != '') {
        this.optionsLoading = true;
        getVehicleList({ plateNumber: query }).then(response => {
          this.vehicles = response.data.rows;
          this.optionsLoading = false;
        })
      }
    },
    getDrivers(query) {
      if (query != '') {
        this.optionsLoading = true;
        getDriverList({ userName: query }).then(response => {
          this.drivers = response.data.rows;
          this.optionsLoading = false;
        })
      }
    },
    typeName(type) {
      switch (type) {
        case 0:
          return '闯红灯';
          break;
        case 1:
          return '超速';
          break;
        case 2:
          return '压线';
          break;
        case 3:
          return '违章停车';
          break;
        case 4:
          return '其他';
          break;
        default:
          break;
      }
    },
    statusName(status) {
      switch (status) {
        case 0:
          return '未处理';
          break;
        case 1:
          return '已经处理';
          break;
        // case 2:
        //   return '注销';
        //   break;
        default:
          break;
      }
    },
    handleCreate() {
      this.resetForm();
      this.dialogFormVisible = true
    },
    closeDialog(formName) {
      this.editact = false;
      this.dialogTitle = "添加";
    },
    resetForm() {
      this.form = {
        amount: '',
        course: '',
        driverId: '',
        driverName: '',
        happenTime: '',
        mechanism: '',
        place: '',
        status: 0,
        type: 4,
        vehicleId: '',
        vehiclePlateNumber: ''
      }
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    toSearch() {
      if (this.page > 1) {
        this.page = 1;
      } else {
        this.fetchData();
      }
    },
    fetchData() {
      this.listLoading = true;
      let params = { pageNo: this.page, pageSize: this.pageSize },
        searchType = this.searchType,
        searchTxt = this.searchTxt;

      switch (searchType) {
        case '1':
          params.vehiclePlateNumber = searchTxt
          break;
        case '2':
          params.driverName = searchTxt
          break;
        default:
          break;
      }

      getInfoList(params).then(response => {
        this.list = response.data.rows||[];
        this.total = response.data.total;
        this.listLoading = false
      })
    },
    addData(formName) {
      this.searchType = null;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveData();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    toEdit(data) {
      this.vehicles = [{ plateNumber: data.vehiclePlateNumber, id: data.vehicleId }]
      this.drivers = [{ userName: data.driverName, id: data.driverId }]
      // data.type=data.type+'';
      // this.form=data;
      this.form = Object.assign({}, data);
      this.dialogFormVisible = true;
      this.editact = true;
      this.dialogTitle = "修改";
    },
    saveData() {
      let data = this.form;

      if (this.editact) {
        editInfo(data).then(response => {
          this.dialogFormVisible = false;
          this.$message({
            message: response.message,
            type: 'success'
          });
          this.fetchData();
        });
        return;
      }
      addInfo(data).then(response => {
        if (response.status == 200) {
          this.dialogFormVisible = false;
          this.$message({
            message: response.message,
            type: 'success'
          });
          this.fetchData();
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
          });
          this.fetchData();
        })
      }).catch(() => {
      });
    },
  }

}
</script>

<style lang="scss" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 160px;
}
.el-input-number{
  width: 160px;
}
</style>

