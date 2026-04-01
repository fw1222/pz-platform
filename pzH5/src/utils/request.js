import axios from "axios";

// 创建axios实例
const http = axios.create({
  baseURL: "https://v3pz.itndedu.com/v3pz",
  timeout: 10000,
  headers: { terminal: "h5" },
});
// 添加拦截器
// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("h5_token");
    const whiteUrl = ["/get/code", "/user/authentication", "/login"];
    // 若token存在且白名单中没有该config的url
    if (token && !whiteUrl.includes(config.url)) {
      config.headers["h-token"] = token;
    }
    return config;
  },

  function (error) {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 对接口异常的数据源，给用户提示
    if (response.data.code === -1) {
      console.log(response.data.message);
    }
    if (response.data.code === -2) {
      console.log("LocalStorage中的token:", localStorage.getItem("h5_token"));
      // code=-2 token有问题（可能已过期）
      localStorage.removeItem("h5_token");
      localStorage.removeItem("h5_userInfo");
      localStorage.removeItem("h5_v3pz");

      //  跳转
      window.location.href = window.location.origin;
      ElMessage.error("登录已过期，请重新登录！");
      return Promise.reject(new Error("登录已过期"));
    }

    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

// 对外暴露axios实例
export default http;
