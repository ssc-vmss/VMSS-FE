<template>
  <div class="app-container">
    <el-row class="toptools"  type="flex" justify="end">
      <div><el-input  placeholder="请输入内容" prefix-icon="el-icon-search" size="medium" style="width:200px" v-model="searchTxt" /><el-button size="medium" type="primary" icon="el-icon-search">搜索</el-button></div>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="申请单号" width="95">
        <template slot-scope="scope">
          {{ scope.row.LPNO }}
        </template>
      </el-table-column>
      <el-table-column label="用车人" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.Color }}
        </template>
      </el-table-column>
      <el-table-column label="用车人单位" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用车时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计返回时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归队时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.VehicleID }}
        </template>
      </el-table-column>
      <el-table-column label="车牌号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.EngineNO }}
        </template>
      </el-table-column>
      <el-table-column label="驾驶员">
        <template slot-scope="scope">
          {{ scope.row.Load }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" style="text-align:right;margin-top:20px"></el-pagination>
    <!-- add from -->
    <el-dialog title="添加车辆信息" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号" :label-width="formLabelWidth">
              <el-input v-model="form.LPNO" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号颜色" :label-width="formLabelWidth">
              <el-input v-model="form.Color" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆类型" :label-width="formLabelWidth">
              <el-select v-model="form.Type" placeholder="请选择车辆类型">
                <el-option label="大型汽车" value="1"></el-option>
                <el-option label="小型汽车" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆识别号" :label-width="formLabelWidth">
              <el-input v-model="form.VehicleID" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发动机号" :label-width="formLabelWidth">
             <el-input v-model="form.EngineNO" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆载重" :label-width="formLabelWidth">
              <el-input v-model="form.Load" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆购置时间" :label-width="formLabelWidth">
             <el-date-picker  v-model="form.BuyTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆状态" :label-width="formLabelWidth">
              <el-select v-model="form.status" placeholder="请选择车辆状态">
                <el-option label="运行" value="1"></el-option>
                <el-option label="事故" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业编号" :label-width="formLabelWidth">
              <el-input v-model="form.EnterpriseNO" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆编号" :label-width="formLabelWidth">
             <el-input v-model="form.VehicleNO" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排放标准" :label-width="formLabelWidth">
              <el-input v-model="form.Emission" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
              <el-input v-model="form.equipmentID" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible:false,
      searchTxt:'',
      form: {
          LPNO: '',
          Color: '',
          Type: [],
          VehicleID: '',
          EngineNO: '',
          Load: '',
          BuyTime: '',
          Status: [],
          EnterpriseNO:'',
          VehicleNO:'',
          Emission:'',
          equipmentModel:[],
          equipmentID:''
        },
        formLabelWidth: '120px',
        page:1,
        pageSize:10,
        total:100
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    toDel(id){
      this.$confirm('您确定要删除该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
        });
    },
    handleCreate(){
      this.dialogFormVisible = true
    },
    fetchData() {
      this.listLoading = true

      setTimeout(()=>{
        this.list=[

        ]
        this.listLoading = false
      },1500)
      return;

      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

