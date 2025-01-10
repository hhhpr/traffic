import { getFactoryAndCar, initFactoryAndCar, getTotalOrders } from "@/api/init"
import { updateGetGoods, updateIsReady, updateTime, updateOrder } from "@/api/update"

//Move用于路径规划、播放动画，动画完成后向后端发起请求，更改工厂车辆的相关信息
export const Move = async (AMap: any, map: any, position: any, ids: any) => {
  //获取路径信息并转化
  for (let i = 0; i < position.length; i++) {
    const result = await getRoad(AMap, map, ids[i].carPosition, position[i].depPosition);
    console.log("zanting", result);
    const AtRoad = await pathToAt(result.routes[0].steps);
    //轨迹回放
    const temp = await ReRoad(AMap, map, AtRoad, position[i], ids[i]);
  }
}

export const reMove = async (AMap: any, map: any, position: any, ids: any) => {
  const result = await getRoad(AMap, map, position.depPosition, position.desPosition);
  const AtRoad = await pathToAt(result.routes[0].steps);
  //轨迹回放
  const temp = await ReRoad(AMap, map, AtRoad, position, ids);
}

//调用高德api获取路径规划信息
export const getRoad = (AMap: any, map: any, startLngLat: number, endLngLat: number) => {
  return new Promise((resolve, reject) => {
    AMap.plugin("AMap.Driving", function () {
      var driving = new AMap.Driving({
        policy: 0, //驾车路线规划策略，0是速度优先的策略
      });
      var opts = {
        // waypoints: [[116.397455, 39.909187]], //途经点参数，最多支持传入16个途经点
      };
      driving.search(startLngLat, endLngLat, opts, function (status, result) {
        //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
        //查询成功时，result 即为对应的驾车导航信息
        if (status === 'complete') {
          console.log("zheli", result);
          map.remove(result);
          resolve(result);
        } else {
          reject(new Error('Failed to get driving route'));
        }
      });
    });
  });
};

//利用getRoad函数返回的路径信息，生成经纬度路径，便于ReRoad播放动画
export const pathToAt = (steps: any) => {
  return new Promise((resolve, reject) => {
    const AtRoad = [];
    steps.forEach(step => {
      step.path.forEach(st => {
        AtRoad.push([st.lng, st.lat]);
      })
    });
    console.log("new", AtRoad.length);
    console.log(AtRoad[AtRoad.length - 1], AtRoad[AtRoad.length - 2], AtRoad[AtRoad.length - 3])
    resolve(AtRoad);
  }
  )
}

//调用高德api进行轨迹回放，动画播放完成后进行判定（isGoods），true表示当前车辆有货，本次动画执行后代表车辆完成了本次运输，发起请求向后端释放车辆状态。
//false表示本次车辆没有载货，本次动画是代表车辆前往工厂取货，向后端发起请求取货并获取目的地工厂，再次调用Move函数进行轨迹回放，并置isGoods为true
export const ReRoad = (AMap: any, map: any, AtRoad: any, position: any, ids: any) => {
  return new Promise((resolve, reject) => {

    const marker = new AMap.Marker({
      map: map,
      position: AtRoad[0],
      icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
      offset: new AMap.Pixel(-13, -26)
    });

    const createInfoWindow = (content: string) => {
      return new AMap.InfoWindow({
        content: content,  // 信息窗体的内容
        offset: new AMap.Pixel(30, 15),
        anchor: 'top-left',  // 锚点设置
      });
    };

    const infoContent =
      `货物：${ids.goodname}<br>
     车辆品牌：${ids.cartype}<br>
     起始地点：${ids.startfactoryname}<br>
     目标地点：${ids.endfactoryname}<br>
     运送货物数量：${ids.goodcount}<br>
     当前状态：${ids.isgoods === true ? "送货中" : "取货中"}<br>
     车辆id：${ids.carid}<br>
     `

    // 创建信息窗体并绑定到marker
    const infoWindow = createInfoWindow(infoContent);

    // 鼠标点击marker时弹出自定义信息窗体
    marker.on('click', () => {
      infoWindow.open(map, marker.getPosition());
    });

    // 绘制轨迹
    var polyline = new AMap.Polyline({
      map: map,
      path: AtRoad,
      showDir: true,
      strokeColor: "#28F",  //线颜色
      strokeOpacity: 1,     //线透明度
      strokeWeight: 6,      //线宽
      // strokeStyle: "solid"  //线样式
    });

    var passedPolyline = new AMap.Polyline({
      map: map,
      // path: lineArr,
      strokeColor: "#AF5",  //线颜色
      // strokeOpacity: 1,     //线透明度
      strokeWeight: 6,      //线宽
      // strokeStyle: "solid"  //线样式
    });

    var endMark = 0;
    var Mark = false;

    marker.on('moving', function (e) {
      passedPolyline.setPath(e.passedPath);
      endMark++;
      if (endMark >= AtRoad.length && !Mark) {
        console.log("sssssssssss")
        const sleep = (ms: number) => {
          return new Promise(resolve => setTimeout(resolve, ms));
        };
        sleep(2000);
        map.remove(marker);
        map.remove(polyline);
        map.remove(passedPolyline);
        Mark = true;
        if (ids.isgoods === false) {
          ids.isgoods = true;
          updateOrder({
            orderId: ids.orderId,
            state: "1"
          });
          /*         updateTime(ids);
                  updateGetGoods(ids).then(res=>{
                    console.log("这是取货后返回的数据",res);
                    var positionResult=[];
                    positionResult[0]={
                      depPosition:[ids.longitude,ids.latitude],
                      desPosition:[res.data.data.longitude,res.data.data.latitude]
                    }
                    var id=[];
                    id[0]={
                      carId:ids.carId,
                      factoryId:res.data.data.id,
                      longitude:res.data.data.longitude,
                      latitude:res.data.data.latitude,
                      clas:res.data.data.clas
                    }
                    console.log("ids和positionresult",ids,positionResult);
                    Move(AMap,map,positionResult,id);
                  }); */
          /*         Move(AMap,map,position,ids); */
          reMove(AMap, map, position, ids);
        } else {
          /*         updateIsReady(ids); */
          updateOrder({
            orderId: ids.orderId,
            state: "2"
          });
          console.log("else")
        }
      }
    });

    map.setFitView();
    marker.moveAlong(AtRoad, {
      // 每一段的时长
      duration: 1,//可根据实际采集时间间隔设置
      // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
      autoRotation: true,
    });

    resolve("nihao");
  }

  )
}

