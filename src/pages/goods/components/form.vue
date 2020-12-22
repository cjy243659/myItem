
<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @opened="opened" @closed="closed">
      <!-- 绑定验证规则 -->
      <el-form :model="user" :rules="rules">
        <!-- 绑定数据 -->

        <!-- 一级分类 -->
        <el-form-item label="一级分类" label-width="120px" prop="first_cateid">
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
        <el-form-item label="二级分类" label-width="120px" prop="second_cateid">
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

        <!-- 商品名称 -->
        <el-form-item label="商品名称" label-width="120px" prop="goodsname">
          <el-input v-model="user.goodsname" placeholder="请输入商品名称"></el-input>
        </el-form-item>

        <!-- 价格 -->
        <el-form-item label="价格" label-width="120px" prop="price">
          <el-input v-model="user.price" placeholder="请输入价格"></el-input>
        </el-form-item>

        <!-- 市场价格 -->
        <el-form-item label="市场价格" label-width="120px" prop="market_price">
          <el-input v-model="user.market_price" placeholder="请输入市场价格"></el-input>
        </el-form-item>

        <!-- 图片 -->
        <el-form-item label="图片" label-width="120px">
          <!-- 上传文件 -->
          <div class="myupload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl" alt />
            <input v-if="info.isshow" type="file" class="ipt" @change="changeFile" />
          </div>
        </el-form-item>

        <!-- 商品规格 -->
        <el-form-item label="商品规格" label-width="120px" prop="specsid">
          <!-- 遍历  使用商品规格列表-->
          <!-- changeSpecsId方法：当商品规格改变的时候重新计算商品规格属性 -->
          <el-select placeholder="请选择商品规格" v-model="user.specsid" @change="changeSpecsId">
            <el-option
              v-for="item in specslist"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 规格属性 -->
        <el-form-item label="规格属性" label-width="120px" prop="specsattr">
          <!-- multiple 写上multiple可以实现下拉框多选 -->
          <el-select placeholder="请选择规格属性" v-model="user.specsattr" multiple>
            <el-option v-for="item in attrsList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <!-- 是否新品 -->
        <el-form-item label="是否新品" label-width="120px">
          <el-radio v-model="user.isnew" :label="1">是</el-radio>
          <el-radio v-model="user.isnew" :label="2">否</el-radio>
        </el-form-item>

        <!-- 是否热卖 -->
        <el-form-item label="是否热卖" label-width="120px">
          <el-radio v-model="user.ishot" :label="1">是</el-radio>
          <el-radio v-model="user.ishot" :label="2">否</el-radio>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>

        <!-- 描述 -->
        <el-form-item label="描述" label-width="120px">
          <!-- 富文本编辑器 
            使用：安装-cnpm i wangeditor --save
                引入 import E from "wangeditor";
                创建一个编辑器
          -->
          <!-- 如果弹窗状态为false的话，就删除div节点，解决编辑器嵌套 -->
          <div v-if="info.isshow" id="edit"></div>
        </el-form-item>
      </el-form>

      <!-- 底部 添加取消修改 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title==='添加商品'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
// 引入请求
import {
  reqcateList,
  reqgoodsAdd,
  reqgoodsDetail,
  reqgoodsUpdate,
} from "../../../utils/https";
// 引入path模块
import path from "path";
// 引入富文本编辑器
import E from "wangeditor";
// 引入成功失败弹窗
import { successAlert, errorAlert } from "../../../utils/alert";

