<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添 加</el-button>

    <!-- 自定义属性传参，把管理员列表传递给list -->
    <v-list :userList="userList" @init="newInit" @edit="edit"></v-list>

    <!-- 分页 -->
    <!-- current-change 页码发生改变时触发  参数是当前页-->
    <!-- @current-change="changePage"  这儿的方法不要加()-->
    <el-pagination
      background
      @current-change="changePage"
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
    ></el-pagination>

    <!-- 把弹窗状态传递给form  自定义事件 -->
    <v-form :info="info" @init="newInit" ref="form"></v-form>
  </div>
</template>
<script>
// 引入子组件
import vList from "./components/list";
import vForm from "./components/form";

import { mapGetters, mapActions } from "vuex";

// 引入请求
import { reqUserList, reqUserCount } from "../../utils/https";
export default {
  // 注册组件
  components: {
    vList,
    vForm,
  },
  data() {
    return {
      // 列表初始值
      userList: [],
      total: 0,
      page: 1,
      size: 2,
      // 弹窗状态 标题
      info: {
        isshow: false,
        title: "添加管理员",
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 点击添加按钮，弹窗出现
    willAdd() {
      this.info = {
        isshow: true,
        title: "添加管理员",
      };
    },
    // 请求列表
    init() {
      // 请求列表
      reqUserList({ page: this.page, size: this.size }).then((res) => {
        // 如果传进的页数还有值，就显示,否则就定义一个空数组，解决报错
        let list = res.data.list ? res.data.list : [];

        // 如果当前页是空的，那么就不显示当前页码
        // 取到的list是[],并且page>1,page自减
        if (list.length === 0 && this.page > 1) {
          // page自减号
          this.page--;
          // 重新请求列表
          this.init();
          return;
        }
        this.userList = list;
      });
    },
    // 获取总数
    getCount() {
      reqUserCount().then((res) => {
        this.total = res.data.list[0].total;
      });
    },
    // 当页码发生变化时，页码就是点击时的页码数 重新请求数据
    changePage(page) {
      (this.page = page),
        // 重新获取列表
        this.init();
    },
    // 编辑  接收到list发来的编辑请求
    edit(uid) {
      // 弹窗出现
      this.info = {
        isshow: true,
        title: "编辑管理员",
      };
      // 调用form的获取一条信息的方法
      this.$refs.form.getOne(uid);
    },
    // 当添加或删除的时候数据总数会发生变化，要重新请求数据总数和列表
    newInit() {
      // 请列表
      this.init();
      // 请总数
      this.getCount();
    },
  },
  mounted() {
    // 一进来就请求列表数据
    this.init();
    // 获取总数
    this.getCount();
  },
};
</script>
<style scoped>
</style>