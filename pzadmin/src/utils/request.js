import axios from "axios";

// 创建axios实例
const http = axios.create({
  baseURL: "https://v3pz.itndedu.com/v3pz",
  timeout: 10000,
});
// 添加拦截器  在定义的axios上操作
// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem("pz_token");
    // 有些不需要添加token
    // 不需要添加token的api 【白名单】
    const whiteUrl = ["/get/code", "/user/authentication", "/login"];
    // 若token存在且白名单中没有该config的url
    if (token && !whiteUrl.includes(config.url)) {
      config.headers["x-token"] = token;
    }
    return config;
  },

  // function (config) {
  //   const token = localStorage.getItem("pz_token");
  //   const whiteUrl = ["/get/code", "/user/authentication", "/login"];

  //   // 🔍 添加详细调试
  //   console.log("=== Token调试信息 ===");
  //   console.log("1. token变量值:", token);
  //   console.log("2. token类型:", typeof token);
  //   console.log("3. token长度:", token ? token.length : 0);
  //   console.log("4. 请求URL:", config.url);
  //   console.log("5. 白名单检查:", whiteUrl.includes(config.url));

  //   if (token && !whiteUrl.includes(config.url)) {
  //     console.log("6. 条件成立，准备设置token");
  //     config.headers["x-token"] = token;
  //     console.log("7. 设置后的headers:", config.headers);
  //   } else {
  //     console.log("6. 条件不成立，原因:", !token ? "token为空" : "在白名单中");
  //   }

  //   return config;
  // },
  function (error) {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 对接口异常的数据源，给用户提示
    if (response.data.code === -1) {
      ElMessage.warning(response.data.message);
    }
    if (response.data.code === -2) {
      console.log("LocalStorage中的token:", localStorage.getItem("pz_token"));
      // code=-2 token有问题（可能已过期）
      localStorage.removeItem("pz_token");
      localStorage.removeItem("pz_userInfo");
      localStorage.removeItem("pz_v3pz");

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
