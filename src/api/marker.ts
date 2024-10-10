import {http}from "@/utils/http"

export const getwoodFacMarkerList=()=>{
    return http.request(
        "get",
        "/woodFacMarkerList",
        {}
    )
}
export const getfurFacMarkerList=()=>{
    return http.request(
        "get",
        "/furFacMarkerList",
        {}
    )
}
export const getfurMarkerList=()=>{
    return http.request(
        "get",
        "/furMarkerList",
        {}
    )
}