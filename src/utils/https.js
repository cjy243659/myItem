// 存放所有的axios请求
import Vue from 'vue'
import qs from 'qs'
import axios from 'axios'
import { errorAlert } from '../utils/alert'
// 引入仓库
import store from "../store"
import router from "../router"
// 项目开发需要/aa
const BASEURL = '/aa'
Vue.prototype.$imgPre = "http://localhost:3000"

// 项目生产不需要  打包
// const BASEURL = ''
// Vue.prototype.$imgPre=""

// 请求拦截  除了登录 前往其他页面都需要携带token
axios.interceptors.request.use(req => {
    // 判断前往的是否是登录页，如果不是登录页就需要携带token(登录页不需要携带token)
    if (req.url != BASEURL + "/api/userlogin") {
        // 那么就把本地存储或者vuex存储的token存储到响应头
        // authorization  是后台要的字段
        req.headers.authorization = store.state.userInfo.token
    }
    return req
})

// 响应拦截
axios.interceptors.response.use(res => {
    console.log('本次请求的地址是' + res.config.url)
    // console.log(res)
    // 统一处理失败弹窗，组件中只需要处理成功就可以了
    // 如果code不是200，就代表操作失败
    if (res.data.code != 200) {
        errorAlert(res.data.msg)
    }

    // 掉线处理---token过期处理
    // 当token过期的时候，后台已经过期了，但是前端不知道token过期，所以要处理一下
    // 如果res.data.msg是后台token过期时传递的信息的话，就证明token过期了，那么就要清除本地存储、vuex存储的信息，然后跳转到登录页重新登陆
    if (res.data.msg === '登录已过期或访问权限受限') {
        // 清除信息 调用store的方法用dispatch  使用数据用commit
        // 调用actions里面的changeUser方法，传过去一个空对象，然后通知mutations要改变数据了
        store.dispatch("changeUser", {})
        // 跳转页面
        router.push('/login')
    }
    return res
})


// =======================菜单管理============================
// 请求商品列表
export const reqMenuList = () => {
    return axios({
        url: BASEURL + '/api/menulist',
        methods: 'get',
        params: ({
            istree: true
        })
    })
}


// 请求一条数据
export const reqMenuDetail = (id) => {
    return axios({
        url: BASEURL + '/api/menuinfo',
        methods: 'get',
        params: {
            id: id
        }
    })
}

// 添加商品
export const reqMenuAdd = (form) => {
    return axios({
        url: BASEURL + "/api/menuadd",
        method: "post",
        data: qs.stringify(form)
    })
}

// 删除一条数据
export const reqMenuDel = (id) => {
    return axios({
        url: BASEURL + '/api/menudelete',
        // method不能加s 否则找不到这个接口
        method: 'post',
        data: qs.stringify({
            id: id
        })
    })
}

// 修改
export const reqMenuUpdate = (form) => {
    return axios({
        url: BASEURL + "/api/menuedit",
        method: "post",
        data: qs.stringify(form)
    })
}


// =====================角色管理=========================

// 角色列表
export const reqRoleList = () => {
    return axios({
        url: BASEURL + '/api/rolelist',
        method: 'get',
    })
}

// 角色添加
export const reqRoleAdd = (user) => {
    return axios({
        url: BASEURL + '/api/roleadd',
        method: 'post',
        data: qs.stringify(user)
    })
}

//角色修改
export const reqRoleUpdade = (user) => {
    return axios({
        url: BASEURL + '/api/roleedit',
        method: 'post',
        data: qs.stringify(user)
    })
}

// 角色删除
export const reqRoleDel = (id) => {
    return axios({
        url: BASEURL + '/api/roledelete',
        method: 'post',
        data: qs.stringify({
            id: id
        })
    })
}

// 角色编辑--获取一条数据
export const reqRoleDetail = (id) => {
    return axios({
        url: BASEURL + '/api/roleinfo',
        method: 'get',
        params: {
            id: id
        }
    })
}

// ======================管理员管理=======================

// 获取列表 p=(page:1,size:2)
export const reqUserList = (p) => {
    return axios({
        url: BASEURL + '/api/userlist',
        method: 'get',
        params: p
    })
}


//添加
export const reqUserAdd = (user) => {
    return axios({
        url: BASEURL + "/api/useradd",
        method: "post",
        data: qs.stringify(user)
    })
}

//删除
export const reqUserDel = (uid) => {
    return axios({
        url: BASEURL + "/api/userdelete",
        method: "post",
        data: qs.stringify({
            uid: uid
        })
    })
}

//详情 获取一条信息
export const reqUserDetail = uid => {
    return axios({
        url: BASEURL + "/api/userinfo",
        method: "get",
        params: {
            uid: uid
        }
    })
}

//修改
export const reqUserUpdate = (user) => {
    return axios({
        url: BASEURL + "/api/useredit",
        method: "post",
        data: qs.stringify(user)
    })
}


// 获取总数
export const reqUserCount = () => {
    return axios({
        url: BASEURL + "/api/usercount",
        method: "get",
    })
}

// =======================登录=============================

// 登录  参数 username 和 password
export const reqLogin = (user) => {
    return axios({
        url: BASEURL + "/api/userlogin",
        method: "post",
        data: qs.stringify(user)
    })
}

// ======================商品分类=================================
// 添加商品分类
export const reqcateAdd = (cate) => {
    // 参数中有文件
    let d = new FormData()
    /*
    d.append("name",12)
    d.append("img",file)
    d.append("age",20)
    */

    for (let i in cate) {
        d.append(i, cate[i])
    }

    return axios({
        url: BASEURL + '/api/cateadd',
        method: 'post',
        // data: qs.stringify(cate)
        data: d
    })
}

