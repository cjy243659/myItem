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
      <!-- 用户编号 -->
      <el-table-column prop="uid" label="编号"></el-table-column>

      <!-- 用户名 -->
      <el-table-column prop="nickname" label="昵称"></el-table-column>

      <!-- 所属角色 -->
      <el-table-column prop="phone" label="手机号"></el-table-column>

      <!-- 密码 -->
      <el-table-column prop="password" label="密码"></el-table-column>

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
          <el-button type="primary" @click="edit(scope.row.uid)">编 辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

// 引入弹窗
import { successAlert } from "../../../utils/alert";

export default {
  // 接收父组件传过来的值
  props: ["userList","total"],
  computed: {
    ...mapGetters({
      list:'vip/list'
    }),
  },
  methods: {
    ...mapActions({
      reqList:'vip/reqList'
    }),
    // 点击编辑
    edit(uid) {
      // 通知父组件点了编辑
      this.$emit("edit", uid);
    },
  },
  mounted() {
    // 一进页面就去请求会员列表
    this.reqList()
  },
};
</script>
<style>
.el-pagination{
  text-align: right;
  margin-top: 10px;
}
</style>