export default {
  props: ["info"],
  data() {
    return {
      //1.初始化数据
      user: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //此时是数组，后端要的是 "[]"
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      //二级分类的list
      secondCateList: [],
      //图片临时地址
      imgUrl: "",
      //规格属性list
      attrsList: [],
      // 验证
      rules: {
        first_cateid: [
          { required: true, message: "请输入一级分类", trigger: "change" },
        ],
        second_cateid: [
          { required: true, message: "请输入二级分类", trigger: "change" },
        ],
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        market_price: [
          { required: true, message: "请输入商品市场价格", trigger: "blur" },
        ],
        specsid: [
          { required: true, message: "请输入商品规格", trigger: "change" },
        ],
        specsattr: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个规格属性",
            trigger: "change",
          },
        ],
      },
    };
  },

  computed: {
    ...mapGetters({
      cateList: "cate/cateList",
      specslist: "specs/list",
    }),
  },
  methods: {
    // 从仓库中取方法
    ...mapActions({
      //请求商品分类列表
      reqCateList: "cate/reqList",
      //请求规格list
      reqSpecsList: "specs/reqList",
      //商品list和总数
      reqGoodsList: "goods/reqList",
      reqGoodsCount: "goods/reqCount",
    }),
    // 清空user
    empty() {
      (this.user = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //此时是数组，后端要的是 "[]"
        isnew: 1,
        ishot: 1,
        status: 1,
      }),
        //二级分类的list
        (this.secondCateList = []),
        //图片临时地址
        (this.imgUrl = ""),
        //规格属性list
        (this.attrsList = []);
    },
    // 根据一级分类 拿到二级分类的数据
    changeFirst() {
      // 二级分类id重置 每一次去请求二级分类数据的时候都要清空之前获取的数据
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
    // 修改了规格，重新计算规格属性
    changeSpecsId() {
      // 将specsattr规格属性置空
      this.user.specsattr = [];
      this.getAttrs();
    },
    // 获取商品规格属性
    getAttrs() {
      // 取出 specsList ,哪条数据的id和this.user.specsid是一样的
      // this.user.specsid 是商品规格
      // 查找一条数据是否符合条件 并返回一个对象 用find
      let obj = this.specslist.find((item) => item.id === this.user.specsid);

      // console.log(obj)
      // console.log(this.user.specsid)

      //将这条数据--obj中的attrs取出来赋值给商品属性的list
      this.attrsList = obj.attrs;
    },
    // 处理图片
    changeFile(e) {
      // e代表Event对象
      console.log(e);
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
    // 点击取消
    cancel() {
      this.info.isshow = false;
    },
    //弹窗状态为false的时候，并且动画结束的时候，如果title是编辑商品管理，那么置空弹窗
    closed() {
      if (this.info.title == "编辑商品") {
        this.empty();
      }
    },
    // 当弹窗打开，并且动画完成的时候执行
    opened() {
      // 创建编辑器实例
      this.editor = new E("#edit");
      this.editor.create();
      //因为不知道弹窗先完成还是数据请求先完成，所以在弹窗动画完成后和请求完成后都取一遍赋值给user的描述
      this.user.description = this.editor.txt.html();
    },
    // 点击添加
    add() {
      // chenk返回一个promise对象，所以可以写then方法
      this.check().then(() => {
        //将编辑器的内容取出来给user.description
        //this.editor.txt.html() 取值
        this.user.description = this.editor.txt.html();
        //拷贝  后端要的是字符串数组 而user里面的specattr是数组
        // 用...实现深拷贝 赋值user的数据，改变复制后的user数据原user类型不改变
        // console.log(typeof(this.user.specsattr)+'22222222')//object
        let d = { ...this.user };
        d.specsattr = JSON.stringify(d.specsattr);
        // console.log(typeof(d.specsattr)+'333333333333')//string
        // console.log(typeof(this.user.specsattr)+'11111111')//object

        /* 直接去转字符串会把原来的user的类型改变，验证过不去 */
        // this.user.specsattr=JSON.stringify(this.user.specsattr)
        // console.log(this.user.specsattr)//string
        
        // 发送请求
        reqgoodsAdd(d).then((res) => {
          if (res.data.code === 200) {
            // 成功弹窗
            successAlert("添加成功");
            // 弹窗消失
            this.cancel();
            //刷新列表
            this.reqGoodsList();
            // 重请总数
            this.reqGoodsCount()
          }
        });
      });
    },
    // 编辑  获取一条信息
    getOne(id) {
      reqgoodsDetail(id).then((res) => {
        if (res.data.code === 200) {
          //将获取到的数据绑定到form弹窗上
          this.user = res.data.list;
          // 后台需要id，user中没有id，补id
          this.user.id = id;
          // 获取二级分类list
          this.getSecondList();
          // 图片处理
          // 获取到的图片没有http://localhost:3000 拼接上
          this.imgUrl = this.$imgPre + this.user.img;

          // 改变属性值格式
          this.user.specsattr = JSON.parse(this.user.specsattr);

          // 计算规格属性列表
          this.getAttrs();
          // 给编辑器赋值
          // 如果编辑器存在的话，也就是数据请求回来的话，就取出编辑器的值，赋值给user中的描述
          if (this.editor) {
            this.editor.txt.html(this.user.description);
          }
        }
      });
    },
    //修改
    update() {
      // 取出编辑器的值赋值给user的描述
      this.user.description = this.editor.txt.html();
      //拷贝  后端要的是字符串数组 而user里面的specattr是数组
      let d = { ...this.user };
      d.specsattr = JSON.stringify(d.specsattr);
      // 发送请求
      reqgoodsUpdate(d).then((res) => {
        if (res.data.code === 200) {
          // 成功后，弹出成功弹窗--弹窗消失--清空user--刷新列表
          successAlert("更新成功");
          this.cancel();
          this.empty();
          this.reqGoodsList();
        }
      });
    },
    //验证
    check() {
      return new Promise((resolve, reject) => {
        if (this.user.first_cateid === "") {
          errorAlert("一级分类不能为空");
          return;
        }
        if (this.user.second_cateid === "") {
          errorAlert("二级分类不能为空");
          return;
        }
        if (this.user.goodsname === "") {
          errorAlert("商品名称不能为空");
          return;
        }
        if (this.user.price === "") {
          errorAlert("商品价格不能为空");
          return;
        }
        if (this.user.market_price === "") {
          errorAlert("市场价格不能为空");
          return;
        }
        if (this.user.specsid === "") {
          errorAlert("商品规格不能为空");
          return;
        }
        if (this.user.specsattr === "") {
          errorAlert("规格属性不能为空");
          return;
        }
        resolve();
      });
    },
  },
  mounted() {
    // 一进来列表就去请求商品规格和分类 
    this.reqCateList();
    // 参数true，是为了取到所有的规格
    this.reqSpecsList(true);
  },
};
</script>
<style scoped>
.line {
  display: flex;
}
.line .el-input {
  flex: 1;
}
.line .el-button {
  width: auto;
}
.myupload {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed #ccc;
  position: relative;
}
.myupload h3 {
  width: 100%;
  height: 100px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  color: #666;
  font-weight: 100;
}
.myupload .ipt {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.myupload .img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>