<template>
  <div>
    <!-- 标题 -->
    <!-- 绑定close 如果title为编辑则再次打开数据清空 -->
    <el-dialog title="添加角色" :visible.sync="info.isshow" @close='close'>
      <el-form :model="user">
        <!-- 角色名称 -->
        <el-form-item label="角色名称" label-width="120px">
          <el-input v-model="user.rolename" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 角色权限  树形控件-->
        <el-form-item label="角色权限" label-width="120px">
          <!-- menuList绑定到tree，配置props -->
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="{children: 'children',label: 'title'}"
            default-expand-all
          ></el-tree>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <!-- 底部 取消、添加 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加角色'" @click="Add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
//引入请求
import { reqMenuList, reqRoleAdd, reqRoleDetail,reqRoleUpdade } from "../../../utils/https";

// 引入弹窗
import { successAlert, errorAlert} from "../../../utils/alert";

export default {
  // 接收弹窗状态
  props: ["info"],
  data() {
    return {
      // 菜单列表---角色权限
      menuList: [],
      // 角色名称 状态
      user: {
        rolename: "",
        menus: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 点击取消按钮，弹窗消失
    cancel() {
      this.info.isshow = false;
    },
    // 清空user数据
    empty() {
      this.user = {
        rolename: "",
        menus: "",
        status: 1,
      };
      //清空树形控件
      // setCheckedKeys  设置目前勾选的节点
      this.$refs.tree.setCheckedKeys([]);
    },
    // 点击添加按钮
    Add() {
      /* user和树形控件是两个部分，所以要单独把树形控件的数据拿出来赋值给 user.menus*/
      /* 
        后台要的字段是字符串数组 数组转为字符串数组 JSON.stringify()
        getCheckedKeys:
            若节点可被选择,则返回目前被选中的节点的key所组成的数组,也就是将被勾选的节点赋值给树形控件
      */
      // 当点击了添加按钮，将被勾选的节点赋值给树形控件
      this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      // 发送添加数据的请求
      reqRoleAdd(this.user).then((res) => {
        //   如果code为200的话则成功
        if (res.data.code === 200) {
          // 弹出成功弹窗
          successAlert("添加成功");
          // 弹窗消失
          this.cancel();
          // 清空user数据
          this.empty();
          // 刷新角色列表数据 通知父组件要添加一条新的数据了，然后父组件调用list中请求角色列表的方法
          this.$emit("init");
        }
        // 因为每一个组件中都要用到失败弹窗，失败信息也是后台给的，所以讲失败弹窗进行了封装，在后台响应拦截时就自动的把失败的弹窗就弹出来了
      });
    },
    /* 
        因为获取到的这一条数据要展示在form弹窗中，所以就直接在form中请求了
    */
    // 获取一条数据----当前所点id对象的数据
    getOne(id) {
      reqRoleDetail(id).then((res) => {
        // 将请求到的数据添加到user中
        // user中没有id字段
        this.user = res.data.list;
        /* 
            处理树形控件的数据:setCheckedKeys
                user传入什么节点setCheckedKeys就设置什么节点
        */
        //后台要的数据是字符串数组
        this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus));

        // 给user补一个id
        this.user.id = id;
      });
    },
    // 修改
    update(){
        reqRoleUpdade(this.user).then(res=>{
            // 弹出成功弹窗
            successAlert('修改成功')
            // 弹窗消失
            this.cancel()
            // 清空user数据
            this.empty()
            // 通知父组件刷新列表
            this.$emit('init')
        })
    },
    // 如果title为编辑角色，则点了取消，再次打开数据清空，如果不是编辑按钮，不做处理
    close(){
        if(this.info.title==='编辑角色'){
            this.empty()
        }
    }
  },
  mounted() {
    //请求菜单列表
    reqMenuList().then((res) => {
      if (res.data.code === 200) {
        console.log(res);
        this.menuList = res.data.list;
      }
    });
  },
};
</script>
<style>
</style>