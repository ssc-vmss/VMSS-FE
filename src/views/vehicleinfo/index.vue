<template>
  <div class="app-container">
    <el-row class="toptools" type="flex" justify="space-between">
      <el-col :span="6">
        <el-button size="medium" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </el-col>
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
        <el-select v-model="searchType" style="width:120px">
          <el-option label="车牌号" value="1"></el-option>
          <el-option label="车辆类型" value="2"></el-option>
          <el-option label="车辆品牌" value="3"></el-option>
        </el-select>
        <el-select v-if="searchType==2" v-model="vehicleSearchType" multiple collapse-tags style="width:180px">
          <el-option label="大型汽车" value="0"></el-option>
          <el-option label="小型汽车" value="1"></el-option>
          <el-option label="摩托车" value="2"></el-option>
          <el-option label="拖拉机" value="3"></el-option>
          <el-option label="挂车" value="4"></el-option>
          <el-option label="新能源大型汽车" value="5"></el-option>
        </el-select>
        <el-input v-else v-model="searchTxt" placeholder="请输入内容" style="width:180px"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      </div>
    </el-row>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit>
      <el-table-column align="center" label="车牌号" width="110">
        <template slot-scope="scope">
          {{ scope.row.LPNO }}
        </template>
      </el-table-column>
      <el-table-column label="车牌号颜色" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.Color }}
        </template>
      </el-table-column>
      <el-table-column label="车辆类型" align="center">
        <template slot-scope="scope">
          <span>{{ vehicleType(scope.row.Type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆品牌" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.plateBrand }}
        </template>
      </el-table-column>
      <el-table-column label="发动机号" min-width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.EngineNO }}
        </template>
      </el-table-column>
      <el-table-column label="发动机识别号" min-width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.engineId }}
        </template>
      </el-table-column>
      <el-table-column label="车辆购置时间" min-width="120" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"/> -->
          <span>{{ scope.row.buyTimes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆状态" align="center">
        <template slot-scope="scope">
          {{ vehicleStatus(scope.row.Status) }}
        </template>
      </el-table-column>
      <el-table-column label="企业编号" min-width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.EnterpriseNO }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="车辆编号">
        <template slot-scope="scope">
          {{ scope.row.VehicleNO }}
        </template>
      </el-table-column> -->
      <el-table-column label="排放标准" align="center">
        <template slot-scope="scope">
          {{ scope.row.Emission }}
        </template>
      </el-table-column>
      <el-table-column label="车载设备型号" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.equipmentModel }}
        </template>
      </el-table-column>
      <el-table-column label="车载设备编号" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.equipmentID }}
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

    <!-- add from -->
    <el-dialog title="添加车辆信息" :visible.sync="dialogFormVisible" width="600px" @close="closeDialog('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号" prop="LPNO" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.LPNO"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号颜色" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.Color" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆类型" prop="Type" :label-width="formLabelWidth">
              <el-select v-model="form.Type" placeholder="请选择车辆类型">
                <el-option label="大型汽车" value="0"></el-option>
                <el-option label="小型汽车" value="1"></el-option>
                <el-option label="摩托车" value="2"></el-option>
                <el-option label="拖拉机" value="3"></el-option>
                <el-option label="挂车" value="4"></el-option>
                <el-option label="新能源大型汽车" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆品牌" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.plateBrand" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发动机号" prop="EngineNO" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.EngineNO" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发动机识别号" prop="engineId" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.engineId" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆购置时间" :label-width="formLabelWidth">
              <el-date-picker v-model="form.buyTimes" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆状态" :label-width="formLabelWidth">
              <el-select v-model="form.Status" placeholder="请选择车辆状态">
                <el-option label="未运行" value="0"></el-option>
                <el-option label="运行" value="1"></el-option>
                <el-option label="事故" value="2"></el-option>
                <el-option label="理赔" value="3"></el-option>
                <el-option label="保养" value="4"></el-option>
                <el-option label="年检" value="5"></el-option>
                <el-option label="报废" value="6"></el-option>
                <el-option label="维修" value="7"></el-option>
                <el-option label="注销" value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业编号" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.EnterpriseNO" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="车辆编号" :label-width="formLabelWidth">
              <el-input v-model.trim="form.VehicleNO" auto-complete="off"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="排放标准" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.Emission" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="车载设备型号" :label-width="formLabelWidth">
              <el-select v-model="form.equipmentModel" placeholder="请选择车辆状态">
                <el-option label="LLT-2018" value="1"></el-option>
                <el-option label="LLT-2017" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车载设备编号" :label-width="formLabelWidth">
              <el-input type="text" v-model="form.equipmentID" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getInfoList, addInfo, editInfo, delInfo,getEquipmentList } from '@/api/vehicle'

