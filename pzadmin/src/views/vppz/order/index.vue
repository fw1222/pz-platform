<template>
  <panel-head :route="route" />
  <div class="form">
    <el-form inline="true" :model="sarchForm">
      <el-form-item prop="out_trade_no">
        <el-input
          v-model="sarchForm.out_trade_no"
          placeholder="请输入订单号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData.list">
    <el-table-column
      fixed="left"
      prop="out_trade_no"
      label="订单号"
      width="150"
    ></el-table-column>
    <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
    <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
    <el-table-column label="陪护师头像">
      <template #default="scope">
        <el-image
          :src="scope.row.companion.avatar"
          style="width: 40px; height: 40px"
        ></el-image>
      </template>
    </el-table-column>
    <el-table-column label="陪护师手机号" width="120">
      <template #default="scope">
        <!-- 因为在陪诊师对象里面 用插槽访问 -->
        {{ scope.row.companion.mobile }}
      </template>
    </el-table-column>
    <el-table-column prop="price" label="总价"></el-table-column>
    <el-table-column prop="paidPrice" label="已付金额"></el-table-column>
    <el-table-column label="下单时间" width="120">
      <template #default="scope">
        {{ dayjs(scope.row.order_start_time).format("YYYY-MM-DD") }}
      </template>
    </el-table-column>
    <el-table-column label="订单状态">
      <template #default="scope">
        <el-tag :type="stateMap(scope.row.trade_state)">
          {{ scope.row.trade_state }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="service_state" label="接单状态"> </el-table-column>
    <el-table-column prop="tel" label="联系人手机号" width="120">
    </el-table-column>
    <!-- 让操作栏固定：fixed -->
    <el-table-column label="操作" width="120" fixed="right">
      <template #default="scope">
        <el-popconfirm
          v-if="scope.row.trade_state === '待服务'"
          :icon="InfoFilled"
          icon-color="#626AEF"
          title="是否确认完成？"
          confirm-button-text="是"
          cancel-button-text="否"
          @confirm="confirmEvent(scope.row.out_trade_no)"
        >
          <template #reference>
            <el-button type="primary" link> 服务完成 </el-button>
          </template>
        </el-popconfirm>
        <el-button v-else type="primary" link disabled>暂无服务</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      size="small"
      :background="false"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { adminOrder, updateOrder } from "../../../api";
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { InfoFilled } from "@element-plus/icons-vue";
const route = useRoute();

// 分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};

// 列表数据
const tableData = reactive({
  // 各项订单信息内容
  list: [],
  // 总订单数
  total: 0,
});

// 请求列表
// params参数默认给空对象 区分开访问全部订单和搜索单个订单
const getListData = (params = {}) => {
  // 调用接口 用{...}组装数据
  adminOrder({ ...paginationData, ...params }).then(({ data }) => {
    console.log(data, "staff");
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};

onMounted(() => {
  getListData();
});

//订单状态映射
const stateMap = (key) => {
  const obj = {
    已取消: "info",
    待支付: "warning",
    已完成: "success",
  };
  // 通过key来匹配
  return obj[key];
};

// 确认服务完成 【弹窗】
const confirmEvent = (id) => {
  updateOrder({ id }).then(({ data }) => {
    // 当前接口请求正常
    if (data.code === 10000) {
      // 再次请求列表数据【更新】
      getListData();
    }
  });
};

// 表单搜索
const sarchForm = reactive({
  out_trade_no: "",
});
// 确定查询
const onSubmit = () => {
  getListData(sarchForm);
};
</script>
<style scoped lang="less">
.form {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
