<template>
  <div class="app-container">
    <el-row class="toptools"  type="flex" justify="space-between">
      <el-col :span="6"><el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button></el-col>
      <div>
        <!-- <el-input  placeholder="请输入内容" prefix-icon="el-icon-search" size="medium" style="width:200px" v-model="searchTxt" /><el-button size="medium" type="primary" icon="el-icon-search">搜索</el-button> -->
        <!-- <el-input v-model="searchTxt">
          <el-select slot="prepend" v-model="searchType" style="width:120px">
            <el-option label="车牌号" value="1"></el-option>
            <el-option label="车辆类型" value="2"></el-option>
            <el-option label="车辆品牌" value="3"></el-option>
          </el-select>
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">查询</el-button>
        </el-input> -->
      </div>
    </el-row>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit>
      <el-table-column align="center" label="车牌号">
        <template slot-scope="scope">
          {{ scope.row.plateNumber }}
        </template>
      </el-table-column>
      <el-table-column label="车载设备型号" align="center">
        <template slot-scope="scope">
          {{ scope.row.vehicleUnitType }}
        </template>
      </el-table-column>
      <el-table-column label="绑定时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="toEdit(scope.row)">修改</el-button> -->
          <el-button type="text" size="small" @click="toDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="handleCurrentChange" style="text-align:right;margin-top:20px"></el-pagination>

    <!-- add from -->
    <el-dialog title="添加绑定信息" :visible.sync="dialogFormVisible" width="600px" @close="closeDialog('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="vehicleId" :label-width="formLabelWidth">
              <!-- <el-input type="text" v-model="form.plateNumber"></el-input> -->
              <el-select v-model="form.vehicleId" clearable filterable remote :remote-method="getVehicles" :loading="vehiclesLoading" placeholder="请输入关键词">
                <el-option
                  v-for="item in vehicles"
                  :key="item.id"
                  :label="item.plateNumber"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车载设备型号" prop="equipmentId" :label-width="formLabelWidth">
              <!-- <el-input type="text" v-model="form.vehicleUnitType" auto-complete="off"></el-input> -->
              <el-select v-model="form.equipmentId" clearable filterable remote :remote-method="getEquipments" :loading="equipmentsLoading" placeholder="请输入关键词">
                <el-option
                  v-for="item in equipments"
                  :key="item.id"
                  :label="item.unitType"
                  :value="item.id">
                </el-option>
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
import { getInfoList, addInfo, editInfo, delInfo,getVehicleList,getEquipmentList } from '@/api/binding'


export default {
  watch: {
    page() {
      this.fetchData();
    }
  },
  data() {
    let validataLPNO=(rule,value,callback)=>{
      let reg="^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$",
          LPNOReg=new RegExp(reg);
      if(!LPNOReg.test(value)){
        callback('请输入正确的车牌号');
      }else{
        callback();
      }
    }
    return {
      list: null,
      listLoading: true,
      dialogFormVisible:false,
      editact:false,
      searchType:'',
      searchTxt:'',
      vehicles:[],
      equipments:[],
      vehiclesLoading:false,
      equipmentsLoading:false,
      form: {
        equipmentId:'',
        plateNumber: '',
        vehicleId:'',
        vehicleUnitType: '',
      },
      rules: {
        vehicleId: [
          { required: true, message: '请输入车牌号', trigger: 'blur' }
        ],
        equipmentId:[
          { required: true, message: '请输入设备型号', trigger: 'change' },
        ]
      },
      formLabelWidth: '120px',
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {

  },
  created() {
    this.fetchData()
  },
  methods: {
    getVehicles(query){
      if(query!=''){
        this.optionsLoading=true;
        getVehicleList({plateNumber:query}).then(response=>{
          this.vehicles=response.data.rows;
          this.optionsLoading=false;
        })
      }
    },
    getEquipments(query){
      if(query!=''){
        this.optionsLoading=true;
        getEquipmentList({unitType:query}).then(response=>{
          this.equipments=response.data.rows;
          this.optionsLoading=false;
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
          });
          this.fetchData();
        })
      }).catch(() => {
      });
    },
    handleCreate() {
      this.resetForm();
      this.dialogFormVisible = true
    },
    closeDialog(formName) {
      this.editact = false;
    },
    resetForm() {
      this.form = {
        plateNumber: '',
        vehicleUnitType: '',
      }
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    fetchData() {
      this.listLoading = true
      let params={pageNo:this.page,pageSize:this.pageSize},
          searchType=this.searchType,
          searchTxt=this.searchTxt;

          if(searchTxt.trim()){
            switch (searchType) {
              case '1':
                params.plateNumber=searchTxt
                break;
              case '2':
                params.plateType=searchTxt
                break;
              case '3':
                params.plateBrand=searchTxt
                break;
              default:
                break;
            }
          }

      getInfoList(params).then(response => {
        this.list = response.data.rows;
        this.total=response.data.total;

        this.listLoading = false
      })
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveData();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    toEdit(data){
      this.form=data;
      this.dialogFormVisible=true;
      this.editact=true;
    },
    saveData(){
      let {id,equipmentId,vehicleUnitType,plateNumber,vehicleId}=this.form;
      let data={id,equipmentId,vehicleUnitType,plateNumber,vehicleId};
      if(this.editact){
        editInfo(data).then(response=>{
          this.dialogFormVisible=false;
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
    }
  }
}
</script>

<style lang="scss" scoped>
.toptools {
  margin-bottom: 20px;
}
</style>

