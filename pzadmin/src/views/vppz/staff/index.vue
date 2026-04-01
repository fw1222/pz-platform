<template>
  <panel-head :route="route" />

  <!-- button控制弹窗的打开 -->
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">
      新增
    </el-button>
    <el-popconfirm
      :icon="InfoFilled"
      icon-color="#626AEF"
      title="是否确认删除？"
      confirm-button-text="是"
      cancel-button-text="否"
      @confirm="confirmEvent"
    >
      <!-- 外部删除按钮 -->
      <template #reference>
        <el-button :icon="Delete" type="danger" size="small">删除</el-button>
      </template>
    </el-popconfirm>
  </div>
  <!-- @selection-change="handleSelectionChange" 点击时对应的回调 -->
  <el-table
    :data="tableData.list"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <!-- table行前多选效果 -->
    <el-table-column type="selection" :selectable="selectable" width="55" />

    <el-table-column prop="id" label="id"></el-table-column>
    <el-table-column prop="name" label="昵称"></el-table-column>
    <el-table-column prop="avatar" label="头像">
      <!-- 自定义插槽获取头像 -->
      <template #default="scope">
        <!-- 通过scope.row拿到当前行 -->
        <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" />
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <!-- 枚举值 -->
      <template #default="scope">
        {{ scope.row.sex === "1" ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"></el-table-column>
    <el-table-column prop="active" label="状态">
      <!-- 通过插槽获取数据 -->
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">
          {{ scope.row.active ? "正常" : "失效" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">
            <!-- 使用插件dayjs -->
            {{ dayjs(create_time).format("YYYY-MM-DD") }}
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <!-- 通过scope.row拿到当前行 -->
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
    title="陪护师添加"
    width="500"
  >
    <el-form
      ref="formRef"
      label-width="100"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button
          v-if="!form.avatar"
          type="primary"
          @click="dialogImgVisible = true"
          >点击上传
        </el-button>
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px; height: 100px"
          @click="dialogImgVisible = true"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="confrim(formRef)">确认</el-button>
    </template>
  </el-dialog>
  <!-- 选择头像的弹窗 -->
  <el-dialog
    v-model="dialogImgVisible"
    :before-close="beforeCloseImg"
    title="选择头像"
    width="680"
  >
    <!-- 渲染头像列表 -->
    <div class="image-list">
      <div
        v-for="(item, index) in fileList"
        :key="item.name"
        class="img-box"
        @click="selectIndex = index"
      >
        <!-- 判断当前索引与选中索引是否一致 -->
        <div v-if="selectIndex === index" class="select">
          <el-icon color="#fff"><Check /></el-icon>
        </div>
        <el-image
          style="width: 148px; height: 148px"
          :src="item.url"
        ></el-image>
      </div>
    </div>
    <template #footer>
      <!-- 取消直接关闭弹窗 -->
      <el-button type="" @click="beforeCloseImg">取消</el-button>
      <el-button type="primary" @click="confrimImg">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { Plus, InfoFilled, Delete } from "@element-plus/icons-vue";
import {
  photoList,
  companion,
  companionList,
  deleteCompanion,
} from "../../../api";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

onMounted(() => {
  getListData();
  photoList().then(({ data }) => {
    fileList.value = data.data;
  });
});
const route = useRoute();

// 弹窗【新增与编辑】
const open = (rowdata = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    // 如果是编辑【rowdata存在】
    if (rowdata) {
      Object.assign(form, rowdata);
    }
  });
};

const dialogFormVisible = ref(false);
const beforeClose = () => {
  dialogFormVisible.value = false;
  // 清空当前的form,方便新增弹窗的渲染
  formRef.value.resetFields();
};

const formRef = ref();
const form = reactive({
  id: "",
  mobile: "",
  active: 1,
  age: 28,
  avatar: "",
  name: "",
  sex: "",
});

const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入昵称" }],
  avatar: [{ required: true, message: "请选择头像" }],
  sex: [{ required: true, trigger: "change", message: "请选择性别" }],
  mobile: [{ required: true, trigger: "blur", message: "请输入手机号" }],
});

// 提交弹窗表单
const confrim = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success("成功");
          beforeClose();
          // 编辑或新增后更新列表
          getListData();
        } else {
          ElMessage.error(data.message);
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 选择头像弹窗
const dialogImgVisible = ref(false);
const fileList = ref([]);
const selectIndex = ref(0);
const confrimImg = () => {
  form.avatar = fileList.value[selectIndex.value].url;
  dialogImgVisible.value = false;
};

const beforeCloseImg = () => {
  dialogImgVisible.value = false;
};

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
  list: [],
  total: 0,
});

// 请求列表
const getListData = () => {
  companionList(paginationData).then(({ data }) => {
    console.log(data, "staff");
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};

// 勾选信息
const selectTableData = ref([]);
// 多选列表
const handleSelectionChange = (val) => {
  // 选中当前行时，对勾选信息进行赋值
  selectTableData.value = val.map((item) => ({ id: item.id }));
};

// 多选列表删除
// 确认删除
const confirmEvent = () => {
  if (!selectTableData.value.length) {
    return ElMessage.warn("请选择至少一项数据进行删除");
  } else {
    deleteCompanion({ id: selectTableData.value }).then(({ data }) => {
      if (data.code === 10000) {
        ElMessage.success("删除成功！");
        getListData();
      }
    });
  }
};
</script>
<style scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.flex-box {
  display: flex;
  align-items: center;
}
</style>
