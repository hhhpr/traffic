import { getwoodFacMarkerList,getfurFacMarkerList,getfurMarkerList } from "@/api/marker";

//获取和渲染工厂点位信息
export const getMarker = (AMap,map) => {
    getwoodFacMarkerList().then((res) => {
      console.log("wozhixingle1");
      res.data.data.forEach((element) => {
        const startIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(25, 34),
          // 图标的取图地址
          image: '/src/assets/fonts/iconfont/row.png',
          // 图标所用图片大小
          imageSize: new AMap.Size(30, 30),
          // 图标取图偏移量
          imageOffset: new AMap.Pixel(0, 0)
      });
        const marker = new AMap.Marker({
          position: new AMap.LngLat(element.longitude, element.latitude), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: element.name,
          icon: startIcon,
        });
        map.add(marker);
      });
    });
    getfurFacMarkerList().then((res) => {
      console.log("wozhixingle");
      const startIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(25, 34),
        // 图标的取图地址
        image: '/src/assets/fonts/iconfont/fur.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(30, 30),
        // 图标取图偏移量
        imageOffset: new AMap.Pixel(-2, 0)
    });
      res.data.data.forEach((element) => {
        const marker = new AMap.Marker({
          position: new AMap.LngLat(element.longitude, element.latitude), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: element.name,
          icon:startIcon,
        });
        map.add(marker);
      });
    });
    getfurMarkerList().then((res) => {
      console.log("wozhixingle2");
      const startIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(30, 30),
        // 图标的取图地址
        image: '/src/assets/fonts/iconfont/furMarket.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(30, 30),
        // 图标取图偏移量
        imageOffset: new AMap.Pixel(0, 0)
    });
      res.data.data.forEach((element) => {
        const marker = new AMap.Marker({
          position: new AMap.LngLat(element.longitude, element.latitude), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: element.name,
          icon:startIcon,
        });
        map.add(marker);
      });
    });
  };