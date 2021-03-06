import servicer from "@/utils/resave";

// 列表
export async function getMeals(data) {
  return await servicer({
    url: "/sy/getMeals",
    method: "post",
    data,
  });
}
export async function getOrders(data) {
  return await servicer({
    url: "/sy/getOrders",
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
// 保存
export async function keepMeals(data) {
  return await servicer({
    url: "/sy/saveMeal",
    method: "post",
    data,
  });
}
// 启用
export async function setMeals(data) {
  return await servicer({
    url: "/sy/activateMeal",
    method: "post",
    data,
  });
}
// 停
export async function closeMeals(data) {
  return await servicer({
    url: "/sy/suspendMeal",
    method: "post",
    data,
  });
}

export async function changeMeals(data) {
  return await servicer({
    url: "/sy/saveMealChange",
    method: "post",
    data,
  });
}
// 删
export async function delMeals(data) {
  return await servicer({
    url: "/sy/removeMeal",
    method: "post",
    data,
  });
}
// 退款
export async function delPay(data) {
  return await servicer({
    url: "/sy/refund",
    method: "post",
    data,
  });
}
// 上传素材
export async function resetMeals(data) {
  return await servicer({
    url: "/sy/uploadNew",
    method: "post",
    data,
  });
}
// 上传素材2
export async function resetMeals2(data) {
  return await servicer({
    url: "/sy/uploadNew1",
    method: "post",
    data,
  });
}
// 上传图片
export async function upload(data) {
  return await servicer({
    url: "/sy/upload",
    headers: {
      "Content-Type": "multipart/form-data;",
    },
    method: "post",
    data,
  });
}
export async function upload64(data) {
  return await servicer({
    url: "/sy/uploadBase64",
    method: "post",
    data,
  });
}

// 提交审核
export async function allowTo(data) {
  return await servicer({
    url: "/sy/submit",
    method: "post",
    data,
  });
}

// 下文件
export async function getFile(data) {
  return await servicer({
    url: "/sy/dowload",
    method: "get",
    params: data,
    // responseType: "arraybuffer",
  });
}

// 获取套餐详情
export async function getMealDetail(data) {
  return await servicer({
    url: "/sy/getMealDetail",
    method: "post",
    data,
  });
}
// 获取物业管理列表
export async function getProperties(data) {
  return await servicer({
    url: "/sy/getProperties",
    method: "post",
    data,
  });
}
// 新增物业接口
export async function addProperty(data) {
  return await servicer({
    url: "/sy/addProperty",
    method: "post",
    data,
  });
}
// 查看物业接口
export async function getProperty(data) {
  return await servicer({
    url: "/sy/getProperty",
    method: "post",
    data,
  });
}
// 更新物业接口
export async function updateProperty(data) {
  return await servicer({
    url: "/sy/updProperty",
    method: "post",
    data,
  });
}
// 获取物业分红详情
export async function getPropertyBounsDetail(data) {
  return await servicer({
    url: "/sy/getBonusDetailMana",
    method: "post",
    data,
  });
}
//提现
export async function drawBouns(data) {
  return await servicer({
    url: "/sy/drawBonus",
    method: "post",
    data,
  });
}
//停用物业
export async function stopProperty(data) {
  return await servicer({
    url: "/sy/stopProperty",
    method: "post",
    data,
  });
}
//启用物业
export async function startProperty(data) {
  return await servicer({
    url: "/sy/startProperty",
    method: "post",
    data,
  });
}
//删除物业
export async function remProperty(data) {
  return await servicer({
    url: "/sy/remProperty",
    method: "post",
    data,
  });
}
//查看小区订单列表
export async function getCoDetailMana(data) {
  return await servicer({
    url: "/sy/getCoDetailMana",
    method: "post",
    data,
  });
}
//11查看分红订单
export async function getBonusOrder(data) {
  return await servicer({
    url: "/sy/getBonusOrder",
    method: "post",
    data,
  });
}

