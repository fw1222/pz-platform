const localData = localStorage.getItem("pz_v3pz");

const state = localData
  ? localData.menu
  : {
      isCollapse: false,
      selectMenu: [],
      routerList: [],
      menuActive: "1-1",
    };

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse;
  },
  addMenu(state, payload) {
    // 对数据进行去重
    if (
      state.selectMenu.findIndex((item) => item.path === payload.path) === -1
    ) {
      state.selectMenu.push(payload);
    }
  },
  closeMenu(state, payload) {
    // 找到将关闭页面的索引值
    const index = state.selectMenu.findIndex((val) => val.name === payload);
    // 通过索引删除数组指定元素
    state.selectMenu.splice(index, 1);
  },
  dynamicMenu(state, payload) {
    console.log(payload, "payload");
    const modules = import.meta.glob("../views/**/**/*.vue");
    console.log(modules);
    // 封装函数，用于接收当前的某一个路由信息
    function routerSet(router) {
      // 对每一项数据进行判断
      router.forEach((route) => {
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`;
          // 拿到获取的vue组件（页面）
          route.component = modules[url];
        } else {
          // 有子菜单，进行递归
          routerSet(route.children);
        }
      });
    }
    // 调用函数
    routerSet(payload);
    // 拿到完整的路由数据（就是此时调用完成之后的payload）
    state.routerList = payload;
  },
  updateMenuActive(state, payload) {
    state.menuActive = payload;
  },
};

export default {
  state,
  mutations,
};
