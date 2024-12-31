import { getwoodFacMarkerList, getfurFacMarkerList, getfurMarkerList } from "@/api/marker";

//获取和渲染工厂点位信息
export const getMarker = (AMap, map) => {
  // 创建信息窗体
  const createInfoWindow = (content: string) => {
    return new AMap.InfoWindow({
      content: content,  // 信息窗体的内容
      offset: new AMap.Pixel(30, 15),
      anchor: 'top-left',  // 锚点设置
    });
  };

  // 创建标记图标
  const createIcon = (imageUrl: string) => {
    return new AMap.Icon({
      size: new AMap.Size(25, 34), // 图标尺寸
      image: imageUrl,  // 图标的取图地址
      imageSize: new AMap.Size(30, 30), // 图标所用图片大小
      imageOffset: new AMap.Pixel(0, 0),  // 图标取图偏移量
    });
  };

  // 添加marker标记的公共函数
  const addMarker = (element: any, icon: AMap.Icon, infoContent: string) => {
    const marker = new AMap.Marker({
      position: new AMap.LngLat(element.longitude, element.latitude),
      title: element.name,
      icon: icon,
    });

    // 创建信息窗体并绑定到marker
    const infoWindow = createInfoWindow(infoContent);

    // 鼠标点击marker时弹出自定义信息窗体
    marker.on('click', () => {
      infoWindow.open(map, marker.getPosition());
    });

    map.add(marker);
  };


// 获取并渲染木材工厂标记
getwoodFacMarkerList().then((res) => {
  console.log("木材工厂", res);
  res.data.data.forEach((element) => {
    const startIcon = createIcon('/src/assets/fonts/iconfont/row.png');
    const content = 
      `名称：${element.name}<br>
      地址：${element.address}`;
    addMarker(element, startIcon, content);
  });
});

// 获取并渲染家具工厂标记
getfurFacMarkerList().then((res) => {
  console.log("家具工厂", res);
  res.data.data.forEach((element) => {
    const startIcon = createIcon('/src/assets/fonts/iconfont/fur.png');
    const content = 
      `名称：${element.name}<br>
      地址：${element.address}`;
    addMarker(element, startIcon, content);
  });
});

// 获取并渲染家具市场标记
getfurMarkerList().then((res) => {
  console.log("家具市场", res);
  res.data.data.forEach((element) => {
    const startIcon = createIcon('/src/assets/fonts/iconfont/furMarket.png');
    const content = 
      `名称：${element.name}<br>
      地址：${element.address}`;
    addMarker(element, startIcon, content);
  });
});
};