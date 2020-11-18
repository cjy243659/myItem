<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow">
      <el-form :model="user" :rules="rules">
        <!--所属角色  -->
        <el-form-item label="所属角色" label-width="120px" prop="roleid">
          <!-- 通过v-model将user绑定到表单上 -->
          <el-select v-model="user.roleid" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :value="item.id"
              :label="item.rolename"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 用户名 -->
        <el-form-item label="用户名" label-width="120px" prop="username">
          <!-- 通过v-model将user绑定到表单上 -->
          <el-input v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>

        <!--状态 -->
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <!-- 底部  修改 添加 取消 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add()" v-if="info.title==='添加管理员'">添 加</el-button>
        <el-button type="primary" v-else @click="update()">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import {
  reqRoleList,
  reqUserAdd,
  reqUserDetail,
  reqUserUpdate,
} from "../../../utils/https";

// 引入弹窗
import { errorAlert, successAlert } from "../../../utils/alert";

export default {
  // 接收弹窗状态
  props: ["info"],
  data() {
    return {
      // 角色列表
      roleList: [],
      //初始化user
      user: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
      // 验证
      // 验证
      rules: {
        roleid: [{ required: true, message: "请输入所属角色", trigger: "change" }],
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 点击取消按钮
    cancel() {
      this.info.isshow = false;
    },
    // 清空user数据
    empty() {
      this.user = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    // 点击添加
    add() {
      this.check().then(() => {
        // 发送添加一条信息的请求
        reqUserAdd(this.user).then((res) => {
          if (res.data.code === 200) {
            // 弹出成功弹窗
            successAlert("添加成功");
            // 成功弹窗消失
            this.cancel();
            // user数据清空
            this.empty();
            // 通知父组件刷新列表
            this.$emit("init");
          }
        });
      });
    },
    // 获取一条信息
    getOne(uid) {
      reqUserDetail(uid).then((res) => {
        // 将获取到的信息绑定到form弹窗上
        this.user = res.data.list;
        // 处理密码
        this.user.password = "";
      });
    },
    // 点击修改
    update() {
      this.check().then(() => {
        // 发送修改信息的请求
        reqUserUpdate(this.user).then((res) => {
          if (res.data.code === 200) {
            // 成功弹窗弹出
            successAlert("修改成功");
            // 弹窗消失
            this.cancel();
            // user清空
            this.empty();
            // 通知父组件刷新列表
            this.$emit("init");
          }
        });
      });
    },
    // 验证
    check() {
      return new Promise((resolve, reject) => {
        if (this.user.roleid === "") {
          errorAlert("所属角色不能为空");
          return
        }
        if (this.user.username === "") {
          errorAlert("用户名不能为空");
          return
        }
        resolve();
      });
    },
  },
  mounted() {
    reqRoleList().then((res) => {
      if (res.data.code === 200) {
        this.roleList = res.data.list;
      }
    });
  },
};
</script>
<style>
</style>