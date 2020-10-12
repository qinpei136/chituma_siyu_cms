import servicer from "@/utils/resave";

// 登录
export async function getSign(data) {
  return await servicer({
    url: "/chtm/signIn",
    method: "post",
    data: data,
  });
}
//  校验登录
export async function isLogin(data) {
  return await servicer({
    url: "/chtm/isSignIn",
    method: "get",
    params: data,
  });
}
