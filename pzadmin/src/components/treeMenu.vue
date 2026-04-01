<template>
  <template v-for="(item, index) in props.menuData">
    <el-menu-item
      @click="handleClick(item, '`${props.index}-${item.meta.id}`')"
      v-if="!item.children || item.children.length == 0"
      :index="`${props.index}-${item.meta.id}`"
      :key="`${props.index}-${item.meta.id}`"
    >
      <!-- 动态组件 -->
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component
        ></el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <treeMenu
        :index="`${props.index}-${item.meta.id}`"
        :menuData="item.children"
      >
      </treeMenu>
    </el-sub-menu>
  </template>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// 子组件获取数据
const props = defineProps(["menuData", "index"]);
console.log(props, "props");

// 创建Router实例
const router = useRouter();
// 创建store实例
const store = useStore();
// 点击菜单
const handleClick = (item, active) => {
  router.push(item.meta.path);
  store.commit("addMenu", item.meta);
  store.commit("updateMenuActive", active);
};
</script>

<style scoped>
.el-sub-menu {
  color: aliceblue;
}
</style>
