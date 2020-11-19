<template>
  <div class="login">
    <div class="con">
      <h3>登录</h3>
      <div class="line">
        <el-input v-model="user.username" placeholder="请输入账号" clearable></el-input>
      </div>
      <div class="line">
        <el-input v-model="user.password" placeholder="请输入密码" clearable show-password></el-input>
      </div>
      <div class="last">
        <el-button type="primary" @click="login" size="">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 辅助函数
import { mapActions, mapGetters } from "vuex";

// 引入请求
import { reqLogin } from "../../utils/https";
// 引入弹窗
import { successAlert } from "../../utils/alert";

export default {
  data() {
    return {
      // 初始化数据
      user: {
        username: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
    }),
    // 点击登录
    // 登陆成功后，要把data.list存起来，data.list是个对象，存的时候要json.stringify,取的时候要json.parse，有可能登录拦截没有这个值，本地存储会报错，所以存储在vuex内，vuex存在一个问题就是刷新就没了，所以要在本地和vuex各存一份，实现vuex和本地存储同步
    login() {
      // 发起登录请求 给后台传一个用户名密码过去
      reqLogin(this.user).then((res) => {
        // 登陆成功 成功弹窗出现
        successAlert("登陆成功");
        // 写入vuex
        // 触发changeUser方法，就会找到actions里面的方法，把obj传过去
        this.changeUser(res.data.list);
        // 跳转页面
        this.$router.push("/");
      });
    },
  },
  mounted() {},
};
</script>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(to right, #543444, #403a53, #303d5f);
}
.con {
  width: 450px;
  padding: 20px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  line-height: 40px;
}
h3 {
  text-align: center;
  margin: 10px;
}
.line {
  margin:0 45px;
  margin-bottom: 20px;
}
.last {
  text-align: center;
}
.el-button{
  width: 80%;
}
</style>