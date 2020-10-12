import servicer from "@/utils/resave";

// --新建竞价活动
export async function setbiddingMaterialID(data) {
  return await servicer({
    url: "/chtm/saveCpm",
    method: "post",
    data,
  });
}
// export async function getActiveDevice(data) {
//   return await servicer({
//     url: "/chtm/getAds",
//     method: "get",
//     params: data,
//   });
// }

// -- 获取列表
export async function getCpmsDevice(data) {
  return await servicer({
    url: "/chtm/getCpms",
    method: "get",
    params: data,
  });
}

// --启动
export async function setbiddingStatusStart(data) {
  return await servicer({
    url: "/chtm/continueCpm",
    method: "post",
    data,
  });
}
// -- 暂停
export async function setbiddingStatusStep(data) {
  return await servicer({
    url: "/chtm/stopCpm",
    method: "post",
    data,
  });
}
// --终止
export async function setbiddingStatusStop(data) {
  return await servicer({
    url: "/chtm/cancelCpm",
    method: "post",
    data,
  });
}
// -- 更新素材
export async function changeBiddingMaterial(data) {
  return await servicer({
    url: "/chtm/changeCpmMaterial",
    method: "post",
    data,
  });
}
// -- 获取详情

export async function getActiveData(data) {
  return await servicer({
    url: "/chtm/getCpm",
    method: "post",
    data,
  });
}
// 修改活动 --素材
export async function setchangeMaterialID(data) {
  return await servicer({
    url: "/chtm/changeCpmMaterial",
    method: "post",
    data,
  });
}
export async function resetMaterial(data) {
  return await servicer({
    url: "/chtm/saveCpmChange",
    method: "post",
    data,
  });
}
