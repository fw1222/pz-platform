<template>
  <RouterView />
  <van-tabbar v-model="active">
    <van-tabbar-item
      v-for="item in router.options.routes[0].children"
      :key="item.path"
      :icon="item.meta.icon"
      :url="`#/${item.path}`"
      >{{ item.meta.name }}</van-tabbar-item
    >
  </van-tabbar>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// active 接收选中的标签的索引
const active = ref(0);

const router = useRouter();
const route = useRoute();
onMounted(() => {
  console.log(router);
  const data = router.options.routes[0];
  data.children.findIndex((item) => "/" + item.path === route.path);
});
</script>
