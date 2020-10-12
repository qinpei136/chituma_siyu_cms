import servicer from "@/utils/resave";

// 保存
export async function keepCoupons(data) {
  return await servicer({
    url: "/sy/addCoupon",
    method: "post",
    data,
  });
}
export async function CouponsList(data) {
  return await servicer({
    url: "/sy/getCouponList",
    method: "post",
    data,
  });
}

// 改数据
export async function CouponsUpData(data) {
  return await servicer({
    url: "/sy/updateCoupon",
    method: "post",
    data,
  });
}
// 该状态
export async function CouponsdelPay(data) {
  return await servicer({
    url: "/sy/updateCouponState",
    method: "post",
    data,
  });
}
//  list
export async function getCoupons(data) {
  return await servicer({
    url: "/sy/getCoupon",
    method: "get",
    params: data,
  });
}
// 记录 list {"name":"","state":100,"aId":""}
export async function getUsrCoupons(data) {
  return await servicer({
    url: "/sy/getUserCouponList",
    method: "post",
    data,
  });
}
