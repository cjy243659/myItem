<template>
  <div>
    <el-button type="primary" @click="willAdd">添 加</el-button>

    <v-list @edit='edit'></v-list>

    <v-form :info='info' ref='form'></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
// 引入组件
import vList from './components/list'
import vForm from './components/form'
export default {
  // 注册组件
  components:{
    vList,
    vForm
  },
  data(){
    return {
      info:{
        isshow:false,
        title:'添加活动'
      }
    }
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    // 点击添加
    willAdd(){
      this.info={
        isshow:true,
        title:'添加活动'
      }
    },
    edit(id){
      this.info={
        isshow:true,
        title:"编辑活动"
      }
      this.$refs.form.getOne(id)
    }
  },
  mounted() {}
};
</script>
<style scoped>
</style>