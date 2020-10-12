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

// ----------小程序配置---------------------------------小程序配置-----------------小程序配置----------------------小程序配置---------------------

// 获取一区一码列表
export async function getCommunityForQr(data) {
  return await servicer({
    url: "/chtm/getCommunityForQr",
    method: "post",
    data,
  });
}

// 下载小区码
export async function downloadQRCode(data) {
  return await servicer({
    url: "/sy/downloadQRCode",
    method: "get",
    params: data,
  });
}

// 获取全局配置
export async function getGlobalConfig(data) {
  return await servicer({
    url: "/sy/getGlobalConfig",
    method: "post",
    data,
  });
}

// 修改全局配置
export async function updateGlobalConfig(data) {
  return await servicer({
    url: "/sy/updateGlobalConfig",
    method: "post",
    data,
  });
}

// 设备异常监控
export async function showMonitor(data) {
  return await servicer({
    url: "/chtm/showMonitor",
    method: "post",
    data,
  });
}
