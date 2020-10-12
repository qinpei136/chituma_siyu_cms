<template>
  <div>
    <div id="map-chitu"></div>
  </div>
</template>
<script>
export default {
  name: "Amap",
  data() {
    return {
      activities: 4,
    };
  },
  mounted() {
    this.newMap();
  },
  methods: {
    newMap() {
      var map = new AMap.Map("map-chitu", {
        zoom: 5,
        resizeEnable: true,
        // ,center: [116.405285, 39.904989] // 中心点坐标
      });
      var that = this;
      var geocoder = new AMap.Geocoder({});
      function showInfoMove(e) {
        var ponit = [e.lnglat.getLng(), e.lnglat.getLat()];
        // console.log(ponit);
        geocoder.getAddress(ponit, function (status, result) {
          if (status === "complete" && result.regeocode) {
            // var address = result.regeocode.formattedAddress;
            // document.getElementById("address").value = address;
            var addr = result.regeocode.addressComponent.province;
            if (addr) {
              that.$message.success(`可以到${addr}`);
            }
          } else {
            console.error("根据经纬度查询地址失败");
          }
        });
      }
      map.on("click", showInfoMove);
      map.on("complete", function () {
        var lnglats = [
          [116.39, 39.92],
          [116.41, 39.93],
          [116.43, 39.91],
          [116.46, 39.93],
        ];
        var markers = [];

        for (var i = 0; i < lnglats.length; i++) {
          var lnglat = lnglats[i];
          // 创建点实例
          var marker = new AMap.Marker({
            icon:
              "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
            position: new AMap.LngLat(lnglat[0], lnglat[1]),
            extData: {
              id: i + 1,
            },
          });
          // marker.setIcon(
          //   "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png"
          // );
          marker.setMap(map);
          // 设置鼠标划过点标记显示的文字提示
          marker.setTitle("我是marker的title");

          // 设置label标签

          // label默认蓝框白底左上角显示，样式className为：amap-marker-label
          // marker.setLabel({
          //   offset: new AMap.Pixel(10, 5), // 设置文本标注偏移量
          //   // https://www.amap.com/search?id=B0FFI8DGV4&city=110105&geoobj=116.401948|40.035403|116.447267|40.05321&query_type=IDQ&query=北京微油科技服务有限公司&zoom=15
          //   content: `<div class='info' >第${i}个</div> `, // 设置文本标注内容
          //   direction: "right" // 设置文本标注方位
          // });

          markers.push(marker);
        }

        // 创建覆盖物群组，并将 marker 传给 OverlayGroup
        var overlayGroups = new AMap.OverlayGroup(markers);
        map.add(overlayGroups);
        // map.setFitView();
      });
      function Make(datas) {
        map.on("complete", function () {
          var lnglats = [
            [116.39, 39.92],
            [116.41, 39.93],
            [116.43, 39.91],
            [116.46, 39.93],
          ];
          var markers = [];

          for (var i = 0; i < lnglats.length; i++) {
            var lnglat = lnglats[i];
            // 创建点实例
            var marker = new AMap.Marker({
              icon:
                "https://zdmobile.lifeweek.com.cn/appforzd/img/userImg.png?imageView2/1/w/80/h/80",
              position: new AMap.LngLat(lnglat[0], lnglat[1]),
              extData: {
                id: i + 1,
              },
            });
            marker.setIcon(
              "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png"
            );
            marker.setMap(map);
            // 设置鼠标划过点标记显示的文字提示
            marker.setTitle("我是marker的title");
            // 设置label标签

            // label默认蓝框白底左上角显示，样式className为：amap-marker-label
            marker.setLabel({
              offset: new AMap.Pixel(10, 5), // 设置文本标注偏移量
              // https://www.amap.com/search?id=B0FFI8DGV4&city=110105&geoobj=116.401948|40.035403|116.447267|40.05321&query_type=IDQ&query=北京微油科技服务有限公司&zoom=15
              content: `<div class='info' >第${i}个</div> `, // 设置文本标注内容
              direction: "right", // 设置文本标注方位
            });

            markers.push(marker);
          }

          // 创建覆盖物群组，并将 marker 传给 OverlayGroup
          var overlayGroups = new AMap.OverlayGroup(markers);
          map.add(overlayGroups);
        });
      }
      return Make;
    },
  },
};
</script>
<style>
.amap-icon img {
  width: 28px;
}
</style>
<style lang="scss" scoped>
#map-chitu {
  width: 100%;
  height: 36rem;
  border: 0;
  margin: 0;
  padding: 0;
}
</style>