//向后端请求已经准备好运输货物的工厂和车辆并调用Move函数执行后续仿真操作
export const getInit = async (AMap: any, map: any, callback: Function) => {
  // 模拟从后端获取订单数据
  var res2 = await getTotalOrders();
  console.log("jj", res2);

  if (res2.data.length !== 0) {
    console.log("yes");

    // 创建一个数组来存储位置和车辆信息
    let positionResult = [];
    let ids = [];

    // 遍历每个订单，格式化数据并生成信息文本
    for (let i = 0; i < res2.data.length; i++) {
      positionResult[i] = {
        depPosition: [res2.data[i].order.startlongitude, res2.data[i].order.startlatitude],
        desPosition: [res2.data[i].order.endlongitude, res2.data[i].order.endlatitude],
      };

      ids[i] = {
        isgoods: false,
        orderId: res2.data[i].order.id,
        carid: res2.data[i].order.carid,
        cartype: res2.data[i].car.type,
        load: res2.data[i].car.load,
        factoryId1: res2.data[i].order.startfactoryid,
        factoryId2: res2.data[i].order.endfactoryid,
        carPosition: [res2.data[i].car.longitude, res2.data[i].car.latitude],
        carlongitude: res2.data[i].car.longitude,
        carlatitude: res2.data[i].car.latitude,
        sclas: res2.data[i].startFactory.clas,
        eclas: res2.data[i].endFactory.clas,
        goodname: res2.data[i].good.name,
        startfactoryname: res2.data[i].order.startfactoryname,
        endfactoryname: res2.data[i].order.endfactoryname,
        goodcount: res2.data[i].order.goodcount,
      };

      // 天气选项
      const weatherConditions = ['暴雨中', '大雨中', '下雪中', ''];

      // 使用当前时间戳对天气选项进行取模
      const randomWeather = weatherConditions[Math.floor(Date.now() / 1000) % weatherConditions.length];

      // 格式化信息文本，作为滚动显示的内容
      const infoText = `${res2.data[i].order.carid}号车从${res2.data[i].order.startfactoryname}到${res2.data[i].order.endfactoryname}，${randomWeather}运送 ${res2.data[i].good.name}，载货量: ${res2.data[i].order.goodcount}`;

      // 使用回调函数将车辆信息传递给前端展示
      callback(infoText);
    }

    console.log("Position Result:", positionResult);
    console.log("IDs:", ids);

    // 调用 Move 函数以更新地图上的车辆移动
    Move(AMap, map, positionResult, ids);

    console.log("完成.");
  }
};
