
// 引入请求
import { reqbannerList } from '../../utils/https'


const state = {
    list: []
}

const mutations = {
    changeBannerList(state, arr) {
        state.list = arr
    }
}

const actions = {
    reqList(context) {
        reqbannerList().then(res => {
            if (res.data.code === 200) {
                context.commit("changeBannerList", res.data.list)
            }
        })
    }
}

const getters = {
    list(state) {
        return state.list
    }
}

export default {
    state, mutations, actions, getters,
    namespaced: true
}