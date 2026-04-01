<template>
  <panel-head :route="route" />

  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small"
      >新增</el-button
    >
  </div>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"></el-table-column>
    <el-table-column prop="name" label="昵称"></el-table-column>
    <el-table-column
      prop="permissionName"
      label="菜单权限"
      width="500"
    ></el-table-column>
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
    title="添加权限"
    width="500"
  >
    <el-form
      ref="formRef"
      label-width="100"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <!-- 一个隐藏的id -->
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :data="permissionData"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
        ></el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="confrim(formRef)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { userGetMenu, userSetMenu, menuList } from "../../../api";
import { Plus } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(() => {
  userGetMenu().then(({ data }) => {
    console.log(data);
    permissionData.value = data.data;
  });
  getListData();
});

// 列表数据 【请求接口后赋值】
const tableData = reactive({
  list: [],
  total: 0,
});

//打开弹窗
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    if (rowData) {
      Object.assign(form, { id: rowData.id, name: rowData.name });
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  });
};

// 列表数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};
const handleCurrentChange = (val) => {
  // 改变页码
  paginationData.pageNum = val;
  // 获得新列表
  getListData();
};

// 请求列表数据 复用性功能
const getListData = () => {
  menuList(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};

const formRef = ref();

// form的数据
const form = reactive({
  id: "",
  name: "",
  permissions: "",
});

// 树形菜单权限数据
const permissionData = ref([]);

// 控制弹窗的显示 （默认值false 不显示）
const dialogFormVisible = ref(false);
// 关闭弹窗前的回调
const beforeClose = () => {
  dialogFormVisible.value = false;
  formRef.value.resetFields();
  treeRef.value.setCheckedKeys(defaultKeys);
};

// 选中权限（默认选中）【初始设置】
const defaultKeys = [4, 5];
const treeRef = ref();

// 表单校验（对话框）
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入权限名称" }],
});

// 提交对话框[异步加async]
const confrim = async (formEl) => {
  if (!formEl) return;
  // 手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      userSetMenu({ name: form.name, permissions, id: form.id }).then(
        ({ data }) => {
          console.log(data);
          beforeClose();
          getListData();
        },
      );
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
