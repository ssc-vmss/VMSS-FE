<template>
  <div class="view">
    <div :class="{remove:!isShowLeftBox}" class="left-box">
      <div class="conf-box">
        <h4 class="conf-h">区域限速设置</h4>
        <h4 v-if="isadding" class="conf-h">(新增中...)</h4>
        <h4 v-if="isediting" class="conf-h">(编辑中...)</h4>
        <div v-if="!issetapplvehicles">
          <div class="conf-form">
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>名称</span>
                <span class="required-span">*</span>
              </div>
              <input class="conf-form-input" :disabled="isadd" v-model="list.name" type="text" placeholder="请输入名称">
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>区域描述</span>
              </div>
              <input :disabled="isadd" v-model="list.description" class="conf-form-input" type="text" placeholder="请输入区域描述">
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>是否启用</span>
              </div>
              <input :disabled="isadd" v-model="list.state?'是':'否'" class="conf-form-input" type="text" @click="isshowmenu = !isshowmenu" placeholder="请选择" readonly>
              <i :class="{isdisabled:isadd}" class="el-icon-caret-bottom conf-form-icon righticon" @click="isshowmenu = !isshowmenu"></i>
              <div v-show="isshowmenu" class="dropdown-menu">
                <ul @click="handleSetState">
                  <li value="0">否</li>
                  <li value="1">是</li>
                </ul>
              </div>
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>最高时速</span>
              </div>
              <input class="conf-form-input" :disabled="isadd" v-model="list.max" type="number">
              <span class="unit-span">km/h</span>
              <i :class="{isdisabled:(isadd||list.max==0)}" class="el-icon-minus conf-form-icon lefticon" @click="list.max--"></i>
              <i :class="{isdisabled:isadd}" class="el-icon-plus conf-form-icon righticon" @click="list.max++"></i>
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>开始时间</span>
              </div>
              <el-time-picker value-format="HH:mm:ss" :disabled="isadd" v-model="list.startTime" class="time-picker" placeholder="选择时间"></el-time-picker>
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>结束时间</span>
              </div>
              <el-time-picker value-format="HH:mm:ss" :disabled="isadd" v-model="list.endTime" class="time-picker" placeholder="选择时间"></el-time-picker>
            </div>
          </div>
          <div class="btn-padding">
            <button :disabled="!isadd" class="btn" @click="handleAdd">新增</button>
            <button :disabled="!isedit" class="btn" @click="handleEdit">编辑</button>
            <button :disabled="!issave" class="btn" @click="handleSave">保存</button>
            <button :disabled="!isdelete" class="btn" @click="handleDelete">删除</button>
            <button :disabled="!issave" class="btn" @click="handleCancel">取消操作</button>
          </div>
        </div>
        <div v-else>
          <div class="checkbox">
            <el-checkbox :indeterminate="isindeterminate" v-model="ischeckedall" @change="handleCheckedAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="vehicles" @change="handleVehicleChange">
              <el-checkbox v-for="(vehicle,index) in vehiclearray" :key="index" :label="vehicle.id">{{ vehicle.type }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="btn-padding">
            <button class="btn" @click="handleExitSetApplVehicles">
              <i class="el-icon-arrow-left"></i>
              返回
            </button>
            <button class="btn" @click="handleAddVehicles">添加车辆</button>
            <button class="btn" @click="ohandleDeleteVehicle">删除车辆</button>
          </div>
        </div>
      </div>
      <div class="list-box">
        <div v-if="!issetapplvehicles">
          <h4 class="conf-h">区域列表</h4>
          <button :disabled="isadding||isediting||areaindex == -1" class="btn" @click="handleApplVehicles">适用车辆</button>
          <loader v-if="listLoading"></loader>
          <div v-else class="list">
            <ul>
              <li v-for="(area,index) in arealist" :class="{disabled:isadding||isediting,selected:areaindex == index}" :key="index" @click="handleSelectArea(index)">{{ area.name }}</li>
            </ul>
          </div>
        </div>
        <div v-else>
          <h4 class="conf-h">车辆</h4>
          <div class="list">
            <ul>
              <li v-for="(vehicle,index) in vehicleslist" :class="{selected:vehicleindex == index}" :key="index" @click="handleSelectVehicle($event,index)">{{ vehicle }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="arrow-left" @click="handleIsShowLeftBox">
      <i :class="[isShowLeftBox?'el-icon-d-arrow-left':'el-icon-d-arrow-right']"></i>
    </div>
    <div class="right-box">
      <b-map-component ref="map" @handleGetLocation="handleGetLocation" :isadd="isadding" :isedit="isediting"></b-map-component>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader'
import BMapComponent from '../BMapComponent'
import { getAreaList, addArea, editArea, delArea } from '@/api/area'

export default {
  components: {
    Loader, BMapComponent
  },
  data() {
    return {
      list: {
        createTime: '',
        creator: '',
        description: '',
        endTime: '',
        id: '',
        isDelete: '',
        location: null,
        max: 0,
        name: '',
        orgId: '',
        startTime: '',
        state: '',
        type: '1',
        vehicleId: ''
      },
      listLoading: false, // 列表加载状态
      isShowLeftBox: true,
      isadd: true,
      isadding: false,
      isedit: false,
      isediting: false,
      issave: false,
      isdelete: false,
      isshowmenu: false,
      issetapplvehicles: false,
      arealist: null,
      areaindex: -1,
      isindeterminate: true,
      ischeckedall: false,
      vehiclearray: [
        { id: '0', type: '大型汽车' },
        { id: '1', type: '小型汽车' },
        { id: '2', type: '摩托车' },
        { id: '3', type: '拖拉车' },
        { id: '4', type: '挂车' },
        { id: '5', type: '新能源大型汽车' }],
      vehicles: [],
      vehicleslist: ['车辆一', '车辆二'],
      vehicleindex: -1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取区域列表
    fetchData() {
      // 未加载时显示加载动画
      this.listLoading = true
      getAreaList().then(response => {
        let resData;
        if (response.data) {
          resData = response.data.rows.map(item => {
            let { createTime, creator, description, endTime, id, isDelete, location, max, name, orgId, startTime, state, type, vehicleId } = item;
            return { createTime, creator, description, endTime, id, isDelete, location, max, name, orgId, startTime, state, type, vehicleId }
          })
          this.arealist = resData
          this.total = response.data.total
        }
        this.listLoading = false
      })
    },
    // 点击是否启用的下拉菜单
    handleSetState(e) {
      // 下拉菜单的点击选择后下拉菜单关闭
      this.list.state = e.target.value
      this.isshowmenu = false
    },
    // 点击隐藏或显示左边菜单栏
    handleIsShowLeftBox() {
      if (this.isShowLeftBox) {
        document.getElementsByClassName('left-box')[0].style.display = 'none'
      } else {
        document.getElementsByClassName('left-box')[0].style.display = ''
      }
      this.isShowLeftBox = !this.isShowLeftBox
    },
    // 点击区域列表
    handleSelectArea(index) {
      this.isadd = true
      this.isedit = true
      this.issave = false
      this.isdelete = true
      this.areaindex = index
      this.list = JSON.parse(JSON.stringify(this.arealist[this.areaindex]))
      this.$refs.map.show(this.list.location)
    },
    // 清空表单
    handleClear() {
      // this.list.createTime = ''
      // this.list.creator = ''
      this.list.description = ''
      // this.list.id = ''
      this.list.endTime = ''
      // this.list.isDelete = ''
      this.list.location = null
      this.list.max = 0
      this.list.name = ''
      // this.list.orgId = ''
      this.list.startTime = ''
      this.list.state = ''
      // this.list.type = '1'
      // this.list.vehicleId = ''
    },
    // 新增
    handleAdd() {
      this.handleClear()
      this.isadd = false
      this.isadding = true
      this.isedit = false
      this.issave = true
      this.isdelete = false
      this.areaindex = -1
      this.$refs.map.remove()
    },
    // 编辑
    handleEdit() {
      this.isadd = false
      this.isedit = false
      this.isediting = true
      this.issave = true
      this.isdelete = false
    },
    // 保存
    handleSave() {
      if (this.isediting) {
        editArea(this.list).then(response => {
          if (response.status === 200) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.isadd = true
            this.isedit = true
            this.isediting = false
            this.issave = false
            this.isdelete = true
            this.fetchData()
          }
        })
      } else {
        console.log(this.list)
        delete this.list.id
        addArea(this.list).then(response => {
          if (response.status === 200) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.isadd = true
            this.isadding = false
            this.isedit = true
            this.issave = false
            this.isdelete = true
            this.areaindex = -1
            this.handleClear()
            this.fetchData()
          }
        })
      }
    },
    // 删除区域
    handleDelete() {
      this.$confirm('是否删除该区域？', '提示', {
        confirmButtonText: '确认',
        cancleButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delArea(this.list.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.isadd = true
          this.isedit = false
          this.isdelete = false
          this.areaindex = -1
          this.handleClear()
          this.fetchData()
          this.$refs.map.remove()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 取消操作
    handleCancel() {
      this.handleClear()
      this.isadd = true
      this.isadding = false
      this.isedit = false
      this.isediting = false
      this.issave = false
      this.isdelete = false
      this.areaindex = -1
    },
    // 点击适用车辆
    handleApplVehicles() {
      this.issetapplvehicles = true
    },
    // 退出适用车辆界面，返回设置适用规则界面
    handleExitSetApplVehicles() {
      this.issetapplvehicles = false
      this.vehicle = ''
      this.vehicleindex = -1
    },
    // 添加车辆
    handleAddVehicles() {
      console.log(this.vehicles)
      if (!this.vehicles.length) {
        this.$message({
          type: 'warning',
          message: '请选择需要添加的车辆或车辆所属的机构部门'
        })
      } else {
        // this.vehicleslist.push(this.vehicle)
        // this.$message({
        //   type: 'success',
        //   message: '添加成功'
        // })
      }
    },
    // 删除车辆
    ohandleDeleteVehicle() {
      this.$confirm('是否删除该车辆？', '提示', {
        confirmButtonText: '',
        cancleButtonText: '',
        type: 'warning'
      }).then(() => {
        this.vehicleslist.splice(this.vehicleindex, 1)
        this.vehicleindex = -1
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击选择车辆
    handleSelectVehicle(e, index) {
      this.vehicleindex = index
    },
    // 点击全选
    handleCheckedAllChange() {
      this.vehicles = this.ischeckedall ? this.vehiclearray.map(item => {
        return item.id
      }) : []
      this.isindeterminate = false
    },
    // 选中车辆列表改变时全选的状态
    handleVehicleChange(value) {
      this.ischeckedall = value.length === this.vehiclearray.length
      this.isindeterminate = value.length > 0 && value.length < this.vehiclearray.length
    },
    // 获取点位信息
    handleGetLocation(location) {
      this.list.location = location
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
