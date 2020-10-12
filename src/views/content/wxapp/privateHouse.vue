<template>
  <div class="table-container">
    <byui-query-form>
      <byui-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item label="小区名">
            <el-select
              v-model="houseNameValue"
              filterable
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in allow_Select"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="width: 500px; height: 3px;"></div>
      </byui-query-form-left-panel>
      <byui-query-form-right-panel>
        <el-form
          ref="form"
          :model="houseForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="house_SelectList"
              >查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-refresh"
              type="primary"
              @click="clearCenterList"
              >清空
            </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>

    <el-table
      ref="tableSigile"
      v-loading="listLoading"
      :data="house_List"
      style="min-height: 50vh;"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column prop="adCommunity" label="小区名称"></el-table-column>

      <el-table-column prop="adDistrict" label="所处区域"></el-table-column>
      <el-table-column prop="adCity" label="所处城市"></el-table-column>
      <el-table-column prop="orders" label="订单总数"></el-table-column>
      <el-table-column prop="coResponsi" label="小区负责人" width="226px">
        <template slot-scope="scope">
          <div v-show="getUser(scope.row)">
            <el-input
              v-model="scope.row.coResponsi"
              class="communityUseSty"
              placeholder="小区负责人"
            ></el-input>
            <el-input
              v-model="scope.row.coPhone"
              class="communityPhoneSty"
              placeholder="小区负责人手机号"
            ></el-input>
          </div>
          <div
            v-show="!getUser(scope.row)"
            @click="house_Clear(scope.row, scope.$index)"
          >
            {{ scope.row.coResponsi + ":" + scope.row.coPhone }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="proResponsi" label="物业负责人" width="226px">
        <template slot-scope="scope">
          <div v-show="getUser(scope.row)">
            <el-input
              v-model="scope.row.proResponsi"
              class="communityUseSty"
              placeholder="物业联系人"
            ></el-input>
            <el-input
              v-model="scope.row.proPhone"
              class="communityPhoneSty"
              placeholder="物业联系人手机号"
            ></el-input>
          </div>
          <div
            v-show="!getUser(scope.row)"
            @click="house_Clear(scope.row, scope.$index)"
          >
            {{ scope.row.proResponsi + ":" + scope.row.proPhone }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="house_toLimits(scope.row)"
            >查看
          </el-button>
          <el-button
            v-show="getUser(scope.row)"
            type="primary"
            plain
            size="mini"
            @click="house_keepItem(scope.row, scope.$index)"
            >保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="查看订单"
      direction="rtl"
      :visible.sync="houseAllowShow"
      :before-close="house_Close"
      custom-class="houseDrawer"
    >
      <div class="onTopNames">
        <el-row>
          <el-col :span="3">
            {{
              houseItem.adCommunity ? `小区名称:${houseItem.adCommunity}` : ""
            }}
          </el-col>
          <el-col :span="3">
            {{ houseItem.adDistrict ? `所属区域:${houseItem.adDistrict}` : "" }}
          </el-col>
          <el-col :span="3">
            {{ houseItem.adCity ? `所属城市:${houseItem.adCity}` : "" }}
          </el-col>
          <el-col :span="3">
            {{ houseItem.orders ? `订单总数:${houseItem.orders}` : "" }}
          </el-col>

          <el-col :span="2">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="house_getExcel(houseItem.adCommunity)"
              >导出
            </el-button>
          </el-col>
          <el-col :span="2">
            <span> 订单状态</span>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="ordersNameSelect"
              placeholder="请选择"
              clearable
              @change="houseMapVerifyCheck"
            >
              <el-option
                v-for="item in house_MapVerify"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="houseUserSty">
          <!-- // houseUser  coResponsi coPhone  proResponsi proPhone-->
          <el-col :span="2">
            <span> 小区负责人:</span>
          </el-col>
          <el-col :span="2">
            <span> {{ houseUser.coResponsi }}</span>
          </el-col>
          <el-col :span="2">
            <span> 小区负责人电话:</span>
          </el-col>
          <el-col :span="2">
            <span> {{ houseUser.coPhone }}</span>
          </el-col>
          <el-col :span="2">
            <span> 物业联系人:</span>
          </el-col>
          <el-col :span="2">
            <span> {{ houseUser.proResponsi }}</span>
          </el-col>
          <el-col :span="2">
            <span> 物业联系人电话:</span>
          </el-col>
          <el-col :span="2">
            <span> {{ houseUser.proPhone }}</span>
          </el-col>
        </el-row>
      </div>
      <el-table
        ref="tableSort"
        v-loading="drawerLoading"
        :data="allow_List"
        style="min-height: 50vh;"
        :element-loading-text="elementLoadingText"
      >
        <el-table-column prop="account" label="客户微信昵称"></el-table-column>
        <el-table-column prop="mobile" label="授权手机号" width="160px">
        </el-table-column>
        <el-table-column prop="meal" label="套餐名称"></el-table-column>

        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column
          prop="orderTime"
          width="160px"
          label="下单时间"
        ></el-table-column>
        <el-table-column prop="adStart" label="投屏时间"></el-table-column>
        <!-- <el-table-column prop="account" label="创建人"> </el-table-column> -->
        <el-table-column prop="orderStat" label="状态">
          <template slot-scope="scope">
            <el-tooltip
              :content="scope.row.remark ? scope.row.remark : ''"
              placement="top-start"
              :disabled="!scope.row.remark"
            >
              <el-tag :type="statusList[scope.row.orderStat].status">
                {{ statusList[scope.row.orderStat].name }}</el-tag
              >
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400px" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="allow_toLimits(scope.row)"
              >查看
            </el-button>
            <el-button
              v-show="
                !parseInt(scope.row.orderStat) || scope.row.orderStat == 10
              "
              type="success"
              plain
              size="mini"
              @click="allow_delMeals(scope.row, true)"
              >通过
            </el-button>
            <el-button
              v-show="
                !parseInt(scope.row.orderStat) || scope.row.orderStat == 10
              "
              type="danger"
              plain
              size="mini"
              @click="allow_delMeals(scope.row, false)"
              >驳回
            </el-button>
            <el-button
              v-show="
                !!parseInt(scope.row.orderStat) &&
                scope.row.orderStat != 7 &&
                scope.row.orderStat != 8 &&
                scope.row.orderStat != 9
              "
              type="primary"
              plain
              size="mini"
              @click="allow_tosee(scope.row, true)"
              >退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :background="background"
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="allowTotal"
        @current-change="allowPageChange"
      ></el-pagination>
    </el-drawer>

    <el-pagination
      :background="background"
      :current-page="houseForm.pageNo"
      :layout="layout"
      :page-size="houseForm.pageSize"
      :total="houseTotal"
      @current-change="housePageChange"
    ></el-pagination>
  </div>
</template>

<script>
import * as actives from "@/apis/model/active";
import * as house from "@/apis/model/house.js";
import * as weapp from "@/apis/model/weapp.js";

import checkPermission from "@/utils/permission";

export default {
  name: "MediumActivity",
  components: {},

  data() {
    return {
      house_InitData: [],
      house_mapData: [],
      house_List: [],

      allow_InitData: [],
      allow_mapData: [],
      allow_List: [],
      allow_Select: [],
      listLoading: true,
      drawerLoading: true,
      layout: "total, prev, pager, next, jumper",
      total: 0,
      houseTotal: 0,
      allowTotal: 0,
      background: true,
      elementLoadingText: "正在加载...",
      houseForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      houseNameValue: "",
      houseNameSelect: "",

      isVerifyStatusType: {
        0: "待审核",
        1: "审核通过",
        2: "未通过",
      },
      house_MapVerify: [],
      ordersNameSelect: null,
      getrouteAdmin: "",
      isShowShen: null,
      isUse: ["禁用", "启用"],
      houseItem: {},
      houseUser: {},
      houseAllowShow: false,

      isShowkeep: true,
      isForKeep: 0,
      statusList: [
        {
          name: "待审核",
          status: "gray",
          value: 0,
        },
        {
          name: "待投放",
          status: "green",
          value: 1,
        },
        {
          name: "投放中",
          status: "brown",
          value: 2,
        },
        {
          name: "已完成",
          status: "red",
          value: 3,
        },
        {
          name: "已驳回4",
          status: "orange",
          value: 4,
        },
        {
          name: "已驳回",
          status: "orange",
          value: 5,
        },
        {
          name: "已过期",
          status: "orange",
          value: 6,
        },
        {
          name: "已退款",
          status: "orange",
          value: 7,
        },
        {
          name: "退款中",
          status: "orange",
          value: 8,
        },
        {
          name: "退款失败",
          status: "orange",
          value: 9,
        },
        {
          name: "待审核",
          status: "orange",
          value: 10,
        },
      ],
    };
  },
  computed: {
    getUser() {
      return function (item) {
        //allow
        return item.allow || (!item.coResponsi && !item.proResponsi);
      };
    },
  },
  watch: {
    // $route(newRoute, oldRoute) {
    //   if (newRoute === "/weapp/private-house") {
    //     this.house_toShowList();
    //   }
    // },
    $route: {
      handler: function (val, oldVal) {
        console.log(val);
        console.log(oldVal);
      },
      deep: true,
    },
  },

  created() {
    this.fetchData();
    this.house_MapVerify = this.statusList.filter((item) => {
      return item.value != 4 && item.value != 0;
    });
  },
  mounted() {
    this.house_toShowList();
  },

  methods: {
    checkPermission,
    getMaterilsData() {
      house
        .getOrders({
          orderStat: -1,
        })
        .then((res) => {
          if (res.data.status) {
            this.house_InitData = res.data.data;

            this.houseTotal = this.house_InitData.length;
            if (this.houseTotal > 0) {
              this.allow_Select = this.house_InitData.map((item) => {
                return {
                  name: item.adCommunity,
                  value: item.adCommunity,
                  pinyin: item.pinyin,
                };
              });
              //小区负责人coResponsi //物业负责人proResponsi //小区电话coPhone //物业电话proPhone
              // this.house_mapData = [...this.house_InitData];
              this.house_mapData = this.house_InitData.map((item, index) => {
                item.allow = false;
                return item;
              });
              this.housePageChange(1);
            }
          }

          this.listLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.listLoading = false;
        });
    },
    fetchData() {
      this.listLoading = true;
      this.getMaterilsData();
    },
    housePageChange(val) {
      this.house_List = this.house_mapData.slice((val - 1) * 20, val * 20);
    },
    allowPageChange(val) {
      this.allow_List = this.allow_mapData.slice((val - 1) * 20, val * 20);
    },
    house_toLimits(row) {
      this.houseItem = row;
      var beforeData_ = JSON.stringify(row);
      sessionStorage.setItem("beforeData", beforeData_);
      this.allowUpdate();
    },
    house_toShowList() {
      var getbeforeData = sessionStorage.getItem("beforeData");
      getbeforeData = getbeforeData ? JSON.parse(getbeforeData) : {};
      if (this.$route.params.shows) {
        this.houseItem = getbeforeData;
        console.log(this.houseItem);

        this.allowUpdate();
      }
    },
    allowUpdate() {
      this.drawerLoading = true;
      this.houseAllowShow = true;
      house
        .postCoOrders({
          adCommunity: this.houseItem.adCommunity,
        })
        .then((res) => {
          this.drawerLoading = false;
          if (res.data.status) {
            this.allow_InitData = res.data.data;

            // this.allow_InitData = this.allow_InitData.reverse();
            this.allowTotal = this.allow_InitData.length;

            if (this.allowTotal > 0) {
              this.houseUser = this.allow_InitData[0];
              this.allow_mapData = [...this.allow_InitData];
              this.allowPageChange(1);
            }
            console.log(this.houseUser);
          }
        })
        .catch((err) => {
          console.log(err);
          this.houseAllowShow = false;
        });
    },
    allow_delMeals(row, allow) {
      var self = this;
      var toSend = {};
      toSend = row;
      toSend.isPass = allow;
      toSend.remark = "";
      if (!allow) {
        self
          .$prompt("请输入驳回理由", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: "请输入理由",
          })
          .then(({ value }) => {
            toSend["remark"] = value;
            // console.log(toSend);
            self.allow_send(toSend);
          })
          .catch(() => {
            self.$message({
              type: "info",
              message: "取消输入",
            });
          });
      } else {
        if (parseInt(row.canSubmit)) {
          this.allow_send(toSend);
        } else {
          self.$message({
            type: "warning",
            message: "未上传素材 请上传后再通过",
          });
        }
      }

      //
    },
    allow_send(data_) {
      var self = this;
      weapp.allowTo(data_).then((res) => {
        if (res.data.status) {
          self.$message({
            type: "success",
            message: "审核成功",
          });
          self.isShowDrawer = false;
        } else {
          self.$message({
            type: "info",
            message: "审核失败",
          });
        }
        self.allowUpdate();
      });
    },
    allow_toLimits(row) {
      // console.log(row, postIsVerify);
      sessionStorage.setItem("fromUrl", "/weapp/private-house");
      this.$router.push({
        name: "privatecp_item",
        params: {
          orderId: row.orderId,
          status: row.orderStat,
        },
      });
    },
    allow_tosee(row, postIsVerify) {
      console.log(row, postIsVerify);
      var self = this;
      weapp.delPay(row).then((res) => {
        self.$message({
          type: "success",
          message: "已发起退款",
        });
        self.allowUpdate();
      });
    },
    house_Close(done) {
      done();
      // this.$confirm("确认关闭？")
      //   .then((_) => {
      //     done();
      //   })
      //   .catch((_) => {}); getOrdersExcel
    },
    house_keepItem(row, item) {
      let sendRow = { ...row };
      var self = this;
      //小区负责人coResponsi //物业负责人proResponsi //小区电话coPhone //物业电话proPhone

      if (!sendRow.coResponsi) {
        this.$message({
          type: "info",
          message: "没有填小区负责人",
        });
        return false;
      }
      if (!sendRow.proResponsi) {
        this.$message({
          type: "info",
          message: "没有填物业负责人",
        });
        return false;
      }
      var reg = /^\d{8,11}$/;
      if (!sendRow.coPhone || !reg.test(sendRow.coPhone)) {
        this.$message({
          type: "info",
          message: "请填小区负责人电话",
        });
        return false;
      }
      if (!sendRow.proPhone || !reg.test(sendRow.proPhone)) {
        this.$message({
          type: "info",
          message: "请填物业负责人电话",
        });
        return false;
      }
      house
        .setOrders(sendRow)
        .then((res) => {
          // console.log(res);
          var list2 = [...self.house_List];
          sendRow.allow = false;
          list2[item] = sendRow;
          self.house_List = list2;
        })
        .catch((err) => {
          console.log(err);
          this.houseAllowShow = false;
        });
    },
    house_Clear(row, item) {
      var list = [...this.house_List];
      row.allow = true;
      list[item] = row;
      this.house_List = list;
    },

    house_getExcel(comtry) {
      var fileActiveName = `赤兔马智媒_${comtry}_订单.xlsx`;
      var urls = `${window.location.origin}/sy/excelCoOrders?adCommunity=${comtry}`;
      console.log(urls);
      try {
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = urls;
        link.setAttribute("download", fileActiveName);
        document.body.appendChild(link);
        var win2 = window.open(link);
        // setTimeout(() => {
        //   win2.close();
        // }, 100);
      } catch (error) {
        console.log(error);
      }
    },

    house_SelectList() {
      var newarr = JSON.parse(JSON.stringify(this.house_InitData));
      if (this.house_InitData.length > 0) {
        if (this.houseNameValue != "") {
          this.house_mapData = newarr.filter((item) => {
            if (this.houseNameValue != "") {
              return item["adCommunity"].search(this.houseNameValue) > -1;
            }
          });
        } else {
          this.house_mapData = [...this.house_InitData];
        }
        // if (!isNaN(parseInt(this.houseNameSelect))) {
        //   this.house_mapData = newarr.filter((item) => {
        //     if (this.houseNameSelect == 10) {
        //       return (
        //         item["orderStat"] == this.houseNameSelect ||
        //         item["orderStat"] == 0
        //       );
        //     }
        //     return item["orderStat"] == this.houseNameSelect;
        //   });
        // if (this.houseNameValue != "") {
        //   this.house_mapData = newarr.filter((item) => {
        //     if (this.houseNameValue != "") {
        //       return (
        //         String(item["EnterpriseRenMobile"]).search(
        //           this.houseNameValue
        //         ) > -1 || item["orderStat"] == this.houseNameSelect
        //       );
        //     }
        //   });
        // }
        // } else {
        //   this.clearCenterList();
        // }
        this.houseTotal = this.house_mapData.length;
        this.housePageChange(1);
        // console.log(this.house_InitData);
      }
    },
    houseMapVerifyCheck() {
      var newarr = JSON.parse(JSON.stringify(this.allow_InitData));
      if (this.allow_InitData.length > 0) {
        // if (this.houseNameValue != "") {
        //   this.house_mapData = newarr.filter((item) => {
        //     if (this.houseNameValue != "") {
        //       return item["adCommunity"].search(this.houseNameValue) > -1;
        //     }
        //   });
        // } else {
        //   this.house_mapData = [...this.allow_InitData];
        // }
        if (!isNaN(parseInt(this.ordersNameSelect))) {
          this.allow_mapData = newarr.filter((item) => {
            if (this.ordersNameSelect == 10) {
              return (
                item["orderStat"] == this.ordersNameSelect ||
                item["orderStat"] == 0
              );
            }
            return item["orderStat"] == this.ordersNameSelect;
          });
        } else {
          this.allow_mapData = [...this.allow_InitData];
        }
        this.houseTotal = this.allow_mapData.length;
        this.allowPageChange(1);
        // console.log(this.house_InitData);
      }
    },
    clearCenterList() {
      this.houseNameValue = "";
      this.houseNameSelect = "";
      this.house_mapData = [...this.house_InitData];
      this.houseTotal = this.house_mapData.length;
      this.housePageChange(1);
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar-uploader {
  text-align: center;
}

.onTopNames {
  margin: 12px;
  color: #07334e;
  position: relative;
  left: 2%;
  bottom: 0;

  // width: 160rem;
}
</style>
<style>
.openImgsAllow {
  width: 60vw;
  text-align: center;
}
.houseDrawer {
  width: 86% !important;

  padding-left: 20px;
  padding-bottom: 20px;
  overflow-y: scroll;
}

.houseDrawer header {
  padding: 0;
}
.houseDrawer .el-drawer__header {
  padding: 0;
  margin: 0;
}
.houseDrawerInput {
  width: 33%;
}
.communityUseSty {
  width: 7rem;
}
.communityPhoneSty {
  width: 8rem;
}
.houseItemImg {
  width: 160px;
  height: 80px;
  border: 1px solid #ececec;
}

.houseUserSty {
  margin-top: 2rem;
}
</style>
