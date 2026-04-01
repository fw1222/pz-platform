import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// 直接引入api
import api from "./api";

const app = createApp(App);

app.config.globalProperties.$api = api;

// 登录状态下的跳转逻辑
// 添加前置导航守卫
router.beforeEach((to, from) => {
  if (to.path !== "/login") {
    if (!localStorage.getItem("h5_token")) {
      // 用户未登录
      return "/login";
    }
  }
});

// 路由挂载
app.use(router);
app.mount("#app");
