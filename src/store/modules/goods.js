import { reqgoodsList, reqgoodsCount } from "../../utils/https"
const state = {
    //分类list
    list: [],
    //总数
    total: 0,
    size: 2,
    page: 1,
}

const mutations = {
    //修改list
    changeList(state, arr) {
        state.list = arr;
        console.log(state.list);
    },
    // 修改总数
    changeTotal(state, num) {
        state.total = num
    },
    // 修改页码
    changePage(state, page) {
        state.page = page
    }
}

const actions = {
    //请求列表
    reqList(context) {
        //发请求，成功之后，修改list
        reqgoodsList({ page: context.state.page, size: context.state.size }).then(res => {
            // 如果当前页有数据就展示没有数据就给一个空数组  不让程序报错
            let list = res.data.list ? res.data.list : []
            // 判断：如果当前页码没有数据并且当前不是第一页，页码就减1，
            // eg：当前在第三页，把第三页的数据删完了就应该显示第二页，第三页消失
            if (list.length == 0 && context.state.page > 1) {
                // mutations修改数据
                // 使用数据用commit
                context.commit('changePage', context.state.page - 1)
                // 刷新列表
                // 使用方法用dispatch
                context.dispatch('reqList')
                return;
            }
            context.commit("changeList", list)
        })
    },
    // 请求总数
    reqCount(context) {
        reqgoodsCount().then(res => {
            if (res.data.code === 200) {
                // console.log(res)
                // 通知mutations修改数据
                context.commit("changeTotal", res.data.list[0].total)
            }
        })
    },
    // 修改页码
    changePage(context, page) {
        //修改页码
        context.commit("changePage", page)
        //从新请求数据
        context.dispatch("reqList")
    }
}

const getters = {
    list(state) {
        return state.list
    },
    total(state) {
        return state.total
    },
    size(state) {
        return state.size
    },
}

export default {
    state, mutations, getters, actions,
    namespaced: true
}