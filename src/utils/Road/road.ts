//生成轨迹并运动
export const Move=async(AMap, map, position)=>{
  console.log(position.data.data);
  //获取路径信息并转化
  position.data.data.forEach(async element => {
    const result = await getRoad(AMap, map, element.depPosition, element.desPosition);
    const AtRoad = await pathToAt(result.routes[0].steps);
    //轨迹回放
    const temp=await ReRoad(AMap, map, AtRoad);
    console.log("temp2",temp);
  });
}

//获取路径规划信息
export const getRoad = (AMap, map,startLngLat,endLngLat) => {
    return new Promise((resolve, reject) => {
      AMap.plugin("AMap.Driving", function () {
        var driving = new AMap.Driving({
          policy: 0, //驾车路线规划策略，0是速度优先的策略
          map: map,
        });
        var opts = {
          // waypoints: [[116.397455, 39.909187]], //途经点参数，最多支持传入16个途经点
        };
        driving.search(startLngLat, endLngLat, opts, function (status, result) {
          //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
          //查询成功时，result 即为对应的驾车导航信息
          if (status === 'complete') {
            console.log("zheli", result);
            resolve(result);
          } else {
            reject(new Error('Failed to get driving route'));
          }
        });
      });
    });
  };

//处理路径信息，生成经纬度路径
export const pathToAt=(steps)=>{
  return new Promise((resolve,reject)=>{
    const AtRoad=[];
    steps.forEach(step => {
      step.path.forEach(st=>{
        AtRoad.push([st.lng,st.lat]);
      })
    });
    resolve(AtRoad);
  }
)
}

//轨迹回放
export const ReRoad=(AMap,map,AtRoad)=>{
  return new Promise((resolve,reject)=>{
    const marker = new AMap.Marker({
    map: map,
    position: AtRoad[0],
    icon: "https://webapi.amap.com/images/car.png",
    offset: new AMap.Pixel(-26, -13),
    autoRotation: false,
    angle:-90
    }); 

    // 绘制轨迹
    var polyline = new AMap.Polyline({
        map: map,
        path: AtRoad,
        showDir:true,
        strokeColor: "#28F",  //线颜色
        // strokeOpacity: 1,     //线透明度
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
    marker.on('moving', function (e) {
      passedPolyline.setPath(e.passedPath);
  });

  map.setFitView();
  marker.moveAlong(AtRoad,2);
  resolve("nihao");
  }

  )
}