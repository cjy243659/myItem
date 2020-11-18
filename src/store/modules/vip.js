// 引入请求
import {reqmemberList} from '../../utils/https'

const state={
    // 会员管理列表
    list:[]
}

const mutations={
    // 修改会员列表
    changeVipList(state,arr){
        state.list=arr
    }
}

const actions={
    //会员列表
    reqList(context){
        // 发送请求
        reqmemberList().then(res=>{
            if(res.data.code===200){
                // console.log(res)
                // 通知mutations修改数据
                context.commit("changeVipList",res.data.list)
            }
        })
    }
}

const getters={
    // 会员列表
    list(state){
        return state.list
    }
}

export default {
    state,mutations,actions,getters,
    namespaced: true
}