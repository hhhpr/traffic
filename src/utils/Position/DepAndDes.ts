import { getPositionList } from "@/api/position";

//获取和渲染工厂点位信息
export const getPosition =async (AMap,map) => {
    await getPositionList().then((res) => {
      res.data.data.forEach((element) => {
        console.log(element);
        const marker = new AMap.Marker({
          position: new AMap.LngLat(element.longitude, element.latitude), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: element.name,
        });
        map.add(marker);
      });
    });
  };