import { createRouter, createWebHistory } from "vue-router";
import NoMenuLayout from "@/layouts/NoMenuLayout.vue";
import SignUp from "@/views/member/SignUp.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import BoardWrite from "@/views/boards/BoardWrite.vue";
import BoardDetail from "@/views/boards/BoardDetail.vue";
import BoardList from "@/views/boards/BoardList.vue";
import store from "@/store";
import SignIn from "@/views/member/SignIn.vue";
import ModifyProfile from "@/views/member/ModifyProfile.vue";
import MainHome from "@/views/boards/MainHome.vue";
import MyPage from "@/views/member/MyPage.vue";

const routes = [
  {
    path: "/",
    name: "defaultLayout",
    component: DefaultLayout,
    beforeEnter: (to, from, next) => {
      store
        .dispatch("boardInfoStore/fetchBoardInfos")
        .then(() => {
          next();
        })
        .catch(e => {
          console.log(e);
        });
    },
    children: [
      {
        path: "",
        name: "MainHome",
        component: MainHome,
      },
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
        name: "signUp",
        component: SignUp,
      },
      {
        path: "mypage",
        name: "myPage",
        component: MyPage,
      },
      {
        path: "profile/modify",
        name: "modifyProfile",
        component: ModifyProfile,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

/**
 * 로그인 여부 검사: 로그인(login), 회원가입(signUp)
 * 비로그인 상태에만 페이지 이동
 */
router.beforeEach((to, from, next) => {
  if (to.name === "login" || to.name === "signUp") {
    if (store.getters["authStore/isAuthenticated"]) {
      return next("/");
    } else {
      return next();
    }
  } else {
    next();
  }
});

/**
 * 로그인 여부 검사: 마이페이지(myPage), 회원정보 수정(modifyProfile)
 * 로그인 상태에만 페이지 이동
 */
router.beforeEach((to, from, next) => {
  if (to.name === "myPage" || to.name === "modifyProfile") {
    if (store.getters["authStore/isAuthenticated"]) {
      return next();
    } else {
      return next({
        path: "/login",
        query: {
          returnUrl: to.fullPath,
        },
      });
    }
  } else {
    next();
  }
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
          switch (accessLevel) {
            case "ALL":
              return next();
            case "NONE":
              return next("/");
            default:
              if (!store.getters["authStore/isAuthenticated"]) {
                return next({
                  path: "/login",
                  query: {
                    returnUrl: to.fullPath,
                  },
                });
              } else if (
                store.getters["authStore/getMember"].roles?.find(
                  role => role === accessLevel,
                )
              ) {
                return next();
              } else {
                alert("권한이 없습니다.");
                return next("/");
              }
          }
        });
    }
  } else {
    next();
  }
});

/**
 * 접근 권한 검사 : 게시글 상세 (boardDetail)
 * 게시글 GET 요청
 * 성공 시, 비밀글 여부 확인: 비밀글이면 작성자나 관리자만 상세 페이지 이동
 * 실패 시
 * : 401 인증 안됨 -> 로그인 페이지 이동
 * : 403 권한 없음 -> 미로그인시 로그인 페이지 이동, 로그인 시 권한 없음 알림
 * : 404 존재하지 않는 게시글
 */
router.beforeEach((to, from, next) => {
  if (to.name === "boardDetail") {
    store
      .dispatch("postStore/fetchPost", to.params.postId)
      .then(() => {
        let post = store.getters["postStore/getPost"];
        if (post == null) {
          return;
        } else if (!post.secret) {
          return next();
        }
        let writerId = post.member["username"];
        let loggedInId = store.getters["authStore/getMember"].username;
        if (writerId === loggedInId || store.getters["authStore/isAdmin"]) {
          return next();
        }
        alert("비밀글은 작성자만 열람 가능합니다.");
        return next("");
      })
      .catch(error => {
        switch (error.response.status) {
          case 401:
            return next({
              path: "/login",
              query: {
                returnUrl: to.fullPath,
              },
            });
          case 403:
            if (!store.getters["authStore/isAuthenticated"]) {
              return next({
                path: "/login",
                query: {
                  returnUrl: to.fullPath,
                },
              });
            }
            alert("권한이 없습니다.");
            return;
          case 404:
            alert("존재하지 않는 게시글입니다.");
            break;
        }
      });
  } else {
    next();
  }
});

/**
 * 접근 권한 검사 : 게시글 수정 (boardModify)
 * 수정할 게시글 GET 요청
 * - 성공 시
 * 작성자 == 사용자 : boardModify 페이지 이동
 * 작성자 != 사용자 : 접근 거부
 * - 실패 시
 * : 401 인증 안됨 -> 로그인 페이지 이동
 * : 403 권한 없음 -> 미로그인시 로그인 페이지 이동, 로그인 시 권한 없음 알림
 * : 404 존재하지 않는 게시글
 */
router.beforeEach((to, from, next) => {
  if (to.name === "boardModify") {
    store
      .dispatch("postStore/fetchPost", to.params.postId)
      .then(() => {
        let isAuthenticated = store.getters["authStore/isAuthenticated"];
        let writerId = store.getters["postStore/getPost"].member?.username;
        let loggedInId = store.getters["authStore/getMember"].username;
        if (isAuthenticated && writerId === loggedInId) {
          return next();
        }
        alert("권한이 없습니다.");
        return next("/");
      })
      .catch(error => {
        switch (error.response.status) {
          case 401:
            return next({
              path: "/login",
              query: {
                returnUrl: to.fullPath,
              },
            });
          case 403:
            if (!store.getters["authStore/isAuthenticated"]) {
              return next({
                path: "/login",
                query: {
                  returnUrl: to.fullPath,
                },
              });
            }
            alert("권한이 없습니다.");
            return;
          case 404:
            alert("존재하지 않는 게시글입니다.");
            break;
        }
      });
  } else {
    next();
  }
});

export default router;
