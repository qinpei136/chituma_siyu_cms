import servicer from "@/utils/resave";

// 获取 列表

export async function getMyActiveDevice(data) {
  return await servicer({
    url: "chtm/getCheckAds",
    method: "get",
    params: data,
  });
}
export async function submitMyActive(data) {
  return await servicer({
    url: "chtm/submitAdCheck",
    method: "post",
    data: data,
  });
}
