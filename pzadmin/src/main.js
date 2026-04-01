import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PanelHead from "./components/panelHead.vue";

// 刷新后的动态路由添加
const localData = localStorage.getItem("pz_v3pz");
// localData存在，说明页面刷新了，需要动态添加
if (localData) {
  // 将字符串转化为一个对象
  store.commit("dynamicMenu", JSON.parse(localData).menu.routerList);
  store.state.menu.routerList.forEach((item) => {
    router.addRoute("main", item);
  });
}

// 前置导航守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem("pz_token");
  if (!token && to.path !== "/login") {
    // 非登录页面 token不存在
    return "/login";
  } else if (token && to.path === "/login") {
    // token存在 阻止用户跳回登录页面
    return "/";
  } else {
    // 放行，允许用户正常跳转
    return true;
  }
});

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.component("PanelHead", PanelHead);

// 路由挂载
app.use(router);
// store挂载
app.use(store);
app.mount("#app");
