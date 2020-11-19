// 引入请求
import  {reqcateList} from '../../utils/https'

// 仓库数据
const state = {
    // 初始化商品分类列表数据
    cateList:[]
}

// 修改数据
const mutations={
    // 修改商品分类列表数据
    changecateList(state,arr){
        state.cateList=arr
    }
}

const actions ={
    // 请求数据列表
    reqList(context){
        // 发起请求列表的请求
        reqcateList({istree:true}).then(res=>{
            
            // 成功之后，修改数据
            context.commit("changecateList",res.data.list)
        })
    }
}

// 导出数据
const getters= {
    cateList(state){
        return state.cateList
    }
}

export default {
    state,mutations,actions,getters,
    // 命名空间
    namespaced: true
}