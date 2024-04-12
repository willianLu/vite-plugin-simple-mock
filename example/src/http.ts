import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { isObject } from "../../lib/index";

/**
 * @description 自定义请求配置参数
 */
export type CustomAxiosRequestConfig<T = any> = AxiosRequestConfig<T> & {
  isFormData?: boolean;
  backOriginResponse?: boolean;
};

// 创建请求实例
const HttpRequest: AxiosInstance = axios.create({
  baseURL: "",
});

function buildFormData(data: Record<string | number | symbol, any>) {
  if (!isObject(data)) return "";
  const formData = new FormData();
  Object.keys(data).forEach((key: string) => {
    formData.set(key, JSON.stringify(data[key]));
  });
  return formData;
}

// 注册请求request拦截器
HttpRequest.interceptors.request.use((config: any) => {
  const { method, params, data, isFormData } = config;
  // 根据请求类型，取不同的参数数据
  let _data = method === "get" ? params : data;
  // formData数据，特殊处理
  _data = isFormData ? buildFormData(_data) : _data;

  if (method === "get") {
    config.params = _data;
  } else {
    config.data = _data;
  }
  return config;
});
/**
 * @description request请求方式，包含get\post\put\delete\head\options\patch等
 * T 返回数据data的类型 例：返回数据{ code: 200, data: {} }，T 代表 data
 * D 请求参数的类型
 * M 返回数据的格式 例：{ code: 200, data: {}, message: ''}
 * U 使用origin则返回原始的response对象
 * @returns {Promise<[Data, Error]>} Data 数据；Error 是否报错，有报错时，则代表请求失败
 * 注意事项：使用async/awiat时，可以不用try/catch
 */
export function request<T, D>(
  config: CustomAxiosRequestConfig<D>
): Promise<[any | undefined, any | undefined]> {
  return new Promise<any>((resolve) => {
    HttpRequest.request<T, AxiosResponse<any, D>, D>(config)
      .then((res) => {
        resolve([config.backOriginResponse ? res : res.data]);
      })
      .catch((error) => {
        resolve([undefined, error]);
      });
  });
}

/**
 * @description Get请求方法
 * @param {string} url 请求地址
 * @param {any} params 请求参数
 * @param {object | undefined} config 配置参数
 * @returns {Promise<any>}
 */

export async function get<T, D>(
  url: string,
  params?: D,
  config?: CustomAxiosRequestConfig<D>
) {
  config = config || {};
  return request<T, D>({
    ...config,
    url,
    method: "get",
    params,
  });
}

/**
 * @description Post请求方法
 * @param {string} url 请求地址
 * @param {object | undefined} params 请求参数
 * @param {object | undefined} config 配置参数
 * @returns {Promise<any>}
 */
export function post<T, D>(
  url: string,
  data?: D,
  config?: CustomAxiosRequestConfig<D>
) {
  config = config || {};
  return request<T, D>({
    ...config,
    url,
    method: "post",
    data,
  });
}

export default HttpRequest;
