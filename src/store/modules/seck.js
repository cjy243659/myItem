// 引入请求
import { reqseckList } from '../../utils/https'

const state = {
    list: []
}

const mutations = {
    changeSeckList(state, arr) {
        state.list = arr
    }
}

const actions = {
    reqList(context) {
        reqseckList().then(res => {
            if (res.data.code === 200) {
                context.commit("changeSeckList",res.data.list)
            }
        })
    }
}

const getters = {
    list(state){
        return state.list
    }
}

export default {
    state, mutations, actions, getters,
    namespaced: true
}