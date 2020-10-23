import Layout from "@/layouts";
import EmptyLayout from "@/layouts/EmptyLayout";
import Vue from "vue";
import VueRouter from "vue-router";
import MyControlSearch from "./reset"; //root admin SuperUser editor advertiser

Vue.use(VueRouter);
export const RouteArr = ["SuperUser", "root", "admin", "editor", "advertiser"];
// devShow可以看到所有页面
var controlRole = new MyControlSearch(RouteArr);

// console.log(controlRole.get(6), 22225552222);
// console.log(controlRole.out(), 2211111111444);
// console.log(controlRole.inside(), 2277777777777444);

//  媒体管理 创建订单
const medium_ordersCreate = (resolve) =>
  require(["@/views/content/orders/ordersCreate"], resolve);
// 媒体管理 订单列表
const medium_ordersInit = (resolve) =>
  require(["@/views/content/orders/init.vue"], resolve);
// 媒体管理 填充广告
const medium_welfare_active = (resolve) =>
  require(["@/views/content/orders/welfare_active.vue"], resolve);
// 广告投放 活动
const medium_advertiser_activity = (resolve) =>
  require(["@/views/content/active/activity.vue"], resolve);

// --------------公共部分---------------公共部分---------------公共部分---------------公共部分-----------
//  地图展示
const medium_devicesList = (resolve) =>
  require(["@/views/content/amap/all.vue"], resolve);
// 订单详情
const ordersDetail = (resolve) =>
  require(["@/views/content/orders/ordersDetail.vue"], resolve);
// 活动详情
const medium_adetails = (resolve) =>
  require(["@/views/content/active/adetails.vue"], resolve);
// 活动详情
const medium_biddingDetails = (resolve) =>
  require(["@/views/content/active/biddingDetails.vue"], resolve);
// --------------公共部分---------------公共部分---------------公共部分---------------公共部分-----------

// ---------------管理--------------管理----------------管理---------管理----------管理---------------
// 媒体管理 素材 审核
const medium_materialsAudit = (resolve) =>
  require(["@/views/content/fodder/materialsAudit.vue"], resolve);
// 媒体管理 活动审核
const materials_ActivityAudit = (resolve) =>
  require(["@/views/content/fodder/materialsActivity.vue"], resolve);
// 广告投放 活动
const medium_admin_activity = (resolve) =>
  require(["@/views/content/active/activity.vue"], resolve);
// 广告投放 活动
const medium_admin_biddingActive = (resolve) =>
  require(["@/views/content/active/biddingActive.vue"], resolve);
// 审核 注册
const medium_admin_allow = (resolve) =>
  require(["@/views/content/super/allow.vue"], resolve); // src\views\content\super\allow.vue

// 设备异常监控
const equipment_monitor = (resolve) =>
  require(["@/views/content/equipment/monitor.vue"], resolve);

//  模板
const medium_admin_medlll = (resolve) =>
  require(["@/views/content/model/model.vue"], resolve); // src\views\content\super\allow.vue

// ---------------管理--------------管理----------------管理---------管理----------管理---------------

// -------------------3.0 升级-------3.0 升级----------3.0 升级-------3.0 升级--------3.0 升级-----------
// cpm订单
const medium_admin_cpmorder = (resolve) =>
  require(["@/views/content/advertis/cpmorder.vue"], resolve);
// cpt订单
const medium_admin_cptorder = (resolve) =>
  require(["@/views/content/advertis/cptorder.vue"], resolve);
// ----------------3.0 升级-------------3.0 升级---------------3.0 升级-----------3.0 升级----------3.0 升级-----------
// -------------------资源 管理-----------资源 管理-----------资源 管理------资源 管理------资源 管理------
//resources
// 资源管理 点位列表
const source_ordersInit = (resolve) =>
  require(["@/views/content/resources/source.vue"], resolve);
// -------------------资源 管理-----------资源 管理-----------资源 管理------资源 管理------资源 管理------
// -------------------小程序 ---------小程序 ----------------小程序 ----------------小程序 -----------------------

// 小程序 管理
const weapp_admin_config = (resolve) =>
  require(["@/views/content/wxapp/config.vue"], resolve);

