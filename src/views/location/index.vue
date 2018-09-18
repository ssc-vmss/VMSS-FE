<template>
  <div class="view">
    <div :class="{remove:!isshowleftbox}" class="left-box">
      <div class="conf-box">
        <h4 class="conf-h">定位信息</h4>
        <div class="conf-form">
          <div class="conf-form-row">
            <span class="conf-form-label">车辆状态</span>
            <el-checkbox-group class="singleline-checkbox">
              <el-checkbox>运动</el-checkbox>
              <el-checkbox>静止</el-checkbox>
              <el-checkbox>离线</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="conf-form-row">
            <span class="conf-form-label">精准查车</span>
          </div>
        </div>
        <div class="btn-padding">
          <button class="btn">查询</button>
        </div>
      </div>
      <div class="list-box">
      </div>
    </div>
    <div class="arrow-left" @click="handleIsShowLeftBox">
      <i :class="[isshowleftbox?'el-icon-d-arrow-left':'el-icon-d-arrow-right']"></i>
    </div>
    <div class="right-box">
      <b-map-component ref="map" @handleGetLocation="handleGetLocation"></b-map-component>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchVehicle: { id: '', number: '' },
      isSelected: false,
      isChecked: false,
      list: {
        id: '',
        speed: '',
        state: '',
        driverId: '',
        driverName: '',
        posTime: '',
        vehicleId: '',
        plateNumber: '',
        plateType: '',
        plateBrand: '',
        volume: '',
        orgId: '',
        createTime: '',
        location: '',
        lng: '',
        lat: ''
      },
      listLoading: false, // 列表加载状态
      isshowleftbox: true,
      newPointsList: null,
      vehicleIndex: -1,
      isindeterminate: true,
      ischeckedall: false,
      vehiclearray: [
        { id: '0', number: '川A4661561' },
        { id: '1', number: '川C4564965' },
        { id: '2', number: '渝A7484414' },
        { id: '3', number: '粤A4558587' },
        { id: '4', number: '川C4567777' },
        { id: '5', number: '渝B4848448' }],
      vehicleIds: [],
      monitorList: []
    }
  },
  methods: {
    // 点击隐藏或显示左边菜单栏
    handleIsShowLeftBox() {
      if (this.isshowleftbox) {
        document.getElementsByClassName('left-box')[0].style.display = 'none'
      } else {
        document.getElementsByClassName('left-box')[0].style.display = ''
      }
      this.isshowleftbox = !this.isshowleftbox
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
