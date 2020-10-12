<template>
  <div class="table-container">
    <byui-query-form>
      <byui-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item label="城市">
            <el-input
              v-model="toSend.cityName"
              placeholder="城市"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="区域">
            <el-input
              v-model="toSend.districtName"
              placeholder="区域"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="小区名称">
            <el-input
              v-model="toSend.communityName"
              placeholder="小区名称"
              clearable
            ></el-input>
          </el-form-item>

        </el-form>
      </byui-query-form-left-panel>
      <byui-query-form-right-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="activeGetData"
              >查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-refresh"
              type="primary"
              @click="activeClearGetData"
              >清空
            </el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="activityAdd"
              >新建竞价广告
            </el-button>
          </el-form-item> -->
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="userCoupon_List"
      :row-class-name="tableRowClassName"
      style="min-height: 50vh;"
      :element-loading-text="elementLoadingText"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="false" type="selection" width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        :index="indexMethod"
      >
      </el-table-column>

      <el-table-column prop="cityName" label="城市"></el-table-column>
      <el-table-column prop="districtName" label="区域"></el-table-column>
      <el-table-column prop="communityName" label="小区"></el-table-column>
      <el-table-column prop="community" label="小区码" fixed="right">
      <template slot-scope="scope">
          <el-button escape="false"
            type="success"
            plain
            size="mini"
            @click="downloadImg(scope.row)"
          >
            下载
          </el-button>
        <!-- <a :download='scope.row.community+".jpg"' :src="'sy/downloadQRCode?id='+scope.row.community">下载</a> -->
        <!-- <el-link type="primary" :src="'https://test.ctmaidsp.com/sy/downloadQRCode?id='+scope.row.community">下载</el-link> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="userCoupon_ShowDialog"
      width="60%"
      custom-class="maEledalog"
      style="margin-top: -7rem;"
      center
    >
      <div style="min-height: 300px; margin: 0 auto;">
        <el-form
          ref="postForm"
          v-model="postForm"
          :inline="true"
          style="max-width: 100%; margin-left: 0rem;"
        >
          <el-card class="boxCard">
            <div slot="header">
              <span class="clearfix">新增竞价广告</span>
            </div>

            <el-form-item label="订单名称:" size="mini">
              <el-input v-model="postForm.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="客户名称:" size="mini">
              <el-input v-model="postForm.UsrName" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="投放方式:" size="mini">
              CPM
            </el-form-item>
          </el-card>
          <el-card class="boxCard">
            <div slot="header">
              <span class="clearfix">客户群体</span>
            </div>

            <el-form-item label="性别:">
              <el-radio v-model="postForm.gender" :label="1">男</el-radio>
              <el-radio v-model="postForm.gender" :label="2">女</el-radio>
              <el-radio v-model="postForm.gender" :label="0">不限</el-radio>
            </el-form-item>
            <br />
            <el-checkbox-group v-model="postForm.ageList">
              <el-form-item label="年龄:">
                <el-checkbox
                  v-for="age in agekList_arr"
                  :key="age"
                  :label="age"
                  >{{ age + agekList_[age] }}</el-checkbox
                >

                <el-checkbox
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                  >全选</el-checkbox
                >
                <el-radio v-model="postForm.getAge" :label="1">不限</el-radio>
              </el-form-item>
            </el-checkbox-group>
            <el-form-item label="投放时长:">
              <el-radio
                v-model="postForm.checkTime"
                :label="5"
                @change="activityChangeID"
                >{{ 5 + "秒" }}
              </el-radio>
              <el-radio
                v-model="postForm.checkTime"
                :label="15"
                @change="activityChangeID"
                >{{ 15 + "秒" }}
              </el-radio>
            </el-form-item>
            <br />

            <el-form-item label="时间段:" size="mini">
              <el-button @click="setTimeShow(false)"> 不限</el-button>
              <el-button @click="setTimeShow(true)">自定义</el-button>
              <div v-if="endTimeShow">
                <el-time-select
                  v-model="startTime"
                  placeholder="起始时间"
                  :picker-options="{
                    start: '00:00',
                    step: '01:00',
                    end: '24:00',
                  }"
                >
                </el-time-select>
                <el-time-select
                  v-model="endTime"
                  placeholder="结束时间"
                  :picker-options="{
                    start: '00:00',
                    step: '01:00',
                    end: '24:00',
                    minTime: startTime,
                  }"
                >
                </el-time-select>
              </div>
            </el-form-item>

            <br />
            <el-form-item label="出价:" prop="price">
              <el-input
                v-model="postForm.price"
                size="mini"
                style="width: 80px;"
              ></el-input
              >元
            </el-form-item>

            <el-form-item label="可选素材:" size="mini">
              <el-select v-model="postForm.material" @change="setSelectShow">
                <el-option
                  v-for="item in userCoupon_SelectWelfare"
                  :key="item.materialId"
                  :value="item.materialId"
                  :label="item.name"
                ></el-option>
              </el-select>
              <span v-if="change_value" style="margin-left: 30px;"
                >类型: {{ change_value }}
              </span>
            </el-form-item>
          </el-card>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="clearCenterDialog">取 消</el-button>
        <el-button type="primary" @click="userCoupon_ImgUpload"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="activityTotal"
      @current-change="activityPageChange"
      @size-change="activitySizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import * as coupons from "@/apis/model/coupons.js";
