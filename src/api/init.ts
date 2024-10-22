import {http}from "@/utils/http"

export const initFactoryAndCar=()=>{
    return http.request(
        "get",
        "/init/start?factoryName=1",
        {}
    )
}

export type initData={
    factoryName:string;
    low:number;
}

export const getFactoryAndCar=(data: initData)=>{
    return http.request(
        "post",
        "/init/factoryAndCar",
        {data}
    )
}