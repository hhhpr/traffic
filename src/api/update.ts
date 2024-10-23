import {http}from "@/utils/http"

export const updateTime=(data: any)=>{
    return http.request(
        "post",
        "/update/time",
        {data}
    )
}

export const updateIsReady=(data: any)=>{
    return http.request(
        "post",
        "/update/isReady",
        {data}
    )
}

export const updateGetGoods=(data: any)=>{
    return http.request(
        "post",
        "/update/getGoods",
        {data}
    )
}

