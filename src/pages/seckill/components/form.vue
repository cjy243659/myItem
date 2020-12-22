
<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow">
      <!-- 绑定验证规则 -->
      <el-form :model="user" :rules="rules">
        <!-- 绑定数据 -->
        <!-- 活动名称 -->
        <el-form-item label="活动名称" label-width="120px" prop="title">
          <el-input v-model="user.title" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="时间期限" label-width="120px">
          <!-- 时间期限 -->
          <!-- 如果弹窗的title是编辑活动那么时间就置空 -->
          <div class="block">
            <el-date-picker
              v-if="info.title!='添加活动'"
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <!-- 如果是编辑活动，就获取当前行的时间期限 -->
            <el-date-picker
              v-else
              v-model="value2"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <!-- 一级分类 -->
        <el-form-item label="一级分类" label-width="120px">
          <!-- @change="changeFirst" ： 一级分类发生变化了，重新计算二级分类-->
          <el-select placeholder="请选择一级分类" v-model="user.first_cateid" @change="changeFirst">
            <!--遍历一级分类 使用商品分类的数据 -->
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 二级分类 -->
        <el-form-item label="二级分类" label-width="120px">
          <!-- 二级分类列表通过一级分类id获取 -->
          <el-select placeholder="请选择二级分类" v-model="user.second_cateid">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 商品 -->
        <el-form-item label="商品" label-width="120px">
          <!-- 遍历  使用商品规格列表-->
          <!-- changeSpecsId方法：当商品规格改变的时候重新计算商品规格属性 -->
          <el-select placeholder="请选择商品" v-model="user.goodsid">
            <el-option v-for="item in list" :key="item.id" :label="item.goodsname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <!-- 底部 添加取消修改 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title==='添加活动'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update()">修 改</el-button>
      </div>
      <!-- {{value1[0]|filterTime}}
      {{value1[1]|filterTime}}-->
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
// 引入请求
import {
  reqcateList,
  reqseckAdd,
  reqseckInfo,
  reqseckEdit,
} from "../../../utils/https";
// 引入弹窗
import { errorAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        id: "",
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: [],
      //二级分类的list
      secondCateList: [],
      // 验证
      rules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/cateList",
      list: "goods/list",
    }),
  },
  methods: {
    ...mapActions({
      reqcateList: "cate/reqList",
      reqgoodsList: "goods/reqList",
      reqseckList: "seck/reqList",
    }),
    // 清空user
    empty() {
      this.user = {
        id: "",
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      (this.value1 = [
        new Date(2000, 10, 10, 10, 10),
        new Date(2000, 10, 11, 10, 10),
      ]),
        //二级分类的list
        (this.secondCateList = []);
    },
    // 点击了取消
    cancel() {
      this.info.isshow = false;
    },
    // 根据一级分类 拿到二级分类的数据
    changeFirst() {
      // 二级分类id重置  用户每选择不同的一级分类，都要重新请求二级分类
      this.user.second_cateid = "";
      this.getSecondList();
    },
    //获取二级分类列表
    getSecondList() {
      // 发送请求商品分类列表  给后台传一个一级分类的id
      reqcateList({ pid: this.user.first_cateid }).then((res) => {
        if (res.data.code === 200) {
          // 赋值给data中secondCateList
          this.secondCateList = res.data.list;
        }
      });
    },
    // 点击添加
    add() {
      this.check().then(() => {
        reqseckAdd(this.user).then((res) => {
          if (res.data.code === 200) {
            successAlert("添加成功");
            this.cancel();
            this.empty();
            this.reqseckList();
          }
        });
      });
    },
    // 获取一条数据
    getOne(id) {
      reqseckInfo(id).then((res) => {
        if (res.data.code === 200) {
          // 将请求回来的数据绑定到form中
          this.user = res.data.list;
          // 这里的user中没有id，补id
          this.user.id = id;
          // 获取二级分类list
          this.getSecondList();
        }
      });
    },
    // 处理时间
    getTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1 + "").padStart(2, 0);
      let day = (date.getDate() + "").padStart(2, 0);
      return `${year}-${month}-${day}`;
    },
    // 修改
    update() {
      this.check().then(() => {
        // 处理时间
        this.user.begintime = this.getTime(this.value1[0]);
        this.user.endtime = this.getTime(this.value1[1]);
        // 发送请求
        reqseckEdit(this.user).then((res) => {
          if (res.data.code === 200) {
            // 成功后，弹出成功弹窗--弹窗消失--清空user--刷新列表
            successAlert("修改成功");
            this.cancel();
            this.empty();
            this.reqseckList();
          }
        });
      });
    },
    // 验证
    check() {
      return new Promise((resolve, reject) => {
        if (this.user.title === "") {
          errorAlert("活动名称不能为空");
          return;
        }
        resolve();
      });
    },
  },
  mounted() {
    this.reqcateList();
    this.reqgoodsList();
  },
};
</script>
<style>
</style>