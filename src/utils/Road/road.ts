import {getFactoryAndCar,initFactoryAndCar}from "@/api/init"
import {updateGetGoods, updateIsReady, updateTime}from "@/api/update"

//Move用于路径规划、播放动画，动画完成后向后端发起请求，更改工厂车辆的相关信息
export const Move=async(AMap:any, map:any, position:any,ids:any,isGoods:boolean)=>{
  //获取路径信息并转化
  for(let i=0;i<position.length;i++){
    const result = await getRoad(AMap, map, position[i].depPosition, position[i].desPosition);
    const AtRoad = await pathToAt(result.routes[0].steps);
    //轨迹回放
    const temp=await ReRoad(AMap, map, AtRoad,ids[i],isGoods);
  }
}

//调用高德api获取路径规划信息
export const getRoad = (AMap:any, map:any,startLngLat:number,endLngLat:number) => {
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
export const pathToAt=(steps:any)=>{
  return new Promise((resolve,reject)=>{
    const AtRoad=[];
    steps.forEach(step => {
      step.path.forEach(st=>{
        AtRoad.push([st.lng,st.lat]);
      })
    });
    console.log(AtRoad.length);
    console.log(AtRoad[AtRoad.length-1],AtRoad[AtRoad.length-2],AtRoad[AtRoad.length-3])
    resolve(AtRoad);
  }
)
}

//调用高德api进行轨迹回放，动画播放完成后进行判定（isGoods），true表示当前车辆有货，本次动画执行后代表车辆完成了本次运输，发起请求向后端释放车辆状态。
//false表示本次车辆没有载货，本次动画是代表车辆前往工厂取货，向后端发起请求取货并获取目的地工厂，再次调用Move函数进行轨迹回放，并置isGoods为true
export const ReRoad=(AMap:any,map:any,AtRoad:any,ids:any,isGoods:boolean)=>{
  return new Promise((resolve,reject)=>{

    const marker = new AMap.Marker({
      map: map,
      position: AtRoad[0],
      icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
      offset: new AMap.Pixel(-13, -26)
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

    var endMark=0;
    var Mark=false;

  marker.on('moving', function (e) {
    passedPolyline.setPath(e.passedPath);
    endMark++;
    if(endMark>=AtRoad.length-5&&!Mark){
      const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      };
      sleep(2000);
      map.remove(marker);
      map.remove(polyline);
      map.remove(passedPolyline);
      Mark=true;
      if(!isGoods){
        updateTime(ids);
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
          Move(AMap,map,positionResult,id,true);
        });
      }else{
        updateIsReady(ids);
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
export const getInit= async (AMap:any, map:any,data:any,isGoods:boolean)=>{
  var res = await getFactoryAndCar(data);

  console.log(res,data);

  if(res.data.data.length==2){
    var positionResult=[res.data.data[0].length];
    var ids=[];
    for(let i=0;i<res.data.data[0].length;i++){
      positionResult[i]={
        depPosition:[res.data.data[1][i].longitude, res.data.data[1][i].latitude],
        desPosition:[res.data.data[0][i].longitude, res.data.data[0][i].latitude]
      }
      ids[i]={
        carId:res.data.data[1][i].id,
        factoryId:res.data.data[0][i].id,
        longitude:res.data.data[0][i].longitude,
        latitude:res.data.data[0][i].latitude,
        clas:res.data.data[0][i].clas
      }
    }
    Move(AMap, map, positionResult, ids,isGoods);
  }

}