const weappp_devices_qrcode = (resolve) =>
  require(["@/views/content/wxapp/devicesQRCode.vue"], resolve);
const weappp_global_config = (resolve) =>
  require(["@/views/content/wxapp/globalConfig.vue"], resolve);
const weapp_private_cpt = (resolve) =>
  require(["@/views/content/wxapp/privateCpt.vue"], resolve);
const weapp_private_cpt_detail = (resolve) =>
  require(["@/views/content/wxapp/privateCptDetail.vue"], resolve);
const weapp_private_traffic = (resolve) =>
  require(["@/views/content/wxapp/privateTraffic.vue"], resolve);
const weapp_private_traffic_detail = (resolve) =>
  require(["@/views/content/wxapp/privateTrafficDetail.vue"], resolve);
const weappp_private_coupons = (resolve) =>
  require(["@/views/content/wxapp/privateCoupons.vue"], resolve);
const weappp_private_house = (resolve) =>
  require(["@/views/content/wxapp/privateHouse.vue"], resolve);
const weappp_user_coupons = (resolve) =>
  require(["@/views/content/wxapp/userCoupons.vue"], resolve);
// 物业管理
const weappp_property_management = (resolve) =>
  require(["@/views/content/wxapp/property_management.vue"], resolve);
// 物业管理新增物业页面
const weappp_property_add = (resolve) =>
  require(["@/views/content/wxapp/property_add.vue"], resolve);
// 物业管理修改页面property_update
const property_update = (resolve) =>
  require(["@/views/content/wxapp/property_update.vue"], resolve);
// 物业管理查看页面
const property_view = (resolve) =>
  require(["@/views/content/wxapp/property_view.vue"], resolve);
// 物业管理提现property_drawbouns
const property_drawbouns = (resolve) =>
  require(["@/views/content/wxapp/property_drawbouns.vue"], resolve);
// 物业管理物业名称订单页面Property_orders
const Property_orders = (resolve) =>
  require(["@/views/content/wxapp/Property_orders.vue"], resolve);

// -------------------小程序 ---------小程序 ----------------小程序 ----------------小程序 -----------------------

// -------------------暂时---------停用------------------停用---------------------停用----------------

// -------------------暂时---------停用----------------停用----------------停用-----------------------

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    // component: () => import("@/views/login/oldlogin"),
    hidden: true,
  },
  {
    path: "/signup",
    component: () => import("@/views/login/signup"),
    hidden: true,
  },
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
];

