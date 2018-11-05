<template>
  <div class="app-container">
    <el-row class="toptools" type="flex" justify="space-between">
      <el-col :span="6">
        <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </el-col>
      <div>
        <el-select v-model="searchType" style="width:120px">
          <el-option label="车牌号码" value="1"></el-option>
          <el-option label="驾驶员姓名" value="2"></el-option>
        </el-select>
        <el-input v-model="searchTxt" placeholder="请输入内容" size="medium" style="width:200px" />
        <el-button size="medium" type="primary" icon="el-icon-search" @click="toSearch">搜索</el-button>
      </div>
    </el-row>
    <el-table  :max-height="tableHeight" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit>
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
      <el-table-column label="过路费用" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收费时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收费地点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.place }}</span>
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
    <!-- add from -->
    <el-dialog :title="dialogTitle+'过路费信息'" :visible.sync="dialogFormVisible" width="700px" @close="closeDialog('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
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
            <el-form-item label="驾驶员" prop="driverId">
              <el-select v-model="form.driverId" clearable filterable remote :remote-method="getDrivers" :loading="vehiclesLoading" placeholder="请输入关键词">
                <el-option v-for="item in drivers" :key="item.id" :label="item.userName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="过路费" prop="price">
              <!-- <el-input v-model="form.price" auto-complete="off"></el-input> -->
              <el-input-number v-model="form.price" :min="0" :precision="0" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收费时间">
              <el-date-picker v-model="form.createTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收费地点">
              <el-input v-model="form.place" auto-complete="off"></el-input>
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
import { getInfoList, addInfo, editInfo, delInfo } from '@/api/tolls'
import { getInfoList as getVehicleList } from '@/api/vehicle'
import { getInfoList as getDriverList } from '@/api/driver'

export default {
  data() {
    return {
      dialogTitle: '添加',
      tableHeight: document.documentElement.clientHeight - 210 || document.body.clientHeight - 210,
      list: null,
      listLoading: true,
      searchType: '1',
      searchTxt: '',
      dialogFormVisible: false,
      vehicles: [],
      vehiclesLoading: false,
      drivers: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      form: {
        driverId: '',
        driverName:'',
        etccardId:'',
        place:'',
        price:'',
        vehiclePlateNumber: '',
        vehicleId: ''
      },
      rules: {
        driverId: [
          { required: true, message: '请选择驾驶员', trigger: 'blur' },
        ],
        vehicleId: [
          { required: true, message: '请选择车辆', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入费用', trigger: 'blur' },
        ]
      },
      formLabelWidth: '100px',
      page: 1,
      pageSize: 7,
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
    typeName(status) {
      switch (status) {
        case 1:
          return '正常';
          break;
        case 2:
          return '注销';
          break;
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
        driverId: '',
        driverName:'',
        etccardId:'',
        place:'',
        price:'',
        vehiclePlateNumber: '',
        vehicleId: ''
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
      this.vehicles = [{ plateNumber: data.vehiclePlateNumber, id: data.vehicleId }];
      this.drivers = [{ userName: data.driverName, id: data.driverId }];
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
</style>

