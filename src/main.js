import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import { Indicator } from 'mint-ui'
import qs from 'qs';
Vue.config.productionTip = false
Vue.use(MintUI)
Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://c.iwanmen.com/element/';

//请求拦截器开启加载动画
axios.interceptors.request.use(
  (config) => {
    if (config.method == 'post') {
      config.data = qs.stringify(config.data);
    }
    //加载动画
    Indicator.open('加载中...')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
//相应拦截器关闭加载动画
axios.interceptors.response.use(
  (response) => {
    Indicator.close()
    return response
  },
  (error) => {
    Indicator.close()
    return Promise.reject(error)
  }
)


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
