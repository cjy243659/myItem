<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <!-- 角色编号 -->
      <el-table-column prop="id" label="角色编号"></el-table-column>

      <!-- 角色名称 -->
      <el-table-column prop="rolename" label="角色名称"></el-table-column>

      <!-- 状态 -->
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <!-- 判断每一条数据中的status 如果是1则启用 反之禁用 -->
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编 辑</el-button>
          <del-btn @confirm='del(scope.row.id)'></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

// 引入弹窗
import { successAlert } from "../../../utils/alert";

// 引入请求
import { reqRoleDel } from "../../../utils/https";

export default {
  // 接收数据列表
  props: ["list"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 删除
    del(id) {
      console.log(id)
      reqRoleDel(id).then((res) => {
        // 如果删除成功 code==200
        if (res.data.code === 200) {
          // 弹出成功弹窗
          successAlert("删除成功");
          // 通知父组件刷新列表
          this.$emit("init");
        }
      });
    },
    // 编辑
    edit(id) {
      /* 思路：
        通知父组件要编辑了，父组件设置title字段以便判断弹出的是编辑还是添加，弹出框显示
        父组件调用子组件的方法，获取一条数据，然后绑定到模板中
       */
      // 通知父组件编辑了
      this.$emit("edit", id);
    },
  },
  mounted() {},
};
</script>
<style>
</style>