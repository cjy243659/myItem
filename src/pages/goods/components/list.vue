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
      <!-- 商品编号 -->
      <el-table-column prop="id" label="商品编号" sortable width="80"></el-table-column>

      <!-- 商品名称 -->
      <el-table-column prop="goodsname" label="商品名称" sortable></el-table-column>

      <!-- 商品价格 -->
      <el-table-column prop="price" label="商品价格" sortable></el-table-column>

      <!-- 市场价格 -->
      <el-table-column prop="market_price" label="市场价格" sortable></el-table-column>

      <!-- 图片 -->
      <el-table-column prop="img" label="图片">
        <template slot-scope="scope">
          <img :src="$imgPre+scope.row.img" alt />
        </template>
      </el-table-column>

      <!-- 是否新品 -->
      <el-table-column prop="isnew" label="是否新品" sortable>
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.isnew===1">是</el-button>
          <el-button type="danger" v-else>否</el-button>
        </template>
      </el-table-column>

      <!-- 是否热卖 -->
      <el-table-column prop="ishot" label="是否热卖" sortable>
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.isnew===1">是</el-button>
          <el-button type="danger" v-else>否</el-button>
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
      <el-table-column prop="name" label="操作" width="180">
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
import { reqgoodsDel, reqUserDetail } from "../../../utils/https";

// 引入弹窗
import { successAlert } from "../../../utils/alert";
export default {
  computed: {
    ...mapGetters({
      list: "goods/list",
      total:'goods/total',
      size:"goods/size"
    }),
  },
  methods: {
    ...mapActions({
      reqList: "goods/reqList",
      reqCount:'goods/reqCount',
      changePage:'goods/changePage'
    }),
    // 点击删除
    del(id) {
      // 发送删除一条信息的请求
      reqgoodsDel(id).then((res) => {
        if (res.data.code === 200) {
          // 弹出成功弹窗
          successAlert("删除成功");
          // 刷新列表
          this.reqList();
          // 请求总数
            this.reqCount();
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
    this.reqList()
    this.reqCount()
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