<template>
  <div class="table-view">
    <div v-bind:style="{paddingRight:isShowOperation?'95px':0}" class="table-container">
      <table id="vmssTable" class="vmss-table">
        <thead class="vmss-thead">
          <tr class="vmss-tr">
            <th v-if="headerList.length == 0" class="vmss-th">暂无表头</th>
            <th v-for="(title,index) in headerList" v-else :key="index" class="vmss-th">{{ title }}</th>
            <th v-if="isShowOperation" class="vmss-th operation-th">操作
            </th>
          </tr>
        </thead>
        <tbody class="vmss-tbody">
          <div v-if="tableList.length == 0" class="empty-tableData">暂无数据</div>
          <tr v-for="(item,index) in tableList" v-else :key="index" class="vmss-tr">
            <td v-for="(key,ind) in item" :key="ind" class="vmss-td">{{ key }}</td>
            <td v-if="isShowOperation" class="vmss-td operation-td">
              <el-button type="text" size="mini" @click="edit(index)">修改</el-button>
              <el-button type="text" size="mini" @click="del(index)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    header: Array,
    tableData: Array,
    showOperation: Boolean
  },
  data() {
    return {
      headerList: this.header,
      tableList: this.tableData,
      isShowOperation: this.showOperation
    }
  },
  created() {
  },
  methods: {
    edit(index) {
      this.$emit('edit', index)
    },
    del(index) {
      this.$emit('del', index)
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
  height: calc(100vh - 200px);
  margin-left: 10px;
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
  background: rgba(102, 179, 179, 1);
  padding: 17px;
}
.operation-th {
  border: none;
  width: 100px;
  position: fixed;
  right: 11px;
  background: rgba(102, 179, 179, 1);
}
.operation-td {
  width: 100px;
  position: fixed;
  right: 11px;
  background: #fff;
  &:last-child {
    padding: 11px;
  }
}
.vmss-td {
  padding: 17px;
}
.empty-tableData {
  font-size: 18px;
  color: rgba(0, 128, 128, 0.5);
  width: 100%;
  top: 50%;
  position: absolute;
}
</style>

