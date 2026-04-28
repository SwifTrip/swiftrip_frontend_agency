export function saveToken(token) {
  localStorage.setItem("access_token", token);
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("access_token") || localStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
}
