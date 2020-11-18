<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow">
      <el-form :model="user" :rules="rules">
        <!-- 手机号 -->
        <el-form-item label="手机号" label-width="120px" prop="phone">
          <!-- 通过v-model将user绑定到表单上 -->
          <el-input v-model="user.phone" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" label-width="120px" prop="nickname">
          <!-- 通过v-model将user绑定到表单上 -->
          <el-input v-model="user.nickname" autocomplete="off"></el-input>
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
        <el-button type="primary" @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

// 引入请求
import { reqmemberInfo, reqmemberEdit } from "../../../utils/https";

// 引入弹窗
import { successAlert, errorAlert } from "../../../utils/alert";

export default {
  // 接收弹窗状态
  props: ["info"],
  data() {
    return {
      // 角色列表
      roleList: [],
      //初始化user
      user: {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
      // 验证
      rules: {
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqList: "vip/reqList",
    }),
    // 点击取消按钮
    cancel() {
      this.info.isshow = false;
    },
    // 清空user数据
    empty() {
      this.user = {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      };
    },
    // 获取一条信息
    getOne(uid) {
      reqmemberInfo(uid).then((res) => {
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
        reqmemberEdit(this.user).then((res) => {
          if (res.data.code === 200) {
            // console.log(this.user)
            // 成功弹窗弹出
            successAlert("修改成功");
            // 弹窗消失
            this.cancel();
            // user清空
            this.empty();
            this.reqList();
          }
        });
      });
    },
    //验证
    check() {
      return new Promise((resolve, reject) => {
        if (this.user.nickname === "") {
          errorAlert("昵称不能为空");
          return;
        }
        if (this.user.phone === "") {
          errorAlert("手机号不能为空");
          return;
        }
        resolve();
      });
    },
  },
  mounted() {},
};
</script>
<style>
</style>