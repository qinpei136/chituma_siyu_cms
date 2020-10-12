import servicer from "@/utils/resave";
// 获取档期列表
export async function getMyValidOrders(data) {
  return await servicer({
    url: "/chtm/getValidOrders",
    method: "get",
    params: data,
  });
}

// 获取素材列表
export async function getValidMyMaterials(data) {
  return await servicer({
    url: "/chtm/getValidMaterials",
    method: "get",
    params: data,
  });
}
// 获取素材列表
export async function getValidMyMaterials_(data) {
  return await servicer({
    url: "/chtm/getValidMaterials",
    method: "post",
    data,
  });
}
// 保存活动id
export async function setValidMyMaterialsID(data) {
  return await servicer({
    url: "/chtm/saveAd ",
    method: "post",
    data,
  });
}
// 修改活动 --素材
export async function setchangeMaterialID(data) {
  return await servicer({
    url: "/chtm/changeMaterial",
    method: "post",
    data,
  });
}
// 删除订单
export async function getMyMaterialDelete(data) {
  return await servicer({
    url: "/chtm/delete",
    method: "post",
    data,
  });
}

// 获取 列表

export async function getActiveDevice(data) {
  return await servicer({
    url: "/chtm/getAds",
    method: "get",
    params: data,
  });
}
// 导出

export async function getExcelData(data) {
  return await servicer({
    url: "/chtm/Excel",
    method: "get",
    params: data,
    headers: {
      "Content-Type": "application/vnd.openxmlformats;",
    },
    responseType: "blob",
  });
}
// 获取 活动详情
export async function getActiveData(data) {
  return await servicer({
    url: "/chtm/getAdDeviceDetail",
    method: "get",
    params: data,
  });
}
//
export async function isLogin(data) {
  return await servicer({
    url: "/chtm/getAdDeviceDetail",
    method: "get",
    params: data,
  });
}
// MaterialsSetStart

// 暂停
export async function MaterialsSetStart_(data) {
  return await servicer({
    url: "/chtm/stopAd ",
    method: "post",
    data,
  });
}
// 启动
export async function MaterialsSetStart(data) {
  return await servicer({
    url: "/chtm/continueAd ",
    method: "post",
    data,
  });
}

// 终止
export async function MaterialsSetStop(data) {
  return await servicer({
    url: "/chtm/cancelAd ",
    method: "post",
    data,
  });
}