export default {
  watch: {
    page() {
      this.fetchData();
    }
  },
  data() {
    let validataLPNO=(rule,value,callback)=>{
      // let reg="^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$",
      let reg="^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-Za-z0-9]{5}|[A-Za-z0-9]{5}[DdFf])$",
          LPNOReg=new RegExp(reg);
      if(!LPNOReg.test(value)){
        callback('请输入正确的车牌号');
      } else {
        callback();
      }
    }
    return {
      list: null,
      listLoading: true,
      dialogFormVisible:false,
      editact:false,
      searchType:'1',
      vehicleSearchType:['0'],
      searchTxt:'',
      options:[],
      optionsLoading:false,
      form: {
        LPNO: '',
        Color: '',
        Type: '',
        plateBrand: '',
        EngineNO: '',
        engineId: '',
        Load: '',
        buyTimes: '',
        Status: '0',
        EnterpriseNO: '',
        // VehicleNO: '',
        Emission: '',
        equipmentModel: '',
        equipmentID: ''
      },
      rules: {
        LPNO: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          // { type: 'string', min: 7, max: 8, message: '长度在 7 到 8 个字符', trigger: 'blur' },
          { validator: validataLPNO, trigger: 'blur' }
        ],
        Type: [
          { required: true, message: '请选择车辆类型', trigger: 'change' },
        ],
        EngineNO: [
          { type: 'string', required: true, message: '请输入发动机号', trigger: 'blur' },
        ],
        engineId: [
          { type: 'string', required: true, message: '请输入发动机识别号', trigger: 'blur' },
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
    getEquipment(query){
      if(query!=''){
        this.optionsLoading=true;
        getEquipmentList({unitType:query}).then(response=>{
          this.options=response.data.rows;
          this.optionsLoading=false;
        })
      }
    },
    vehicleType(type) {
      switch (type) {
        case 0:
          return '大型汽车'
          break;
        case 2:
          return '摩托车'
          break;
        case 3:
          return '拖拉机'
          break;
        case 4:
          return '挂车'
          break;
        case 5:
          return '新能源大型汽车'
          break;
        default:
          return '小型汽车'
          break;
      }
    },
    vehicleStatus(status) {
      switch (status) {
        case 1:
          return '运行'
          break;
        case 2:
          return '事故'
          break;
        case 3:
          return '理赔'
          break;
        case 4:
          return '保养'
          break;
        case 5:
          return '年检'
          break;
        case 6:
          return '报废'
          break;
        case 7:
          return '维修'
          break;
        case 8:
          return '注销'
          break;
        default:
          return '未运行'
          break;
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
        LPNO: '',
        Color: '',
        Type: '',
        plateBrand: '',
        EngineNO: '',
        engineId: '',
        Load: '',
        buyTimes: '',
        Status: '0',
        EnterpriseNO: '',
        // VehicleNO: '',
        Emission: '',
        equipmentModel: '',
        equipmentID: ''
      }
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    fetchData() {
      this.listLoading = true
      let params={pageNo:this.page,pageSize:this.pageSize},
          searchType=this.searchType,
          vehicleSearchType=this.vehicleSearchType,
          searchTxt=this.searchTxt;

          switch (searchType) {
            case '1':
              params.plateNumber=searchTxt
              break;
            case '2':
              params.plateType=vehicleSearchType.join()
              break;
            case '3':
              params.plateBrand=searchTxt
              break;
            default:
              break;
          }

      getInfoList(params).then(response => {
        let resData;
        resData=response.data.rows&&response.data.rows.map(item=>{
          let{id,plateNumber:LPNO,plateColour:Color,plateType:Type,engineNumber:EngineNO,engineId,type:Status,enterpriseNumber:EnterpriseNO,emissionStandard:Emission,buyTimes,plateBrand,}=item;
          return {id,LPNO,Color,Type,EngineNO,engineId,Status,EnterpriseNO,Emission,buyTimes,plateBrand}
        })
        this.list = resData;
        this.total = response.data.total;

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
    toEdit(data) {
      data.Type = data.Type + '';
      data.Status = data.Status + '';
      this.form = data;
      this.dialogFormVisible = true;
      this.editact = true;
    },
    saveData() {
      let { id, LPNO: plateNumber, Color: plateColour, Type: plateType, plateBrand, engineId, EngineNO: engineNumber, buyTimes, Status: type, EnterpriseNO: enterpriseNumber, Emission: emissionStandard } = this.form;
      let data = { id, plateNumber, plateColour, plateType, plateBrand, engineId, engineNumber, buyTimes, type, enterpriseNumber, emissionStandard };
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
    }
  }
}
</script>

<style lang="scss" scoped>
.toptools {
  margin-bottom: 20px;
}
</style>

