<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"
        ><Fold
      /></el-icon>
      <ul class="nav-ul flex-box">
        <li
          v-for="(item, index) in selectMenu"
          :key="item.path"
          class="tab flex-box"
          :class="{ selected: route.path === item.path }"
        >
          <el-icon size="12"> <component :is="item.icon" /></el-icon>
          <router-link class="text flex-box" :to="{ path: item.path }">
            {{ item.name }}
          </router-link>
          <el-icon class="close" size="12" @click="closeTab(item, index)"
            ><Close
          /></el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <el-avatar :src="userInfo.avatar" />
          <p class="username">{{ userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { Select } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
// 拿到store的实例
const store = useStore();
const router = useRouter();
const route = useRoute();

const selectMenu = computed(() => store.state.menu.selectMenu);

const userInfo = JSON.parse(localStorage.getItem("pz_userInfo"));

// 点击关闭tag
const closeTab = (item, index) => {
  store.commit("closeMenu", item);
  // 删除非当前页tag
  if (route.path !== item.path) {
    return;
  }
  const selectMenuData = selectMenu.value;
  // 删除的是最后一项 前进一位
  if (index === selectMenuData.length) {
    if (!selectMenuData.length) {
      // 如果tag只有一个元素
      // 跳转到根路径
      router.push("/");
    } else {
      router.push({
        path: selectMenuData[index - 1].path,
      });
    }
  } else {
    // 如果删除的是中间位置的tag 后退一位
    router.push({
      path: selectMenu[index].path,
    });
  }
};

const handleClick = (command) => {
  if (command === "cancel") {
    // 登出逻辑
    // 清除缓存设置的token
    localStorage.removeItem("pz_token");
    localStorage.removeItem("pz_userInfo");
    // 持久化的数据也需要清除
    localStorage.removeItem("pz_v3pz");
    // 路由跳转
    localStorage.window.location.herf = window.location.origin;
  }
};
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding-right: 25px;
  height: 100%;
  .header-left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
    .nav-ul {
      height: 100%;
    }
    .tab {
      padding: 0 10px;
      height: 100%;
      .text {
        margin: 0 5px;
      }
      .close {
        visibility: hidden;
      }
      // 同级
      &.selected {
        color: #409eff;
        a {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        cursor: pointer;
        color: #333;
      }
    }
  }
  .header-right {
    .username {
      padding-left: 15px;
    }
  }
  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>
