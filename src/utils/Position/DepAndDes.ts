import { getPositionList } from "@/api/position";

//��ȡ����Ⱦ������λ��Ϣ
export const getPosition =async (AMap,map) => {
    await getPositionList().then((res) => {
      res.data.data.forEach((element) => {
        console.log(element);
        const marker = new AMap.Marker({
          position: new AMap.LngLat(element.longitude, element.latitude), //��γ�ȶ���Ҳ�����Ǿ�γ�ȹ��ɵ�һά����[116.39, 39.9]
          title: element.name,
        });
        map.add(marker);
      });
    });
  };