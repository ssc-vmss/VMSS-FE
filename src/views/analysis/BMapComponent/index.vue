<template>
  <div class="map-view">
    <div class="conf-form">
      <div class="conf-form-row">
      </div>
    </div>
    <div id="allmap" ref="map"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasOverlays: false,
      location: '',
      overlays: [], // 点位信息
      map: null, // 创建Map实例
      // list: [
      //   {
      //     'id': '4d7986d6f97e41ce96b03b03184bc301',
      //     'speed': null,
      //     'state': '2',
      //     'driverId': null,
      //     'driverName': null,
      //     'posTime': null,
      //     'vehicleId': 'B',
      //     'plateNumber': 'B002',
      //     'plateType': null,
      //     'plateBrand': null,
      //     'volume': null,
      //     'orgId': null,
      //     'createTime': '2018-09-12 14:24:26',
      //     'location': '104.051934,30.64888830',
      //     'lng': '104.052934',
      //     'lat': '30.64888830'
      //   }, {
      //     'id': '360c87bf3b9a4aae9d0a47d6b4ae3d56',
      //     'speed': 0,
      //     'state': '1',
      //     'driverId': 'driverId',
      //     'driverName': 'driverName',
      //     'posTime': null,
      //     'vehicleId': 'A',
      //     'plateNumber': 'A001',
      //     'plateType': 'plateType',
      //     'plateBrand': 'plateBrand',
      //     'volume': 0,
      //     'orgId': 'orgId',
      //     'createTime': '2018-09-12 14:23:26',
      //     'location': '104.051944,30.64888830',
      //     'lng': '104.051944',
      //     'lat': '30.64888830'
      //   }
      // ], // 数据接收点
      imgPath: '' // 创建标注点并添加到地图中
    }
  },
  mounted() {
    this.ready()
  },
  methods: {
    ready() {
      const map = new BMap.Map("allmap", { enableMapClick: false }) // 创建Map实例
      const point = new BMap.Point(104.085145, 30.642301)
      map.centerAndZoom(point, 15) // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom() //启用鼠标滚动对地图放大缩小
      map.addControl(new BMap.ScaleControl())
      map.addControl(new BMap.NavigationControl())
      this.map = map
      this.setZoom(this.list)
      this.addMarker(this.list)
      this.map = map
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
        const zoom = this.getZoom(maxLng, minLng, maxLat, minLat) // 缩放级别
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
    addMarker(list) {
      console.log(this.list)
      for (let i = 0; i < list.length; i++) {
        const nowPoint = new BMap.Point(list[i].lng, list[i].lat)
        // console.log(this.list)
        if (this.list[i].state === '0') {
          this.imgPath = '0.png' // 图片路径
        } else if (list[i].state === '1') {
          this.imgPath = 'src/assets/images/1.png'
        } else {
          this.imgPath = 'src/assets/images/2.png'
        }
        const myIcon = new BMap.Icon(this.imgPath, new BMap.Size(52, 26), {
          anchor: new BMap.Size(25, 15)
        })
        const marker = new BMap.Marker(nowPoint, {
          icon: myIcon
        })
        this.map.addOverlay(marker);
        // 循环添加监听事件
        (function () {
          let thePoint = list[i]
          marker.addEventListener('click', function () {
            this.showInfo(this, thePoint) // 展示车辆信息
            let q = this.map.getZoom()
            console.log(q)
          })
        })()
      }
    },
    showInfo(thisMarker, points) {
      // 获取点的信息
      const vehicleInfo = '车牌号码：' + points.plateNumber + '<br />' + '车辆品牌：' + points.plateBrand + '<br />' + '行驶速度：' + points.speed + '<br />' + '司机姓名：' + points.driverName + '<br />'
      const infoWindow = new BMap.InfoWindow(vehicleInfo)
      thisMarker.openInfoWindow(infoWindow)
    }
  }
}
</script>
<style lang="scss" scoped>
.map-view {
  display: block;
  height: 100%;
  padding: 10px;
}
#allmap {
  width: 100%;
  padding-right: 500px;
  height: 100%;
  position: relative;
  margin-top: -40px;
}
.conf-form {
  .conf-form-row {
    width: 400px;
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
#searchResult {
  border: 1px solid #c0c0c0;
  width: 150px;
  height: auto;
  display: none;
}
</style>
