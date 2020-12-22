<template>
  <div>
    <div class="box" id="main"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
// 引入图标库
import echarts from "echarts";
export default {
  computed: {
    ...mapGetters({
      cateList: "cate/cateList",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList",
    }),
  },
  watch: {
    cateList: {
      handler() {
        if (this.cateList.length > 0) {
          //画图
          let myChart = echarts.init(document.getElementById("main"));

          // 指定图表的配置项和数据
          var option = {
            title: {
              text: "商品分类图表",
            },
            tooltip: {},
            legend: {
              data: ["商品数量"],
            },
            xAxis: {
              data: this.cateList.map((item) => item.catename),
            },
            yAxis: {},
            // series 数据
            series: [
              {
                name: "商品数量",
                type: "bar",
                data: this.cateList.map((item) =>
                  item.children ? item.children.length : 0
                ),
              },
            ],
          };

          myChart.setOption(option);
        }
      },
      deep: true,
    },
  },
  mounted() {
    //触发请求
    this.reqList();
  },
};
</script>
<style scoped>
.box {
  width: 80%;
  margin: 20px auto;
  height: 500px;
}
</style>