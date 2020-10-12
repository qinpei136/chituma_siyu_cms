<template>
  <div class="table-container">
    <byui-query-form>
      <byui-query-form-left-panel :span="12">
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-dropdown @command="handleCommands">
              <span class="el-dropdown-link">
                {{ activeUsrName[active_Get]
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in active_Init"
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
              :placeholder="activeUsrName[active_Get]"
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
            {{ scope.row.adName }}<span v-text="'|' + scope.row.adId"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="adTime" label="起止时间" width="210">
        <template slot-scope="scope">
          {{ scope.row.adStart }}/ {{ scope.row.adStop }}
        </template>
      </el-table-column>
      <el-table-column prop="devicesAmount" label="已选点位"></el-table-column>
      <el-table-column prop="howLong" label="类型/时长"></el-table-column>

      <el-table-column prop="adTime" label="创建时间"></el-table-column>
      <el-table-column v-if="false" prop="" label="离线数"></el-table-column>
      <el-table-column v-if="false" label="订单状态" prop="adStat">
        <template slot-scope="scope">
          {{ orderStatusType[scope.row.adStat] }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="投放状态">
        <template slot-scope="scope">
          <el-tooltip
            :content="
              scope.row.adStat == 5
                ? scope.row.remark
                : activeMapStatus[scope.row.adStat]['label']
            "
            class="item"
            effect="dark"
            placement="top-start"
          >
            <!-- <el-tag
              :type="scope.row.adStat | statusFilter[scope.row.adStat]"
            >
              {{ materialsActiveStatus[scope.row.adStat] }}</el-tag dark、light 和 plain
            > -->
            <el-tag
              :type="activeMapStatus[scope.row.adStat]['type']"
              :effect="activeMapStatus[scope.row.adStat]['effect']"
            >
              {{ activeMapStatus[scope.row.adStat]["label"] }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown size="medium" trigger="click" @command="handleCommand">
            <el-button size="mini" type="warning" style="padding: 7px 9px;">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="beforeHandleCommand(scope.$index, scope.row, 'a')"
                >查看</el-dropdown-item
              >
              <el-dropdown-item
                :disabled="activeMapStatus[scope.row['adStat']]['isAllow']"
                :command="beforeHandleCommand(scope.$index, scope.row, 'b')"
              >
                {{
                  scope.row["adStat"] == 4 ? "启动" : "暂停"
                }}</el-dropdown-item
              >
              <el-dropdown-item
                :disabled="activeMapStatus[scope.row['adStat']]['isAllow']"
                :command="beforeHandleCommand(scope.$index, scope.row, 'c')"
                >终止</el-dropdown-item
              >
              <el-dropdown-item
                :command="beforeHandleCommand(scope.$index, scope.row, 'd')"
                >导出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-dropdown
            size="small"
            split-button
            type="primary"
            class="el-dropdown-link_"
            @command="handleCommand(scope.row.adStat)"
          >
            操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">黄金糕</el-dropdown-item>
              <el-dropdown-item command="b">狮子头</el-dropdown-item>
              <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
              <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
              <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <!-- <el-button
            type="primary"
            size="mini"
            plain
            @click="activity_ListEdit(scope.row)"
            >查看
          </el-button>
          <el-button
            v-show="scope.row['adStat'] != 3"
            :type="ActiveSetStatus[scope.row['adStat']] ? 'info' : 'primary'"
            size="mini"
            plain
            :disabled="ActiveSetStatus[scope.row['adStat']]"
            @click="activity_ListSetStart(scope.row)"
            >{{ scope.row["adStat"] == 4 ? "启动" : "暂停" }}
          </el-button>
          <el-button
            v-show="scope.row['adStat'] != 3"
            :type="ActiveSetStatus[scope.row['adStat']] ? 'info' : 'primary'"
            size="mini"
            plain
            :disabled="ActiveSetStatus[scope.row['adStat']]"
            @click="activity_ListSetStop(scope.row)"
            >终止
          </el-button>

          <el-button
            type="primary"
            size="mini"
            plain
            @click="activeListDown(scope.row)"
            >导出
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="增加广告活动"
      :visible.sync="activity_ShowDialog"
      width="60%"
      style="margin: 0 auto;"
      center
    >
      <div style="height: 300px; text-align: center; margin: 0 auto;">
        <el-steps
          direction="vertical"
          :active="active"
          finish-status="success"
          simple
        >
          <el-step title="选择订单"></el-step>
          <el-step title="选择素材"></el-step>
        </el-steps>
        <el-form
          v-model="selectForm"
          style="max-width: 60%; margin: 0 auto; padding-top: 7vh;"
        >
          <el-form-item v-if="active === 1" label="可选订单">
            <el-select v-if="activity_ShowDialog" v-model="selectForm.times">
              <el-option
                v-for="item in activity_SelectOrder"
                :key="item.orderId"
                :value="item.orderId"
                :label="item.orderName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="active === 2" label="可选素材">
            <el-select v-model="selectForm.material">
              <el-option
                v-for="item in activity_SelectWelfare"
                :key="item.materialId"
                :value="item.materialId"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-row>
        <el-col :offset="15">
          <el-button style="margin-top: 12px;" @click="back">上一步</el-button>
          <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
          <el-button
            v-if="selectForm.material"
            style="margin-top: 12px;"
            @click="setMyMaterialsID"
            >提交</el-button
          >
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="clearCenterDialog">取 消</el-button>
        <el-button type="primary" @click="activity_ImgUpload">确 定</el-button>
      </span>
    </el-dialog>

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
      activeMapStatus: activitys.activeStatus,
      active_Init: activitys.active_Init,
      activeUsrName: activitys.active_Name,
      active_Get: "adName",

      activity_ShowDialog: false,
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
      // active_ordersName: [
      //   {
      //     value: 0,  label: "待审核",
      //   }, {
      //     value: 1, label: "未投放",
      //   }, {
      //     value: 2,label: "投放中",
      //   }, {
      //     value: 4, label: "已暂停",
      //   }, {
      //     value: 6, label: "已终止",
      //   },  {
      //     value: 3, label: "已结束",
      //   }, {
      //     value: 5, label: "审核失败",
      //   },
      // ],
      multipleSelection: [],
      adId_mainArr: [],
      visible: false,
    };
  },
  created() {
    this.pageName = this.$route.name;
    this.activity_fetchData();
    // console.log(this.pageName);
    // var getAs = async function fn1(params) {
    //   var time = 0;
    //   function gettime(times) {
    //     setTimeout(() => {
    //       times++;
    //       console.log(times);
    //     }, 200);
    //   }
    //   function gettime1(times1) {
    //     times1++;
    //     setTimeout(() => {
    //       console.log(times1);
    //     }, 2000);
    //   }
    //   time++;
    //   await gettime1(time);
    //   time++;
    //   await gettime(time);
    // };
    // getAs().then((res) => {
    //   console.log(res);
    // });
    // console.log(getAs);
  },
  mounted() {
    // var scripts = document.createElement("script");
    // scripts.src =
    //   "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.3/xlsx.full.min.js";
    // document.body.append(scripts);
    // console.log(this.$route.params);
  },
  methods: {
    beforeHandleCommand(index, row, command) {
      return {
        index: index,
        row: row,
        command: command,
      };
    },
    handleCommand(command) {
      switch (command.command) {
        case "a": //编辑
          this.activity_ListEdit(command.row);
          break;
        case "b": // 启动/暂停
          this.activity_ListSetStart(command.row);
          break;
        case "c": //终止
          this.activity_ListSetStop(command.row);
          break;
        case "d": //导出
          this.activeListDown(command.row);
          break;
      }
    },
    handleCommands(command) {
      this.active_Get = command;
    },
    downs,
    activity_fetch() {
      actives
        .getActiveDevice()
        .then((res) => {
          if (res.data.status) {
            this.activity_InitData = res.data.data;
            this.activity_InitData = this.activity_InitData.reverse();
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
        (val - 1) * 20,
        val * 20
      );
    },
    activitySizeChange(val) {
      this.queryForm.pageSize = val;
      this.activityPageChange(val);
    },
    indexMethod(index) {
      return (this.queryForm.pageNo - 1) * 20 + index + 1;
    },
    activity_fetchData() {
      this.listLoading = true;
      this.activity_fetch();
    },

    activityAdd() {
      this.active = 1;
      actives.getMyValidOrders().then((res) => {
        // console.log(res, "获取"); // materialId
        if (res.data.status) {
          this.activity_SelectOrder = res.data.data;
          this.activity_ShowDialog = true;
          // console.log("add------");
          // console.log(this.activity_SelectOrder);
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
    back() {
      this.activity_SelectList();
      this.active = 1;
    },
    next() {
      if (this.active === 1) {
        if (this.selectForm.times) {
          this.activity_SelectList();
        }
        //  if (this.active++ > 1) this.active = 1; selectForm.material
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
      this.active++;
    },
    activity_ImgUpload() {
      this.activity_ShowDialog = false;
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
                parseInt(item["adStat"]) === this.ordersValue &&
                String(item[this.active_Get]).search(this.ordersNameValue) > -1
              );
            } else {
              return parseInt(item["adStat"]) === this.ordersValue;
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
</style>

<style>
.el-table .warning-row {
  background: #a8edea;
}

.el-table .success-row {
  background: #49b50f;
}
</style>
