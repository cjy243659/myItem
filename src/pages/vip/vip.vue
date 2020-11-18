<template>
  <div>
    <!-- 自定义属性传参，把管理员列表传递给list -->
    <v-list :userList="userList" @edit="edit"></v-list>

    <!-- 把弹窗状态传递给form  自定义事件 -->
    <v-form :info="info"  ref="form"></v-form>
  </div>
</template>
<script>
// 引入子组件
import vList from "./components/list";
import vForm from "./components/form";

import { mapGetters, mapActions } from "vuex";

// 引入请求
import { reqUserList, reqUserCount } from "../../utils/https";
export default {
  // 注册组件
  components: {
    vList,
    vForm,
  },
  data() {
    return {
      // 列表初始值
      userList: [],
      // 弹窗状态 标题
      info: {
        isshow: false,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqList:"vip/reqList"
    }),
    // 编辑  接收到list发来的编辑请求
    edit(uid) {
      // 弹窗出现
      this.info = {
        isshow: true,
        title: "编辑会员",
      };
      // 调用form的获取一条信息的方法
      this.$refs.form.getOne(uid);
    },
  },
  mounted() {
    // 一进来就请求列表数据
    this.reqList()
  },
};
</script>
<style scoped>
</style>