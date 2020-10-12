export const activeStatus = [
  {
    statu: 0,
    value: 0,
    label: "待审核",
    isAllow: true,
    type: "info",
    effect: "light",
  },
  {
    statu: 1,
    value: 1,
    label: "待投放",
    isAllow: false,
    type: "primary",
    effect: "light",
  },
  {
    statu: 2,
    value: 2,
    label: "投放中",
    isAllow: false,
    type: "success",
    effect: "light",
  },
  {
    statu: 3,
    value: 3,
    label: "已完成",
    isAllow: true,
    type: "danger",
    effect: "dark",
  },
  {
    statu: 4,
    value: 4,
    label: "已暂停",
    isAllow: false,
    type: "warning",
    effect: "light",
  },
  {
    statu: 5,
    value: 5,
    label: "未通过",
    isAllow: true,
    type: "danger",
    effect: "light",
  },
  {
    statu: 6,
    value: 6,
    label: "已终止",
    isAllow: true,
    type: "danger",
    effect: "plain",
  },
];
export const biddingStatus = [
  {
    statu: 0,
    value: 0,
    label: "待投放",
    isAllow: true,
    type: "info",
    effect: "light",
  },
  {
    statu: 1,
    value: 1,
    label: "投放中",
    isAllow: false,
    type: "primary",
    effect: "light",
  },
  {
    statu: 2,
    value: 2,
    label: "已结束",
    isAllow: true,
    type: "success",
    effect: "light",
  },
  {
    statu: 3,
    value: 3,
    label: "已暂停",
    isAllow: false,
    type: "warning",
    effect: "light",
  },
  {
    statu: 4,
    value: 4,
    label: "已终止",
    isAllow: true,
    type: "danger",
    effect: "plain",
  },
  {
    statu: 5,
    value: 5,
    label: "未通过",
    isAllow: true,
    type: "danger",
    effect: "light",
  },
  {
    statu: 6,
    value: 6,
    label: "已终止",
    isAllow: true,
    type: "danger",
    effect: "plain",
  },
];

export const bidding_Init = [
  {
    statu: 1,
    value: 1,
    label: "投放中",
    isAllow: false,
    type: "primary",
    effect: "light",
  },
  {
    statu: 3,
    value: 3,
    label: "已暂停",
    isAllow: false,
    type: "warning",
    effect: "light",
  },
  {
    statu: 4,
    value: 4,
    label: "已终止",
    isAllow: true,
    type: "danger",
    effect: "plain",
  },
];
export const active_Init = [
  {
    value: "adName",
    label: "订单名称",
  },
  {
    value: "adId",
    label: "订单ID",
  },
  {
    value: "howLong",
    label: "时长",
  },
];

export const active_Name = {
  adName: "订单名称",
  adId: "订单ID",
  howLong: "时长",
};
export const biddingActive_Init = [
  {
    value: "adName",
    label: "订单名称",
  },
  {
    value: "id",
    label: "订单ID",
  },
  {
    value: "userName_",
    label: "用户名",
  },
  {
    value: "userName",
    label: "创建人",
  },
];
export const biddingActive_Name = {
  adName: "订单名称",
  id: "订单ID",
  userName: "用户名",
};
export const active_fn = [
  {
    fn: "activity_ListEdit",
    name: "查看",
  },
  {
    fn: "activity_ListSetStart_",
    name: "删除",
  },
  {
    fn: "howLong_",
    name: "审核通过",
  },
  {
    fn: "howLong",
    name: "审核驳回",
  },
  {
    fn: "activity_ListSetStart",
    name: "暂停",
  },
  {
    fn: "activity_ListSetStop",
    name: "终止",
  },
  {
    fn: "activeListDown",
    name: "导出",
  },
];
export const Active_Type = [
  {
    value: 0,
    label: "图片",
  },
  {
    value: 1,
    label: "视频",
  },
];
export const Active_periods = [
  {
    value: 30,
    label: "图片",
  },
  {
    value: 60,
    label: "视频",
  },
];
export const pickerOptions = {
  disabledDate(time) {
    var b_date = new Date();
    b_date.setDate(b_date.getDate() - 1);
    var beforeDate = new Date(b_date);

    var n_date = new Date();
    n_date.setDate(n_date.getDate() + 239);
    var nextDate = new Date(n_date);
    return time.getTime() < beforeDate || time.getTime() > nextDate;
  },
  shortcuts: [
    {
      text: "连续",
      onClick(picker) {
        var gettimes = picker;
        if (picker.value && picker.value.length > 1) {
          var long = picker.value[picker.value.length - 1] - picker.value[0];
          var allLong = long / 24 / 60 / 60 / 1000;
          var dateArr = [];
          var obj = {};
          for (var index = 0; index < allLong + 1; index++) {
            var ndate = "";
            obj[index] = new Date(picker.value[0]);
            dateArr.push(
              new Date(obj[index].setDate(obj[index].getDate() + index))
            );
          }
          gettimes.$emit("pick", dateArr);
        }
      },
    },
  ],
};
export const options = [
  {
    id: 1,
    label: "一级 1",
    children: [
      {
        id: 4,
        label: "二级 1-1",
        children: [
          {
            id: 9,
            label: "三级 1-1-1",
          },
          {
            id: 10,
            label: "三级 1-1-2",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "一级 2",
    children: [
      {
        id: 5,
        label: "二级 2-1",
      },
      {
        id: 6,
        label: "二级 2-2",
      },
    ],
  },
  {
    id: 3,
    label: "一级 3",
    children: [
      {
        id: 7,
        label: "二级 3-1",
      },
      {
        id: 8,
        label: "二级 3-2",
      },
    ],
  },
];
