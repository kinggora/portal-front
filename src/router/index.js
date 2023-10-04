import { createRouter, createWebHistory } from "vue-router";
import FreeForm from "@/views/free/FreeWrite.vue";
import FreeList from "@/views/free/FreeList.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import NoMenuLayout from "@/layouts/NoMenuLayout.vue";
import SignUp from "@/views/member/SignUp.vue";
import SignIn from "@/views/member/SignIn.vue";
import FreeDetail from "@/views/free/FreeDetail.vue";

const routes = [
  {
    path: "/",
    name: "defaultLayout",
    component: DefaultLayout,
    children: [
      {
        path: "/free/write",
        name: "freeForm",
        component: FreeForm,
      },
      {
        path: "/free",
        name: "freeList",
        component: FreeList,
      },
      {
        path: "/free/:id",
        name: "freeDetail",
        component: FreeDetail,
      },
    ],
  },
  {
    path: "/",
    name: "noMenuLayout",
    component: NoMenuLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: SignIn,
      },
      {
        path: "/signup",
        name: "SignUp",
        component: SignUp,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
