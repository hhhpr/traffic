import {http}from "@/utils/http"

//��ȡ·����ֹ�����꣬����·����Ⱦ
export const getPositionList=()=>{
    return http.request(
        "get",
        "/PositionList",
        {}
    )
}