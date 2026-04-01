# pz-platform
## 📱 项目简介

随着老龄化社会加速，陪诊服务需求日益增长。本平台旨在连接用户与专业陪护师，提供便捷、安全的陪诊服务。

- **H5 用户端**：用户注册登录、服务预约、在线支付、订单跟踪
- **PC 后台管理端**：账号管理、陪护师管理、订单管理、权限控制


## 🛠 技术栈
| 端 | 技术 |
|------|------|
| **PC 端** | Vue 3 + Vite + Element Plus + Vuex + Axios + Less |
| **H5 端** | Vue 3 + Vite + Vant + Vue Router + Axios + QRCode |
| **公共** | Vue Router、Axios、Day.js |


## 📁 项目结构

陪诊服务平台/
│
├── pc-admin/                    # 后台管理系统
│   ├── src/
│   │   ├── api/                 # 接口封装
│   │   ├── components/          # 公共组件
│   │   ├── router/              # 路由配置
│   │   ├── store/               # Vuex 状态管理
│   │   ├── utils/               # 工具函数（axios 封装）
│   │   └── views/               # 页面组件
│   ├── package.json
│   └── vite.config.js
│
├── h5-client/                   # H5 用户端
│   ├── src/
│   │   ├── api/                 # 接口封装
│   │   ├── components/          # 公共组件
│   │   ├── router/              # 路由配置
│   │   ├── utils/               # 工具函数
│   │   └── views/               # 页面组件
│   ├── package.json
│   └── vite.config.js
│
└── README.md                    # 项目说明文档

## ✨ 核心功能

### 🔐 后台管理系统

| 模块 | 功能 |
|------|------|
| **动态权限** | 基于角色动态渲染菜单，页面级权限控制 |
| **账号管理** | 用户增删改查、状态管理 |
| **陪护师管理** | 陪护师信息维护、头像上传 |
| **订单管理** | 订单查询、状态扭转（待服务→已完成） |
| **权限管理** | 角色权限分配、菜单树配置 |

### 📱 H5 用户端

| 模块 | 功能 |
|------|------|
| **用户登录** | 手机号登录、token 认证 |
| **服务预约** | 选择医院、陪诊师、就诊时间、填写需求 |
| **在线支付** | 微信扫码支付、二维码弹窗 |
| **订单跟踪** | 多状态筛选、进度条可视化、倒计时提醒 |
| **个人中心** | 用户信息展示、退出登录 |

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装运行

**后台管理系统（PC 端）**

```bash
cd pc-admin
npm install
npm run dev
```
访问 http://localhost:5173 即可查看。
**H5 用户端**

```bash
cd pzH5
npm install
npm run dev
```
访问 http://localhost:4500 即可查看。


## 🎯 核心亮点
| 亮点               | 实现                                                         |
| :----------------- | :----------------------------------------------------------- |
| **动态路由权限**   | 基于后端菜单树，递归生成路由，使用 `import.meta.glob` 动态加载组件 |
| **递归菜单组件**   | 封装 `TreeMenu` 组件，自调用实现无限层级菜单渲染             |
| **状态持久化**     | 引入 `vuex-persistedstate`，解决页面刷新后数据丢失           |
| **Axios 二次封装** | 请求/响应拦截器，token 自动携带，错误统一处理                |
| **微信支付集成**   | 使用 `qrcode` 库生成二维码，`van-dialog` 弹窗展示            |
| **订单倒计时**     | 封装 `counter` 组件，支持超时提醒                            |

## 📷 项目截图
### 后台管理
登录页面
<img width="1280" height="740" alt="image" src="https://github.com/user-attachments/assets/a20775f4-d35b-4790-a60e-c0e97f39151e" />

操作页面

<img width="1243" height="664" alt="屏幕截图 2026-04-01 143732" src="https://github.com/user-attachments/assets/a2ed979d-6fcf-4fd2-810f-81aff833c42e" />
<img width="1249" height="666" alt="image" src="https://github.com/user-attachments/assets/4fa68f68-456f-41f5-b3ee-ed10462393a5" />
<img width="1240" height="678" alt="image" src="https://github.com/user-attachments/assets/9bd95cb1-48fb-4796-ad98-3800e2268e88" />


### h5端
首页页面
<img width="285" height="618" alt="屏幕截图 2026-04-01 142445" src="https://github.com/user-attachments/assets/64d6188c-d5bd-4049-955a-580ecd609a83" />

订单页面
<img width="278" height="617" alt="屏幕截图 2026-04-01 142408" src="https://github.com/user-attachments/assets/3bb48beb-5639-4c48-a09e-89ba32eb2225" />

用户信息页面
<img width="281" height="621" alt="image" src="https://github.com/user-attachments/assets/dbe408e2-dd0b-48d0-875b-9e727c883835" />

创建订单页面
<img width="284" height="619" alt="屏幕截图 2026-04-01 144629" src="https://github.com/user-attachments/assets/9bc3ccf5-421f-4b97-9330-247b7edd58af" />

订单详情页面

<img width="281" height="621" alt="屏幕截图 2026-04-01 144511" src="https://github.com/user-attachments/assets/ed9d2d0f-248a-4486-9559-d920b8b068ab" />

