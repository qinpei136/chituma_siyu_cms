import servicer from "@/utils/resave";
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