// 商品分类列表
// 参数形式 ： p={istree:true}  p={pid:1}
export const reqcateList = (p) => {
    return axios({
        url: BASEURL + "/api/catelist",
        method: "get",
        params: p
    })
}
// 删除商品分类
export const reqcateDel = (id) => {
    return axios({
        url: BASEURL + "/api/catedelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}

// 修改商品分类
// 参数说明 id pid catename img status
export const reqcateUpdate = (cate) => {
    let d = new FormData()
    for (let i in cate) {
        d.append(i, cate[i])
    }
    return axios({
        url: BASEURL + "/api/cateedit",
        method: "post",
        data: d
    })
}

// 获取一条数据(详情)
export const reqcateDetail = (id) => {
    return axios({
        url: BASEURL + '/api/cateinfo',
        method: 'get',
        params: {
            id: id
        }
    })
}


// ===========================商品规格======================
// 添加 文件
export const reqspecsAdd = (user) => {

    return axios({
        url: BASEURL + "/api/specsadd",
        method: "post",
        data: qs.stringify(user)
    })
}

//列表 p={page:1,size:10}
export const reqspecsList = (p) => {
    return axios({
        url: BASEURL + "/api/specslist",
        method: "get",
        params: p
    })
}

//删除
export const reqspecsDel = (id) => {
    return axios({
        url: BASEURL + "/api/specsdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}

//详情
export const reqspecsDetail = id => {
    return axios({
        url: BASEURL + "/api/specsinfo",
        method: "get",
        params: {
            id: id
        }
    })
}

//修改 文件
export const reqspecsUpdate = (user) => {

    return axios({
        url: BASEURL + "/api/specsedit",
        method: "post",
        data: qs.stringify(user)
    })
}
// 总数
export const reqspecsCount = () => {

    return axios({
        url: BASEURL + "/api/specscount",
        method: "get",
    })
}

// ==========================商品管理===========================

//添加
export const reqgoodsAdd = (user) => {
    // 处理文件
    let d = new FormData()
    for (let i in user) {
        d.append(i, user[i])
    }
    return axios({
        url: BASEURL + "/api/goodsadd",
        method: "post",
        data: d
    })
}

//列表 size page pid sid
export const reqgoodsList = (p) => {
    return axios({
        url: BASEURL + "/api/goodslist",
        method: "get",
        params: p
    })
}

//删除
export const reqgoodsDel = (id) => {
    return axios({
        url: BASEURL + "/api/goodsdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}

//详情
export const reqgoodsDetail = id => {
    return axios({
        url: BASEURL + "/api/goodsinfo",
        method: "get",
        params: {
            id: id
        }
    })
}

//修改
export const reqgoodsUpdate = (user) => {
    let d = new FormData()
    for (let i in user) {
        d.append(i, user[i])
    }
    return axios({
        url: BASEURL + "/api/goodsedit",
        method: "post",
        data: d
    })
}
// 总数
export const reqgoodsCount = () => {
    return axios({
        url: BASEURL + "/api/goodscount",
        method: "get",
    })
}

// ====================会员管理=============================

// 列表
export const reqmemberList = () => {
    return axios({
        url: BASEURL + '/api/memberlist',
        method: 'get'
    })
}

//获取一条信息  修改
export const reqmemberInfo = (uid) => {
    return axios({
        url: BASEURL + '/api/memberinfo',
        method: 'get',
        params: {
            uid: uid
        }
    })
}

// 修改  uid nickname  phone  password  status
export const reqmemberEdit = (user) => {
    return axios({
        url: BASEURL + '/api/memberedit',
        method: 'post',
        data: qs.stringify(user)
    })
}

// =======================轮播图管理============================
// 添加
export const reqbannerAdd = (user) => {
    // 文件处理
    let d = new FormData()
    for (let i in user) {
        d.append(i, user[i])
    }

    return axios({
        url: BASEURL + '/api/banneradd',
        method: 'post',
        data: d
    })
}

// 列表
export const reqbannerList = () => {
    return axios({
        url: BASEURL + '/api/bannerlist',
        method: 'get',
    })
}

// 获取一条数据 编辑
export const reqbannerInfo = (id) => {
    return axios({
        url: BASEURL + '/api/bannerinfo',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 修改
export const reqbannerEdit = (user) => {
    let d = new FormData()
    for (let i in user) {
        d.append(i, user[i])
    }
    return axios({
        url: BASEURL + '/api/banneredit',
        method: 'post',
        data: d
    })
}

//删除
export const reqbannerDel = (id) => {
    return axios({
        url: BASEURL + '/api/bannerdelete',
        method: 'post',
        data: qs.stringify({
            id: id
        })
    })
}

// ====================商品秒杀========================

// 添加
export const reqseckAdd = (user) => {
    return axios({
        url: BASEURL + '/api/seckadd',
        method: 'post',
        data: qs.stringify(user)
    })
}

// 列表
export const reqseckList = () => {
    return axios({
        url: BASEURL + '/api/secklist',
        method: 'get',
    })
}

// 获取一条数据 编辑
export const reqseckInfo = (id) => {
    return axios({
        url: BASEURL + '/api/seckinfo',
        method: 'get',
        params: {
            id: id
        }
    })
}

// 修改
export const reqseckEdit = (user) => {
    return axios({
        url: BASEURL + '/api/seckedit',
        method: 'post',
        data: qs.stringify(user)
    })
}

//删除
export const reqseckDel = (id) => {
    return axios({
        url: BASEURL + '/api/seckdelete',
        method: 'post',
        data: qs.stringify({
            id: id
        })
    })
}
