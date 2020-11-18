<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow">
      <el-form :rules="rules">
        <!-- 规格名称 -->
        <el-form-item label="规格名称" label-width="120px" prop="specsname">
          <!-- 通过v-model将user绑定到表单上 -->
          <el-input v-model="user.specsname" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 规格属性 -->
        <el-form-item label="规格属性" label-width="120px" v-for="(item,index) in attrArr" :key="index">
          <!-- {{attrArr}} -->
          <div class="line">
            <!-- 将attrArr的value绑定到input框中 -->
            <el-input v-model="item.value" autocomplete="off"></el-input>
            <el-button type="primary" v-if="index===0" @click="addAttr">添加规格属性</el-button>
            <el-button type="danger" v-else @click="delAttr(index)">删除</el-button>
          </div>
        </el-form-item>

        <!--状态 -->
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <!-- 底部  修改 添加 取消 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add()" v-if="info.title==='添加规格'">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
// 引入请求
import {
  reqspecsAdd,
  reqspecsDetail,
  reqspecsUpdate,
} from "../../../utils/https";

// 引入弹窗
import { errorAlert, successAlert } from "../../../utils/alert";

export default {
  // 接收弹窗状态
  props: ["info"],
  data() {
    return {
      //初始化user
      user: {
        specsname: "",
        attrs: "",
        status: 1,
      },
      //属性值  自己控制自己
      attrArr: [{ value: "" }],
      rules: {
        specsname: [
          { required: true, message: "请输入规格名称", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqList: "specs/reqList",
      reqCount: "specs/reqCount",
    }),
    // 点击取消按钮
    cancel() {
      this.info.isshow = false;
    },
    // 清空user数据
    empty() {
      this.user = {
        specsname: "",
        attrs: "",
        status: 1,
      };
      //属性值
      this.attrArr = [{ value: "" }];
    },
    //新增规格属性
    addAttr() {
      this.attrArr.push({
        value: "",
      });
    },
    //删除规格属性
    delAttr(index) {
      this.attrArr.splice(index, 1);
    },
    //点击添加
    add() {
      this.check().then(() => {
        // console.log(this.attrArr);//[{value:"s"},{value:"m"},{value:"l"}]--["s","m","l"]
        // user中的attrs真正要用的是属性值里面的value
        // 使用map遍历attrArr，取出value，返回新的数组
        this.user.attrs = JSON.stringify(
          this.attrArr.map((item) => item.value)
        );
        //发送添加请求 把user给后台传过去
        reqspecsAdd(this.user).then((res) => {
          if (res.data.code === 200) {
            // 成功弹窗
            successAlert("添加成功");
            // 弹窗关闭  清空user和attrArr
            this.cancel();
            this.empty();
            //刷新list 重请总数
            this.reqList();
            this.reqCount();
          }
        });
      });
    },
    // 获取一条信息
    getOne(id) {
      reqspecsDetail(id).then((res) => {
        if (res.data.code === 200) {
          this.user = res.data.list[0];
          // "["20","22","24"]"--->-->[{value:"s"},{value:"M"}]
          // 处理属性
          // JSON.parse是从一个字符串中解析出json(键值对)
          this.attrArr = JSON.parse(this.user.attrs).map((item) => ({
            value: item,
          }));
        }
      });
    },
    // 点击修改
    update() {
      this.check().then(() => {
        // 修改属性值格式
        // JSON.stringify是从一个对象中解析出字符串  展示在页面中的是字符串
        this.user.attrs = JSON.stringify(
          this.attrArr.map((item) => item.value)
        );
        // 发送修改信息的请求
        reqspecsUpdate(this.user).then((res) => {
          if (res.data.code === 200) {
            // 成功弹窗弹出
            successAlert("修改成功");
            // 弹窗消失
            this.cancel();
            // user清空
            this.empty();
            //刷新列表
            this.reqList();
          }
        });
      });
    },
    // 验证
    check() {
      return new Promise((resolve, reject) => {
        if (this.user.specsname === "") {
          errorAlert("规格名称不能为空");
          return
        }
        resolve();
      });
    },
  },
  mounted() {},
};
</script>
<style scope>
.line {
  display: flex;
}
.inp {
  flex: 1;
}
.Btn {
  width: auto;
}
</style>