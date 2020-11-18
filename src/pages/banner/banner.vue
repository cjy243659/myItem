<template>
  <div>
    <el-button type="primary" @click="willAdd">添 加</el-button>

    <v-list :info="info" @edit="edit"></v-list>

    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
// 引入组件
import vList from "./component/list";
import vForm from "./component/form";

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
        title: "添加轮播图",
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 点击添加
    willAdd() {
      (this.info.isshow = true), (this.info.title = "添加轮播图");
    },
    edit(id) {
      this.info = {
        isshow: true,
        title: "编辑轮播图",
      };
      //   调用form方法
      this.$refs.form.getOne(id);
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>