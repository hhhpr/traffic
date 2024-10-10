import {http}from "@/utils/http"

export const testApi=()=>{
    return http.request(
        "get",
        "/depts",
        {}
    )
}