// 将封装的axios实例引入
import request from "../utils/request";

// 接口1-发送验证码
export const getCode = (data) => {
  return request.post("/get/code", data);
};

// 接口2-注册用户
export const userAuthentication = (data) => {
  return request.post("/user/authentication", data);
};

// 接口3-登录账号
export const userLogin = (data) => {
    return request.post("/login", data);
};

// 接口4-权限管理
// get请求属性为params
export const authAdmin = (params) => {
  return request.get("/auth/admin", { params });
};

// 接口5-菜单权限数据
export const userGetMenu = (params) => {
  return request.get("/user/getmenu", params);
};

// 接口6-菜单权限修改
export const userSetMenu = (data) => {
  return request.post("/user/setmenu", data);
};

// 接口7-菜单权限列表
export const menuList = (params) => {
  return request.get("/menu/list", { params });
};

//接口8-菜单权限下拉列表
export const menuSelectList = () => {
  return request.get("/menu/selectlist");
};

//接口9-用户信息修改
export const updateUser = (data) => {
  return request.post("/update/user", data);
};

// 接口10-用户菜单权限
export const menuPermissions = () => {
  return request.get("/menu/permissions");
};

// 接口11-陪护师头像
export const photoList = () => {
  return request.get("/photo/list");
};

// 接口12-陪护师创建
export const companion = (data) => {
  return request.post("/companion", data);
};

// 接口13-陪护师列表
export const companionList = (params) => {
  return request.get("/companion/list", { params });
};

// 接口13-陪护师删除
export const deleteCompanion = (data) => {
  return request.post("/delete/companion", data);
};

// 订单列表
export const adminOrder = (params) => {
  return request.get("/admin/order", { params });
};

// 服务状态完成
export const updateOrder = (data) => {
  return request.post("/update/order", data);
};
