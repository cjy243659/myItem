<template>
  <div>
    <el-table
      :data="cateList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <!-- 分类编号 -->
      <el-table-column prop="id" label="分类编号" width="100"></el-table-column>

      <!-- 分类名称 -->
      <el-table-column prop="catename" label="分类名称" width="250"></el-table-column>

      <!-- 图片 -->
      <el-table-column label="图片">
        <template slot-scope="scope" >
          <!-- $imgPre----http://localhost:3000 
              得到的地址没有$imgPre
          -->
          <img :src="$imgPre+scope.row.img" v-if='scope.row.pid' alt />
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
import { reqcateDel } from "../../../utils/https";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  computed: {
    // 取数据
    ...mapGetters({
      cateList: "cate/cateList",
    }),
  },
  //取方法
  methods: {
    ...mapActions({
      reqList: "cate/reqList",
    }),
    // 删除
    del(id) {
      reqcateDel(id).then((res) => {
        // 如果删除成功 code==200
        if (res.data.code === 200) {
          // 弹出成功弹窗
          successAlert("删除成功");
          // 刷新列表
          this.reqList();
        }
      });
    },
    //编辑
    edit(id) {
      this.$emit("edit", id);
    },
  },
  mounted() {
    // 商品分类列表
    this.reqList();
  },
};
</script>
<style scope>
img{
  width: 80px;
  height: 80px;
}
</style>