import * as model from "@/apis/model/model.js";

import * as actives from "@/apis/model/active";
import * as activitys from "@/apis/json/activity";
// import * as userCoupon from "@/apis/model/userCoupon";

import { downs } from "@/utils/getDownloadExcel"; // src\utils\getDownloadExcel.js
import { parseTime } from "@/utils/index.js";
export default {
  name: "MediumActivitys",
  components: {},
  filters: {
    // statusFilter(status) {
    //   return this.activeMapStatus[status]["type"];
    // },
  },
  data() {
    const agekList_m = {
      "0-11": "岁 儿童",
      "12-17": "岁 青少年",
      "18-29": "岁 青年",
      "30-39": "岁 壮年",
      "40-59": "岁 中年",
      "60岁以上": "老年",
    };

    const agekList_s = Object.keys(agekList_m);

    const bidding_Init = {
      0: "未使用",
      1: "已使用",
      2: "已过期",
    };
    var statInit = [];
    for (const stat in bidding_Init) {
      if (bidding_Init.hasOwnProperty(stat)) {
        const element = bidding_Init[stat];
        statInit.push({
          value: Number(stat),
          label: element,
        });
      }
    }
    statInit.push({
      value: Number(100),
      label: "全部",
    });

    return {
      pageName: "",
      userCoupon_InitData: [],
      userCoupon_mapData: [],
      userCoupon_List: [],
      userCoupon_SelectOrder: [],
      userCoupon_SelectWelfare: [],

      listLoading: true,
      layout: "total, prev, pager, next,  jumper",
      activityTotal: 0,
      background: true,
      selectRows: "",
      elementLoadingText: "正在加载...",
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      activeMapStatus: activitys.biddingStatus,
      activeMap_Status: statInit,
      activeList_Status: bidding_Init,

      userCoupon_ShowDialog: false,
      uploadFileName: "",
      imgSrc: "",
      vadioSrc: "",
      getFile: null,
      active: 1,
      selectForm: {
        times: null,
        material: null,
      },
      ordersValue: null,
      ordersNameValue: "",
      multipleSelection: [],
      adId_mainArr: [],
      visible: false,
      agekList_: agekList_m,
      agekList_arr: agekList_s,
      isIndeterminate: true,

      toSend: { cityName: "", districtName: "", communityName: "" },
      useFor: {
        0: "代金券",
        1: "折扣券",
      },
      getWay: {
        0: "系统发放",
        1: "其他",
      },
      postForm: {
        name: "",
        UsrName: "",
        gender: 0,
        getAge: 1,
        material: "",
        ageList: [],
        checkTime: 15,
        timeList: [],
        price: "",
      },
      startTime: "",
      endTime: "",
      change_value: "",
      endTimeShow: false,
      pickerOptions: {
        disabledDate(time) {
          var b_date = new Date();
          b_date.setDate(b_date.getDate() - 1);
          var beforeDate = new Date(b_date);
          var n_date = new Date();
          n_date.setDate(n_date.getDate() + 27);
          var nextDate = new Date(n_date);
          return time.getTime() < beforeDate || time.getTime() > nextDate;
        },
        shortcuts: [
          {
            text: "连续",
            onClick(picker) {
              var gettimes = picker;
              if (picker.value && picker.value.length > 1) {
                var long =
                  picker.value[picker.value.length - 1] - picker.value[0];
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
      },
    };
  },
  watch: {
    "postForm.ageList": {
      handler(newList, oldList) {
        if (newList.length < 1) {
          this.postForm.getAge = 1;
        } else {
          this.postForm.getAge = 0;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // console.log(this.activeMapStatus);
    this.pageName = this.$route.name;
    this.userCoupon_fetchData();
  },
  mounted() {},
  methods: {
    downloadImg(row){
        var url = 'sy/downloadQRCode?id='+row.community;// 获取图片地址
        var a = document.createElement('a');// 创建一个a节点插入的document
        var event = new MouseEvent('click')// 模拟鼠标click点击事件
        a.download =row.cityName+"_"+row.districtName+"_"+row.communityName+'.jpg'// 设置a节点的download属性值
        a.href = url;// 将图片的src赋值给a节点的href
        a.dispatchEvent(event)// 触发鼠标点击事件
     },
    userCoupon_fetchData() {
      this.listLoading = true;
      this.userCoupon_fetch();
    },

    downloadQRCode(row, postIsVerify) {
      this.isShowDrawer = true;
      this.isShowkeep = postIsVerify; //:disabled="!isShowkeep"
      this.setState = false;
      this.isForKeep = 1;
      this.CouponsForm = { ...row };
      this.clearTimes();
    },
    userCoupon_fetch() {
      model
        .getCommunityForQr({ ...this.toSend })
        .then((res) => {
          if (res.data.status) {
            this.userCoupon_InitData = res.data.data;
            this.activityTotal = this.userCoupon_InitData.length;
            this.userCoupon_mapData = [...this.userCoupon_InitData];
            this.activityPageChange(1);
          }
          this.listLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.listLoading = false;
        });
    },
    handleCheckAllChange(val) {
      this.postForm.ageList = val ? this.agekList_arr : [];
      this.isIndeterminate = false;
    },
    beforeHandleCommand(index, row, command) {
      return {
        index: index,
        row: row,
        command: command,
      };
    },
    setSelectShow(Show) {
      // console.log(Show);
      var item_ = this.userCoupon_SelectWelfare.filter((item) => {
        return item.materialId === Show;
      });
      var [getItem_] = [...item_];
      // console.log(getItem_.format);
      this.change_value = getItem_.format;
    },
    setTimeShow(Show) {
      this.endTimeShow = Show;
      if (!Show) {
        this.startTime = "";
        this.endTime = "";
      }
    },
    handleCommand(command) {
      switch (command.command) {
        case "a": //编辑
          this.userCoupon_ListEdit(command.row);
          break;
        case "b": // 启动/暂停
          this.userCoupon_ListSetStart(command.row);
          break;
        case "c": //终止
          this.userCoupon_ListSetStop(command.row);
          break;
        case "d": //导出
          this.activeListDown(command.row);
          break;
      }
    },
    activityPageChange(val) {
      this.queryForm.pageNo = val;
      this.userCoupon_List = this.userCoupon_mapData.slice(
        (val - 1) * this.queryForm.pageSize,
        val * this.queryForm.pageSize
      );
    },
    activitySizeChange(val) {
      this.queryForm.pageSize = val;
      this.activityPageChange(1);
    },
    indexMethod(index) {
      return (this.queryForm.pageNo - 1) * this.queryForm.pageSize + index + 1;
    },

    activityAdd() {
      this.userCoupon_ShowDialog = true;

      // console.log(this.postForm.checkTime);
      this.activityChangeID();
    },
    activityChangeID() {
      this.postForm.material = "";
      this.change_value = "";
      actives
        .getValidMyMaterials_({
          long: this.postForm.checkTime,
        })
        .then((res) => {
          if (res.data.status) {
            this.userCoupon_SelectWelfare = res.data.data;
          }
        });
    },

    tableRowClassName({ row, rowIndex }) {
      var getMainArr = this.$route.params.mainArr;
      getMainArr = getMainArr ? getMainArr : [];
      if (getMainArr.indexOf(row.adId) > -1) {
        return "warning-row";
      }
      return "";
    },
    handleAvatarSuccess() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    timesChange() {
      if (this.postForm.timeList && this.postForm.timeList.length > 0) {
        this.postForm.timeList = this.postForm.timeList.sort(function (a, b) {
          return (
            Date.parse(a.replace(/-/g, "/")) - Date.parse(b.replace(/-/g, "/"))
          );
        });
      } else {
        this.$baseMessage("请至少选中一个日期", "info");
      }
    },
    userCoupon_ImgUpload() {
      // this.userCoupon_ShowDialog = false;
      return;
      var start_time = "00";
      var stop_time = "24";
      if (this.endTimeShow) {
        if (!this.startTime || !this.endTime) {
          this.$baseMessage("自定义时间段必须选择开始和结束时间", "warning");
          return false;
        } else {
          start_time = this.startTime.slice(0, 2);
          stop_time = this.endTime.slice(0, 2);
        }
      }

      var patrn = /^\d{0,8}(\.\d{0,2})?$/;
      // var patrn = /^([1-9]\d*(.\d{1,2})?)$|^(0.\d?[1-9])$|^(0.[1-9]\d?)$/;
      if (!patrn.test(this.postForm.price)) {
        this.$baseMessage(
          "请输入正确的出价--（至多带2位小数的正数）",
          "warning"
        );
        return false;
      }
      if (
        this.postForm.name &&
        this.postForm.UsrName &&
        this.postForm.material &&
        this.postForm.price
      ) {
        // this.postForm.ageList   this.agekList_arr
        if (parseInt(this.postForm.getAge) == 1) {
          this.postForm.ageList = this.agekList_arr;
        }

        var sendAge = this.postForm.ageList.map((item) => {
          if (item === "60岁以上") {
            return (item = "60-uncap");
          } else {
            return item;
          }
        });
        var getMaterial = null;
        this.userCoupon_SelectWelfare.forEach((item) => {
          if (this.postForm.material == item.materialId) {
            getMaterial = item;
          }
        });
        // console.log(getMaterial, 333);
        // console.log(sendAge, 444);
        // console.log(this.userCoupon_SelectWelfare);
        // console.log(this.postForm);  new String("John");

        const { materialId, format, url } = getMaterial;
        this.userCoupon_ShowDialog = false;
        start_time = new String(start_time);
        stop_time = new String(stop_time);
        userCoupon
          .setbiddingMaterialID({
            gender: [this.postForm.gender],
            materialId,
            materialFormat: format,
            age: sendAge,
            long: this.postForm.checkTime,
            materiaUrl: url,
            adName: this.postForm.name,
            userName: this.postForm.UsrName,
            price: this.postForm.price,
            adDatys: [], // this.postForm.timeList,
            startDay: null, //this.postForm.timeList[0],
            stopDay: null, // this.postForm.timeList[this.postForm.timeList.length - 1],

            startHour: start_time,
            stopHour: stop_time,
            community: [],
            aiext: [],
            dmpext: [],
            commical: [],
          })
          .then((res) => {
            // console.log(res);
            if (res.data.status) {
              this.userCoupon_fetch();
            }
            this.clearCenterDialog();
          });
      } else {
        this.$baseMessage("请填写完整", "warning");
      }
    },
    clearCenterDialog() {
      this.postForm.name = "";
      this.postForm.UsrName = "";
      this.postForm.material = "";
      this.postForm.gender = 0;
      this.postForm.price = "";
      this.postForm.ageList = [];
      this.postForm.timeList = [];

      this.change_value = "";
      this.startTime = "";
      this.endTime = "";

      this.userCoupon_ShowDialog = false;
    },
    userCoupon_ListEdit(row) {
      // this.$router.push({
      //   path: "/byui/medium_activity/" + row["adId"],
      // });
      this.$router.push({
        path: "/byui/medium_bidding/" + row["id"],
      });
    },
    userCoupon_ListSetStart(row) {
      return false;
      var get_status = parseInt(row["stat"]);
      if (get_status === 3) {
        userCoupon.setbiddingStatusStart({ id: row["id"] }).then((res) => {
          if (res.data.status) {
            this.$baseMessage(" 启动成功", "success");
            this.userCoupon_fetchData();
          }
        });
      } else {
        userCoupon.setbiddingStatusStep({ id: row["id"] }).then((res) => {
          if (res.data.status) {
            this.$baseMessage("暂停成功", "success");
            this.userCoupon_fetchData();
          }
        });
      }
    },
    userCoupon_ListSetStop(row) {
      return false;
      if (row["stat"] == 4) {
        this.$baseMessage("已经终止", "success");
        return false;
      }
      userCoupon.setbiddingStatusStop({ id: row["id"] }).then((res) => {
        if (res.data.status) {
          this.userCoupon_fetchData();
        }
      });
    },
    activeListDown(row) {
      // console.log(row); // 赤兔马智媒+客户名称+订单名称+当天导出时间
      var thatTime = parseTime(new Date());
      thatTime = thatTime.slice(0, 10);
      var fileActiveName = `赤兔马智媒_${row["orderUseName"]}_${row["adName"]}_${thatTime}.xlsx`;
      var urls = `${window.location.origin}/chtm/Excel?adId=${row["adId"]}&name=${fileActiveName}`;
      console.log(urls);
      try {
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = urls;
        link.setAttribute("download", fileActiveName);
        document.body.appendChild(link);
        var win2 = window.open(link);
        setTimeout(() => {
          win2.close();
        }, 100);
      } catch (error) {
        console.log(error);
      }
    },
    activeGetData() {
      this.userCoupon_fetch();
    },
    activeClearGetData() {
      this.toSend.cityName = "";
      this.toSend.districtName = "";
      this.toSend.communityName = "";
      this.userCoupon_fetch();
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar-uploader {
  text-align: center;
}
.active_order_sty {
  display: flex;
  justify-content: space-between;
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
  text-align: start;
  span {
    word-break: keep-all;
  }
}
.el-dropdown-link_ {
  cursor: pointer;
  border: 1px solid #91b1d0;
}
</style>

<style>
.boxCard {
  width: 100%;
}
.clearfix {
  display: inline-block;
  text-align: start;
}
.el-table .warning-row {
  background: #a8edea;
}

.el-table .success-row {
  background: #49b50f;
}
.maEledalog {
  margin-top: 0;
  width: 66%;
}
</style>
