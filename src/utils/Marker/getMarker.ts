
import { getwoodFacMarkerList,getfurFacMarkerList,getfurMarkerList,getFacMarkerList } from "@/api/marker";

//获取和渲染工厂点位信息
export const getMarker = (AMap,map) => {
  getFacMarkerList().then((res) => {
    console.log("初始化工厂图标");
    const startIcon1 = new AMap.Icon({
      // 图标尺寸
      size: new AMap.Size(25, 34),
      // 图标的取图地址
      image: '/src/assets/fonts/iconfont/row.png',
      // 图标所用图片大小
      imageSize: new AMap.Size(30, 30),
      // 图标取图偏移量
      imageOffset: new AMap.Pixel(0, 0)
  });
    const startIcon2 = new AMap.Icon({
      // 图标尺寸
      size: new AMap.Size(25, 34),
      // 图标的取图地址
      image: '/src/assets/fonts/iconfont/fur.png',
      // 图标所用图片大小
      imageSize: new AMap.Size(30, 30),
      // 图标取图偏移量
      imageOffset: new AMap.Pixel(0, 0)
  });
    const startIcon3 = new AMap.Icon({
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
/*       console.log("这里是ele",element); */
      if(element.clas==1){
        const marker = new AMap.Marker({
          position: new AMap.LngLat(element.longitude, element.latitude), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: element.name,
          icon: startIcon1,
        });
         
        const createInfoWindow = (content: string) => {
          return new AMap.InfoWindow({
            content: content,  // 信息窗体的内容
            offset: new AMap.Pixel(30, 15),
            anchor: 'top-left',  // 锚点设置
          });
        };

        const infoContent = 
            `名称：${element.name}<br>
             地址：${element.address}<br>
             工厂级别：${element.clas}级<br>
             商品库存：${element.goodsInventory}<br>
             原料库存：${element.rawInventory}<br>
             总容量：${element.totalInventory}<br>
             原料转化比：${element.transRate}<br>
             `
    
         // 创建信息窗体并绑定到marker
         const infoWindow = createInfoWindow(infoContent);
    
         // 鼠标点击marker时弹出自定义信息窗体
         marker.on('click', () => {
           infoWindow.open(map, marker.getPosition());
         });

        map.add(marker);
      }else if(element.clas==2){
        const marker = new AMap.Marker({
          position: new AMap.LngLat(element.longitude, element.latitude), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: element.name,
          icon: startIcon2,
        });

        const createInfoWindow = (content: string) => {
          return new AMap.InfoWindow({
            content: content,  // 信息窗体的内容
            offset: new AMap.Pixel(30, 15),
            anchor: 'top-left',  // 锚点设置
          });
        };

        const infoContent = 
            `名称：${element.name}<br>
             地址：${element.address}<br>
             工厂级别：${element.clas}级<br>
             商品库存：${element.goodsInventory}<br>
             原料库存：${element.rawInventory}<br>
             总容量：${element.totalInventory}<br>
             原料转化比：${element.transRate}<br>
             `
    
         // 创建信息窗体并绑定到marker
         const infoWindow = createInfoWindow(infoContent);
    
         // 鼠标点击marker时弹出自定义信息窗体
         marker.on('click', () => {
           infoWindow.open(map, marker.getPosition());
         });

        map.add(marker);
      }else{
        const marker = new AMap.Marker({
          position: new AMap.LngLat(element.longitude, element.latitude), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: element.name,
          icon: startIcon3,
        });

        const createInfoWindow = (content: string) => {
          return new AMap.InfoWindow({
            content: content,  // 信息窗体的内容
            offset: new AMap.Pixel(30, 15),
            anchor: 'top-left',  // 锚点设置
          });
        };

        const infoContent = 
            `名称：${element.name}<br>
             地址：${element.address}<br>
             工厂级别：${element.clas}级<br>
             商品库存：${element.goodsInventory}<br>
             总容量：${element.totalInventory}<br>
             `
    
         // 创建信息窗体并绑定到marker
         const infoWindow = createInfoWindow(infoContent);
    
         // 鼠标点击marker时弹出自定义信息窗体
         marker.on('click', () => {
           infoWindow.open(map, marker.getPosition());
         });

        map.add(marker);
      }
    });
  });
    // getwoodFacMarkerList().then((res) => {
    //   console.log("wozhixingle1");
    //   res.data.data.forEach((element) => {
    //     const startIcon = new AMap.Icon({
    //       // 图标尺寸
    //       size: new AMap.Size(25, 34),
    //       // 图标的取图地址
    //       image: '/src/assets/fonts/iconfont/row.png',
    //       // 图标所用图片大小
    //       imageSize: new AMap.Size(30, 30),
    //       // 图标取图偏移量
    //       imageOffset: new AMap.Pixel(0, 0)
    //   });

    //   const marker = new AMap.Marker({
    //       position: new AMap.LngLat(element.longitude, element.latitude), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    //       title: element.name,
    //       icon: startIcon,
    //     });
    //     map.add(marker);
    //   });
    // });
    // getfurFacMarkerList().then((res) => {
    //   console.log("wozhixingle");
    //   const startIcon = new AMap.Icon({
    //     // 图标尺寸
    //     size: new AMap.Size(25, 34),
    //     // 图标的取图地址
    //     image: '/src/assets/fonts/iconfont/fur.png',
    //     // 图标所用图片大小
    //     imageSize: new AMap.Size(30, 30),
    //     // 图标取图偏移量
    //     imageOffset: new AMap.Pixel(-2, 0)
    // });
    //   res.data.data.forEach((element) => {
    //     const marker = new AMap.Marker({
    //       position: new AMap.LngLat(element.longitude, element.latitude), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    //       title: element.name,
    //       icon:startIcon,
    //     });
    //     map.add(marker);
    //   });
    // });
    // getfurMarkerList().then((res) => {
    //   console.log("wozhixingle2");
    //   const startIcon = new AMap.Icon({
    //     // 图标尺寸
    //     size: new AMap.Size(30, 30),
    //     // 图标的取图地址
    //     image: '/src/assets/fonts/iconfont/furMarket.png',
    //     // 图标所用图片大小
    //     imageSize: new AMap.Size(30, 30),
    //     // 图标取图偏移量
    //     imageOffset: new AMap.Pixel(0, 0)
    // });
    //   res.data.data.forEach((element) => {
    //     const marker = new AMap.Marker({
    //       position: new AMap.LngLat(element.longitude, element.latitude), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    //       title: element.name,
    //       icon:startIcon,
    //     });
    //     map.add(marker);
    //   });
    // });
  };

