<template>
  <div>
    <TitleHeader :title="boardInfo.subject" />
    <TwoButtonModal
      v-if="popState"
      question="게시물을 삭제하시겠습니까?"
      @sendAnswer="closeDeleteModal"
      @scroll.prevent
      @wheel.prevent
      @touchmove.prevent
    ></TwoButtonModal>
    <v-container>
      <div class="post-area">
        <v-row class="mb-2">
          {{ post.category.name }}
        </v-row>
        <v-row class="mb-2">
          <div class="text-h5">{{ post.title }}</div>
        </v-row>
        <v-row>
          <div class="text-subtitle-1">{{ post.member.name }}</div>
        </v-row>
        <v-row justify="space-between">
          <div style="color: darkgray">
            {{ post.regDate }}&nbsp;&nbsp;&nbsp;조회수: {{ post.hit }}
          </div>
          <div style="color: darkgray">수정 일시: {{ post.modDate }}</div>
        </v-row>
        <v-divider class="mt-6 mb-12" thickness="2"></v-divider>
        <v-row>
          {{ post.content }}
        </v-row>
      </div>
      <div class="file-area">
        <v-row>첨부 파일</v-row>
      </div>
      <v-divider class="mt-6 mb-12" thickness="2"></v-divider>
      <div class="reply-area">
        <v-row>댓글</v-row>
      </div>
      <div class="btn-area">
        <v-row justify="center">
          <v-btn width="150" color="indigo" @click="moveToList">목록</v-btn>
          <v-btn
            class="ml-2 mr-2"
            width="150"
            variant="tonal"
            color="indigo"
            @click="moveToModify"
            >수정</v-btn
          >
          <v-btn
            width="150"
            variant="outlined"
            color="indigo"
            @click="openDeleteModal"
            >삭제</v-btn
          >
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import TitleHeader from "@/components/TitleHeader.vue";
import TwoButtonModal from "@/components/TwoButtonModal.vue";

export default {
  name: "FreeDetail",
  components: { TwoButtonModal, TitleHeader },
  data() {
    return {
      popState: false,
      boardInfo: {
        id: 4,
        name: "free",
        subject: "자유 게시판",
      },
      post: {
        title: "자바 (프로그래밍 언어)",
        content:
          "자바(영어: Java)는 썬 마이크로시스템즈의 제임스 고슬링(James Gosling)과 다른 연구원들이 개발한 객체 지향적 프로그래밍 언어이다. 1991년 그린 프로젝트(Green Project)라는 이름으로 시작해 1995년에 발표했다. 처음에는 가전제품 내에 탑재해 동작하는 프로그램을 위해 개발되었지만 현재 웹 애플리케이션 분야에 가장 많이 사용하는 언어 중 하나이고, 안드로이드를 비롯한 모바일 기기용 소프트웨어 개발에도 널리 사용되고 있다. 현재 버전 20까지 출시했다.\n" +
          "\n" +
          "자바의 개발자들은 유닉스 기반의 배경을 가지고 있었기 때문에 문법적인 특성은 파스칼이 아닌 C++의 조상인 C 언어와 비슷하다.[2] 자바를 다른 컴파일언어와 구분 짓는 가장 큰 특징은 컴파일된 코드가 플랫폼 독립적이라는 점이다. 자바 컴파일러는 자바 언어로 작성된 프로그램을 바이트코드라는 특수한 바이너리 형태로 변환한다. 바이트코드를 실행하기 위해서는 JVM(자바 가상 머신, Java Virtual Machine)이라는 특수한 가상 머신이 필요한데, 이 가상 머신은 자바 바이트코드를 어느 플랫폼에서나 동일한 형태로 실행시킨다. 때문에 자바로 개발된 프로그램은 CPU나 운영 체제의 종류에 관계없이 JVM을 설치할 수 있는 시스템에서는 어디서나 실행할 수 있으며, 이 점이 웹 애플리케이션의 특성과 맞아떨어져 폭발적인 인기를 끌게 되었다.",
        hit: 100,
        regDate: "2023-09-27 14:36",
        modDate: "-",
        member: {
          id: 12,
          username: "wiki",
          name: "위키피디아",
          role: "ROLE_USER",
        },
        category: {
          id: 1,
          name: "JAVA",
          boardId: 4,
        },
      },
    };
  },
  methods: {
    moveToList() {},
    moveToModify() {},
    openDeleteModal() {
      this.popState = true;
    },
    closeDeleteModal(answer) {
      if (answer) {
        this.deletePost();
      }
      this.popState = false;
    },
    deletePost() {
      console.log("delete...");
    },
  },
};
</script>

<style scoped>
.post-area {
  margin-bottom: 100px;
}
.file-area {
  margin-bottom: 100px;
}
.reply-area {
  margin-bottom: 100px;
}
</style>
