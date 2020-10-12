import Vue from "vue";
import App from "./App";
import store from "./store";
import router from "./router";
import "./plugins";

import VueKindEditor from './plugins/kindeditor.js'
import './assets/kindeditor/themes/default/default.css'
import './assets/kindeditor/kindeditor-all.js'
import './assets/kindeditor/lang/zh-CN.js'
Vue.use(VueKindEditor)

if (process.env.NODE_ENV === "test") {
  const { mockXHR } = require("../mock/static");
  mockXHR();
}

Vue.config.productionTip = false;

new Vue({
  el: "#vue-admin-beautiful",
  router,
  store,
  render: (h) => h(App),
});
