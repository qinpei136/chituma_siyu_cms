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
            <el-select
              v-model="ordersNameSelect"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in medlll_RouteOptions"
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
          :model="medlll_FormData"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="medlll_getDataList"
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
      v-loading="medlll_listLoading"
      :data="medlll_List"
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
            @click="medlll_openImg(scope.row)"
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
            @click="medlll_setLimits(scope.row, false)"
            >审核
          </el-button>
          <el-button
            v-else
            type="primary"
            plain
            @click="medlll_setLimits(scope.row, true)"
            >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="注册详情"
      :visible.sync="medlll_showDialog"
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
                <span v-text="medlll_getArea"> </span></el-form-item
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
            v-if="!medlll_isShowLimits"
            v-model="medlll_getLimits"
            placeholder="请选择"
          >
            <el-option
              v-for="item in medlll_superRouteOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span v-show="medlll_isShowLimits"> {{ medlll_LimitsText }}</span>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <div v-show="medlll_isShowLimits">
          <el-button @click="clearCenterDialog">取 消</el-button>
          <el-button type="primary" @click="medlll_ImgUpload">确 定</el-button>
        </div>
        <div v-show="!medlll_isShowLimits">
          <el-button @click="clearCenterDialog">取 消</el-button>
          <el-button type="primary" @click="medlll_ImgUpload(1)"
            >审核通过</el-button
          >
          <el-button type="primary" @click="medlll_ImgUpload(2)"
            >不通过审核</el-button
          >
        </div>
      </span>
    </el-dialog>

    <el-pagination
      :background="background"
      :current-page="medlll_FormData.pageNo"
      :layout="layout"
      :page-size="medlll_FormData.pageSize"
      :total="medlll_total"
      @current-change="medlll_CurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import * as mode from "@/apis/model/model.js";
import { RouteArr } from "@/router/index";
import checkPermission from "@/utils/permission";

