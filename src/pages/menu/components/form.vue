<template>
  <div>
    <!-- 绑定数据到模板 -->
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <!--  -->
      <el-form :model="form" :rules="rules">
        <!-- 菜单名称 -->
        <el-form-item label="菜单名称" label-width="120px" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>

        <!--上级菜单 -->
        <el-form-item label="上级菜单" label-width="120px" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择" @change="changePid">
            <el-option label="顶级菜单" :value="0"></el-option>
            <!-- 23 list遍历 -->
            <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 菜单类型 -->
        <el-form-item label="菜单类型" label-width="120px">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>

        <!-- 菜单图标 -->
        <el-form-item label="菜单图标" v-if="form.type===1" label-width="120px">
          <el-select v-model="form.icon" placeholder="请选择">
            <el-option v-for="item in icons" :key="item" :value="item">
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 菜单地址 -->
        <el-form-item label="菜单地址" label-width="120px" v-else>
          <el-select v-model="form.url" placeholder="请选择">
            <!-- 10.遍历routes -->
            <el-option
              v-for="item in routes"
              :key="item.path"
              :label="item.name+'--/'+item.path"
              :value="'/'+item.path"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <!-- 底部 取消、添加 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title==='添加菜单'">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
// 引入路由
import { routes } from "../../../router";

// 引入弹窗js
import { successAlert, errorAlert } from "../../../utils/alert";

// 引入添加数据，请求一条数据，列表数据更新等请求
import { reqMenuAdd, reqMenuDetail, reqMenuUpdate } from "../../../utils/https";

export default {
  // 接收info list
  props: ["info", "list"],
  data() {
    return {
      //icon集合
      icons: [
        "el-icon-s-tools",
        "el-icon-user-solid",
        "el-icon-s-help",
        "el-icon-s-operation",
      ],
      //9.定义routes
      routes: routes,
      //11.初始化form,并通过v-model绑定数据到模板
      form: {
        pid: "",
        title: "",
        icon: "",
        type: "",
        url: "",
        status: 1,
      },
      // 验证
      rules: {
        title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        pid: [{ required: true, message: "请输入上级菜单", trigger: "change" }],
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
    // form清空
    empty() {
      this.form = {
        pid: "",
        title: "",
        icon: "",
        type: "",
        url: "",
        status: 1,
      };
    },
    // 点击添加按钮
    add() {
      this.check().then(() => {
        //发起添加的请求
        reqMenuAdd(this.form).then((res) => {
          if (res.data.code === 200) {
            // 弹一个成功的弹窗
            successAlert("添加成功");
            //弹框消失
            this.cancel();
            //清空form
            this.empty();
            //24.通知父组件menu刷新列表数据
            this.$emit("init");
          } else {
            errorAlert(res.data.msg);
          }
        });
      });
    },
    // 如果上级菜单是顶级菜单(目录，没有路径，有图标，所以只显示图标就可以) from.type=1
    // 如果是菜单(没有图标，有路径，所以只需要显示路径的选择就可以)  from.type=2
    changePid() {
      if (this.form.pid === 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    //获取一条数据
    getOne(id) {
      reqMenuDetail(id).then((res) => {
        //此时form上是没有id的
        this.form = res.data.list;
        //补id
        this.form.id = id;
      });
    },
    // 修改
    update() {
      this.check().then(() => {
        reqMenuUpdate(this.form).then((res) => {
          if (res.data.code === 200) {
            //成功弹框
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //form重置
            this.empty();
            //列表刷新
            this.$emit("init");
          } else {
            errorAlert(res.data.msg);
          }
        });
      });
    },
    //验证
    check() {
      return new Promise((resolve, reject) => {
        if (this.form.title === "") {
          errorAlert("菜单名称不能为空");
          return;
        }
        if (this.form.pid === "") {
          errorAlert("上级菜单不能为空");
          return;
        }
        resolve();
      });
    },
    // 关闭弹窗时判断打开的是添加弹窗还是编辑弹窗
    closed() {
      if (this.info.title === "编辑菜单") {
        // 编辑菜单点了取消数据就不在了，添加弹窗按了取消再次打开数据还在
        this.empty();
      }
    },
  },
  mounted() {},
};
</script>
<style>
</style>