import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/dashboard.vue";
import Detail from "../views/detail.vue";
Vue.use(VueRouter);

const routes = [
    {
      path: "",
      component: Dashboard,
      name: "dashboard"
    },
    {
      path: "/detail/:id",
      component: Detail,
      name: "detail",
    }
];
const router = new VueRouter({
  mode: "history",
  routes
});
export default router