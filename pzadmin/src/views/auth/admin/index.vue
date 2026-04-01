<template>
  <panel-head :route="route" />
  <!-- 逻辑复用 -->
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"></el-table-column>
    <el-table-column prop="name" label="昵称"></el-table-column>
    <el-table-column prop="permission_id" label="所属组别">
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"></el-table-column>
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">
          {{ scope.row.active ? "正常" : "失效" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
      <template #default="scope">
        <div class="flex=box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      size="small"
      :background="flase"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="编辑用户"
    width="500"
  >
    <el-form
      ref="formRef"
      label-width="100"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permission_id">
        <el-select
          v-model="form.permissions_id"
          placeholder="请选择菜单权限"
          style="width: 250px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="confrim(formRef)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { authAdmin, menuSelectList, updateUser } from "../../../api";
import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";

const route = useRoute();
console.log(route, "route");

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

// 列表数据 【请求接口后赋值】
const tableData = reactive({
  list: [],
  total: 0,
});

// 渲染时
onMounted(() => {
  (getListDate(),
    // 调用接口，获取当前下拉列表数据
    menuSelectList().then(({ data }) => {
      options.value = data.data;
    }));
});

// 请求列表
const getListDate = () => {
  // 调用接口e
  authAdmin(paginationData).then(({ data }) => {
    console.log(data, "data");
    const { list, total } = data.data;
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
    tableData.list = list;
    tableData.total = total;
  });
};

const options = ref([]);
// 根据权限id匹配权限名称
const permissionName = (id) => {
  const data = options.value.find((el) => el.id === id);
  // 如果data存在直接返回name属性
  // data不存在直接返回超级管理员  【首次创建账号】
  return data ? data.name : "超级管理员";
};

const open = (rowData) => {
  dialogFormVisible.value = true;
  // 不需要复用 不考虑特别情况，对form整体进行赋值
  Object.assign(form, {
    mobile: rowData.mobile,
    name: rowData.name,
    permissions_id: rowData.permissions_id,
  });
};

// 弹窗
const dialogFormVisible = ref(false);
// 关闭弹窗前的回调
const beforeClose = () => {
  dialogFormVisible.value = false;
  formRef.value.resetFields();
  treeRef.value.setCheckedKeys(defaultKeys);
};

// 编辑表单
const form = reactive({
  name: "",
  permissions_id: "",
});

const formRef = ref();
// 表单提交
const confrim = async (formEl) => {
  if (!formEl) return;
  // 手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 调用接口，更新数据
      // 先拿到两个数据
      const { name, permissions_id } = form;
      //
      updateUser({ name, permissions_id }).then(({ data }) => {
        if (data.code === 10000) {
          // 成功修改，关闭弹窗
          dialogFormVisible.value = false;
          getListDate();
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请填写名称" }],
  permissions_id: [
    { required: true, trigger: "blur", message: "请选择菜单权限" },
  ],
});
</script>
<style scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>
