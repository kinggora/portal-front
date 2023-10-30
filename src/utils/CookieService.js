import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const AccessTokenKey = "accessToken";
const RefreshTokenKey = "refreshToken";

function addCookie(key, value) {
  cookies.set(key, value);
}

function removeCookies(...keys) {
  for (let key in keys) {
    cookies.remove(key);
  }
}

function addAccessToken(token) {
  addCookie(AccessTokenKey, token);
}

function addRefreshToken(token) {
  addCookie(RefreshTokenKey, token);
}

function getAccessToken() {
  return cookies.get(AccessTokenKey);
}

function getRefreshToken() {
  return cookies.get(RefreshTokenKey);
}

function removeAccessToken() {
  removeCookies(AccessTokenKey);
}

function removeRefreshToken() {
  removeCookies(RefreshTokenKey);
}

export {
  addAccessToken,
  addRefreshToken,
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
};
