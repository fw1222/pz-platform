<template>
  <h2>用户登录</h2>
  <!-- form表单区域 -->
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="form.userName"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="form.passWord"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <!-- 提交按钮 -->
    <div class="btn">
      <van-button round block type="primary" native-type="submit"
        >提交</van-button
      >
    </div>
  </van-form>
</template>

<script setup>
import { reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();

// 表单数据
const form = reactive({
  userName: "",
  passWord: "",
});

// 表单提交
const onSubmit = async () => {
  const { data } = await proxy.$api.login(form);
  if (data.code === 10000) {
    //code正常，拿到了正确数据
    // 设置浏览器缓存
    localStorage.setItem("h5_token", data.data.token);
    // res.data.userInfo是一个引用数据类型，需要转换为JSON字符串
    localStorage.setItem("h5_userInfo", JSON.stringify(data.data.userInfo));
    // 路由跳转到首页位置
    router.push("/home");
  }
};
</script>

<style lang="less" scoped>
h2 {
  text-align: center;
}
.btn {
  margin: 16px;
}
</style>
