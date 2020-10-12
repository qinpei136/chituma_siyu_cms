<template>
  <div class="table-container">
    <byui-query-form>
      <byui-query-form-left-panel :span="12">
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-dropdown @command="handleCommands">
              <span class="el-dropdown-link">
                {{ biddingUsrName[active_Get]
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in biddingActive_Init"
                  :key="item.value"
                  :command="item.value"
                  v-text="item.label"
                >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="ordersNameValue"
              :placeholder="biddingUsrName[active_Get]"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="ordersValue" placeholder="投放状态" clearable>
              <el-option
                v-for="item in activeMapStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </byui-query-form-left-panel>
      <byui-query-form-right-panel :span="12">
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item v-if="false">
            <el-button icon="el-icon-plus" type="primary" @click="activityExcel"
              >导出Excel
            </el-button>
          </el-form-item>
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
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="activityAdd"
              >新建广告活动
            </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="activity_List"
      border
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
      <el-table-column min-width="140">
        <template slot="header">
          <div class="active_order_sty">
            订单名称
            <span v-text="'| ID'"></span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="active_order_sty">
            {{ scope.row.adName }}<span v-text="'|' + scope.row.id"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="客户名称" width="120">
        <template slot-scope="scope">
          <div class="active_order_sty">
            {{ scope.row.userName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price">
        <span slot="header" style="font-size: 8px;">价格(千次曝光)</span>
        <template slot-scope="scope">
          {{ "￥" + parseFloat(scope.row.price).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="startHour" label="时间段">
        <template slot-scope="scope">
          {{
            scope.row.startHour == 0 && scope.row.stopHour == 24
              ? "全天"
              : scope.row.startHour + ":00至" + scope.row.stopHour + ":00"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="cpmnum">
        <span slot="header" style="font-size: 8px;">曝光次数</span>
      </el-table-column>
      <el-table-column prop="cpmcost" label="已消费">
        <template slot-scope="scope">
          {{ "￥" + parseFloat(scope.row.cpmcost).toFixed(2) }}
        </template>
      </el-table-column>

      <!-- <el-table-column label="审核状态" prop="stat"></el-table-column> -->

      <el-table-column label="订单状态" prop="adStat">
        <template slot-scope="scope">
          <el-tag
            :type="activeMapStatus[scope.row.stat]['type']"
            :effect="activeMapStatus[scope.row.stat]['effect']"
          >
            {{ activeMapStatus[scope.row.stat]["label"] }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="stopDay" label="创建时间"></el-table-column> -->
      <el-table-column prop="userName" label="创建人"></el-table-column>

      <el-table-column label="操作" min-width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown size="medium" trigger="click" @command="handleCommand">
            <el-button
              size="mini"
              type="warning"
              style="padding: 7px 9px;"
              @click="setdropdown(scope.row)"
            >
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="fn in active_getfn"
                :key="fn.fn"
                :command="beforeHandleCommand(scope.$index, scope.row, fn.fn)"
              >
                {{ fn.name }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :visible.sync="activity_ShowDialog"
      direction="rtl"
      custom-class="set_drawer"
      :with-header="false"
    >
      <el-container>
        <el-header>
          <div class="set_steps">
            <el-steps :active="biddingStap" align-center simple>
              <el-step title="广告订单信息">
                <span slot="icon" class="set_step_cont">1</span>
              </el-step>
              <el-step title="选择设备信息">
                <span slot="icon" class="set_step_cont">2</span>
              </el-step>
              <el-step title="上传素材">
                <span slot="icon" class="set_step_cont">3</span>
              </el-step>
              <el-step title="确认广告信息">
                <span slot="icon" class="set_step_cont">4</span>
              </el-step>
            </el-steps>
          </div>
        </el-header>
        <div class="drawers_content">
          <div class="drawers_main">
            <el-form v-model="biddingForm" size="mini" inline>
              <el-row type="flex" justify="start">
                <el-col :span="6">
                  <el-form-item v-show="biddingStap == 1" label="广告订单名称:">
                    <el-input
                      v-model="biddingForm.activeName"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                  <br />
                  <el-form-item
                    v-show="biddingStap == 1"
                    label="广告时长:"
                    size="mini"
                  >
                    <el-select
                      v-model="biddingForm.long"
                      size="mini"
                      style="width: 120px;"
                    >
                      <el-option
                        v-for="imte in 3"
                        v-show="imte !== 2"
                        :key="imte * 5"
                        :label="imte * 5 + '秒'"
                        :value="imte * 5"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-show="biddingStap == 2"
                    label="投放点位:"
                    size="mini"
                  >
                    <!--  @change="SelectChange"-->
                    <el-select v-model="activeCity" size="mini" clearable>
                      <el-option
                        v-for="item in Cityoptions"
                        :key="item.city_id"
                        size="mini"
                        :label="item.city_name"
                        :value="item.city_id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <br />
                </el-col>
                <el-col :span="6">
                  <el-form-item v-show="biddingStap == 1" label="客户名称:">
                    <el-input
                      v-model="biddingForm.usrName"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                  <br />
                  <el-form-item
                    v-show="biddingStap == 1"
                    label="周期:"
                    size="mini"
                  >
                    <el-select
                      v-model="biddingForm.userDataCycle"
                      size="mini"
                      style="width: 120px;"
                    >
                      <el-option
                        v-for="imte in 4"
                        v-show="imte !== 3"
                        :key="imte * 30"
                        :label="imte * 30 + 's/次'"
                        :value="imte * 30"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item v-show="biddingStap == 2">
                    <el-input
                      v-model="CommunityName"
                      size="mini"
                      placeholder="请输入小区关键字"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item v-show="biddingStap == 1" label="素材类型:">
                    <el-select
                      v-model="biddingForm.activeType"
                      placeholder="请选择"
                      size="mini"
                      class="setpopper"
                    >
                      <el-option
                        v-for="item in Active_Type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <br />
                  <el-form-item
                    v-show="biddingStap == 1"
                    label="起始日期:"
                    size="mini"
                  >
                    <el-date-picker
                      v-model="devicePostTimes"
                      type="dates"
                      value-format="yyyy-MM-dd"
                      placeholder="请选择日期"
                      clearable
                      :picker-options="pickerOptions"
                      @change="timesChange"
                    >
                    </el-date-picker>
                    <span>
                      {{ devicePostTimes ? devicePostTimes.length : "" }}</span
                    >
                    天
                  </el-form-item>
                  <el-form-item v-show="biddingStap == 2">
                    <el-input
                      v-model="CommunityMax"
                      size="mini"
                      placeholder="单个小区设备上限值"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item v-show="biddingStap == 1" label="投放方式:">
                    <el-radio value="CPT" label="CPT">
                      CPT</el-radio
                    > </el-form-item
                  ><br />
                  <el-form-item v-show="biddingStap == 2">
                    <el-button
                      size="mini"
                      icon="el-icon-search"
                      type="primary"
                      native-type="submit"
                      @click="submiteGetTable"
                      >查询</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <!-- v-show="biddingStap == 2" -->
            <!-- <el-cascader-panel :options="options"></el-cascader-panel> -->
            <el-tree
              ref="tree"
              :data="options"
              show-checkbox
              default-expand-all
              node-key="id"
              highlight-current
              :props="{
                children: 'children',
                label: 'label',
              }"
            >
            </el-tree>
          </div>
          <div class="drawers_foot">
            <el-row type="flex" justify="end">
              <el-button size="mini" @click="clearCenterDialog"
                >取 消</el-button
              >
              <el-button
                v-show="biddingStap != 1"
                size="mini"
                type="primary"
                @click="backNext"
              >
                上一步
              </el-button>
              <el-button size="mini" type="primary" @click="goNext">
                下一步
              </el-button>
            </el-row>
          </div>
        </div>
      </el-container>
    </el-drawer>

    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryForm.pageSize"
      :total="activityTotal"
      @current-change="activityPageChange"
      @size-change="activitySizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getList, doDelete } from "@/api/table";
import * as actives from "@/apis/model/active";
import * as activitys from "@/apis/json/activity";
import * as biddingActive from "@/apis/model/biddingActive";
import * as ordersCreate from "@/apis/model/ordersCreate";

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
    return {
      pageName: "",
      activity_InitData: [],
      activity_mapData: [],
      activity_List: [],
      activity_SelectOrder: [],
      activity_SelectWelfare: [],

      listLoading: true,
      layout: "total, prev, pager, next,sizes, jumper",
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
      biddingActive_Init: activitys.biddingActive_Init,
      Active_Type: activitys.Active_Type,
      Active_Periods: activitys.Active_periods,
      pickerOptions: activitys.pickerOptions,
      options: activitys.options,

      biddingUsrName: activitys.biddingActive_Name,
      active_Get: "adName",
      uploadFileName: "",
      imgSrc: "",
      vadioSrc: "",
      getFile: null,
      selectForm: {
        times: null,
        material: null,
      },
      ordersValue: null,
      ordersNameValue: "",
      multipleSelection: [],
      adId_mainArr: [],
      active_fn: activitys.active_fn,
      active_getfn: [],
      visible: false,
      activity_ShowDialog: true,

      Cityoptions: [],
      biddingStap: 2,
      activeCity: "",
      CommunityName: "",
      CommunityMax: "",
      devicePostTimes: ["2020-09-15", "2020-09-18"],
      biddingForm: {
        activeName: "dsfsdfs",
        usrName: "cssdfasdfas",
        activeType: 0,
        userDataCycle: 120,
        long: 15,
      },
    };
  },
  created() {
    this.pageName = this.$route.name;
    this.activity_fetchData();
  },
  mounted() {},
  methods: {
    downs,
    beforeHandleCommand(index, row, command) {
      return {
        index: index,
        row: row,
        command: command,
      };
    },
    setdropdown(row) {
      this.active_getfn = this.active_fn.filter((item) => {
        if (row.stat == 1) {
          return (
            item.fn === "activity_ListEdit" || item.fn === "activeListDown"
          );
        } else if (row.stat == 4) {
          return (
            item.fn !== "activity_ListEdit" && item.fn !== "activeListDown"
          );
        }
      });
      // console.log(JSON.stringify(this.active_getfn));
    },
    handleCommand(command) {
      console.log(command);
      this[command.command](command.row);
    },
    handleCommands(command) {
      this.active_Get = command;
    },
    timesChange() {
      if (this.devicePostTimes && this.devicePostTimes.length > 0) {
        this.devicePostTimes.sort((a, b) => {
          return (
            parseInt(a.replace(/\D/g, ""), 10) -
            parseInt(b.replace(/\D/g, ""), 10)
          );
        });
      } else {
        this.$baseMessage("请至少选中一个日期", "info");
      }
    },
    activity_fetch() {
      biddingActive
        .getCpmsDevice()
        .then((res) => {
          if (res.data.status) {
            this.activity_InitData = res.data.data;

            this.activityTotal = this.activity_InitData.length;
            if (this.activityTotal > 0) {
              this.activity_mapData = [...this.activity_InitData];
              this.activityPageChange(1);
            }
          }
          this.listLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.listLoading = false;
        });
    },
    activityPageChange(val) {
      this.queryForm.pageNo = val;
      this.activity_List = this.activity_mapData.slice(
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
    activity_fetchData() {
      this.listLoading = true;
      this.activity_fetch();
    },

    activityAdd() {
      this.biddingStap = 1;
      actives.getMyValidOrders().then((res) => {
        if (res.data.status) {
          this.activity_SelectOrder = res.data.data;
          this.activity_ShowDialog = true;
        }
      });
    },
    setMyMaterialsID() {
      var getNmae = "";
      var getUrl = "";
      this.activity_SelectOrder.forEach((item) => {
        if (item["orderId"] == this.selectForm.times) {
          getNmae = item["orderName"];
        }
      });
      this.activity_SelectWelfare.forEach((item) => {
        if (item["materialId"] == this.selectForm.material) {
          getUrl = item["url"];
        }
      });
      var getUrlFormat = getUrl[0].search("mp4") > 0 ? "视频" : "图片";
      if (this.selectForm.material && this.selectForm.times) {
        actives
          .setValidMyMaterialsID({
            orderId: this.selectForm.times,
            adName: getNmae,
            materialId: this.selectForm.material,
            materiaUrl: getUrl,
            materialFormat: getUrlFormat,
          })
          .then((res) => {
            // console.log(res, "set");
            if (res.data.status) {
              this.$baseMessage("已提交", "success");
              this.clearCenterDialog();
              this.activity_fetchData();
            }
          });
      }
    },

    tableRowClassName({ row, rowIndex }) {
      var getMainArr = this.$route.params.mainArr;
      getMainArr = getMainArr ? getMainArr : [];
      if (getMainArr.indexOf(row.adId) > -1) {
        return "warning-row";
      }
      // if (rowIndex === 1) {
      //   return "warning-row";
      // } else if (rowIndex === 3) {
      //   return "success-row";
      // }
      return "";
    },
    handleAvatarSuccess() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    activityExcel() {
      // if (this.multipleSelection.length > 0) {
      //   var sendExcel = [];
      //   var sendExcel_item = "";
      //   console.log(this.multipleSelection);
      //   this.multipleSelection.forEach((item) => {
      //     sendExcel.push(item.adId);
      //     sendExcel_item = item.adId;
      //   });
      //   actives
      //     .getExcelData({
      //       adId: sendExcel_item,
      //     })
      //     .then((res) => {
      //       console.log(res.data);
      //       if (res) {
      //         this.downs(res.data, "结案报告");
      //       }
      //     });
      // }
    },
    submiteGetTable() {
      console.log(this.$refs.tree.getCheckedNodes());
    },

    back() {
      this.activity_SelectList();
      this.biddingStap = 1;
    },
    backNext() {
      this.biddingStap--;
    },
    goNext() {
      console.log({ ...this.biddingForm }, this.devicePostTimes);

      if (this.biddingStap === 1) {
        if (
          !this.biddingForm.activeName ||
          !this.biddingForm.usrName ||
          isNaN(Number(this.biddingForm.activeType)) ||
          this.devicePostTimes.length < 1
        ) {
          this.$baseMessage("请填写完整信息", "info");
          return false;
        }
        if (this.lengthCheck(this.biddingForm.activeName, "广告名称")) {
          return false;
        }
        if (this.lengthCheck(this.biddingForm.usrName, "客户名称")) {
          return false;
        }
        this.biddingStap++;
        ordersCreate.getMygetCities().then((res) => {
          if (res.data.status) {
            this.Cityoptions = res.data.data;
          }
        });
      } else if (this.biddingStap === 2) {
        // this.biddingStap++;
        console.log(1212);
      }
    },
    lengthCheck(val, tip) {
      if (val.length > 20) {
        this.$baseMessage(tip + "字数过多 (20字内)", "info");
        return true;
      } else {
        return false;
      }
    },
    activity_SelectList() {
      var get_SelectOrder = {};
      this.activity_SelectOrder.forEach((item) => {
        if (item["orderId"] == this.selectForm.times) {
          get_SelectOrder = item;
        }
      });
      actives
        .getValidMyMaterials_({
          long: get_SelectOrder.long,
        })
        .then((res) => {
          this.activity_SelectWelfare = res.data.data;
        });
      this.biddingStap++;
    },
    activity_ImgUpload() {
      // this.activity_ShowDialog = false;
    },
    clearCenterDialog() {
      this.selectForm.times = null;
      this.selectForm.material = null;
      this.activity_ShowDialog = false;
    },
    activity_ListEdit(row) {
      this.$router.push({
        path: "/byui/medium_activity/" + row["adId"],
      });
    },
    activity_ListSetStart(row) {
      var get_status = parseInt(row["adStat"]);
      if (get_status === 4) {
        actives.MaterialsSetStart({ adId: row["adId"] }).then((res) => {
          if (res.data.status) {
            this.activity_fetchData();
          }
        });
      } else {
        actives.MaterialsSetStart_({ adId: row["adId"] }).then((res) => {
          if (res.data.status) {
            this.activity_fetchData();
          }
        });
      }
    },
    activity_ListSetStop(row) {
      actives.MaterialsSetStop({ adId: row["adId"] }).then((res) => {
        if (res.data.status) {
          this.activity_fetchData();
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
        // setTimeout(() => {
        //   win2.close();
        // }, 100);
      } catch (error) {
        console.log(error);
      }
    },
    activeGetData() {
      var newarr = JSON.parse(JSON.stringify(this.activity_InitData));
      if (this.activity_InitData.length > 0) {
        if (!isNaN(parseInt(this.ordersValue))) {
          this.activity_mapData = newarr.filter((item) => {
            if (this.ordersNameValue != "") {
              return (
                parseInt(item["stat"]) === this.ordersValue &&
                String(item[this.active_Get]).search(this.ordersNameValue) > -1
              );
            } else {
              return parseInt(item["stat"]) === this.ordersValue;
            }
          });
        } else if (!isNaN(parseInt(this.ordersNameValue))) {
          this.activity_mapData = newarr.filter((item) => {
            return (
              String(item[this.active_Get]).search(this.ordersNameValue) > -1
            );
          });
        } else if (this.ordersNameValue) {
          this.activity_mapData = newarr.filter((item) => {
            return (
              String(item[this.active_Get]).search(this.ordersNameValue) > -1
            );
          });
        } else {
          this.activity_mapData = [...this.activity_InitData];
        }

        this.activityTotal = this.activity_mapData.length;
        this.activityPageChange(1);
      }
      // if (this.activity_InitData.length > 0) {
      //   if (!isNaN(parseInt(this.ordersValue))) {
      //     this.activity_mapData = newarr.filter((item) => {
      //       if (this.ordersNameValue != "") {
      //         return (
      //           (parseInt(item["adStat"]) === this.ordersValue &&
      //             item["adName"].search(this.ordersNameValue) > -1) ||
      //           (parseInt(item["adStat"]) === this.ordersValue &&
      //             String(item["adId"]).search(this.ordersNameValue) > -1)
      //         );
      //       } else {
      //         return parseInt(item["adStat"]) === this.ordersValue;
      //       }
      //     });
      //   } else if (this.ordersNameValue != "") {
      //     this.activity_mapData = newarr.filter((item) => {
      //       return (
      //         item["adName"].search(this.ordersNameValue) > -1 ||
      //         String(item["adId"]).search(this.ordersNameValue) > -1
      //       );
      //     });
      //   } else {
      //     this.activity_mapData = [...this.activity_InitData];
      //   }

      //   this.activityTotal = this.activity_mapData.length;
      //   this.activityPageChange(1);
      // }
    },
    activeClearGetData() {
      this.ordersNameValue = "";
      this.ordersValue = null;
      this.activity_mapData = [...this.activity_InitData];
      this.activityTotal = this.activity_mapData.length;
      this.activityPageChange(1);
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

.drawers_content {
  margin: 1rem;
  min-height: 40rem;
  height: 40rem;

  overflow-y: scroll;
}
.drawers_main {
  height: 70%;
}
.drawers_foot {
  height: 18%;
}
</style>

<style>
.el-table .warning-row {
  background: #a8edea;
}

.el-table .success-row {
  background: #49b50f;
}
.set_drawer {
  width: 74% !important;
  padding-top: 2rem;
  overflow-y: scroll;
}
.set_steps {
  display: flex;
  justify-content: space-around;
}
.set_steps .el-step {
  width: 12rem;
}
.set_steps .el-step .el-step__title {
  word-break: keep-all !important;
}
.set_step_cont {
  font-size: 6px;
}
.setpopper {
  width: 120px !important;
}
</style>
