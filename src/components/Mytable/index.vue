<template>
  <div class="table-view">
    <Carloader v-if="listLoading" />
    <div v-else class="table-container">
      <table id="vmssTable" class="vmss-table">
        <thead class="vmss-thead">
          <tr class="vmss-tr">
            <th class="vmss-th">
              <el-checkbox></el-checkbox>
            </th>
            <th v-for="(title,index) in headerList" :key="index" class="vmss-th">{{ title }}</th>
          </tr>
        </thead>
        <tbody v-if="tableList.length == 0">
          <div class="empty-tableData">暂无数据</div>
        </tbody>
        <tbody v-else class="vmss-tbody">
          <tr v-for="(item,index) in tableList" :key="index" class="vmss-tr">
            <td class="vmss-td">
              <el-checkbox></el-checkbox>
            </td>
            <td v-for="(key,ind) in item" :key="ind" class="vmss-td">{{ key }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import Carloader from '@/components/loader'

export default {
  components: {
    Carloader
  },
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
  props: {
    header: Array,
    tableData: Array
  },
  data() {
    return {
      headerList: this.header,
      // headerList: ['id', '车牌号', '车牌号颜色', '车辆类型', '车辆识别号', '发动机号', '车辆载重', '车辆购置时间', '车辆状态', '企业编号', '车辆编号', '排放标准', '车载设备型号', '车载设备编号', '车载设备编号', '车载设备编号', '车载设备编号', '车载设备编号'],
      tableList: this.tableData,
      listLoading: true,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    toDel(id) {
      this.$confirm('您确定要删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => { })
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    fetchData() {
      console.log(this.tableList)
      this.listLoading = true
      setTimeout(() => {
        if (this.header === undefined) {
          // this.headerList = ['id', '车牌号', '车牌号颜色', '车辆类型', '车辆识别号', '发动机号', '车辆载重', '车辆购置时间', '车辆状态', '企业编号', '车辆编号', '排放标准', '车载设备型号', '车载设备编号', '车载设备编号', '车载设备编号', '车载设备编号', '车载设备编号']
          this.headerList = ['暂无表头']
        }
        // if (this.tableData.length === 0) {
        //   this.tableList = [
        //     {
        //       id: 1,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332211'
        //     },
        //     {
        //       id: 2,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 3,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 4,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 5,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 6,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 7,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 8,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 9,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 10,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 11,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 12,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 13,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 14,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 15,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 16,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 17,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 18,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 19,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     },
        //     {
        //       id: 20,
        //       LPNO: '川A 88888',
        //       Color: '红色',
        //       Type: '小汽车',
        //       VehicleID: 'LSGJR1122334455678',
        //       EngineNO: '2464766K',
        //       Load: '5T',
        //       BuyTime: '2018-01-01',
        //       Status: '运行',
        //       EnterpriseNO: 'szf',
        //       VehicleNO: 'szf-001',
        //       Emission: '国IV',
        //       equipmentModel: 'LLT-2018',
        //       equipmentID: 'LLT2018x332212'
        //     }
        //   ]
        // }
        this.listLoading = false
      }, 1500)
      // return getList(this.listQuery).then(response => {
      //   this.tableList = response.data.items
      //   this.listLoading = false
      // })
    }
  }
}
</script>

<style lang='scss' scoped>
%section {
  height: 100%;
  overflow-y: scroll;
  overflow-x: scroll;
  &::-webkit-scrollbar-thumb {
    background-color: rgba(136, 136, 136, 0.5);
    border-radius: 20px;
    z-index: 999;
  }
  &::-webkit-scrollbar {
    height: 10px;
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 20px;
  }
}
.table-view {
  padding: 10px 10px 10px 0;
}
.search {
  outline-style: none;
  &:hover {
  }
}
.table-container {
  border: 1px solid rgba(0, 128, 128, 0.3);
  border-radius: 5px;
  position: relative;
  height: calc(100vh - 150px);
  overflow-y: hidden;
  @extend %section;
}
.vmss-table {
  border-collapse: collapse;
  font-size: 14px;
  text-align: center;
  width: 100%;
}
.vmss-table,
.vmss-th,
.vmss-td {
  white-space: nowrap;
  border: 1px solid #ebeef5;
}
.vmss-tr:hover {
  background: rgba(0, 128, 128, 0.1);
}
.vmss-th {
  color: #f5fffa;
  background: rgba(0, 128, 128, 0.6);
  padding: 19px;
}
.vmss-td {
  padding: 19px;
}
.empty-tableData {
  font-size: 18px;
  color: rgba(0, 128, 128, 0.5);
  width: 100%;
  top: 50%;
  position: absolute;
}
</style>