/*当settings.js里authentication配置的是intelligence时，views引入交给前端配置*/
export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    meta: {
      title: "首页",
      icon: "home",
      affix: true,
    },
    children: [
      {
        path: "/index",
        name: "Index",
        component: () => import("@/views/index/index"),
        meta: {
          title: "首页",
          icon: "home",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/byui",
    component: Layout,
    redirect: "noRedirect",
    name: "Byui",
    meta: { title: "广告订单管理", icon: "cloud" },
    children: [
      // {
      //   path: "medium-orders",
      //   name: " medium_ordersInit",
      //   component: EmptyLayout,
      //   redirect: "noRedirect",
      //   meta: {
      //     title: "CPT 广告管理",
      //     permissions: controlRole.get(5),
      //   },
      //   children: [
      //     {
      //       path: "init_",
      //       name: "medium_ordersInit_",
      //       component: medium_ordersInit,
      //       meta: {
      //         title: "CPT 广告管理",
      //         permissions: controlRole.get(5),
      //       },
      //     },
      //   ],
      // },
      // {
      //   path: "medium-bidding",
      //   name: " medium_admin_bidding",
      //   component: EmptyLayout,
      //   redirect: "noRedirect",
      //   meta: {
      //     title: "CPM广告管理",
      //     permissions: controlRole.get(5),
      //   },
      //   children: [
      //     {
      //       path: "active",
      //       name: "medium_admin_biddingActive",
      //       component: medium_admin_biddingActive,
      //       meta: {
      //         title: "CPM广告管理",
      //         permissions: controlRole.get(5),
      //       },
      //     },
      //   ],
      // },

      {
        path: "medium-orders-init",
        name: "medium_orders_Init",
        component: medium_ordersInit,
        meta: {
          title: "创建_订单",
          permissions: controlRole.all(),
        },
      },
      {
        path: "medium-activity",
        name: "medium_admin_activity",
        component: medium_admin_activity,
        meta: {
          title: "广告_活动",
          permissions: controlRole.inside(),
        },
      },
      {
        path: "medium-activity",
        name: "medium_advertiser_activity",
        component: medium_advertiser_activity,
        meta: {
          title: "广告-活动",
          permissions: controlRole.out(),
        },
      },
      {
        path: "medium-bidding-active",
        name: "medium_admin_biddingActive",
        component: medium_admin_biddingActive,
        meta: {
          title: "广告-竞价",
          permissions: controlRole.all(),
        },
      },
      {
        path: "medium-materials-audit",
        name: "medium_materialsAudit",
        component: medium_materialsAudit,
        meta: {
          title: "审核素材",
          permissions: controlRole.inside(), // 内部
        },
      },

      // {
      //   path: "materials-activity-audit_",
      //   name: "medium_activityAudit",

      //   component: medium_materialsAudit,
      //   meta: {
      //     title: "审核素材",
      //     permissions: controlRole.all(), // 外部
      //   },
      // },
      {
        path: "materials-activity-audit_",
        name: "medium_activityAudit",

        component: materials_ActivityAudit,
        meta: {
          title: "审核活动",
          permissions: controlRole.inside(), // 外部
        },
      },
      {
        path: "medium-welfare-active",
        name: "medium_welfare_active",
        component: medium_welfare_active,
        meta: {
          title: "公益-素材",
          permissions: controlRole.inside(),
        },
      },
      {
        path: "medium-devices-list",
        name: "medium_devicesList",
        component: medium_devicesList,
        meta: {
          title: "设备-坐标",
          permissions: controlRole.all(),
        },
      },

      {
        path: "medium-orders-create",
        name: "medium_ordersCreate",
        hidden: true,
        component: medium_ordersCreate,
        meta: {
          title: "新建-订单",
          permissions: controlRole.get(5),
        },
      },
      {
        path: "medium_order/:details",
        name: "medium_order_details",
        hidden: true,
        component: ordersDetail,
        meta: {
          title: "订单详情",
          permissions: controlRole.all(), // 外部
        },
      },
      {
        path: "medium_activity/:details",
        name: "medium_activity_details",
        hidden: true,
        component: medium_adetails,
        meta: {
          title: "活动详情",
          permissions: controlRole.all(),
        },
      },
      {
        path: "medium_bidding/:details",
        name: "medium_bidding_details",
        hidden: true,
        component: medium_biddingDetails,
        meta: {
          title: "竞价详情",
          permissions: controlRole.all(),
        },
      },
      {
        path: "medium-activity-audit/:details",
        name: "medium_activityAudit_details",
        hidden: true,
        component: medium_adetails,
        meta: {
          title: "审核活动详情",
          permissions: controlRole.all(), // 外部
        },
      },

      {
        path: "medium-admin-medlll",
        name: "medium_admin_medlll",
        component: medium_admin_medlll,
        hidden: true,
        meta: {
          title: "设备-模板",
          permissions: controlRole.all(),
        },
      },
    ],
  },
  {
    path: "/resources",
    component: Layout,
    redirect: "noRedirect",
    name: "resources",
    hidden: true,
    meta: {
      title: "资源",
      icon: "folder",
      permissions: controlRole.inside(),
    },
    children: [
      {
        path: "",
        name: "source_ordersInit",

        component: source_ordersInit,
        meta: {
          title: "点位管理",
          permissions: controlRole.inside(),
        },
      },
    ],
  },
  {
    path: "/equipment",
    component: Layout,
    redirect: "noRedirect",
    name: "equipment-monitor",
    meta: {
      title: "设备异常监控",
      icon: "folder",
      permissions: controlRole.inside(),
    },
    children: [
      {
        path: "",
        name: "equipment-monitor",
        hidden: true,
        component: equipment_monitor,
        meta: {
          title: "设备异常监控",
          permissions: controlRole.inside(),
        },
      },
    ],
  },
  {
    path: "/admin",
    component: Layout,
    redirect: "noRedirect",
    name: "Allow",
    meta: {
      title: "管理",
      icon: "folder",
      permissions: controlRole.inside(),
    },
    children: [
      {
        path: "",
        name: "allow",
        hidden: true,
        component: medium_admin_allow,
        meta: {
          title: "注册管理",
          permissions: controlRole.inside(),
        },
      },
    ],
  },
  {
    path: "/weapp",
    component: Layout,
    redirect: "noRedirect",
    name: "config",
    meta: {
      title: "小程序",
      icon: "folder",
      permissions: controlRole.inside(),
    },
    children: [
      {
        path: "devicesQRCode",
        name: "weappp-devices-qrcode",
        component: weappp_devices_qrcode,
        meta: {
          title: "小程序配置-一区一码",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },
      {
        path: "globalConfig",
        name: "weappp-global-config",
        component: weappp_global_config,
        meta: {
          title: "小程序配置-全局配置",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },
      {
        path: "private-domain-traffic",
        name: "config_s",
        component: weapp_private_traffic,
        meta: {
          title: "私域流量方案套餐",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },
      {
        path: "privateTrafficDetail/:style/:id/:isEdit",
        name: "weapp-private-traffic-detail",
        hidden: true,
        component: weapp_private_traffic_detail,
        meta: {
          title: "方案套餐",
          permissions: controlRole.get(5),
        },
      },
      {
        path: "private-traffic-cpt",
        name: "privatecpt",
        component: weapp_private_cpt,
        meta: {
          title: "私域流量cpt订单",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },
      {
        path: "private-house",
        name: "config_h",
        component: weappp_private_house,
        meta: {
          title: "小区订单管理",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },

      {
        path: "private-coupons",
        name: "config_c",
        component: weappp_private_coupons,
        meta: {
          title: "优惠券管理",
          permissions: controlRole.inside(),
        },
      },
      {
        path: "user-coupons",
        name: "weappp-user-coupons",
        component: weappp_user_coupons,
        meta: {
          title: "用户领取记录",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },
      // 物业管理页面
      {
        path: "propertyManagement",
        name: "weappp_property_management",
        component: weappp_property_management,
        meta: {
          title: "物业管理",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },
      // 物业管理页面(新增物业页面)
      {
        path: "propertyAdd",
        name: "weappp_property_add",
        component: weappp_property_add,
        hidden: true,
        meta: {
          title: "物业管理",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },
      // 物业管理页面(修改页面)property_update
      {
        path: "property_update",
        name: "property_update",
        component: property_update,
        hidden: true,
        meta: {
          title: "物业管理",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },
      // 物业管理页面(查看页面)property_view
      {
        path: "property_view",
        name: "property_view",
        component: property_view,
        hidden: true,
        meta: {
          title: "物业管理",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },
      // //  物业管理页面(物业名称页面)
      // {
      //   path: "property_drawbouns",
      //   name: "property_drawbouns",
      //   component: property_drawbouns,
      //   hidden: true,
      //   meta: {
      //     title: "物业提现",
      //     keepAlive: true,
      //     permissions: controlRole.inside(),
      //   },
      // },
      // 物业管理物业名称订单页面Property_orders
      {
        path: "Property_orders",
        name: "Property_orders",
        component: Property_orders,
        hidden: true,
        meta: {
          title: "物业管理",
          keepAlive: true,
          permissions: controlRole.inside(),
        },
      },
      {
        path: "private-traffic-cpt-item/:orderId/:status",
        name: "privatecp_item",
        component: weapp_private_cpt_detail,
        hidden: true,
        meta: {
          title: "订单详情",
          permissions: controlRole.inside(),
        },
      },
    ],
  },
  {
    path: "/error",
    component: EmptyLayout,
    redirect: "noRedirect",
    hidden: true,
    name: "Error",
    meta: { title: "错误页", icon: "bug" },
    children: [
      {
        path: "/401",
        name: "401",
        component: () => import("@/views/401"),
        meta: { title: "401" },
      },
      {
        path: "/404",
        name: "404",
        component: () => import("@/views/404"),
        meta: { title: "404" },
      },
    ],
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];

const router = new VueRouter({
  mode: "hash",
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
});

export function resetRouter() {
  router.matcher = new VueRouter({
    mode: "hash",
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  }).matcher;
}

export default router;
