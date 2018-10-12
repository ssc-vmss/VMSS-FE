<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">车辆数量</div>
          <div class="numeric-value">123</div>
        </div>
      </el-col>
      <el-col :span="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">驾驶员数量</div>
          <div class="numeric-value">123</div>
        </div>
      </el-col>
      <el-col :span="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">车载设备数量</div>
          <div class="numeric-value">123</div>
        </div>
      </el-col>
      <el-col :span="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">未审批生申请单数量</div>
          <div class="numeric-value">123</div>
        </div>
      </el-col>
      <el-col :span="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">派车单数量</div>
          <div class="numeric-value">123</div>
        </div>
      </el-col>
      <el-col :span="4" class="numeric">
        <div class="numeric-box">
          <div class="numeric-label">事故违章数量</div>
          <div class="numeric-value">123</div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      车辆调度
      
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.numeric {
  &-box{
    padding: 10px;
    border: 1px solid rgba(0, 128, 128,1);
    // background: rgba(0, 128, 128,.1);
  }
  &-label{
    color: #909399;
    padding: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &-value{
    font-weight: 700;
    font-size: 25px;
    padding: 5px;
  }
}
</style>
