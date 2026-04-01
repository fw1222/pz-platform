<template>
  <div class="container">
    <div class="header">
      <van-icon
        @click="goBack"
        name="arrow-left"
        class="header-left"
        size="30"
      />
      服务订单详情
    </div>
    <statusBar :item="stateMap[detailData.trade_state]" />
    <div class="tips">
      <!-- 待支付效果 -->
      <div class="dzf" v-if="detailData.trade_state === '待支付'">
        <div class="text1">订单待支付</div>
        <!-- 倒计时 -->
        <div class="text2">
          请在 <counter :second="second" /> 内完成支付,超时订单自动取消
        </div>
        <!-- 点击支付的按钮 -->
        <div class="text3">
          <van-button type="success" @click="showCode = true"
            >立即支付</van-button
          >
        </div>
      </div>
      <!-- 待服务效果 -->
      <div class="dzf" v-if="detailData.trade_state === '待服务'">
        <div class="text1">正在为您安排服务专员...</div>
        <div class="text2">请保持手机畅通,稍后将有服务专员与您联系</div>
      </div>
      <!-- 已完成 -->
      <div class="dzf" v-if="detailData.trade_state === '已完成'">
        <div class="text1">服务已完成</div>
        <div class="text2">感谢您的使用,如有售后问题请联系客服</div>
      </div>
      <!-- 已取消 -->
      <div class="dzf" v-if="detailData.trade_state === '已取消'">
        <div class="text1">订单已取消</div>
        <div class="text2">期待下次为您服务,如需帮助可咨询客服</div>
      </div>
    </div>

    <van-cell-group class="card">
      <div class="header-text">预约信息</div>
      <van-cell
        v-for="(item, key) in makeInfo"
        :key="key"
        :title="item"
        :value="formatData(key)"
      ></van-cell>
    </van-cell-group>
    <van-cell-group class="card">
      <div class="header-text">订单信息</div>
      <van-cell
        v-for="(item, key) in orderInfo"
        :key="key"
        :title="item"
        :value="formatData(key)"
      ></van-cell>
    </van-cell-group>

    <!-- 做dialog弹窗接收付款二维码图片 -->
    <van-dialog v-model:show="showCode" :show-confirm-button="false">
      <van-icon name="cross" class="close" @click="closeCode" />
      <div>微信支付</div>
      <van-image :src="codeImg" width="150" height="150"></van-image>
      <div>请使用本人微信扫描二维码</div>
    </van-dialog>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { onMounted, getCurrentInstance, reactive, ref, computed } from "vue";
import statusBar from "../../components/statusBar.vue";
// 倒计时组件
import counter from "../../components/counter.vue";
// url转二维码图片插件
import Qrcode from "qrcode";

const { proxy } = getCurrentInstance();
const router = useRouter();
// 拿到当前路由对象，从而拿到路由中的id
const route = useRoute();

// 计算倒计时
// detailData.order_start_time可能存在也可能不存在，需要做初始的判断
const second = computed(() => {
  return detailData.order_start_time
    ? detailData.order_start_time + 7200000 - Date.now()
    : 0;
});

// 支付弹窗
const showCode = ref(false);
// 支付图片
const codeImg = ref("");
// 关闭弹窗
const closeCode = () => {
  // 关闭弹窗
  showCode.value = false;
  // 点击关闭后，跳转到订单列表页面
  router.push("/order");
};

// 详情页数据
const detailData = reactive({});
// 枚举数据
const stateMap = {
  待支付: 10,
  待服务: 20,
  已完成: 30,
  已取消: 40,
};

// 订单详情
// 预约信息
const makeInfo = {
  service_name: "预约服务",
  hospital_name: "就诊医院",
  starttime: "期望就诊时间",
  "client.name": "就诊人",
  "client.mobile": "就诊人电话",
  receiveAddress: "接送地址",
  demand: "就诊需求",
};
// 订单信息
const orderInfo = {
  tel: "联系电话",
  order_start_time: "下单时间",
  price: "应付金额",
  out_trade_no: "订单编号",
};

const formatData = (key) => {
  if (key.indexOf(".") === -1) {
    // 时间戳转换
    if (key === "order_start_time") {
      return formatTimestamp(detailData[key]);
    }
    return detailData[key];
  }

  let arr = key.split(".").reduce((o, p) => {
    return (o || {})[p];
  }, detailData);
  return arr;
};
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 生命周期中调用vue实例的接口，用于渲染
onMounted(async () => {
  console.log(route, "route");

  const { data } = await proxy.$api.orderDetail({ oid: route.query.oid });

  Object.assign(detailData, data.data);
  Qrcode.toDataURL(data.data.code_url).then((url) => {
    codeImg.value = url;
  });
  console.log(detailData, "detailData");
});

// 点击返回
const goBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="less">
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;
  .header-left {
    float: left;
  }
}
.card {
  margin: 15px 0;
  padding: 10px;
  .header-text {
    padding-left: 5px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    border-left: 4px solid red;
  }
}
.dzf {
  padding: 20px;
  .text1 {
    font-size: 20px;
    font-weight: bold;
    line-height: 30px;
    color: #666;
  }
  .text2 {
    font-size: 14px;
    color: #666;
  }
  .text3 {
    text-align: center;
    .van-button {
      margin-top: 10px;
      margin-left: 10px;
      width: 80%;
      font-weight: bold;
    }
  }
}
::v-deep(.van-dialog__content) {
  text-align: center;
  padding: 20px;
  .close {
    position: absolute;
    left: 20px;
  }
}
</style>
