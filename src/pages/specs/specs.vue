<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添 加</el-button>

    <!-- 自定义属性传参，把管理员列表传递给list -->
    <v-list  @edit="edit"></v-list>

    <!-- 把弹窗状态传递给form  自定义事件 -->
    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
// 引入子组件
import vList from "./components/list";
import vForm from "./components/form";

import { mapGetters, mapActions } from "vuex";

export default {
  // 注册组件
  components: {
    vList,
    vForm,
  },
  data() {
    return {
      // 弹窗状态 标题
      info: {
        isshow: false,
        title: "添加规格",
      },
    };
  },
  computed: {
    ...mapGetters({
    }),
  },
  methods: {
    ...mapActions({
    }),
    // 点击添加按钮，弹窗出现
    willAdd() {
      this.info = {
        isshow: true,
        title: "添加规格",
      };
    },
    // 编辑  接收到list发来的编辑请求
    edit(id) {
      // 弹窗出现
      this.info = {
        isshow: true,
        title: "编辑规格",
      };
      // 调用form的获取一条信息的方法
      this.$refs.form.getOne(id);
    },
  },
  mounted() {
  },
};
</script>
<style scoped>
</style>