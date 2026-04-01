<template>
  <el-menu
    :style="{ width: !isCollapse ? '230px' : '64px' }"
    text-color="#fff"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    :default-active="active"
  >
    <p class="logo-lg">{{ !isCollapse ? "DIDI陪诊" : "DIDI" }}</p>
    <TreeMenu :index="1" :menuData="menuData" />
  </el-menu>
</template>

<script setup>
import TreeMenu from "./treeMenu.vue";
import { reactive } from "vue";

// 获取路由消息
import { useRouter } from "vue-router";
import { computed } from "vue";

import { useStore } from "vuex";

// 创建store实例
const store = useStore();

const isCollapse = computed(() => store.state.menu.isCollapse);

const active = computed(() => store.state.menu.menuActive);

// 路由实例
const router = useRouter();

const menuData = computed(() => store.state.menu.routerList);

const handleOpen = () => {};
const handleClose = () => {};
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  color: rgb(255, 255, 255);
  .logo-lg {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
}
</style>
