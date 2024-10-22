import {http}from "@/utils/http"

export const updateTimeAndIsready=(data: any)=>{
    return http.request(
        "post",
        "/update/timeAndIsready",
        {data}
    )
}