<template>
  <div>
    <el-button type="primary" @click="willAdd">添 加</el-button>

    <v-list @edit="edit"></v-list>

    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
// 引入子组件
import vList from "./components/list";
import vForm from "./components/form";

export default {
  // 注册组件
  components: {
    vList,
    vForm,
  },
  data() {
    return {
      info: {
        isshow: false,
        title: "添加商品管理",
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 点击添加按钮
    willAdd() {
      this.info = {
        isshow: true,
        title: "添加商品",
      };
    },
    // 编辑
    edit(id) {
      // 改变弹窗状态 和 标题
      this.info = {
        isshow: true,
        title: "编辑商品",
      };
      this.$refs.form.getOne(id);
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>