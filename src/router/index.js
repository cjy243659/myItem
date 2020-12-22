import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 引入仓库
import store from '../store'

// 判断登录用户的权限，只能访问有权限的模块
function checkedEnter(path, next) {
  if (store.state.userInfo.menus_url.includes(path)) {
    next()
  }
  else {
    next('/')
  }
}

// 导出部分路由 
// 因为在添加商品信息的时候，在菜单栏会让用户选择路径，会使用到路由
export const routes = [
  {
    path: 'menu', component: () => import('../pages/menu/menu'), name: '菜单管理',
    // // 路由独享守卫
    beforeEnter: (to, from, next) => {
      checkedEnter('/menu', next)
    }
  },
  {
    path: 'role', component: () => import("../pages/role/role"), name: '角色管理',
    beforeEnter: (to, from, next) => {
      checkedEnter('/role', next)
    }
  },
  {
    path: 'manage', component: () => import("../pages/manage/manage"), name: '管理者管理',
    beforeEnter: (to, from, next) => {
      checkedEnter('/manage', next)
    }
  },
  {
    path: 'cate', component: () => import("../pages/cate/cate"), name: '商品分类',
    beforeEnter: (to, from, next) => {
      checkedEnter('/cate', next)
    }
  },
  {
    path: 'goods', component: () => import("../pages/goods/goods"), name: '商品管理',
    beforeEnter: (to, from, next) => {
      checkedEnter('/goods', next)
    }
  },
  {
    path: 'banner', component: () => import("../pages/banner/banner"), name: '轮播图管理',
    beforeEnter: (to, from, next) => {
      checkedEnter('/banner', next)
    }
  },
  {
    path: 'seckill', component: () => import("../pages/seckill/seckill"), name: '秒杀活动',
    beforeEnter: (to, from, next) => {
      checkedEnter('/seckill', next)
    }
  },
  {
    path: 'spec', component: () => import("../pages/specs/specs"), name: '商品规格',
    beforeEnter: (to, from, next) => {
      checkedEnter('/spec', next)
    }
  },
  {
    path: 'member', component: () => import("../pages/vip/vip"), name: '会员管理',
    beforeEnter: (to, from, next) => {
      checkedEnter('/member', next)
    }
  },
]

const router = new Router({
  routes: [
    {
      path: "/login",
      component: () => import("../pages/login/login")
    },
    {
      path: '/',
      component: () => import('../pages/index/index'),
      children: [
        { path: '', component: () => import('../pages/home/home') },
        // 使用拼接
        // ...routers
      ].concat(routes)
    }
  ]
})


// 登陆拦截
//全局前置守卫：守卫所有的路由
router.beforeEach((to, from, next) => {
  // 如果前往的是登录页，就只进入
  if (to.path == '/login') {
    next()
    // 结束代码
    return
  }
  // 如果前往的不是登录，就要查看仓库数据中有没有token
  if (store.state.userInfo.token) {
    // 如果有，就登录了，就进入
    next()
    return
  }
  next('/login')
})

export default router;