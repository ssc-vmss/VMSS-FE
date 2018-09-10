<template>
  <div class="table-view">
    <Carloader v-if="listLoading"></Carloader>
    <div v-else>
      <div class="table-container">
        <table class="vmss-table">
          <thead class="vmss-thead">
            <tr class="vmss-tr">
              <th class="vmss-th">
                <el-checkbox></el-checkbox>
              </th>
              <th v-for="title in headerList" :key="title" class="vmss-th">{{ title }}</th>
            </tr>
          </thead>
          <tbody class="vmss-tbody">
            <tr v-for="item in tableList" :key="item" class="vmss-tr">
              <td class="vmss-td">
                <el-checkbox></el-checkbox>
              </td>
              <td v-for="key in item" :key="key" class="vmss-td">{{ key }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <pagination :pages="25"></pagination> -->
    </div>
  </div>
</template>

<script>
import { getList } from "@/api/table";
import Carloader from "@/components/loader";
import Pagination from "@/components/pagination";

export default {
  props: {
    header: Array,
    tableData: Array
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  components: {
    Carloader, Pagination
  },
  data() {
    return {
      headerList: this.header,
      // headerList: ['id', '车牌号', '车牌号颜色', '车辆类型', '车辆识别号', '发动机号', '车辆载重', '车辆购置时间', '车辆状态', '企业编号', '车辆编号', '排放标准', '车载设备型号', '车载设备编号', '车载设备编号', '车载设备编号', '车载设备编号', '车载设备编号'],
      tableList: this.tableData,
      listLoading: true,
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    toDel(id) {
      this.$confirm("您确定要删除该记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => { });
    },
    handleCreate() {
      this.dialogFormVisible = true;
    },
    fetchData() {
      this.listLoading = true;
      setTimeout(() => {
        if (this.header === undefined) {
          this.headerList = ['id', '车牌号', '车牌号颜色', '车辆类型', '车辆识别号', '发动机号', '车辆载重', '车辆购置时间', '车辆状态', '企业编号', '车辆编号', '排放标准', '车载设备型号', '车载设备编号', '车载设备编号', '车载设备编号', '车载设备编号', '车载设备编号']
        }
        if (this.tableData === undefined) {
          this.tableList = [
            {
              id: 1,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332211"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            },
            {
              id: 2,
              LPNO: "川A 88888",
              Color: "红色",
              Type: "小汽车",
              VehicleID: "LSGJR1122334455678",
              EngineNO: "2464766K",
              Load: "5T",
              BuyTime: "2018-01-01",
              Status: "运行",
              EnterpriseNO: "szf",
              VehicleNO: "szf-001",
              Emission: "国IV",
              equipmentModel: "LLT-2018",
              equipmentID: "LLT2018x332212"
            }
          ]
        }
        this.listLoading = false;
      }, 1500);
      return;
      getList(this.listQuery).then(response => {
        this.tableList = response.data.items;
        this.listLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
  // height: calc(100vh - 50px);
}
.search {
  outline-style: none;
  &:hover {
  }
}
.table-container {
  position: relative;
  margin: 0 10px;
  height: calc(100vh - 170px);
  @extend %section;
}
.vmss-table {
  border-collapse: collapse;
  font-size: 14px;
  text-align: center;
}
.vmss-table,
.vmss-th,
.vmss-td {
  white-space: nowrap;
  border: 1px solid #ebeef5;
}
.vmss-tr:hover {
  background: rgba(30, 144, 255, 0.1);
}
.vmss-th {
  color: #909399;
  background: rgb(232, 244, 255);
  padding: 15px;
}
.vmss-td {
  padding: 15px;
}
</style>