export default {
  name: "MediumActivity",
  components: {},

  data() {
    var medlll_superRouteName = [
      "超级管理员",
      "root管理员",
      "管理员",
      "运营",
      "广告主",
    ];
    var medlll_NewRoute = RouteArr.map((item, routeIndex) => {
      return (item = {
        name: medlll_superRouteName[routeIndex],
        value: item,
      });
    });
    medlll_NewRoute = medlll_NewRoute.reverse();

    return {
      medlll_initData: [],
      medlll_List: [],
      medlll_MapData: [],
      medlll_SelectData: [],
      medlll_listLoading: true,
      layout: "total, prev, pager, next, jumper",
      background: true,
      elementLoadingText: "正在加载...",
      medlll_showDialog: false,
      medlll_FormData: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      isVerifyStatusType: {
        0: "待审核",
        1: "审核通过",
        2: "未通过",
      },
      getForm: {
        account: "", // 用户名
        enterpriseName: "", // 企业名称
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
      medlll_superRouteOptions: medlll_NewRoute,
      medlll_RouteOptions: [],
      medlll_total: 0,
      medlll_getLimits: "",
      medlll_isShowLimits: null,
      ordersNameValue: "",
      ordersNameSelect: "",
    };
  },
  computed: {
    medlll_getArea: function () {
      if (typeof this.getForm.enterpriseAddress === "object") {
        return this.getForm.enterpriseAddress.join("-");
      } else {
        return "";
      }
    },
    medlll_LimitsText: function () {
      var LimitsText = "";
      if (!this.getForm.accountType) {
        return "";
      } else {
        this.medlll_superRouteOptions.forEach((item) => {
          if (item.value === this.getForm.accountType) {
            LimitsText = item.name;
          }
        });
        return LimitsText;
      }
    },
  },

  created() {
    this.medlll_fetchData();
  },
  mounted() {
    if (!this.checkPermission(["SuperUser"])) {
      this.medlll_superRouteOptions = this.medlll_superRouteOptions.slice(0, 4);
    }
    this.medlll_RouteOptions = [];
    for (const key in this.isVerifyStatusType) {
      if (this.isVerifyStatusType.hasOwnProperty(key)) {
        const element = this.isVerifyStatusType[key];
        this.medlll_RouteOptions.push({
          name: element,
          value: key,
        });
      }
    }
    // console.log(this.medlll_RouteOptions);
  },
  methods: {
    checkPermission,
    medlll_fetchData() {
      this.medlll_listLoading = true;
      mode
        .getActiveDevices()
        .then((res) => {
          if (res.data.status) {
            this.medlll_initData = res.data.data;
            this.medlll_initData = this.medlll_initData.reverse();
            this.medlll_MapData = [...this.medlll_initData];
            if (this.medlll_MapData.length > 20) {
              this.medlll_CurrentChange(1);
            }

            this.medlll_total = this.medlll_MapData.length;
          }
          this.medlll_listLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.medlll_listLoading = false;
        });
    },

    medlll_CurrentChange(val) {
      this.medlll_List = this.medlll_MapData.slice((val - 1) * 20, val * 20);
    },
    medlll_getDataList() {
      // console.log(2222); // adStat
      var newarr = JSON.parse(JSON.stringify(this.medlll_initData));
      if (this.medlll_MapData.length > 0) {
        if (this.ordersNameValue != "") {
          this.medlll_SelectData = newarr.filter((item) => {
            if (this.ordersNameValue != "") {
              return (
                String(item["EnterpriseRenMobile"]).search(
                  this.ordersNameValue
                ) > -1
              );
            }
          });
        } else {
          this.medlll_SelectData = this.medlll_initData;
        }
        if (!isNaN(parseInt(this.ordersNameSelect))) {
          this.medlll_SelectData = newarr.filter((item) => {
            return item["isVerify"] == this.ordersNameSelect;
          });
          if (this.ordersNameValue != "") {
            this.medlll_SelectData = newarr.filter((item) => {
              if (this.ordersNameValue != "") {
                return (
                  String(item["EnterpriseRenMobile"]).search(
                    this.ordersNameValue
                  ) > -1 || item["isVerify"] == this.ordersNameSelect
                );
              }
            });
          }
        } else if (this.ordersNameValue == "") {
          this.medlll_SelectData = this.medlll_initData;
        }

        this.medlll_total = this.medlll_SelectData.length;
        this.medlll_MapData = this.medlll_SelectData;
        this.medlll_CurrentChange(1);
      }
    },
    clearCenterList() {
      this.ordersNameValue = "";
      this.ordersNameSelect = "";
      this.medlll_MapData = this.medlll_initData;
      this.medlll_total = this.medlll_MapData.length;
      if (this.medlll_MapData.length > 20) {
        this.medlll_CurrentChange(1);
      }
    },
    medlll_openImg(val) {
      if (val.EnterpriseImage) {
        this.$alert(
          '<div style="display:inline-block; height:56vh;"><img src="' +
            val.EnterpriseImage +
            '" alt="" srcset="" style=" height: 100%;max-width: 100%;">' +
            "</div>",
          "营业执照",
          {
            dangerouslyUseHTMLString: true,
            customClass: "openImgs_medlll_stl",
          }
        );
      } else {
        this.$message({
          type: "info",
          message: "没有图片",
        });
      }
    },
    medlll_ImgUpload(getUploadStatus) {
      if (this.medlll_getLimits) {
        // postSignUpAccount
        this.medlll_SignLimits(getUploadStatus);
      } else if (getUploadStatus == 2) {
        this.medlll_getLimits = "";
        this.medlll_SignLimits(getUploadStatus);
        return false;
      } else {
        if (this.medlll_isShowLimits) {
          this.clearCenterDialog();
        } else {
          this.$message({
            type: "info",
            message: "请设置账户权限",
          });
        }
      }
    },
    medlll_SignLimits(stat) {
      //请设置账户权限
      mode
        .postSignUpAccount({
          account: this.getForm.account,
          accountType: this.medlll_getLimits,
          isVerify: stat,
        })
        .then((res) => {
          if (res.data.status) {
            this.clearCenterDialog();
            this.$message({
              type: "success",
              message: "提交成功",
            });
          }
        });
    },
    clearCenterDialog() {
      this.medlll_getLimits = "";
      this.medlll_showDialog = false;
    },
    medlll_setLimits(row, postIsVerify) {
      this.medlll_isShowLimits = postIsVerify;
      mode
        .postSignUpDetail({
          account: row.account,
        })
        .then((res) => {
          if (res.data.status) {
            this.getForm = res.data.data;
            this.medlll_showDialog = true;
          }
        });
    },

    handleSizeChange(val) {
      this.medlll_FormData.pageSize = val;
      this.medlll_fetchData();
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
.openImgs_medlll_stl {
  width: 60vw;
  text-align: center;
}
</style>
