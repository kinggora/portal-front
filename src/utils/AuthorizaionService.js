import store from "@/store";

const authorization = accessLevel => {
  switch (accessLevel) {
    case "NONE":
      return false;
    case "ALL":
      return true;
    case "USER":
      return store.getters["authStore/isAuthenticated"];
    case "ADMIN":
      return store.getters["authStore/isAdmin"];
  }
  return false;
};

export { authorization };
