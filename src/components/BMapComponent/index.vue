<template>
  <div class="view">
    <div class="conf-form">
      <div class="conf-form-row">
        <span class="conf-form-label">搜索框</span>
        <input type="text" class="conf-form-input" id="suggestId" />
        <div id="searchResult"></div>
        <span class="conf-form-label">点位信息</span>
        <input id="pll" type="text" class="conf-form-input" disabled="disabled" />
        <button class="btn" onclick="add();">绘图</button>
        <!-- 用于选择区域名称后显示其对应的围栏 p为点位参数-->
        <button class="btn" onclick="show(p);">显示</button>
        <button class="btn" onclick="edit();">编辑</button>
        <button class="btn" onclick="remove();">删除</button>
      </div>
    </div>
    <div id="allmap"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.ready()
  },
  methods: {
    ready: function () {
      var map = new BMap.Map('allmap') // 创建Map实例
      var point = new BMap.Point(104.085145, 30.642301)
      map.centerAndZoom(point, 15) // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom() //启用鼠标滚动对地图放大缩小
      map.addControl(new BMap.ScaleControl())
      map.addControl(new BMap.NavigationControl())
      map.addControl(new BMap.MapTypeControl())
      function G(id) {
        return document.getElementById(id);
      }
      var ac = new BMap.Autocomplete( //建立一个自动完成的对象
        {          "input": "suggestId", "location": map
        });
      ac.addEventListener("onhighlight", function (e) { //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResult").innerHTML = str;
      });
      var myValue;
      ac.addEventListener("onconfirm", function (e) { //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResult").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        setPlace();
      });
      function setPlace() {
        var allOverlay = map.getOverlays();
        for (var i = 0; i < allOverlay.length; i++) {
          if (allOverlay[i].toString() == "[object Marker]") {
            map.removeOverlay(allOverlay[i]);
          }
        }
        function myFun() {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          map.centerAndZoom(pp, 14);
          map.addOverlay(new BMap.Marker(pp)); //添加标注
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
      // 绘制多变形
      var polygon = [];
      var overlays = [];	//点位信息
      var overlaycomplete = function (e) {
        var path = e.overlay.getPath();//Array<Point> 返回多边型的点数组
        if (path.length > 2) {
          overlays.push(path);
          polygon = new BMap.Polygon(path, styleOptions);
          map.addOverlay(polygon);//画线
          // 保存多变形坐标点
          var pll = new Array();
          for (var i = 0; i < path.length; i++) {
            pll[i] = (path[i].lng + "," + path[i].lat);
          }
          pll = pll.join(";");
          $("#pll").attr("value", pll);
        } else {
          map.clearOverlays();
          overlays = [];
          $("#pll").val(null);
        }
      };
      var styleOptions = {
        strokeColor: "red", //边线颜色。
        fillColor: "yellow", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      };
      //实例化鼠标绘制工具
      var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        polygonOptions: styleOptions, //多边形的样式
      });
      //添加鼠标绘制工具监听事件，用于获取绘制结果
      drawingManager.addEventListener('overlaycomplete', overlaycomplete);

      //清除覆盖物
      function remove() {
        if (confirm("是否确定清楚该区域？")) {
          map.clearOverlays();
          overlays = [];
          $("#pll").val(null);
        }
      }
      //添加
      function add() {
        if (overlays.length > 0) {
          if (confirm("此操作会清空已有的区域,是否继续")) {
            map.clearOverlays();
            overlays = [];
            drawingManager.open();//开启地图的绘制模式
            drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);//绘制多边形
          }
        } else {
          drawingManager.open();//开启地图的绘制模式
          drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);//绘制多边形
        }
      }
      //编辑
      function edit() {
        polygon.enableEditing();
      }
      map.addEventListener("rightclick", function () {
        polygon.disableEditing();
        var mypoints = new Array();
        var allOverlay = map.getOverlays();
        for (var i = 0; i < allOverlay.length; i++) {
          if (allOverlay[i].toString() == "[object Polygon]") {
            for (var j = 0; j < allOverlay[i].getPath().length; j++) {
              mypoints[j] = allOverlay[i].getPath()[j].lng + "," + allOverlay[i].getPath()[j].lat
            }
            mypoints = mypoints.join(";");
            $("#pll").attr("value", mypoints);
          }
        }
      });
      //展示
      function show(p) {
        // 		var p = "104.066568,30.651125;104.081731,30.650938;104.067359,30.642612";
        var str = [];
        str = p.split(";");// 坐标点通过分号分割
        for (var i = 0; i < str.length; i++) {
          map.centerAndZoom(new BMap.Point(str[i].split(",")[0], str[i].split(",")[1]), 15); // 分割后的坐标作为起始坐标
          overlays.push(new BMap.Point(str[i].split(",")[0], str[i].split(",")[1])); // 循环数组中每一组的坐标
        }
        polygon = new BMap.Polygon(overlays, styleOptions);// 展示围栏
        map.addOverlay(polygon);
      }
    }
  }

}
</script>
<style lang="scss" scoped>
.view {
  display: block;
}
#allmap {
  width: 100%;
  padding-right: 500px;
  height: calc(100% - 70px);
}
.conf-form {
  .conf-form-row {
    height: 50px;
    .conf-form-label {
      width: 70px;
    }
    .conf-form-input {
      width: 200px;
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
