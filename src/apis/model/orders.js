import servicer from "@/utils/resave";
// 查询城市

export async function getOrdersDevice(data) {
  return await servicer({
    url: "/chtm/getOrders",
    method: "get",
    params: data,
  });
}
// -------------素材----------------------------------素材---------------------素材---------------------------素材------------
// 获取素材列表
export async function getMyMaterialList(data) {
  return await servicer({
    url: "/chtm/getMyMaterial",
    method: "get",
    params: data,
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
// 上传
export async function postMaterials(data) {
  return await servicer({
    url: "/chtm/upload",
    headers: {
      "Content-Type": "multipart/form-data;",
    },
    method: "post",
    data,
  });
}
// ----------活动---------------------------------活动-----------------活动----------------------活动---------------------
// 删除订单
export async function delMyMaterialDelete(data) {
  return await servicer({
    url: "/chtm/deleteOrder",
    method: "get",
    params: data,
  });
}
