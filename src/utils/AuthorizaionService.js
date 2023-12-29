import store from "@/store";

const authorization = accessLevel => {
  let isAuthenticated = store.getters["authStore/isAuthenticated"];
  let member = store.getters["authStore/getMember"];
  switch (accessLevel) {
    case "NONE":
      return false;
    case "ALL":
      return true;
    case "USER":
    case "ADMIN":
      if (!isAuthenticated) {
        return false;
      }
      for (let i = 0; i < member.roles.length; i++) {
        if (member.roles[i] === accessLevel) {
          return true;
        }
      }
  }
  return false;
};

export { authorization };
