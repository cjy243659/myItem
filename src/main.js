// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入vuex组件
import Vuex from 'vuex'
// 配置vue插件
Vue.use(Vuex)


// 引入ui组件库
import ElementUI from 'element-ui'; 
// 引入组件相关样式
import 'element-ui/lib/theme-chalk/index.css'
// 配置vue插件
Vue.use(ElementUI)

// 引入公共css文件
import './assets/css/reset.css'

// 引入过滤器
import './filter'

// 引入公用组件
import './components'

// 导入仓库
import store from './store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
