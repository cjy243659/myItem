export default {
    methods: {
        del() {
            this.$confirm("你确定要删除吗？", "删除提示", {
                confirmButtonText: "删 除",
                cancelButtonText: "取 消",
                type: "warning"
            })
                .then(() => {
                    //31.通知父组件，点了确定
                    this.$emit("confirm");
                })
                .catch(() => {
                    console.log(" 你点了取消");
                });
        }
    }
};