<template>
<!-- 
  菜单管理：添加按钮，商品列表表格，商品弹窗三大模块----拆分
 -->
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="add()">添加</el-button>

    <!-- 父组件通过自定义属性给子组件传值 
      自定义事件
    -->
    <v-list :list='list' @init="init"  @edit="edit($event)"></v-list>
    <!-- 将info list值传给 form
          通过ref获取子组件的方法
    -->
    <v-form :info='info'  :list="list" @init="init"  ref="form"></v-form>
  </div>
</template>
<script>
// 引入子组件 list、goods 
import vList from './components/list'
import vForm from './components/form'
// 辅助函数
import { mapGetters, mapActions } from "vuex";

import {reqMenuList} from '../../utils/https'

export default {
  // 注册组件
  components:{
    vList,
    vForm
  },
  data(){
    return {
      // 弹窗的状态
      info:{
        isshow:false,
        title:"添加菜单"
      },
      // 列表数据
      // 由于list.vue 和form.vue都要使用列表数据，所以将列表数据放到menu.vue中，分别传递给list.vue和form.vue
      list:[],
    }
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    // 点击添加按钮，弹出商品弹窗、
    add(){
      this.info.isshow=true
    },
    // 父组件自定义事件
    // 请求列表数据
    init(){
        reqMenuList().then(res=>{
          this.list=res.data.list
        })
    },
    //点击编辑
    edit(id){
      console.log(id)
      //弹窗弹出
      this.info.isshow=true
      //给info补了一个字段，用来判断是添加还是编辑打开的弹框
      this.info.title="编辑菜单"
      //父组件调用子组件 form.vue 的getOne()
      this.$refs.form.getOne(id)
    }
  },
  mounted() {
    // 一进来就要请求列表数据
    this.init()
  }
};
</script>
<style scoped>
</style>