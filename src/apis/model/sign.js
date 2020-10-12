import servicer from "@/utils/resave";

// 查询城市

// export async function getOrdersDevice(data) {
//   return await servicer({
//     url: "/chtm/getOrders",
//     method: "get",
//     params: data,
//   });
// }
// -------------素材----------------------------------素材---------------------素材---------------------------素材------------

// 上传图片
export async function getUsrName(data) {
  return await servicer({
    url: "/chtm/checkAccount",
    method: "post",
    data,
  });
}
// 上传图片
export async function getSignUp(data) {
  return await servicer({
    url: "/chtm/uploadLicense",
    method: "post",
    data,
  });
}
// 上传图片
export async function postSignUp(data) {
  return await servicer({
    url: "/chtm/regist",
    method: "post",
    data,
  });
}

// 获取 列表

export async function getActiveDevices(data) {
  return await servicer({
    url: "/chtm/getAccount",
    method: "get",
    params: data,
  });
}
// 获取详情
export async function postSignUpDetail(data) {
  return await servicer({
    url: "/chtm/getAccountDetail",
    method: "post",
    data,
  });
}
// 提交审核
export async function postSignUpAccount(data) {
  return await servicer({
    url: "/chtm/submitAccount",
    method: "post",
    data,
  });
}
// ----------活动---------------------------------活动-----------------活动----------------------活动---------------------
