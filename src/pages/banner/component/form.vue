
<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow">
      <el-form :model="user" :rules="rules">
        <!-- 标题 -->
        <el-form-item label="标题" label-width="120px" prop="title">
          <!-- 通过v-model将user绑定到表单上 -->
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 图片 -->
        <!-- 如果用户选择的不是顶级目录图片就显示，如果是顶级目录图片就不显示 -->
        <!-- 原生js上传文件 -->
        <el-form-item label="图片" label-width="120px" v-if="user.pid!==0">
          <div class="div">
            <h3 class="h3">+</h3>
            <!-- 有一个小框：有图片就展示图片没有就不显示 -->
            <img :src="imgUrl" class="img" v-if="imgUrl" />
            <!-- 表单用change事件 -->
            <input type="file" class="input" v-if="info.isshow" @change="changeFile" />
          </div>
        </el-form-item>

        <!-- <el-upload
          action="#"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog> -->

        <!--状态 -->
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <!-- 底部  修改 添加 取消 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title==='添加轮播图'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
// 引入请求
import {
  reqbannerAdd,
  reqbannerInfo,
  reqbannerEdit,
} from "../../../utils/https";
// 引入弹窗
import { successAlert, errorAlert } from "../../../utils/alert";
// 引入path
import path from "path";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        title: "",
        img: null,
        status: 1,
      },
      // 初始化图片路径
      imgUrl: "",
      // 验证
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqList: "banner/reqList",
    }),
    // 点击取消
    cancel() {
      this.info.isshow = false;
    },
    // 清空user
    empty() {
      this.user = {
        title: "",
        img: null,
        status: 1,
      };
      this.imgUrl = "";
    },
    // 点击选择文件
    changeFile(e) {
      // 文件列表：  文件名字 大小 类型 最后修改时间戳
      // console.log(e.target.files[0]);
      //  获取到文件
      let file = e.target.files[0];
      //  判断上传的是不是图片  用后缀名判断
      let extname = path.extname(file.name);
      //   console.log(extname);
      let arr = [".jpg", ".jpeg", ".png", ".gif"];
      if (!arr.includes(extname)) {
        errorAlert("请上传正确的文件格式！");
        return;
      }
      // 判断图片大小  ile.size B ，1M=1024KB 1KB=1024B
      if (file.size > 2 * 1024 * 1024) {
        errorAlert("上传文件不能超过2M！");
        return;
      }
      // 给user.img赋值完后，还要显示到页面中
      //URL.createObjectURL(file) 将一个文件生成一个URL地址
      this.imgUrl = URL.createObjectURL(file);
      //文件还要传给后端 --- 给user.img赋值
      this.user.img = file;
    },
    // 点击添加按钮
    add() {
      // 如果能通过验证再去请求添加
      this.check().then(() => {
        reqbannerAdd(this.user).then((res) => {
          if (res.data.code === 200) {
            console.log(this.user);
            successAlert("添加成功");
            this.cancel();
            this.empty();
            this.reqList();
          }
        });
      });
    },
    // 获取一条数据
    getOne(id) {
      reqbannerInfo(id).then((res) => {
        if (res.data.code === 200) {
          //此刻user没有id
          this.user = res.data.list;
          // 得到的路径没有http://localhost:3000  所以在vue原型上挂上http，在项目生产时设为空
          this.imgUrl = this.$imgPre + this.user.img;
          //补id
          this.user.id = id;
        }
      });
    },
    // 点击修改
    update() {
      this.check().then(() => {
        reqbannerEdit(this.user).then((res) => {
          if (res.data.code === 200) {
            console.log(res);
            successAlert("修改成功");
            this.cancel();
            this.empty();
            this.reqList();
          }
        });
      });
    },
    //验证
    check() {
      return new Promise((resolve, reject) => {
        if (this.user.title === "") {
          errorAlert("商品名称不能为空");
          return;
        }
        resolve();
      });
    },
  },
  mounted() {},
};
</script>
<style scoped>
.div {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed #ccc;
  position: relative;
}
.h3 {
  width: 100%;
  height: 100px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  color: #666;
  font-weight: 100;
}
.input {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>