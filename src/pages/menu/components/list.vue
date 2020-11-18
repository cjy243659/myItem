<template>
  <div>
    <!-- 展示list -->
    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children'}"
    >
      <!-- 菜单编号 -->
      <el-table-column prop="id" label="菜单编号" width="180"></el-table-column>

      <!-- 菜单名称 -->
      <el-table-column prop="title" label="菜单名称" width="180"></el-table-column>

      <!-- 菜单图标 -->
      <el-table-column prop="icon" label="菜单图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>

      <!-- 菜单地址 -->
      <el-table-column prop="url" label="菜单地址" width="180"></el-table-column>

      <!-- 状态 -->
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row.id)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { successAlert, errorAlert } from "../../../utils/alert";
import { reqMenuDel } from "../../../utils/https";
export default {
  // 子组件通过props来取父组件传过来的值
  props: ["list"],
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 删除一条数据
    del(id) {
      // 每一行对应的id号
      // console.log(id);
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除的请求
          reqMenuDel(id).then((res) => {
            if (res.data.code == 200) {
              //成功后出现弹窗
              successAlert(res.data.msg);
              //通知父组件刷新list
              this.$emit("init");
            } else {
              errorAlert(res.data.msg);
            }
          });
        })
        .catch(() => {
          alert("已取消");
        });
    },
    // 点击编辑按钮
    /* 
      点击编辑后，要要去获取当前点击的数据，然后传递给form弹窗，所以直接在form组件中发请求
      点击编辑，通知父组件要要编辑了，然后父组件通知form弹窗去请求数据
      list---menu---form
    */
    edit(id) {
      //通知父组件，要编辑了
      this.$emit("edit", id);
    },
  },
  mounted() {},
};
</script>
<style>
</style>