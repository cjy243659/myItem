<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 将列表数据传给list -->
    <v-list :list='list' @init='init' @edit='edit'></v-list>

    <!-- 将info(弹窗状态)传递给form -->
    <!-- 父组件自定义事件 -->
    <!-- 父组件调用form的方法 ref -->
    <v-form :info="info" @init="init" ref='form'></v-form>
  </div>
</template>
<script>
// 引入子组件
import vList from "./components/list";
import vForm from "./components/form";

// 辅助函数
import { mapGetters, mapActions } from "vuex";

// 进入axios请求
import { reqRoleList } from "../../utils/https";

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
        title:'添加角色'
      },
      list:[]
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 点击添加按钮，弹窗显示
    willAdd() {
      this.info.isshow = true;
    },
    // 请求列表数据 因为list和form都要用到角色列表数据，所以放在父组件里
    init() {
      reqRoleList().then((res) => {
        console.log(res);
        this.list = res.data.list;
      });
    },
    // 编辑
    edit(id){
      this.info={
        // 弹出框显示
        isshow:true,
         // 加title字段，用来判断是编辑还是添加
        title:'编辑角色'
      }
      // 调用form的方法  用refs
      this.$refs.form.getOne(id)
    }
  },
  mounted() {
    // 进来就去请求角色列表数据
    this.init()
  },
};
</script>
<style scoped>
</style>