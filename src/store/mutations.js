// 数据
export const state = {
    // 初始值
    /* 
        vuex的值一刷新就没有了，所以要在刷新的时候把本地存储的值取出来
    */
    // 判断：如果本地存储有值，就取出来，如果得到的null，就是空对象
    userInfo:sessionStorage.getItem('userInfo')?JSON.parse(sessionStorage.getItem('userInfo')):{}
}
// 修改
export const mutations = {
    // 登录成功后传进来一个对象，然后修改userInfo
    changeUserInfo(state, obj) {
        // 修改值
        state.userInfo = obj
        /* 
            vuex和本地存储同步
            在登录时，存储res.data.list(它里面包含了之后要用到权限判断、登录时的token),页面中传进来了一个对象，这时候，要把它存储到本地存储里面，因为vuex一刷新就没有了；
            在退出登录时，vuex在退出登录的时候就没有了，就变成了空对象了，就没有token了
        */
        //判断token是否存在，存在就存起来，不存在就删除本地存储
        if(obj.token){
            sessionStorage.setItem("userInfo", JSON.stringify(obj))
        }else{
            sessionStorage.removeItem('userInfo')
        }
    }
}
// 导出
export const getters = {
    userInfo(state) {
        return state.userInfo
    }
}
// 对于页面的交接，在actions中交接，actions专门负责逻辑，异步数据请求的