import { reqspecsList, reqspecsCount } from "../../utils/https"
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
    reqList(context,bool) {
        // 因为商品管理里面也要用到商品规格，但是需要全部展示
        // 所以加判断，如果调用的时候有参数bool为真，那么就全部展示，否则就传page、size给后台
        let params=bool?{}:{page:context.state.page,size:context.state.size}
        //发请求，成功之后，修改list
        reqspecsList(params).then(res => {
            // 如果当前页有数据就展示没有数据就给一个空数组  不让程序报错
            let list = res.data.list ? res.data.list : []
            // 判断：如果当前页码没有数据并且当前不是第一页，页码就减1，
            // eg：当前在第三页，把第三页的数据删完了就应该显示第二页，第三页消失
            if (list.length == 0 && context.state.page > 1) {
                // mutations修改数据
                // 使用数据用commit
                context.commit('changeList', context.state.page - 1)
                // 刷新列表
                // 使用方法用dispatch
                context.dispatch('reqList')
                return;
            }
            // 修改属性格式
            //拿到list每一条的数据
            list.forEach(item => {
                // JSON.parse():从一个字符串中解析出json对象
                item.attrs = JSON.parse(item.attrs)
            })
            context.commit("changeList", list)
        })
    },
    // 请求总数
    reqCount(context) {
        reqspecsCount().then(res => {
            if (res.data.code === 200) {
                // console.log(res)
                // 通知mutations修改数据
                context.commit("changeTotal", res.data.list[0].total)
            }
        })
    },
    //修改页码
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