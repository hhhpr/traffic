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
    // 设置地图容器id
    viewMode: "3D", // 是否为3D地图模式
    zoom: 11, // 初始化地图级别
    center: [104.065861, 30.657401], // 初始化地图中心点位置
  });

  // 获取工厂点位信息
  getMarker(AMap, map);

  //请求初始化工厂和车辆信息
  await initFactoryAndCar();
  getInit(AMap, map);

  // 定时发送请求
  intervalId = setInterval(async () => {
    // 在这里发送你的请求，例如调用一个 API 函数
    console.log("nihao");
  }, 5000); // 每隔 10 秒发送一次请求
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
</style>

