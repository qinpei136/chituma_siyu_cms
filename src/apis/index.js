import servicer from "@/utils/resave";

// 获取订单列表

export async function getOrdersDevice(data) {
  return await servicer({
    url: "/chtm/getOrders",
    method: "get",
    params: data,
  });
}

// 设备状态
export async function getDeivceAll(data) {
  return await servicer({
    url: "/chtm/getEqOnline",
    method: "get",
    params: data,
  });
}
// 设备状态 3天后广告过期
export async function getDeivceEndingAds(data) {
  return await servicer({
    url: "/chtm/getEndingAds",
    method: "get",
    params: data,
  });
}

export async function getSignUp(data) {
  return await servicer({
    url: "/chtm/uploadLicense",
    method: "post",
    data,
  });
}
