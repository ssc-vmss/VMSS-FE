<template>
  <div class="map-view">
    <div class="conf-form">
      <div class="conf-form-row">
        <button class="btn">
          <el-checkbox :checked="isChecked" class="allow-checkbox">画面跟随</el-checkbox>
        </button>
        <button ref="play" :disabled="isPlaying" class="btn" @click="play">播放</button>
        <button ref="pause" :disabled="!isPlaying" class="btn" @click="pause">暂停</button>
        <button class="btn" @click="reset">重置</button>
        <button class="btn" @click="add">加速</button>
        <button class="btn" @click="reduce">减速</button>
      </div>
    </div>
    <div id="allmap" ref="map"></div>
    <div v-if="list.length>0&&list[index]" class="conf-form label-box">
      <div class="label-row">
        <span>车牌号码：{{ list[index].plateNumber }}</span>
      </div>
      <!-- <div class="label-row">
        <span>行驶速度：{{ list[index].speed }}</span>
      </div> -->
      <div class="label-row">
        <span>定位时间：{{ list[index].createTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null, // 创建Map实例
      points: [],
      isChecked: false,
      isPlaying: false,
      hasOverlays: false,
      location: '',
      overlays: [], // 点位信息
      list: [], // 数据接收点
      car: '', // 汽车图标
      centerPoint: '',
      imgPath: 'src/assets/images/1.png',
      startImg: 'src/assets/images/start.png',
      endImg: 'src/assets/images/end.png',
      timer: '', // 定时器
      index: 0, // 记录播放到第几个point
      speed: 1000, // 默认一秒钟(后期与接口频率调整一致)
      lineStyle: {
        strokeColor: '#1910A2',
        strokeWeight: 3.5,
        strokeOpacity: 1
      }
    }
  },
  mounted() {
    this.ready()
  },
  methods: {
    ready() {
      this.map = new BMap.Map('allmap', { enableMapClick: false }) // 创建Map实例
      this.map.enableScrollWheelZoom() // 启用鼠标滚动对地图放大缩小
      this.map.addControl(new BMap.ScaleControl())
      this.map.addControl(new BMap.NavigationControl())
      this.map.centerAndZoom(new BMap.Point(104.085145, 30.642301), 15) // 初始化地图,设置中心点坐标和地图级别
      if (this.list.length > 0) {
        this.points = []
        for (var i = 0; i < this.list.length; i++) {
          var point = new BMap.Point(this.list[i].lng, this.list[i].lat)
          this.points.push(point)
        }
        this.map.centerAndZoom(this.points[0], 15) // 初始化地图,设置中心点坐标和地图级别
        var start = new BMap.Point(this.list[0].lng, this.list[0].lat) // 起点
        var end = new BMap.Point(this.list[this.list.length - 1].lng, this.list[this.list.length - 1].lat) // 终点
        var myIcon = new BMap.Icon(this.imgPath, new BMap.Size(52, 26))
        var startIcon = new BMap.Icon(this.startImg, new BMap.Size(32, 32), { anchor: new BMap.Size(16, 32) })
        var endIcon = new BMap.Icon(this.endImg, new BMap.Size(32, 32), { anchor: new BMap.Size(16, 32) })
        var myStart = new BMap.Marker(this.points[0], { icon: startIcon })
        this.map.addOverlay(myStart)
        // 终点标记
        var myEnd = new BMap.Marker(end, { icon: endIcon })
        this.map.addOverlay(myEnd)
        var map = this.map
        var points = this.points
        // 通过DrivingRoute获取一条路线的point
        var driving = new BMap.DrivingRoute(this.map)
        driving.search(start, end)
        const that = this
        driving.setSearchCompleteCallback(function () {
          // 画面移动到起点和终点的中间
          var centerPoint = new BMap.Point((points[0].lng + points[points.length - 1].lng) / 2, (points[0].lat + points[points.length - 1].lat) / 2)
          map.panTo(centerPoint)
          that.centerPoint = centerPoint
          // 连接所有点
          map.addOverlay(new BMap.Polyline(points, that.lineStyle))
          // 显示小车子
          var car = new BMap.Marker(points[0], { icon: myIcon })
          map.addOverlay(car)
          that.car = car
          // 点亮操作按钮
          that.isPlaying = false
        })
      }
    },
    play() {
      this.isPlaying = true
      var point = this.points[this.index]
      if (this.index > 0) {
        this.map.addOverlay(new BMap.Polyline([this.points[this.index - 1], point], { strokeColor: '#E80110', strokeWeight: 3.5, strokeOpacity: 1 }))
        this.setRotation(this.points[this.index - 1], point, this.car)
      }
      this.car.setPosition(point)
      this.index++
      if (this.isChecked) {
        this.map.panTo(point)
      }
      if (this.index < this.points.length) {
        this.timer = window.setTimeout(() => { this.play() }, this.speed)
      } else {
        this.isPlaying = true
        // 		map.panTo(point);
      }
      if (this.index === this.points.length) {
        this.index--
      }
    },
    pause() {
      this.isPlaying = false
      if (this.timer) {
        window.clearTimeout(this.timer)
      }
    },
    reset() {
      this.isChecked = false
      this.isPlaying = false
      if (this.timer) {
        window.clearTimeout(this.timer)
      }
      this.index = 0
      this.speed = 1000
      this.car.setPosition(this.points[0])
      this.map.panTo(this.centerPoint)
      this.map.addOverlay(new BMap.Polyline(this.points, this.lineStyle))

    },
    add() {
      this.speed = this.speed / 2
      console.log(this.speed)
    },
    reduce() {
      this.speed = this.speed * 2
      console.log(this.speed)
    },
    // 设置方向 curPos 起点 targetPos 终点
    setRotation(curPos, targetPos, marker) {
      var deg = 0
      curPos = this.map.pointToPixel(curPos)
      targetPos = this.map.pointToPixel(targetPos)

      if (targetPos.x !== curPos.x) {
        var tan = (targetPos.y - curPos.y) / (targetPos.x - curPos.x), atan = Math.atan(tan)
        deg = atan * 360 / (2 * Math.PI)
        if (targetPos.x < curPos.x) {
          deg = -deg + 90 + 90
        } else {
          deg = -deg
        }
        marker.setRotation(-deg)
      } else {
        var disy = targetPos.y - curPos.y
        var bias = 0
        if (disy > 0) {
          bias = -1
        } else {
          bias = 1
        }
        marker.setRotation(-bias * 90)
      }
      return
    }
  }
}
</script>
<style lang="scss" scoped>
.conf-form {
  .conf-form-row {
    width: 420px;
    margin: 0 auto;
    z-index: 999;
    height: 40px;
    min-width: 40px;
    .conf-form-label {
      width: 70px;
    }
    .conf-form-input {
      width: 200px;
      margin: 5px 0;
    }
  }
}
.allow-checkbox {
  padding-right: 0;
}
</style>
