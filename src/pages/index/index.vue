<template>
  <div>
    <el-container>
      <!-- 侧边导航 -->
      <!-- 
           unique-opened：是否只打开一个子菜单，boolean值，默认为false
           router：是否使用 vue-router 的模式，启用该模式会在激活导航时以index作为path进行路由跳转
           default-active：默认活动，就是一进入页面哪个有默认样式
           active-text-color:活动时的文本颜色(点击该元素时的样式)
      -->
      <el-aside width="200px">
        <!-- 导航菜单 -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#20222A"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
          default-active="/"
        >
          <!-- 首页 -->
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <!-- 动态侧边栏：根据用户权限展示不同的目录和菜单 -->
          <!-- 遍历userInfo.menus -->
          <div v-for="item in userInfo.menus" :key="item.id">
            <!-- 如果有 children 的话 说明是目录-->
            <!--  Expected String with value "11", got Number with value 11.
                要得到的是字符串的值，所以使用隐式转换将数值类型变成字符串
            -->
            <el-submenu :index="item.id+''" v-if="item.children">
              <template slot="title">
                <!-- 动态图标 -->
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <!-- 遍历目录下的菜单 -->
                <el-menu-item v-for="i in item.children" :key="i.id" :index="i.url">{{i.title}}
                  <!-- {{i.url}} -->
                </el-menu-item>
              </el-menu-item-group>
              
            </el-submenu>
            <!-- 没有children 就是菜单 没有图标，只需要遍历路径，添加标题就可以了-->
            <el-menu-item v-else :index="item.url">{{item.title}}</el-menu-item>
          </div>

          <!-- 系统设置 -->
          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>系统设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/menu">菜单管理</el-menu-item>
              <el-menu-item index="/role">角色管理</el-menu-item>
              <el-menu-item index="/manage">管理员管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>-->

          <!-- 商城管理 -->
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span>商城管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/cate">商品分类</el-menu-item>
              <el-menu-item index="/specs">商品规格</el-menu-item>
              <el-menu-item index="/goods">商品管理</el-menu-item>
              <el-menu-item index="/vip">会员管理</el-menu-item>
              <el-menu-item index="/banner">轮播图管理</el-menu-item>
              <el-menu-item index="/seckill">秒杀活动</el-menu-item>
            </el-menu-item-group>
          </el-submenu>-->
        </el-menu>
      </el-aside>

      <!-- 中间部分：header  main -->
      <el-container>
        <!-- 头部 -->
        <el-header>
          <span>{{userInfo.username}}</span>
          <el-button type="primary" @click="outLogin()">退出登录</el-button>
        </el-header>

        <!-- main -->
        <el-main>
          <!-- 面包屑 -->
          <!--separator-class：分隔符，使用之后separator失效 -->
          <!-- 如果本身就是首页home的话，就不用显示首页两个字了 -->
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="$route.name">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
          </el-breadcrumb>

          <!-- 二级路由出口 -->
          <!--因为所有组件的内容都要展现在main中，所以路由出口写在main里面 -->

          <router-view class="main"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      // 取出数据，userInfo.menus就是登录用户的权限，记录着用户可以访问哪些页面
      userInfo: "userInfo",
    }),
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
    }),
    // 退出登录
    outLogin() {
      // 清掉vuex和本地存储---给changeUser传一个空对象
      // 本地存储是在仓库中的数据中存储的，所以要在mutations中改变
      this.changeUser({});
      // 跳转页面
      this.$router.push("/login");
    },
  },
  mounted() {
    console.log(this.$store);
  },
};
</script>
<style scoped>
.el-container {
  height: 100vh;
  width: 100vw;
}
.el-aside {
  height: 100%;
  background-color: #20222a;
}
.el-header {
  background: #b3c0d1;
}
.main {
  padding-top: 20px;
}
.el-header {
  text-align: right;
  line-height: 55px;
}
</style>