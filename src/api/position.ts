import {http}from "@/utils/http"

//获取路径起止点坐标，进行路径渲染
export const getPositionList=()=>{
    return http.request(
        "get",
        "/PositionList",
        {}
    )
}