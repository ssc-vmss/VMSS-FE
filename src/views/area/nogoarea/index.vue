<template>
  <div class="view">
    <div :class="{hide:!isshowleftbox}" class="left-box">
      <div class="conf-box">
        <h4 class="conf-h4">禁区设置</h4>
        <div v-if="!issetrule&&!issetapplvehicles&&!issetapplorgs" class="conf-form">
          <div class="conf-form-row">
            <div class="conf-form-label">
              <span>区域描述</span>
            </div>
            <input :disabled="isadd" v-model="description" class="conf-form-input" type="text" placeholder="请输入内容">
          </div>
          <div class="conf-form-row">
            <div class="conf-form-label">
              <span>是否启用</span>
            </div>
            <input :disabled="isadd" v-model="state" class="conf-form-input" type="text" placeholder="请选择" @click="handleShowMenu">
            <i :class="{isdisabled:isadd}" class="el-icon-caret-bottom conf-form-icon righticon" @click="handleShowMenu"></i>
            <div v-show="isshowmenu" class="dropdown-menu">
              <ul>
                <li @click="handleSetIsStart">是</li>
                <li @click="handleSetIsStart">否</li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else-if="issetrule" class="conf-form">
          <button class="btn" @click="handleExitSetRule">
            <i class="el-icon-arrow-left"></i>
            返回
          </button>
          <div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>名称</span>
                <span class="required-span">*</span>
              </div>
              <input :disabled="isadd" v-model="name" class="conf-form-input" type="text">
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>最高时速</span>
                <span class="required-span">*</span>
              </div>
              <input :disabled="isadd" v-model="max" class="conf-form-input" type="text">
              <span class="unit-span">km/h</span>
              <i :class="{isdisabled:(isadd||max==1)}" class="el-icon-minus conf-form-icon lefticon" @click="max--"></i>
              <i :class="{isdisabled:isadd}" class="el-icon-plus conf-form-icon righticon" @click="max++"></i>
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>开始时间</span>
                <span class="required-span">*</span>
              </div>
              <el-time-picker :disabled="isadd" v-model="start_time" value-format="HH:mm:ss" class="time-picker" placeholder="选择时间"></el-time-picker>
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>结束时间</span>
                <span class="required-span">*</span>
              </div>
              <el-time-picker :disabled="isadd" v-model="end_time" value-format="HH:mm:ss" class="time-picker" placeholder="选择时间"></el-time-picker>
            </div>
            <div class="conf-form-row">
              <div class="conf-form-label">
                <span>是否应用</span>
              </div>
              <input :disabled="isadd" v-model="state" class="conf-form-input" type="text" placeholder="请选择" @click="handleShowMenu">
              <i :class="{isdisabled:isadd}" class="el-icon-caret-bottom conf-form-icon righticon" @click="handleShowMenu"></i>
              <div v-show="isshowmenu" class="dropdown-menu">
                <ul>
                  <li @click="handleSetIsStart">是</li>
                  <li @click="handleSetIsStart">否</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="issetapplvehicles">
          <button class="btn" @click="handleExitSetApplVehicles">
            <i class="el-icon-arrow-left"></i>
            返回
          </button>
          <div class="tree-box">
            <el-tree :data="vehicletree" accordion show-checkbox :props="defaultVehicleProps" @check-change="handleClickVehicleTree"></el-tree>
          </div>
          <div class="btn-padding">
            <button class="btn" @click="handleAddVehicles">添加车辆</button>
            <button class="btn" @click="ohandleDeleteVehicle">删除车辆</button>
          </div>
        </div>
        <div v-else-if="issetapplorgs">
          <button class="btn" @click="handleExitSetApplOrgs">
            <i class="el-icon-arrow-left"></i>
            返回
          </button>
          <div class="tree-box">
            <el-tree :props="defaultOrgProps" accordion :data="orgtree" @node-click="handleClickOrgTree"></el-tree>
          </div>
          <div class="btn-padding">
            <button class="btn" @click="handleAddOrg">添加机构</button>
            <button class="btn" @click="handleDeleteOrg">删除机构</button>
          </div>
        </div>
        <div v-if="!issetapplvehicles&&!issetapplorgs" class="btn-padding">
          <button :disabled="!isadd" class="btn" @click="issetrule?handleAddRule():handleAddArea()">新增</button>
          <button :disabled="!ismodify" class="btn" @click="issetrule?handleModifyRule():handleModifyArea()">修改</button>
          <button :disabled="!issave" class="btn" @click="issetrule?handleSaveRule():handleSaveArea()">保存</button>
          <button :disabled="!isdelete" class="btn" @click="issetrule?handleDeleteRule():handleDeleteArea()">删除</button>
          <button v-if="!issetrule" :disabled="!isshowrule" class="btn" @click="handleSetRule">适用规则</button>
        </div>
      </div>
      <div class="list-box">
        <div v-if="!issetrule&&!issetapplvehicles&&!issetapplorgs">
          <h4 class="conf-h4">区域列表</h4>
          <div class="area-list">
            <ul>
              <li v-for="(area,index) in arealist" :class="{selected:areaindex == index}" :key="index" @click="handleSelectArea($event,index)">{{ area.description }}</li>
            </ul>
          </div>
        </div>
        <div v-else-if="issetrule">
          <h4 class="conf-h4">规则定义</h4>
          <div class="btn-padding">
            <button :disabled="ruleindex== -1" class="btn" @click="handleApplVehicles">适用车辆</button>
            <button :disabled="ruleindex== -1" class="btn" @click="handleApplOrgs">适用单位</button>
          </div>
          <div class="area-list">
            <ul>
              <li v-for="(rule,index) in rulelist" :class="{selected:ruleindex == index}" :key="index" @click="handleSelectRule($event,index)">{{ rule.name }}</li>
            </ul>
          </div>
        </div>
        <div v-else-if="issetapplvehicles">
          <h4 class="conf-h4">车辆</h4>
          <div class="area-list">
            <ul>
              <li v-for="(vehicle,index) in vehicleslist" :class="{selected:vehicleindex == index}" :key="index" @click="handleSelectVehicle($event,index)">{{ vehicle }}</li>
            </ul>
          </div>
        </div>
        <div v-else-if="issetapplorgs">
          <h4 class="conf-h4">机构部门</h4>
          <div class="area-list">
            <ul>
              <li v-for="(org,index) in orgslist" :class="{selected:orgindex == index}" :key="index" @click="handleSelectOrg($event,index)">{{ org }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="arrow-left" @click="handleIsShowLeftBox">
      <i :class="[isshowleftbox?'el-icon-d-arrow-left':'el-icon-d-arrow-right']"></i>
    </div>
    <div class="map-box">
      <b-map-component></b-map-component>
    </div>
  </div>
</template>

<script>
import BMapComponent from '@/components/BMapComponent'

export default {
  components: {
    BMapComponent
  },
  data() {
    return {
      isshowleftbox: true,
      isadd: true,
      ismodify: false,
      issave: false,
      isdelete: false,
      isshowrule: false,
      isshowmenu: false,
      issetrule: false,
      issetapplvehicles: false,
      issetapplorgs: false,
      description: '',
      state: '',
      name: '',
      max: 1,
      start_time: '00:00:00',
      end_time: '23:59:59',
      arealist: [
        { description: '区域一', state: '是' },
        { description: '区域二', state: '否' },
        { description: '区域三', state: '否' },
        { description: '区域四', state: '是' },
        { description: '区域五', state: '否' }],
      areaindex: -1,
      rulelist: [
        { name: '规则一', max: '3', start_time: '11:54:24', end_time: '20:04:16', state: '否' },
        { name: '规则二', max: '6', start_time: '04:27:37', end_time: '15:46:28', state: '是' },
        { name: '规则三', max: '4', start_time: '21:54:24', end_time: '23:04:16', state: '否' },
        { name: '规则四', max: '2', start_time: '19:35:33', end_time: '22:44:46', state: '否' },
        { name: '规则五', max: '4', start_time: '05:46:37', end_time: '23:59:59', state: '是' }
      ],
      ruleindex: -1,
      vehicletree: [{
        vehiclename: '四川联通',
        children: [{
          vehiclename: '产业互联网',
          children: [
            { vehiclename: '班车' },
            { vehiclename: '客车' },
            { vehiclename: '小轿车' }]        }]      }],
      defaultVehicleProps: {
        label: 'vehiclename',
        children: 'children'
      },
      orgtree: [{
        orgname: '四川联通',
        children: [{
          orgname: '产业互联网',
          children: [
            { orgname: '产品开发/能力开放事业部' },
            { orgname: '财务风险法务部' },
            { orgname: '综合人事采购部' }]        }]      }],
      defaultOrgProps: {
        label: 'orgname',
        children: 'children'
      },
      vehicle: '',
      vehicleslist: ['车辆一', '车辆二'],
      vehicleindex: -1,
      org: '',
      orgslist: ['机构部门一', '机构部门二'],
      orgindex: -1
    }
  },
  methods: {
    handleSetIsStart(e) {
      // 下拉菜单的点击选择后下拉菜单关闭
      this.state = e.target.innerText
      this.isshowmenu = false
    },
    handleIsShowLeftBox() {
      if (this.isshowleftbox) {
        document.getElementsByClassName('left-box')[0].style.display = 'none'
      } else {
        document.getElementsByClassName('left-box')[0].style.display = ''
      }
      this.isshowleftbox = !this.isshowleftbox
    },
    handleAddArea() {
      this.isadd = false
      this.ismodify = false
      this.issave = true
      this.isdelete = false
      this.isshowrule = false
      this.description = ''
      this.state = ''
      this.areaindex = -1
    },
    handleModifyArea() {
      this.isadd = false
      this.issave = true
      this.isdelete = false
      this.isshowrule = false
    },
    handleSaveArea() {
      if (this.description === '') {
        this.$message({
          type: 'warning',
          message: '区域描述不能为空'
        })
      } else if (this.state === '') {
        this.$message({
          type: 'warning',
          message: '请选择是否启用'
        })
      } else {
        let message = ''
        // 修改模式
        if (this.ismodify) {
          this.arealist.splice(this.areaindex, 1, { 'description': this.description, 'state': this.state })
          message = '修改成功'
          this.ismodify = false
          this.areaindex = -1
        } else { // 新增模式
          this.arealist.push({ 'description': this.description, 'state': this.state })
          message = '新增成功'
        }
        this.$message({
          type: 'success',
          message: message
        })
        this.isadd = true
        this.issave = false
        this.description = ''
        this.state = ''
      }
    },
    handleDeleteArea() {
      this.$confirm('是否删除该限速区域？', '提示', {
        confirmButtonText: '',
        cancleButtonText: '',
        type: 'warning'
      }).then(() => {
        this.arealist.splice(this.areaindex, 1)
        this.isadd = true
        this.ismodify = false
        this.isdelete = false
        this.isshowrule = false
        this.description = ''
        this.state = ''
        this.areaindex = -1
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
    handleSetRule() {
      this.ismodify = false
      this.isdelete = false
      this.issetrule = true
    },
    handleShowMenu() {
      this.isshowmenu = !this.isshowmenu
    },
    handleSelectArea(e, index) {
      this.isadd = true
      this.ismodify = true
      this.issave = false
      this.isdelete = true
      this.isshowrule = true
      this.areaindex = index
      this.description = e.target.innerText
      this.state = this.arealist[this.areaindex].state
    },
    handleExitSetRule() {
      this.isadd = true
      this.ismodify = true
      this.issave = false
      this.isdelete = true
      this.isshowrule = true
      this.issetrule = false
      this.name = ''
      this.max = 1
      this.start_time = '00:00:00'
      this.end_time = '23:59:59'
      this.ruleindex = -1
    },
    handleAddRule() {
      this.isadd = false
      this.ismodify = false
      this.issave = true
      this.isdelete = false
      this.isshowrule = false
      this.name = ''
      this.max = 1
      this.start_time = ''
      this.end_time = ''
      this.state = ''
      this.ruleindex = -1
    },
    handleModifyRule() {
      this.isadd = false
      this.issave = true
      this.isdelete = false
    },
    handleSaveRule() {
      if (this.name === '') {
        this.$message({
          type: 'warning',
          message: '名称不能为空'
        })
      } else if (this.start_time === '') {
        this.$message({
          type: 'warning',
          message: '请选择开始时间'
        })
      } else if (this.end_time === '') {
        this.$message({
          type: 'warning',
          message: '请选择结束时间'
        })
      } else if (this.state === '') {
        this.$message({
          type: 'warning',
          message: '请选择是否应用'
        })
      } else {
        let message = ''
        // 修改模式
        if (this.ismodify) {
          this.rulelist.splice(this.ruleindex, 1, { 'name': this.name, 'max': this.max, 'start_time': this.start_time, 'end_time': this.end_time, 'state': this.state })
          message = '修改成功'
          this.ismodify = false
          this.ruleindex = -1
          console.log(this.rulelist)
        } else { // 新增模式
          this.rulelist.push({ 'name': this.name, 'max': this.max, 'start_time': this.start_time, 'end_time': this.end_time, 'state': this.state })
          message = '新增成功'
        }
        this.$message({
          type: 'success',
          message: message
        })
        this.isadd = true
        this.issave = false
        this.name = ''
        this.max = ''
        this.start_time = ''
        this.end_time = ''
        this.state = ''
      }
    },
    handleDeleteRule() {
      this.$confirm('是否删除该规则？', '提示', {
        confirmButtonText: '',
        cancleButtonText: '',
        type: 'warning'
      }).then(() => {
        this.rulelist.splice(this.ruleindex, 1)
        this.isadd = true
        this.ismodify = false
        this.isdelete = false
        this.name = ''
        this.max = 1
        this.start_time = ''
        this.end_time = ''
        this.state = ''
        this.ruleindex = -1
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
    handleApplVehicles() {
      this.issetrule = false
      this.issetapplvehicles = true
    },
    handleApplOrgs() {
      this.issetrule = false
      this.issetapplorgs = true
    },
    // 点击选择规则
    handleSelectRule(e, index) {
      this.isadd = true
      this.ismodify = true
      this.issave = false
      this.isdelete = true
      this.ruleindex = index
      this.name = e.target.innerText
      this.max = this.rulelist[this.ruleindex].max
      this.start_time = this.rulelist[this.ruleindex].start_time
      this.end_time = this.rulelist[this.ruleindex].end_time
      this.state = this.rulelist[this.ruleindex].state
    },
    // 退出适用车辆界面，返回设置适用规则界面
    handleExitSetApplVehicles() {
      this.issetrule = true
      this.issetapplvehicles = false
      this.vehicle = ''
      this.vehicleindex = -1
    },
    // 添加车辆
    handleAddVehicles() {
      if (this.vehicle === '') {
        this.$message({
          type: 'warning',
          message: '请选择需要添加的车辆或车辆所属的机构部门'
        })
      } else {
        this.vehicleslist.push(this.vehicle)
        this.$message({
          type: 'success',
          message: '添加成功'
        })
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
    handleClickVehicleTree(data) {
      this.vehicleindex = -1
      this.vehicle = data.vehiclename
    },
    // 退出适用单位界面，返回设置适用规则界面
    handleExitSetApplOrgs() {
      this.issetrule = true
      this.issetapplorgs = false
      this.org = ''
      this.orgindex = -1
    },
    // 添加机构
    handleAddOrg() {
      if (this.org === '') {
        this.$message({
          type: 'warning',
          message: '请选择需要添加的机构部门'
        })
      } else {
        this.orgslist.push(this.org)
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      }
    },
    // 删除机构
    handleDeleteOrg() {
      this.$confirm('是否删除该机构？', '提示', {
        confirmButtonText: '',
        cancleButtonText: '',
        type: 'warning'
      }).then(() => {
        this.orgslist.splice(this.orgindex, 1)
        this.orgindex = -1
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
    // 点击选择机构
    handleSelectOrg(e, index) {
      this.orgindex = index
    },
    handleClickOrgTree(data) {
      this.orgindex = -1
      this.org = data.orgname
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
