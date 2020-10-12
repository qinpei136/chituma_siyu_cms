import { loginRSA } from "@/config/settings";
import { encryptedData } from "@/utils/encrypt";
import request from "@/utils/request";
import "./imock";

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data);
  }
  return request({
    url: "/imock/login",
    method: "post",
    data,
  });
}

export function getInfo(accessToken) {
  return request({
    url: "/imock/user/info",
    method: "post",
    data: {
      accessToken,
    },
  });
}

export function logout() {
  return request({
    url: "/imock/logout",
    method: "post",
  });
}
