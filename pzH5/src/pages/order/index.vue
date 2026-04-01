<template>
  <div class="container">
    <div class="header">我的订单</div>
    <van-tabs v-model:active="active" @click-tab="onClickTab">
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="待支付" name="1"></van-tab>
      <van-tab title="待服务" name="2"></van-tab>
      <van-tab title="已完成" name="3"></van-tab>
      <van-tab title="已取消" name="4"></van-tab>
    </van-tabs>

    <van-row
      v-for="item in order"
      :key="item.out_trade_no"
      @click="goDetail(item)"
    >
      <van-col span="5">
        <van-image
          width="50"
          height="50"
          radius="5"
          :src="item.serviceImg"
        ></van-image>
      </van-col>
      <van-col span="14">
        <div class="text1">{{ item.service_name }}</div>
        <div class="text2">{{ item.hospital_name }}</div>
        <div class="text2">预约时间：{{ item.starttime }}</div>
      </van-col>
      <van-col
        class="text2"
        :style="{ color: colorMap[item.trade_state] }"
        span="5"
      >
        {{ item.trade_state }}

        <counter :second="item.timer" v-if="item.trade_state === '待支付'" />
      </van-col>
    </van-row>
    <div class="bottom-text">没有更多了</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { reactive, getCurrentInstance, onMounted } from "vue";
import counter from "../../components/counter.vue";
import { useRouter, useRoute } from "vue-router";

// 订单列表数据
const order = ref([]);

// 获取vue实例
const { proxy } = getCurrentInstance();

const getOrderList = async (state) => {
  const { data } = await proxy.$api.orderList({ state });
  console.log(data, "orderList");
  data.data.forEach((item) => {
    item.timer = item.order_start_time + 7200000 - Date.now();
  });
  order.value = data.data;
};

const route = useRoute();
onMounted(() => {
  // ✅ 从路由参数中获取 active
  const activeTab = route.query.active || ""; // 如果没传，默认全部
  active.value = activeTab; // 设置当前激活的tab
  getOrderList(activeTab); // 根据参数请求对应的订单列表
});
const active = ref("");

const onClickTab = (item) => {
  getOrderList(item.name);
};

const router = useRouter();

// 跳转订单详情  拿到当前数据再进行跳转
const goDetail = (item) => {
  // 跳转需要携带订单id参数 使用模板字符串进行拼接
  router.push(`/detail?oid=${item.out_trade_no}`);
};

const colorMap = {
  待支付: "#ffa200",
  待服务: "#1da6fd",
  已完成: "#21c521",
};
</script>

<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;
}
.van-row {
  background-color: #fff;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  .text1 {
    font-size: 16px;
    line-height: 25px;
    font-weight: bold;
  }
  .text2 {
    font-size: 14px;
    line-height: 20px;
    color: #999999;
  }
}
.bottom-text {
  line-height: 50px;
  text-align: center;
  color: #999999;
}
</style>
