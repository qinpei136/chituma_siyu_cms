<template>
  <div class="table-container">
    <byui-query-form>
      <byui-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item label="联系人电话">
            <el-input
              v-model="ordersNameValue"
              placeholder="联系人电话"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <!-- ordersNameSelect -->
            <el-select
              v-model="ordersNameSelect"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in allow_MapVerify"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="allow_SelectList"
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
      ref="tableSort"
      v-loading="listLoading"
      :data="allow_List"
      style="min-height: 50vh;"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column prop="enterpriseName" label="企业名称"></el-table-column>
      <el-table-column prop="account" label="用户名"></el-table-column>
      <el-table-column prop="enterpriseMail" label="企业邮箱"></el-table-column>
      <el-table-column
        v-if="false"
        prop="enterpriseUnifiedsocialCode"
        label="社会统一信用代码"
      ></el-table-column>
      <el-table-column prop="EnterpriseRen" label="联系人"></el-table-column>
      <el-table-column prop="EnterpriseImage" label="查看营业执照">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.EnterpriseImage"
            @click="allow_OpenImg(scope.row)"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="EnterpriseRenMobile"
        label="联系人电话"
      ></el-table-column>
      <el-table-column prop="isVerify" label="账号状态">
        <template slot-scope="scope">
          {{ isVerifyStatusType[scope.row.isVerify] }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180px" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="!parseInt(scope.row.isVerify)"
            type="primary"
            plain
            @click="allow_toLimits(scope.row, false)"
            >审核
          </el-button>
          <el-button
            v-else
            type="primary"
            plain
            @click="allow_toLimits(scope.row, true)"
            >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="注册详情"
      :visible.sync="centerDialogVisible"
      width="60%"
      style="margin: 0 auto;"
      center
    >
      <div style="height: 300px; margin: 0 auto;">
        <el-form
          v-model="getForm"
          size="mini"
          inline
          label-position="left"
          label-width="100px"
        >
          <el-row type="flex" justify="start">
            <el-col :span="8">
              <el-form-item label="用户名:">
                {{ getForm.account }}</el-form-item
              >
              <br />
              <el-form-item label="企业邮箱:">
                {{ getForm.enterpriseMail }}</el-form-item
              ><br />
              <el-form-item label="邮编:">
                {{ getForm.EnterprisePostalCode }}</el-form-item
              ><br />
              <el-form-item label="联系人电话:">
                {{ getForm.EnterpriseRenMobile }}</el-form-item
              ><br />
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业名称:">
                {{ getForm.enterpriseName }}</el-form-item
              ><br />
              <el-form-item label="所在地区:">
                <span v-text="getArea"> </span></el-form-item
              ><br />
              <el-form-item label="座机号码:">
                <span v-text="getForm.EnterpriseRenTell"> </span></el-form-item
              ><br />
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人:">
                {{ getForm.EnterpriseRen }}</el-form-item
              ><br />
              <el-form-item label="详细街道地址:">
                {{ getForm.enterpriseDetailed }}</el-form-item
              ><br />
              <el-form-item>
                <span>企业统一社会信用代码: </span><br />
                {{ getForm.enterpriseUnifiedsocialCode }}</el-form-item
              ><br />
              <el-form-item label="经营范围:">
                <span v-text="getForm.EnterpriseBusinessScope">
                </span></el-form-item
              ><br />
            </el-col>
          </el-row>
          账户权限：
          <el-select
            v-if="!isShowShen"
            v-model="getrouteAdmin"
            placeholder="请选择"
          >
            <el-option
              v-for="item in allow_RouteOption"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span v-show="isShowShen"> {{ allow_LimitsText }} </span>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <div v-show="isShowShen">
          <el-button @click="allow_clearSetLimits">取 消</el-button>
          <el-button type="primary" @click="allowSetLimits">确 定</el-button>
        </div>
        <div v-show="!isShowShen">
          <el-button @click="allow_clearSetLimits">取 消</el-button>
          <el-button type="primary" @click="allowSetLimits(1)"
            >审核通过</el-button
          >
          <el-button type="primary" @click="allowSetLimits(2)"
            >不通过审核</el-button
          >
        </div>
      </span>
    </el-dialog>

    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="allowTotal"
      @current-change="allowPageChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getList, doDelete } from "@/api/table";

import * as actives from "@/apis/model/active";
import * as sign from "@/apis/model/sign.js";
import { RouteArr } from "@/router/index";
import checkPermission from "@/utils/permission";

export default {
  name: "MediumActivity",
  components: {},

  data() {
    var getrouteOptionsName = [
      "超级管理员",
      "root管理员",
      "管理员",
      "运营",
      "广告主",
    ];
    var allowGetRoute = RouteArr.map((item, getrouteIndex) => {
      return (item = {
        name: getrouteOptionsName[getrouteIndex],
        value: item,
      });
    });
    allowGetRoute = allowGetRoute.reverse();

    return {
      allow_InitData: [],
      allow_mapData: [],
      allow_List: [],

      listLoading: true,
      layout: "total, prev, pager, next, jumper",
      total: 0,
      allowTotal: 0,
      background: true,
      selectRows: "",
      elementLoadingText: "正在加载...",
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      centerDialogVisible: false,
      uploadFileName: "",
      imgSrc: "",
      vadioSrc: "",
      active: 1,

      ordersNameValue: "",
      ordersNameSelect: "",

      isVerifyStatusType: {
        0: "待审核",
        1: "审核通过",
        2: "未通过",
      },
      allow_MapVerify: [],
      getForm: {
        account: "订单1", // 用户名
        firstPass: "2", // 密码1
        checkPass: "", // 密码2
        enterpriseName: "企查查1", // 企业名称
        enterpriseMail: "", // 企业邮箱
        enterpriseDetailed: "", // 详细街道地址
        enterpriseAddress: "", // 企业所在省区[省、市、区 ]
        enterpriseUnifiedsocialCode: "", // 企业统一社会信用代码
        enterpriseRen: "", // 联系人
        enterpriseRenMobile: "", // 联系人电话
        enterpriseRenTell: "", // 座机号码
        enterprisePostalCode: "", // 邮编
        enterpriseBusinessScope: "", // 企业经营范围
        enterpriseImage: "", // 营业执照url
      },
      allow_RouteOption: allowGetRoute,
      allow_allRouteOption: allowGetRoute,

      getrouteAdmin: "",
      isShowShen: null,
    };
  },
  computed: {
    getArea: function () {
      if (typeof this.getForm.enterpriseAddress === "object") {
        return this.getForm.enterpriseAddress.join("-");
      } else {
        return "";
      }
    },
    allow_LimitsText: function () {
      var LimitsText = "";
      if (!this.getForm.accountType) {
        return "";
      } else {
        this.allow_allRouteOption.forEach((item) => {
          if (item.value === this.getForm.accountType) {
            LimitsText = item.name;
          }
        });

        return LimitsText;
      }
    },
  },

  created() {
    this.fetchData();
  },
  mounted() {
    if (!this.checkPermission(["SuperUser"])) {
      this.allow_RouteOption = this.allow_RouteOption.slice(0, 4);
    }
    this.allow_MapVerify = [];
    for (const key in this.isVerifyStatusType) {
      if (this.isVerifyStatusType.hasOwnProperty(key)) {
        const element = this.isVerifyStatusType[key];
        this.allow_MapVerify.push({
          name: element,
          value: key,
        });
      }
    }
  },
  methods: {
    checkPermission,
    getMaterilsData() {
      sign
        .getActiveDevices()
        .then((res) => {
          if (res.data.status) {
            this.allow_InitData = res.data.data;
            this.allow_InitData = this.allow_InitData.reverse();
            this.allowTotal = this.allow_InitData.length;

            if (this.allowTotal > 0) {
              this.allow_mapData = [...this.allow_InitData];
              this.allowPageChange(1);
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
    allowPageChange(val) {
      this.allow_List = this.allow_mapData.slice((val - 1) * 20, val * 20);
    },
    allow_setLimits(stat) {
      sign
        .postSignUpAccount({
          account: this.getForm.account,
          accountType: this.getrouteAdmin,
          isVerify: stat,
        })
        .then((res) => {
          // console.log(res, "获取"); // materialId
          if (res.data.status) {
            this.fetchData();
            this.allow_clearSetLimits();
            this.$message({
              type: "success",
              message: "提交成功",
            });
          }
        });
    },
    allowSetLimits(getUploadStatus) {
      if (this.getrouteAdmin) {
        // postSignUpAccount
        this.allow_setLimits(getUploadStatus);
      } else if (getUploadStatus == 2) {
        this.getrouteAdmin = "";
        this.allow_setLimits(getUploadStatus);
        return false;
      } else {
        if (this.isShowShen) {
          this.allow_clearSetLimits();
        } else {
          this.$message({
            type: "info",
            message: "请设置账户权限",
          });
        }
      }
    },
    allow_clearSetLimits() {
      this.getrouteAdmin = "";
      this.centerDialogVisible = false;
    },
    allow_toLimits(row, postIsVerify) {
      this.isShowShen = postIsVerify;
      sign
        .postSignUpDetail({
          account: row.account,
        })
        .then((res) => {
          if (res.data.status) {
            this.getForm = res.data.data;
            this.centerDialogVisible = true;
          }
        });
    },

    allow_SelectList() {
      var newarr = JSON.parse(JSON.stringify(this.allow_InitData));
      if (this.allow_InitData.length > 0) {
        if (this.ordersNameValue != "") {
          this.allow_mapData = newarr.filter((item) => {
            if (this.ordersNameValue != "") {
              return (
                String(item["EnterpriseRenMobile"]).search(
                  this.ordersNameValue
                ) > -1
              );
            }
          });
        } else {
          this.allow_mapData = [...this.allow_InitData];
        }
        if (!isNaN(parseInt(this.ordersNameSelect))) {
          this.allow_mapData = newarr.filter((item) => {
            return item["isVerify"] == this.ordersNameSelect;
          });
          if (this.ordersNameValue != "") {
            this.allow_mapData = newarr.filter((item) => {
              if (this.ordersNameValue != "") {
                return (
                  String(item["EnterpriseRenMobile"]).search(
                    this.ordersNameValue
                  ) > -1 || item["isVerify"] == this.ordersNameSelect
                );
              }
            });
          }
        }

        this.allowTotal = this.allow_mapData.length;
        this.allowPageChange(1);
        // console.log(this.allow_InitData);
      }
    },
    clearCenterList() {
      this.ordersNameValue = "";
      this.ordersNameSelect = "";
      this.allow_mapData = [...this.allow_InitData];
      this.allowTotal = this.allow_mapData.length;
      this.allowPageChange(1);
    },

    allow_OpenImg(val) {
      if (val.EnterpriseImage) {
        this.$alert(
          '<div style="display:inline-block; height:56vh;"><img src="' +
            val.EnterpriseImage +
            '" alt="" srcset="" style=" height: 100%;max-width: 100%;">' +
            "</div>",
          "营业执照",
          {
            dangerouslyUseHTMLString: true,
            customClass: "openImgsAllow",
          }
        );
      } else {
        this.$message({
          type: "info",
          message: "没有图片",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar-uploader {
  text-align: center;
}
</style>
<style>
.openImgsAllow {
  width: 60vw;
  text-align: center;
}
</style>
