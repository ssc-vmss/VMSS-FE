<template>
  <div class="map-view">
    <div class="conf-form">
      <div class="conf-form-row">
        <input type="text" class="conf-form-input" id="suggestId" placeholder="搜索地址" />
        <div id="searchResult"></div>
        <button :disabled="!(isadd||isedit)||overlays.length==0" class="btn" @click="remove">区域清除</button>
        <!-- <button class="btn" @click="remove">区域清除</button> -->
      </div>
    </div>
    <div id="allmap" ref="map"></div>
  </div>
</template>

<script>
export default {
  props: {
    isadd: Boolean,
    isedit: Boolean
  },
  data() {
    return {
      hasOverlays: false,
      location: '',
      overlays: [], // 点位信息
      map: null, // 创建Map实例
      drawingManager: null, // 实例化鼠标绘制工具
      styleOptions: {
        strokeColor: 'rgb(47,79,79)', // 边线颜色。
        fillColor: 'rgb(0,128,128)', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.5, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.2, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      },
      polygon: []
    }
  },
  mounted() {
    this.ready()
  },
  methods: {
    ready() {
      var map = new BMap.Map("allmap", { enableMapClick: false }) // 创建Map实例
      var point = new BMap.Point(104.085145, 30.642301)
      map.centerAndZoom(point, 15) // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom() // 启用鼠标滚动对地图放大缩小
      map.addControl(new BMap.ScaleControl())
      map.addControl(new BMap.NavigationControl())
      function myFun(result) {
        var cityName = result.name
        map.setCenter(cityName)
      }
      var myCity = new BMap.LocalCity()
      myCity.get(myFun)
      function G(id) {
        return document.getElementById(id)
      }
      var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
        {          'input': 'suggestId', 'location': map
        })
      ac.addEventListener('onhighlight', function (e) { // 鼠标放在下拉列表上的事件
        var str = ''
        var _value = e.fromitem.value
        var value = ''
        if (e.fromitem.index > -1) {
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value
        value = ''
        if (e.toitem.index > -1) {
          _value = e.toitem.value
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
        G('searchResult').innerHTML = str
      })
      var myValue
      ac.addEventListener('onconfirm', function (e) { // 鼠标点击下拉列表后的事件
        var _value = e.item.value
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business
        G('searchResult').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue
        setPlace()
      })
      function setPlace() {
        // debugger
        var allOverlay = map.getOverlays()
        for (var i = 0; i < allOverlay.length; i++) {
          if (allOverlay[i].toString() == '[object Marker]') {
            map.removeOverlay(allOverlay[i])
          }
        }
        function myFun() {
          var pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
          map.centerAndZoom(pp, 14)
          map.addOverlay(new BMap.Marker(pp)) // 添加标注
        }
        var local = new BMap.LocalSearch(map, { // 智能搜索
          onSearchComplete: myFun
        })
        local.search(myValue)
      }
      // 实例化鼠标绘制工具
      // this.drawingManager = new BMapLib.DrawingManager(map, {
      //   isOpen: false, // 是否开启绘制模式
      //   polygonOptions: this.styleOptions, // 多边形的样式
      // })
      // 添加鼠标绘制工具监听事件，用于获取绘制结果
      // this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete)
      this.map = map
    },
    // 保存
    save() {
      this.polygon.disableEditing()
      var mypoints = []
      var allOverlay = this.map.getOverlays()
      console.log('allOverlay', allOverlay)
      for (var i = 0; i < allOverlay.length; i++) {
        if (allOverlay[i].toString() === '[object Polygon]') {
          for (var j = 0; j < allOverlay[i].getPath().length; j++) {
            mypoints[j] = allOverlay[i].getPath()[j].lng + ',' + allOverlay[i].getPath()[j].lat
          }
          mypoints = mypoints.join(';')
        }
      }
      this.location = mypoints
      this.$emit('handleGetLocation', this.location)
    },
    // 添加
    add() {
      // 实例化鼠标绘制工具
      this.drawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: true, // 是否开启绘制模式
        polygonOptions: this.styleOptions // 多边形的样式
      })

      this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete)
      if (this.overlays.length > 0) {
        this.map.clearOverlays()
        this.overlays = []
      }
      // this.drawingManager.open()// 开启地图的绘制模式
      this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON)// 绘制多边形
    },

    // 展示
    show(location) {
      if (this.overlays.length > 0) {
        this.overlays = []
        this.map.clearOverlays()
      }
      var str = []
      str = location.split(';')// 坐标点通过分号分割
      for (var i = 0; i < str.length; i++) {
        this.map.centerAndZoom(new BMap.Point(str[i].split(',')[0], str[i].split(',')[1]), 15) // 分割后的坐标作为起始坐标
        this.overlays.push(new BMap.Point(str[i].split(',')[0], str[i].split(',')[1])) // 循环数组中每一组的坐标
      }
      this.polygon = new BMap.Polygon(this.overlays, this.styleOptions)// 展示围栏
      this.map.addOverlay(this.polygon)
    },
    // 编辑
    edit() {
      this.polygon.enableEditing()
    },
    // 清除覆盖物
    remove() {
      this.overlays = []
      this.map.clearOverlays()
      this.$emit('handleGetLocation', '')
      if (this.isadd || this.isedit) {
        this.$emit('handleRemove')
        this.add()
      }
    },
    overlaycomplete(e) {
      console.log('overlaycomplete')
      var path = e.overlay.getPath()// Array<Point> 返回多边型的点数组
      if (path.length > 2) {
        this.overlays.push(path)
        this.polygon = new BMap.Polygon(path, this.styleOptions)
        this.map.addOverlay(this.polygon)// 画线
        // 保存多变形坐标点
        var pll = []
        for (var i = 0; i < path.length; i++) {
          pll[i] = (path[i].lng + ',' + path[i].lat)
        }
        pll = pll.join(';')
        this.location = pll
      } else {
        this.map.clearOverlays()
        this.overlays = []
        this.location = ''
        this.add();
      }
      this.$emit('handleGetLocation', this.location)
    }
  }
}
</script>
<style lang="scss" scoped>
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
      margin: 5px;
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
