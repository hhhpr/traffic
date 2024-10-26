<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { testApi } from "../api/test";
import { ref } from "vue";
import { Move, getInit } from "../utils/Road/road";
import { getMarker } from "../utils/Marker/getMarker";
import { getPositionList } from "@/api/position";
import { initFactoryAndCar, getFactoryAndCar } from "@/api/init";

let map = null;

onMounted(async () => {
  window._AMapSecurityConfig = {
    securityJsCode: "cd5160e55ed690b22cb0f23ef9007cdd",
  };

  const AMap = await AMapLoader.load({
    key: "2409361ec538275b95222c72fc8fc322", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale", "AMap.Driving", "AMap.MoveAnimation"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  });

  // 初始化地图
  map = new AMap.Map("container", {
    resizeEnable: true,
    center: [104.065861, 30.657401],
    zoom: 11,
  });

  // 获取工厂点位信息，并使用不同图标区分不同等级的工厂
  getMarker(AMap, map);

  //请求初始化工厂和车辆信息，每个工厂随机生成一个时间节点，到达此时间后表示该工厂有货物准备运输
  await initFactoryAndCar();

  var reqBody = [
    { factoryName: "woodfactory1", low: 15 },
    { factoryName: "furniturefactory", low: 15 },
  ];

  var flag = 0;
  // 定时发送请求，向后端请求已经准备好运输货物的工厂和车辆并执行后续仿真操作
  intervalId = setInterval(async () => {
    if (flag < 10 || flag / 2 == 0) {
      await getInit(AMap, map, reqBody[0], false);
    } else {
      await getInit(AMap, map, reqBody[1], false);
    }
  }, 5000); // 每隔 5 秒发送一次请求
});
</script>

<template>
  <!-- <button @click="getMarker()">nihao</button> -->
  <div style="width: 50%; overflow: "><div id="container"></div></div>
</template>

<style>
#container {
  width: 1695px;
  height: 900px;
}
.amap-icon img {
  position: relative;
}
</style>

