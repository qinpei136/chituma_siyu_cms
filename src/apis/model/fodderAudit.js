import servicer from "@/utils/resave";

// -------------素材----------------------------------素材---------------------素材---------------------------素材------------

// 审核素材
export async function getMaterialList(data) {
  return await servicer({
    url: "/chtm/getMaterial",
    method: "get",
    params: data,
  });
}
// 审核素材 check
export async function MaterialAudit(data) {
  return await servicer({
    url: "/chtm/submitXCheck",
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
// ----------素材---------------------------------素材-----------------素材----------------------素材---------------------
