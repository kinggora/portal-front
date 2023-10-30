import { createRouter, createWebHistory } from "vue-router";
import NoMenuLayout from "@/layouts/NoMenuLayout.vue";
import SignUp from "@/views/member/SignUp.vue";
import SignIn from "@/views/member/SignIn.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import PostWrite from "@/views/common/PostWrite.vue";
import PostDetail from "@/views/common/PostDetail.vue";
import BoardList from "@/views/common/BoardList.vue";

const routes = [
  {
    path: "/",
    name: "defaultLayout",
    component: DefaultLayout,
    children: [
      {
        path: ":boardName/write",
        name: "postWrite",
        component: PostWrite,
        props: true,
      },
      {
        path: ":boardName",
        name: "boardList",
        component: BoardList,
        props: true,
      },
      {
        path: ":boardName/:postId",
        name: "postDetail",
        component: PostDetail,
        props: true,
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
