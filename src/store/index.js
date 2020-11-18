import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
import actions from "./actions"
import {state,mutations,getters} from "./mutations"
import cate from '../store/modules/cate'
import specs from '../store/modules/specs'
import goods from '../store/modules/goods'
import vip from '../store/modules/vip'
import banner from '../store/modules/banner'
import seck from '../store/modules/seck'
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules:{
        cate,
        specs,
        goods,
        vip,
        banner,
        seck
    }
})