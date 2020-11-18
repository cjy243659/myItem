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
      <el-table-column prop="id" label="编号"></el-table-column>

      <!-- 用户名 -->
      <el-table-column prop="title" label="轮播图标题"></el-table-column>

      <!-- 图片 -->
      <el-table-column label="图片">
        <template slot-scope="scope">
          <!-- $imgPre----http://localhost:3000 
              得到的地址没有$imgPre
          -->
          <img :src="$imgPre+scope.row.img" alt />
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
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

// 引入弹窗
import { successAlert } from "../../../utils/alert";
// 引入请求
import { reqbannerDel } from "../../../utils/https";

export default {
  // 接收父组件传过来的值
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "banner/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "banner/reqList",
    }),
    // 点击编辑
    edit(id) {
      //   通知父组件调用form的getOne方法
      this.$emit("edit", id);
    },
    // 点击删除
    del(id) {
        console.log(id)
      reqbannerDel(id).then((res) => {
        if (res.data.code === 200) {
          successAlert("删除成功");
          this.reqList();
        }
      });
    },
  },
  mounted() {
    //   一进来页面就请求列表
    this.reqList();
  },
};
</script>
<style>
.el-pagination {
  text-align: right;
  margin-top: 10px;
}
img {
  width: 80px;
  height: 80px;
}
</style>