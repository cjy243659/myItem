<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
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
  // 注册子组件
  components: {
    vList,
    vForm,
  },
  data() {
    return {
      info: {
        isshow: false,
        title: "添加分类",
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 点击添加 弹窗出现
    willAdd() {
      this.info.isshow = true;
    },
    // 编辑  在list中点了编辑按钮，通知父组件编辑，父组件调用form的getOne方法
    edit(id) {
      this.info = {
        isshow: true,
        title: "编辑分类",
      };
      this.$refs.form.getOne(id);
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>