import Vue from "vue";
import VueRouter from "vue-router";

import App from "./App.vue";
import WordValidator from "./views/WordValidator.vue";
import PageNotFound from "./views/PageNotFound.vue";

export const eventBus = new Vue();

Vue.config.productionTip = false;
Vue.use(VueRouter);

export const router = new VueRouter({
  routes: [
    { path: "/", component: WordValidator, props: true },
    { path: "*", component: PageNotFound, props: true },
  ],
});

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
