import request from "@/utils/request";
import servicer from "@/utils/resave";

export function getList(data) {
  return request({
    url: "/changeLog/getList",
    method: "post",
    data,
  });
}

// 登录
export async function getDatas(data) {
  return await servicer({
    url: "/chtm/signIn",
    method: "post",
    // data: ToFormData(data),
    data: data,
  });
}
// 获取小区数据
export async function getDetails(data) {
  return await servicer({
    url: "/api/goodslist",
    method: "get",
    // data: ToFormData(data),
    data: data,
  });
}
