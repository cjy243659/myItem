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
      <!-- 规格编号 -->
      <el-table-column prop="id" label="规格编号"></el-table-column>

      <!-- 规格名称 -->
      <el-table-column prop="specsname" label="规格名称"></el-table-column>

      <!-- 规格属性 -->
      <el-table-column prop="attrs" label="规格属性">
        <template slot-scope="scope">
          <!-- {{scope.row.attrs}} -->
          <el-tag v-for="item in scope.row.attrs" :key="item">{{item}}</el-tag>
        </template>
      </el-table-column>

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
          <!-- 调用confirm -->
          <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- current-change 页码发生改变时触发  参数是当前页-->
    <!-- @current-change="changePage"  这儿的方法不要加()-->
    <el-pagination
      background
      @current-change="changePage"
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
    ></el-pagination>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
// 引入请求
import { reqspecsDel, reqUserDetail } from "../../../utils/https";

// 引入弹窗
import { successAlert } from "../../../utils/alert";

export default {
  computed: {
    ...mapGetters({
      list:'specs/list',
      total: "specs/total",
      size: "specs/size",
    }),
  },
  methods: {
    ...mapActions({
      reqList:'specs/reqList',
      reqCount: "specs/reqCount",
      changePage: "specs/changePage",
    }),
    // 点击删除
    del(id) {
      // 发送删除一条信息的请求
      reqspecsDel(id).then((res) => {
        if (res.data.code === 200) {
          // 弹出成功弹窗
          successAlert("删除成功");
          // 刷新列表
          this.reqList();
          // 请求总数
          this.reqCount()
        }
      });
    },
    // 点击编辑
    edit(id) {
      // 通知父组件点了编辑
      this.$emit("edit", id);
    },
  },
  // 一进来就请求列表和总数
  mounted() {
    this.reqList();
    this.reqCount();
  },
};
</script>
<style>
.el-pagination {
  text-align: right;
  margin-top: 10px;
}
</style>