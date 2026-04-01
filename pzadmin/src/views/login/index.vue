<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">
          {{ formType ? "返回登录" : "注册账号" }}
        </el-link>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        style="max-width: 600px"
        class="demo-form"
        :rules="rules"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="手机号"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input
            v-model="loginForm.validCode"
            placeholder="验证码"
            :prefix-icon="Lock"
          >
            <template #append>
              <span @click="countDownChange">{{ countDown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="submitForm(loginFormRef)"
          >
            {{ formType ? "注册账号" : "登录" }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { reactive, ref, computed, toRaw } from "vue";
import {
  getCode,
  userAuthentication,
  userLogin,
  menuPermissions,
} from "../../api";
import { User, Lock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex/dist/vuex.cjs.js";
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;

// 表单数据
const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});

// 切换表单(0登录，1注册)
const formType = ref(0);

// 点击切换注册和登录
const handleChange = () => {
  formType.value = formType.value ? 0 : 1;
};

// 账号校验规则
const validateUser = (rule, value, callback) => {
  // 不能为空
  if (value === "") {
    callback(new Error("请输入账号"));
  } else {
    const phoneReg =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    phoneReg.test(value)
      ? callback()
      : callback(new Error("请输入正确手机号格式"));
  }
};
// 密码校验
const validatePass = (rule, value, callback) => {
  // 不能为空
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const Reg = /^[a-zA-Z0-9_-]{4,16}$/;
    Reg.test(value)
      ? callback()
      : callback(new Error("密码格式不正确！需要4~16位字符"));
  }
};

// 表单校验
const rules = reactive({
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
});

// 发送短信
const countDown = reactive({
  validText: "获取验证码",
  time: 60,
});
// 创建标识，使只能有一个定时计时器（不反复发验证码）
let flag = false;
const countDownChange = () => {
  // 若已存在定时器（已发送），不做处理
  if (flag) return;
  // 判断手机号是否正确
  const phoneReg =
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: "请检查手机号是否正确！",
      type: "warning",
    });
  }
  // 定时器  每隔一秒让时间减一
  const time = setInterval(() => {
    if (countDown.time <= 0) {
      countDown.time = 60;
      countDown.validText = "获取验证码";
      flag = false;
      //到时间后清楚定时器
      clearInterval(time);
    } else {
      countDown.time -= 1;
      countDown.validText = `剩余${countDown.time}s`;
    }
  }, 1000);
  flag = true;
  // 调用接口获取验证码
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    console.log(data, "data");
    if (data.code === 10000) {
      ElMessage.success("发送成功");
    }
  });
};

const loginFormRef = ref();
const router = useRouter();
const store = useStore();

const routerList = computed(() => store.state.menu.routerList);

// 表单提交
const submitForm = async (formEl) => {
  if (!formEl) return;
  // 手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(loginForm, "submit!");
      // 注册页面
      if (formType.value) {
        userAuthentication(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success("注册成功，请登录！");
            formType.value = 0;
          }
        });
      } else {
        // 登录页面
        userLogin(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success("登录成功！");
            console.log(data, "我是数据");
            localStorage.setItem("pz_token", data.data.token);
            localStorage.setItem(
              "pz_userInfo",
              JSON.stringify(data.data.userInfo),
            );
            menuPermissions().then(({ data }) => {
              // 调用store中的方法
              store.commit("dynamicMenu", data.data);
              console.log(routerList, "routerList");
              // 转变好后直接进行遍历 拿到每一项，调用router
              toRaw(routerList.value).forEach((item) => {
                // 指定的添加路由 给main路由下添加子路由 原本写的路由注释掉
                router.addRoute("main", item);
              });

              // 后续跳转到首页【router】
              router.push("/");
            });
          }
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
