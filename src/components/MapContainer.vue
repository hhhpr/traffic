<script setup>
import { onMounted, ref } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { Move, getInit } from "../utils/Road/road";
import { getMarker } from "../utils/Marker/getMarker";
import { getPositionList } from "@/api/position";
import { initFactoryAndCar, getFactoryAndCar } from "@/api/init";

let map = null;
const vehicleList = ref([]);  // 存储车辆信息的列表
const maxVehicleCount = 10;  // 限制显示的最大车辆信息数量

onMounted(async () => {
  window._AMapSecurityConfig = {
    securityJsCode: "cd5160e55ed690b22cb0f23ef9007cdd",
  };

  const AMap = await AMapLoader.load({
    key: "2409361ec538275b95222c72fc8fc322",
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.Driving", "AMap.MoveAnimation"],
  });

  // 初始化地图
  map = new AMap.Map("container", {
    resizeEnable: true,
    center: [104.065861, 30.657401],
    zoom: 11,
  });

  // 获取工厂点位信息
  getMarker(AMap, map);

  let flag = 0;

  // 定时请求后端并执行后续仿真操作
  intervalId = setInterval(async () => {
    if (flag < 10 || flag / 2 == 0) {
      await getInit(AMap, map, updateVehicleList);  // 传递回调来更新车辆信息
    } else {
      await getInit(AMap, map, updateVehicleList);
    }
  }, 5000);
});

// 用于更新车辆信息的回调函数
function updateVehicleList(info) {
  if (vehicleList.value.length >= maxVehicleCount) {
    // 超过最大数量，删除最旧的一个信息
    vehicleList.value.shift();
  }
  vehicleList.value.push(info);  // 每次更新时，添加新信息到列表中
}
</script>

<template>
  <div style="width: 50%; overflow: ">
    <div id="container"></div>
  </div>
  <div id="container2">
    <!-- 浮窗样式 -->
    <div v-if="vehicleList.length" class="info-layer">
      <div v-for="(info, index) in vehicleList" :key="index" class="vehicle-info">
        {{ info }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 地图容器样式，地图会全屏 */
#container {
  width: 1695px;
  height: 900px;
}
.amap-icon img {
  position: relative;
}
/* 浮窗样式 */
#container2 {
  position: absolute;
  top: 0;
  left: 0;
  width:50%;  /* 使浮窗占据八分之一宽度 */
  height: 25%; /* 使浮窗占据八分之一高度 */
  background-color: rgba(0, 0, 0, 0.7); /* 半透明背景 */
  z-index: 1000; /* 确保浮窗显示在地图之上 */
}

/* 车辆信息样式 */
.info-layer {
  width: 100%;
  height: 100%;
  overflow: auto; /* 内容超出时滚动 */
  color: white;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
}

.vehicle-info {
  margin-bottom: 10px;
}
</style>

