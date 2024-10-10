import Axios, {
    AxiosInstance,
    AxiosRequestConfig,
    CustomParamsSerializer
  } from "axios";

  import {
    RequestMethods,
    PureHttpRequestConfig
  } from "./types";

import { stringify } from "qs";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
    baseURL: "http://localhost:8080/",
    // 请求超时时间
    timeout: 10000,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    },
    // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
    paramsSerializer: {
      serialize: stringify as unknown as CustomParamsSerializer
    }
  };

  class PureHttp {
  
    /** 保存当前Axios实例对象 */
    private static axiosInstance: AxiosInstance = Axios.create(defaultConfig)
  
    /** 通用请求工具函数 */
    public request<T>(
      method: RequestMethods,
      url: string,
      param?: AxiosRequestConfig,
      axiosConfig?: PureHttpRequestConfig
    ): Promise<T> {
      const config = {
        method,
        url,
        ...param,
        ...axiosConfig
      } as PureHttpRequestConfig;
  
      // 单独处理自定义请求/响应回调
      return new Promise((resolve, reject) => {
        PureHttp.axiosInstance
          .request(config)
          .then((response: undefined) => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }

  export const http=new PureHttp;