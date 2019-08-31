import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from '@/router'
import '@/style/index.css'

// 简单配置axios,在任何实例中都能使用到$http
import axios from '@/api'
// @代表的是vue-cil提供的路径别名，src绝对路径的别名
// 然后router下面的index.js省略了，在目录下默认索引文件（默认会去加载文件index名称的）
// import Style from '@/style/index.less'

import myPlugin from '@/components' // 用配置好的axios
Vue.prototype.$http = axios
Vue.use(myPlugin)

Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// Main.js作用 入口文件 ，具体的职责
// 1,负责依赖资源的全局导入
// 2，创建一个目标vue根实例，去管理index.html中app容器
