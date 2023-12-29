import { createRouter, createWebHistory } from "vue-router";
import NoMenuLayout from "@/layouts/NoMenuLayout.vue";
import SignUp from "@/views/member/SignUp.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import BoardWrite from "@/views/boards/BoardWrite.vue";
import BoardDetail from "@/views/boards/BoardDetail.vue";
import BoardList from "@/views/boards/BoardList.vue";
import store from "@/store";
import SignIn from "@/views/member/SignIn.vue";

const routes = [
  {
    path: "/",
    name: "defaultLayout",
    component: DefaultLayout,
    children: [
      {
        path: "portal",
        name: "boardList",
        component: BoardList,
        meta: {
          permission: "accessList",
        },
      },
      {
        path: "portal/write",
        name: "boardWrite",
        component: BoardWrite,
        meta: {
          permission: "accessWrite",
        },
      },
      {
        path: "portal/write/:postId",
        name: "boardModify",
        component: BoardWrite,
        props: true,
        meta: {
          permission: "accessWrite",
        },
      },
      {
        path: "portal/:postId",
        name: "boardDetail",
        component: BoardDetail,
        meta: {
          permission: "accessRead",
        },
      },
    ],
  },
  {
    path: "/",
    name: "noMenuLayout",
    component: NoMenuLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: SignIn,
      },
      {
        path: "signup",
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

/**
 * 접근 권한 검사 : 게시글 목록 (boardList), 게시글 작성 (boardWrite)
 * 게시판 정보에서 접근 레벨 확인 -> 사용자 정보와 비교
 */
router.beforeEach((to, from, next) => {
  if (to.name === "boardList" || to.name === "boardWrite") {
    if (to.query.boardId) {
      store
        .dispatch("boardInfoStore/fetchBoardInfo", to.query.boardId)
        .then(() => {
          let boardInfo = store.getters["boardInfoStore/getBoardInfo"];
          let permission = to.meta["permission"];
          const accessLevel = boardInfo[permission];
          authorizationAccess(accessLevel, to, next);
        });
    }
  } else {
    next();
  }
});

/**
 * 접근 권한 검사 : 게시글 상세 (boardDetail)
 * 게시글 정보에서 접근 레벨 확인 -> 사용자 정보와 비교
 */
router.beforeEach((to, from, next) => {
  if (to.name === "boardDetail") {
    store.dispatch("postStore/fetchPost", to.params.postId).then(() => {
      let post = store.getters["postStore/getPost"];
      let permission = to.meta["permission"];
      const accessLevel = post.boardInfo[permission];
      authorizationAccess(accessLevel, to, next);
    });
  } else {
    next();
  }
});

/**
 * 접근 권한 검사 : 게시글 수정 (boardModify)
 * 게시글 정보에서 작성자 확인 -> 사용자 정보와 비교
 * 작성자 == 사용자 : 접근 허용
 * 작성자 != 사용자 : 접근 거부
 */
router.beforeEach((to, from, next) => {
  if (to.name === "boardModify") {
    store.dispatch("postStore/fetchPost", to.params.postId).then(() => {
      let writer = store.getters["postStore/getPost"].member;
      authorizationWriter(writer, to, next);
    });
  } else {
    next();
  }
});

const authorizationAccess = (accessLevel, to, next) => {
  if (accessLevel === "ALL") {
    return next();
  }
  if (accessLevel === "NONE") {
    return next("/");
  }
  if (!store.getters["authStore/isAuthenticated"]) {
    return next({
      path: "/login",
      query: {
        returnUrl: to.fullPath,
      },
    });
  }
  if (
    store.getters["authStore/getMember"].roles?.find(
      role => role === accessLevel,
    )
  ) {
    return next();
  } else {
    alert("권한이 없습니다.");
    return next("/");
  }
};
const authorizationWriter = (writer, to, next) => {
  let isAuthenticated = store.getters["authStore/isAuthenticated"];
  if (!isAuthenticated) {
    return next({
      path: "/login",
      query: {
        returnUrl: to.fullPath,
      },
    });
  }
  let writerId = writer.username;
  let loggedInId = store.getters["authStore/getMember"].username;
  if (writerId === loggedInId) {
    return next();
  }
  alert("권한이 없습니다.");
  return next("/");
};

export default router;
