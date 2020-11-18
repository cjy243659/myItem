
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
      <!-- 活动名称 -->
      <el-table-column prop="title" label="活动名称" width="120"></el-table-column>

      <!-- 状态 -->
      <el-table-column prop="status" label="状态" width="200">
        <template slot-scope="scope">
          <!-- 判断每一条数据中的status 如果是1则启用 反之禁用 -->
          <el-button type="success" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column prop="name" label="操作" width="auto">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编 辑</el-button>
          <!-- 调用confirm -->
          <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
// 引入请求
import { reqseckDel } from "../../../utils/https";
// 引入弹窗
import { successAlert } from "../../../utils/alert";
export default {
  computed: {
    ...mapGetters({
      list: "seck/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "seck/reqList",
    }),
    // 删除
    del(id) {
      reqseckDel(id).then((res) => {
        if (res.data.code === 200) {
          successAlert("删除成功");
          this.reqList()
        }
      });
    },
    // 编辑
    edit(id){
      this.$emit("edit",id)
    }
  },
  mounted() {
    //   一进页面就请求列表
    this.reqList();
  },
};
</script>
<style>
</style>