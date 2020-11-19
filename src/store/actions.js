export default {
    changeUser(context, obj) {
        // 接收到页面传进来的值后，会通知mutations去改变值
        context.commit("changeUserInfo", obj)
    }
}