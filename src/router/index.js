import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Contacts",
    component: () => import("../views/ContactsList.vue"),
  },
  {
    path: "/contacts/:id",
    name: "Contact",
    component: () => import("../views/Contact.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
