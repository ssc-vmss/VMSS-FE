<template>
  <div class="map-view">
    <div class="conf-form">
      <div class="conf-form-row">
        <button class="btn">
          <el-checkbox v-model="isChecked" class="allow-checkbox">画面跟随</el-checkbox>
        </button>
        <button ref="play" :disabled="isPlaying||allOverlay.length == 0" class="btn" @click="play">播放</button>
        <button ref="pause" :disabled="!isPlaying" class="btn" @click="pause">暂停</button>
        <button :disabled="allOverlay.length == 0" class="btn" @click="reset">重置</button>
        <div class="slider-box">
          <div class="slider-label">播放慢速</div>
          <el-slider :format-tooltip="formatSpeed" :show-tooltip="false" v-model="speed" :step="250" :min="0" :max="4000" class="slider"></el-slider>

        </div>
      </div>
    </div>
    <div id="allmap" ref="map"></div>
    <div v-if="list.length>0&&list[index]" class="conf-form label-leftbox">
      <div class="label-row">
        <span>车牌号码：{{ list[index].plateNumber }}</span>
      </div>
      <div class="label-row">
        <span>行驶速度：{{ list[index].speed?list[index].speed:0 }} km/h</span>
      </div>
      <div class="label-row">
        <span>定位时间：{{ list[index].posTime }}</span>
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
      imgPath: require('@/assets/images/1.png'),
      startImg: require('@/assets/images/start.png'),
      endImg: require('@/assets/images/end.png'),
      timer: '', // 定时器
      index: 0, // 记录播放到第几个point
      speed: 2000, // 默认一秒钟(后期与接口频率调整一致)
      lineStyle: {
        strokeColor: '#1910A2',
        strokeWeight: 3.5,
        strokeOpacity: 1
      },
      allOverlay: []
    }
  },
  mounted() {
    this.map = new BMap.Map('allmap', { enableMapClick: false }) // 创建Map实例
    this.map.enableScrollWheelZoom() // 启用鼠标滚动对地图放大缩小
    this.map.addControl(new BMap.ScaleControl())
    this.map.addControl(new BMap.NavigationControl())
    this.map.centerAndZoom(new BMap.Point(104.085145, 30.642301), 15) // 初始化地图,设置中心点坐标和地图级别
  },
  methods: {
    ready() {
      if (this.list.length > 0) {
        this.points = []
        for (var i = 0; i < this.list.length; i++) {
          var point = new BMap.Point(this.list[i].lng, this.list[i].lat)
          this.points.push(point)
        }
        // debugger
        //this.map.centerAndZoom(this.points[0], 10) // 初始化地图,设置中心点坐标和地图级别
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
        this.allOverlay = this.map.getOverlays()
      }
    },
    // 获取中心点
    setZoom(list) {
      if (list.length > 0) {
        let maxLng = list[0].lng
        let minLng = list[0].lng
        let maxLat = list[0].lat
        let minLat = list[0].lat
        let res
        for (let i = list.length - 1; i >= 0; i--) {
          res = list[i]
          if (res.lng > maxLng) {
            maxLng = res.lng
          }
          if (res.lng < minLng) {
            minLng = res.lng
          }
          if (res.lat > maxLat) {
            maxLat = res.lat
          }
          if (res.lat < minLat) {
            minLat = res.lat
          }
        }
        const cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2 // 缩放中心的精度
        const cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2 // 缩放中心的纬度
        let zoom = this.getZoom(maxLng, minLng, maxLat, minLat) // 缩放级别
        zoom = zoom + 1
        this.map.centerAndZoom(new BMap.Point(cenLng, cenLat), zoom) // 中心点和缩放级别
      } else {
        const myFun = (result) => {
          const cityName = result.name
          this.map.setCenter(cityName)
        }
        const myCity = new BMap.LocalCity()
        myCity.get(myFun)
      }
    },
    // 获取最佳缩放级别
    getZoom(maxLng, minLng, maxLat, minLat) {
      const zoom = ['50', '100', '200', '500', '1000', '2000', '5000',
        '10000', '20000', '25000', '50000', '100000', '200000',
        '500000', '1000000', '2000000'] // 级别18到3
      const pointA = new BMap.Point(maxLng, maxLat) // 创建点坐标A
      const pointB = new BMap.Point(minLng, minLat) // 创建点坐标B
      const distance = this.map.getDistance(pointA, pointB).toFixed(1) // 获取两点距离,保留小数点后两位
      for (let i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance > 0) {
          return 18 - i + 2 // 之所以会多2，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加2
        }
      }
    },
    // 点击播放
    play() {
      // debugger
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
    // 点击暂停
    pause() {
      this.isPlaying = false
      if (this.timer) {
        window.clearTimeout(this.timer)
      }
    },
    // 点击重置
    reset() {
      // this.isChecked = false
      this.isPlaying = false
      if (this.timer) {
        window.clearTimeout(this.timer)
      }
      this.index = 0
      this.speed = 2000
      this.car.setPosition(this.points[0])
      this.map.panTo(this.centerPoint)
      this.map.addOverlay(new BMap.Polyline(this.points, this.lineStyle))
    },
    formatSpeed(speed) {
      return speed / 10
    },
    // handleChangeSlider(val) {
    //   this.speed = 4000 - this.speed
    // },
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
    width: 500px;
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
  .label-row {
    padding: 10px 5px;
  }
}
.label-leftbox {
  margin: 10px;
  padding: 0 10px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  border-bottom-left-radius: 25px;
}
.allow-checkbox {
  padding-right: 0;
}
</style>
