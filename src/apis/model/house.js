import servicer from "@/utils/resave";

// 列表
export async function getMeals(data) {
  return await servicer({
    url: "/sy/getMeals",
    method: "post",
    data,
  });
}

// 总表
export async function getOrders(data) {
  return await servicer({
    url: "/sy/getOrderByCo",
    method: "post",
    data,
  });
}

// 总表
export async function postCoOrders(data) {
  return await servicer({
    url: "/sy/getCoOrders",
    method: "post",
    data,
  });
}
// 详情
export async function getOrdersItem(data) {
  return await servicer({
    url: "/sy/getOrderDetail",
    method: "post",
    data,
  });
}
// 导出
export async function getOrdersExcel(data) {
  return await servicer({
    url: "/sy/excelCoOrders",
    method: "get",
    params: data,
  });
}

export async function setOrders(data) {
  return await servicer({
    url: "/sy/addResponsiPerson",
    method: "post",
    data,
  });
}
