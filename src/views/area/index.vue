<template>
  <div class="view">
    <div :class="{remove:!isShowLeftBox}" class="left-box">
      <div class="conf-box">
        <div v-if="!issetapplvehicles">
          <h4 class="conf-h">区域设置</h4>
          <h4 v-if="isadding" class="conf-h">(新增中...)</h4>
          <h4 v-if="isediting" class="conf-h">(编辑中...)</h4>
          <div class="btn-padding">
            <button :disabled="!isadd" class="btn" @click="handleAdd">新增</button>
            <button :disabled="!isedit" class="btn" @click="handleEdit">编辑</button>
            <button :disabled="!(isadding||isediting)" class="btn" @click="handleSave">保存</button>
            <button :disabled="!issave" class="btn" @click="handleCancel">取消操作</button>
          </div>
          <div class="conf-form">
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>围栏类型</span>
              </div>
              <input :disabled="isadd" v-model="list.type=='1'?'区域报警':'违规用车'" class="conf-form-input" type="text" @click="handleShowTypeMenu" placeholder="请选择" readonly />
              <i :class="{isdisabled:isadd}" class="el-icon-caret-bottom conf-form-icon righticon" @click="handleShowTypeMenu"></i>
              <div v-show="isShowTypeMenu" tabindex="-1" class="dropdown-menu">
                <ul class="dropdown-ul" @click="handleSetType">
                  <li value="1">区域报警</li>
                  <li value="2">违规用车</li>
                </ul>
              </div>
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>名称</span>
                <span class="required-span">*</span>
              </div>
              <input :disabled="isadd" v-model="list.name" class="conf-form-input" type="text" placeholder="请输入名称">
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
              <input :disabled="isadd" v-model="list.state==1?'是':'否'" class="conf-form-input" type="text" @click="handleShowStateMenu" placeholder="请选择" readonly />
              <i :class="{isdisabled:isadd}" class="el-icon-caret-bottom conf-form-icon righticon" @click="handleShowStateMenu"></i>
              <div v-show="isShowStateMenu" tabindex="-1" class="dropdown-menu">
                <ul class="dropdown-ul" @click="handleSetState">
                  <li value="0">否</li>
                  <li value="1">是</li>
                </ul>
              </div>
            </div>
            <div v-if="list.type=='1'">
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
              <div class="conf-form-row">
                <div class="conf-form-label">
                  <span>启动报警</span>
                </div>
                <div :disabled="!(isadding||isediting)" class="singleline-checkbox">
                  <el-checkbox :disabled="!(isadding||isediting)" v-model="list.inWarn" true-label="1" false-label="0">驶入</el-checkbox>
                  <el-checkbox :disabled="!(isadding||isediting)" v-model="list.outWarn" true-label="1" false-label="0">驶出</el-checkbox>
                  <el-checkbox :disabled="!(isadding||isediting)" v-model="isSpeedLimit">限速</el-checkbox>
                </div>
              </div>
              <div v-if="isSpeedLimit" class="conf-form-row">
                <div class="conf-form-label">
                  <span>最高时速</span>
                </div>
                <input class="conf-form-input" :disabled="isadd" v-model="list.max" type="number">
                <span class="unit-span">km/h</span>
                <i :class="{isdisabled:(isadd||list.max==0)}" class="el-icon-minus conf-form-icon lefticon" @click="list.max--"></i>
                <i :class="{isdisabled:isadd}" class="el-icon-plus conf-form-icon righticon" @click="list.max++"></i>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <h4 class="conf-h">已选车辆</h4>
          <div v-if="!vehiclearray.length" class="empty-box">
            暂无车辆
          </div>
          <div v-else class="checkbox">
            <el-checkbox :indeterminate="isUnSelectedIndeterminate" v-model="isUnSelectedCheckedAll" @change="unSelectedCheckAllChange">全选</el-checkbox>
            <el-checkbox-group class="scrollBox" v-model="unSelectedIds" @change="unSelectedVehicleChange">
              <el-checkbox :class="{search:vehicle.id == searchVehicle}" v-for="(vehicle,index) in unSelectedList" v-model="vehicle.id" :key="index" :label="vehicle.id">{{ vehicle.plateNumber }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <el-select v-model="searchVehicle" clearable filterable remote placeholder="请输入车牌号码" @change="handleSelectNumber">
            <el-option v-for="item in vehiclearray" :key="item.id" :label="item.plateNumber" :value="item.id"></el-option>
          </el-select>
          <!-- <el-autocomplete valueKey="plateNumber" @select="handleSelectNumber" :fetch-suggestions="handleFetchNumber" trigger-on-focus v-model="searchVehicle" placeholder="输入车牌号搜索"></el-autocomplete> -->
          <div class="btn-padding">
            <button class="btn" @click="handleExitSetApplVehicles">
              <i class="el-icon-arrow-left"></i>
              返回
            </button>
            <button class="btn" @click="handleAddVehicles">添加车辆</button>
          </div>
        </div>
      </div>
      <div class="list-box">
        <div v-if="!issetapplvehicles">
          <h4 class="conf-h">区域列表</h4>
          <button :disabled="isadding||isediting||areaindex == -1" class="btn" @click="handleApplVehicles">适用车辆</button>
          <button :disabled="!isdelete" class="btn" @click="handleDelete">删除</button>
          <loader v-if="listLoading"></loader>
          <div v-else class="list">
            <ul>
              <li v-for="(area,index) in arealist" :class="{disabled:isadding||isediting,selected:areaindex == index}" :key="index" @click="handleSelectArea(index)">{{ area.name }}</li>
            </ul>
          </div>
        </div>
        <div v-else>
          <h4 class="conf-h">车辆</h4>
          <button :disabled="!selectedIds.length" class="btn" @click="handleDeleteVehicle">删除车辆</button>
          <div v-if="!selectedList.length" class="empty-box">
            未选车辆
          </div>
          <div v-else class="checkbox">
            <el-checkbox v-if="selectedList.length" :indeterminate="isSelectedIndeterminate" v-model="isSelectedCheckedAll" @change="selectedCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="selectedIds" @change="selectedVehicleChange">
              <el-checkbox v-for="(vehicle,index) in selectedList" v-model="vehicle.id" :key="index" :label="vehicle.id">{{ vehicle.plateNumber }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="arrow-left" @click="handleIsShowLeftBox">
      <i :class="[isShowLeftBox?'el-icon-d-arrow-left':'el-icon-d-arrow-right']"></i>
    </div>
    <div class="right-box">
      <b-map-component ref="map" @handleGetLocation="handleGetLocation" @handleRemove="handleRemove" :isadd="isadding" :isedit="isediting"></b-map-component>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader'
import BMapComponent from './BMapComponent'
import { getInfoList } from '@/api/vehicle'
import { getAreaList, addArea, editArea, delArea } from '@/api/area'

export default {
  components: {
    Loader, BMapComponent
  },
  data() {
    return {
      searchVehicle: '',
      list: {
        type: '1',
        description: '',
        endTime: '',
        location: '',
        max: 0,
        name: '',
        startTime: '',
        state: 0,
        vehicleId: '',
        inWarn: 0,
        outWarn: 0
      },
      listLoading: false, // 列表加载状态
      isSpeedLimit: false, // 是否限速
      isShowLeftBox: true, // 是否显示左边栏
      isadd: true,
      isadding: false, // 是否正在新增
      isedit: false,
      isediting: false, // 是否正在编辑
      issave: false, // 是否保存
      isdelete: false, // 是否删除
      isShowTypeMenu: false, // 是否显示类型下拉菜单
      isShowStateMenu: false, // 是否显示状态下拉菜单
      issetapplvehicles: false,
      arealist: null,
      areaindex: -1,
      isindeterminate: true,
      isCheckedAll: false,
      vehiclearray: [
        { id: '0', type: '大型汽车' },
        { id: '1', type: '小型汽车' },
        { id: '2', type: '摩托车' },
        { id: '3', type: '拖拉车' },
        { id: '4', type: '挂车' },
        { id: '5', type: '新能源大型汽车' }],
      unSelectedIds: [],
      selectedIds: [],
      unSelectedList: [],
      selectedList: [],
      isUnSelectedIndeterminate: true,
      isSelectedIndeterminate: true,
      isUnSelectedCheckedAll: false,
      isSelectedCheckedAll: false,
      vehicleslist: ['车辆一', '车辆二'],
      vehicleindex: -1,
      hasRemove: false
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
        if (response.data) {
          this.arealist = response.data.rows
          this.total = response.data.total
        }
        this.listLoading = false
      })
    },
    // 输入车牌号时获取相似车牌号提供输入建议
    handleFetchNumber(querystring, callback) {
      const results = []
      this.vehiclearray.forEach(vehicle => {
        const reg = new RegExp(querystring.toLowerCase())
        if (vehicle.plateNumber.toLowerCase().match(reg) !== null) {
          results.push(vehicle)
        }
      })
      callback(results)
    },
    // 点击建议项里的车牌号
    handleSelectNumber(data) {
      let searchVehicleIndex = -1
      this.vehiclearray.forEach((vehicle, index) => {
        if (data === vehicle.id) {
          searchVehicleIndex = index
        }
      })
      const scrollTop = this.vehiclearray.length * searchVehicleIndex
      document.getElementsByClassName('scrollBox')[0].scrollTop = `${scrollTop}px`
    },
    // 点击区域围栏的下拉菜单
    handleSetType(e) {
      // 下拉菜单的点击选择后下拉菜单关闭
      this.list.type = e.target.value
      this.isShowTypeMenu = false
    },
    // 点击是否启用的下拉菜单
    handleSetState(e) {
      // 下拉菜单的点击选择后下拉菜单关闭
      this.list.state = e.target.value
      this.isShowStateMenu = false
    },
    // 切换显示类型下拉菜单
    handleShowTypeMenu() {
      if (!this.isShowTypeMenu) {
        this.isShowTypeMenu = true
        document.addEventListener('mousedown', e => {
          if (e.target.parentElement.className !== 'dropdown-ul') {
            this.isShowTypeMenu = false
            return
          }
        })
      }
    },
    // 切换显示状态下拉菜单
    handleShowStateMenu() {
      if (!this.isShowStateMenu) {
        this.isShowStateMenu = true
        document.addEventListener('mousedown', e => {
          if (e.target.parentElement.className !== 'dropdown-ul') {
            this.isShowStateMenu = false
            return
          }
        })
      }
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
      // debugger
      if (index === this.areaindex) {
        this.areaindex = -1
        this.isedit = false
        this.isdelete = false
        this.isSpeedLimit = false
        this.handleClear()
        this.$refs.map.remove()
      } else {
        this.isadd = true
        this.isedit = true
        this.issave = false
        this.isdelete = true
        this.areaindex = index
        this.isSpeedLimit = false
        this.list = JSON.parse(JSON.stringify(this.arealist[this.areaindex]))
        if (this.list.max > 0) {
          this.isSpeedLimit = true
        }
        this.$refs.map.show(this.list.location)
      }
    },
    // 清空表单
    handleClear() {
      this.list.type = '1'
      this.list.description = ''
      this.list.endTime = ''
      this.list.location = ''
      this.list.max = 0
      this.list.name = ''
      this.list.startTime = ''
      this.list.state = 0
      this.list.inWarn = 0
      this.list.outWarn = 0
      this.list.vehicleId = ''
    },
    // 新增
    handleAdd() {
      this.$refs.map.remove()
      this.handleClear()
      this.isadd = false
      this.isadding = true
      this.isedit = false
      this.issave = true
      this.isdelete = false
      this.areaindex = -1
      this.isSpeedLimit = false
      this.$refs.map.add()
    },
    // 编辑
    handleEdit() {
      this.isadd = false
      this.isedit = false
      this.isediting = true
      this.issave = true
      this.isdelete = false
      this.$refs.map.edit()
    },
    // 保存
    handleSave() {
      console.log(this.list.location)
      if (this.list.location === '') {
        this.$message({
          type: 'warning',
          message: '区域不能为空,请绘制区域'
        })
        return
      }
      if (this.list.name === '') {
        this.$message({
          type: 'warning',
          message: '名称不能为空'
        })
        return
      }
      if (this.list.startTime > this.list.endTime) {
        this.$message({
          type: 'warning',
          message: '开始时间不能大于结束时间'
        })
        return
      }
      if (this.isediting) {
        if (!this.hasRemove) {
          this.$refs.map.save()
        }
        editArea(this.list).then(response => {
          if (response.status === 200) {
            this.isadd = true
            this.isedit = true
            this.isediting = false
            this.issave = false
            this.isdelete = true
            this.fetchData()
            this.$message({
              message: response.message,
              type: 'success'
            })
          }
        })
      } else {
        delete this.list.id
        addArea(this.list).then(response => {
          if (response.status === 200) {
            this.isadd = true
            this.isadding = false
            this.isedit = true
            this.issave = false
            this.isdelete = true
            this.areaindex = -1
            this.isSpeedLimit = false
            this.handleClear()
            this.fetchData()
            this.$message({
              message: response.message,
              type: 'success'
            })
            setTimeout(() => {
              this.handleSelectArea(0)
            }, 100)
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
          this.isSpeedLimit = false
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
      this.isSpeedLimit = 0
      this.$refs.map.map.clearOverlays()
      this.$refs.map.overlays = []
    },
    // 点击适用车辆
    handleApplVehicles() {
      this.issetapplvehicles = true
      this.fetchVehicle()
    },
    // 获取车辆信息
    fetchVehicle() {
      // 获取车辆信息
      getInfoList({ pageNo: 1, pageSize: 1000 }).then(response => {
        this.vehiclearray = response.data.rows
        this.unSelectedList = this.vehiclearray
        this.total = response.data.total
        const ids = this.list.vehicleId.split(',')
        ids.forEach(id => {
          this.unSelectedList.forEach((vehicle, index) => {
            if (id === vehicle.id) {
              this.selectedList.push(vehicle)
              this.unSelectedList.splice(index, 1)
            }
          })
        })
      })
    },
    // 退出适用车辆界面，返回设置适用规则界面
    handleExitSetApplVehicles() {
      this.issetapplvehicles = false
      this.vehicle = ''
      this.vehicleindex = -1
      this.selectedList = []
    },
    // 添加车辆
    handleAddVehicles() {
      if (!this.unSelectedIds.length) {
        this.$message({
          type: 'warning',
          message: '请选择需要添加的车辆'
        })
      } else {
        this.unSelectedIds.forEach(id => {
          this.unSelectedList.forEach((vehicle, index) => {
            if (id === vehicle.id) {
              this.selectedList.push(vehicle)
              this.unSelectedList.splice(index, 1)
            }
          })
        })
        this.changeApplVehicle()
        this.selectedIds = []
      }
    },
    // 删除车辆
    handleDeleteVehicle() {
      this.selectedIds.forEach(id => {
        this.selectedList.forEach((vehicle, index) => {
          if (id === vehicle.id) {
            this.selectedList.splice(index, 1)
            this.unSelectedList.push(vehicle)
          }
        })
      })
      this.changeApplVehicle()
      this.unSelectedIds = []
    },
    // 添加或删除适用车辆
    changeApplVehicle() {
      let idsString = ''
      this.selectedList.map((vehicle, index) => {
        if (index === this.selectedList.length - 1) {
          idsString += vehicle.id
        } else {
          idsString += `${vehicle.id},`
        }
      })
      this.list.vehicleId = idsString
      editArea(this.list).then(response => {
        console.log(response)
        if (response.status === 200) {
          this.fetchData()
        }
      })
    },
    // 点击选择车辆
    handleSelectVehicle(e, index) {
      this.vehicleindex = index
    },
    // 点击全选所有车辆
    unSelectedCheckAllChange() {
      this.unSelectedIds = this.isUnSelectedCheckedAll ? this.unSelectedList.map(item => {
        return item.id
      }) : []
      this.isUnSelectedIndeterminate = false
    },
    // 点击全选
    selectedCheckAllChange() {
      this.selectedIds = this.isSelectedCheckedAll ? this.selectedList.map(item => {
        return item.id
      }) : []
      this.isSelectedIndeterminate = false
    },
    // 选中所有车辆列表改变时全选的状态
    unSelectedVehicleChange(value) {
      if (value) {
        this.isSelectedCheckedAll = value.length === this.unSelectedList.length
        this.isUnSelectedIndeterminate = value.length > 0 && value.length < this.unSelectedList.length
      }
    },
    // 选中选中车辆列表改变时全选的状态
    selectedVehicleChange(value) {
      if (value) {
        this.isSelectedCheckedAll = value.length === this.selectedList.length
        this.isSelectedIndeterminate = value.length > 0 && value.length < this.selectedList.length
      }
    },
    // 获取点位信息
    handleGetLocation(location) {
      this.list.location = location
    },
    // 是否已清空过区域
    handleRemove() {
      this.hasRemove = true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
