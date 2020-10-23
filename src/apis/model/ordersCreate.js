import servicer from "@/utils/resave";

// 查询城市
export async function getMygetCities(data) {
  return await servicer({
    url: "/chtm/getCities",
    method: "get",
    params: data,
  });
}
// 查询行政区
export async function postMyCommunity(data) {
  return await servicer({
    // url: "/chtm/getCommunity", 旧
    url: "/chtm/getDistrict",
    method: "post",
    data,
  });
}
// 查询小区
export async function postMyUnit(data) {
  return await servicer({
    url: "/chtm/getCommunity",
    method: "post",
    data,
  });
}
// 查询 设备
export async function postMyMediaTask(data) {
  return await servicer({
    url: "/chtm/getMediaTask",
    method: "post",
    data,
  });
}
// 保存数据
export async function postTowerDevice(data) {
  return await servicer({
    url: "/chtm/saveMediaTask",
    method: "post",
    data,
  });
}
