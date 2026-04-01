import request from "../utils/request";

// 与管理系统直接通过export暴露方法不同
export default {
  // 登录数据
  login(data) {
    return request.post("/login", data);
  },

  // 首页数据
  index() {
    return request.get("/Index/index");
  },
  // 订单详情
  h5Companion() {
    return request.get("/h5/companion");
  },
  // 提交表单
  createOrder(data) {
    return request.post("/createOrder", data);
  },
  // 订单列表
  orderList(params) {
    return request.get("/order/list", { params });
  },
  // 订单详情
  orderDetail(params) {
    return request.get("/order/detail", { params });
  },
};
