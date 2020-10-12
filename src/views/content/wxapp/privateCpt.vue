<template>
  <div class="table-container">
    <byui-query-form>
      <byui-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <!--   <el-form-item label="联系人电话">
            <el-input
              v-model="ordersNameValue"
              placeholder="联系人电话"
              clearable
            ></el-input>
          </el-form-item>-->
          <el-form-item label="状态">
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
        <div style="width: 500px; height: 3px;"></div>
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
          <!--  <el-form-item>
            <el-button
              icon="el-icon-refresh"
              type="primary"
              @click="createdCenterList"
              >新建套餐
            </el-button>
          </el-form-item> -->
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
      <el-table-column prop="account" label="客户微信昵称"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="160px">
      </el-table-column>
      <el-table-column prop="meal" label="套餐名称"></el-table-column>

      <el-table-column prop="payPrice" label="价格"></el-table-column>
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
            @click="allow_toLimits(scope.row, false)"
            >查看
          </el-button>
          <el-button
            v-show="!parseInt(scope.row.orderStat) || scope.row.orderStat == 10"
            type="success"
            plain
            size="mini"
            @click="allow_delMeals(scope.row, true)"
            >通过
          </el-button>
          <el-button
            v-show="!parseInt(scope.row.orderStat) || scope.row.orderStat == 10"
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
          <!--  
           <el-button
            type="primary"
            plain
            size="mini"
            @click="allow_setMeals(scope.row, false)"
          >
            {{ isUse[parseInt(scope.row.stat) ? 1 : 0] }}
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="创建套餐"
      direction="rtl"
      :visible.sync="isShowDrawer"
      :before-close="active_Close"
      custom-class="ShowDrawer"
    >
      <div class="ShowDrawer__content">
        <el-form :model="mealForm" label-width="126px" label-position="left">
          <el-form-item label="套餐名称">
            <el-row type="flex">
              <el-col :span="8">
                <el-input v-model="mealForm.name"></el-input>
              </el-col>
              <el-col :span="8" :push="2">
                <div>
                  方案: 社区家庭生日会
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="蛋糕样式">
            <div v-if="mealForm.cake.length > 0">
              <img
                v-for="src in mealForm.cake"
                :key="src"
                :src="src"
                class="mealFormImg"
                alt=""
              />
            </div>
            <upload-img v-else :edit-data="editData" @resaveImg="allow_setImg">
            </upload-img>
          </el-form-item>
          <el-form-item label="蛋糕尺寸">
            <el-input
              v-model="mealForm.cakeSize"
              class="ShowDrawerInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="玩偶样式">
            <div v-if="mealForm.toy.length > 0">
              <img
                v-for="src in mealForm.toy"
                :key="src"
                :src="src"
                class="mealFormImg"
                alt=""
              />
            </div>
            <upload-img
              v-else
              :edit-data="editData"
              @resaveImg="allow_resaveImg"
            >
            </upload-img>
          </el-form-item>

          <el-form-item label="是否需要创意场景">
            <el-radio v-model="mealForm.isScene" :label="true">是</el-radio>
            <el-radio v-model="mealForm.isScene" :label="false">否</el-radio>
          </el-form-item>

          <el-form-item label="可选设备数量">
            <el-input
              v-model.number="mealForm.device"
              class="ShowDrawerInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="可投放天数">
            <el-input
              v-model.number="mealForm.day"
              class="ShowDrawerInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input
              v-model="mealForm.price"
              class="ShowDrawerInput"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="ShowDrawer__footer">
        <el-row>
          <el-col :push="16">
            <el-button @click="isShowDrawer = false">取 消</el-button>
            <el-button v-if="isShowkeep" type="primary" @click="activeChangeUrl"
              >保 存</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-drawer>

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
import * as actives from "@/apis/model/active";
import * as weapp from "@/apis/model/weapp.js";

import checkPermission from "@/utils/permission";

export default {
  name: "MediumActivity",
  components: {},

  data() {
    return {
      allow_InitData: [],
      allow_mapData: [],
      allow_List: [],
      listLoading: true,
      layout: "total, prev, pager, next, jumper",
      total: 0,
      allowTotal: 0,
      background: true,
      elementLoadingText: "正在加载...",
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      ordersNameValue: "",
      ordersNameSelect: "",

      isVerifyStatusType: {
        0: "待审核",
        1: "审核通过",
        2: "未通过",
      },
      allow_MapVerify: [],
      getrouteAdmin: "",
      isShowShen: null,
      isUse: ["禁用", "启用"],
      mealForm: {
        cakeSize: "12x12",
        isScene: false,
        name: "88套餐",
        price: null,
        cake: [],
        toy: [],
        day: 1,
        device: 20,
        material: [],
        schemeName: "birthday",
      },
      isShowDrawer: false,
      editData: {},
      imgsetData: [],
      imgresaveData: [],
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
  computed: {},

  created() {
    this.fetchData();
    this.allow_MapVerify = this.statusList.filter((item) => {
      return item.value != 4 && item.value != 0;
    });
  },
  mounted() {
    var getCpt = sessionStorage.getItem("cpt");
    this.queryForm = getCpt ? getCpt.queryForm : this.queryForm;
  },
  methods: {
    checkPermission,
    getMaterilsData() {
      weapp
        .getOrders({
          orderStat: -1,
        })
        .then((res) => {
          if (res.data.status) {
            this.allow_InitData = res.data.data;

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
      weapp
        .postSignUpAccount({
          account: this.mealForm.account,
          accountType: this.getrouteAdmin,
          isVerify: stat,
        })
        .then((res) => {
          if (res.data.status) {
            this.fetchData();
            this.$message({
              type: "success",
              message: "提交成功",
            });
          }
        });
    },

    allow_setImg(data) {
      // console.log(data);
      this.imgsetData = data;
    },
    allow_resaveImg(data) {
      // console.log(data);
      this.imgresaveData = data;
    },
    createdCenterList() {
      this.isShowDrawer = true;
      this.isForKeep = 0;
      this.mealForm.cake = [];
      this.mealForm.toy = [];
    },

    allow_toLimits(row, postIsVerify) {
      // console.log(row, postIsVerify);
      sessionStorage.setItem("fromUrl", "/weapp/private-traffic-cpt");
      this.mealForm = row;
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
        setTimeout(() => {
          self.fetchData();
        }, 3000);
        self.$message({
          type: "success",
          message: "已发起退款",
        });
      });
    },
    allow_setMeals(row, postIsVerify) {
      console.log(row, postIsVerify); // setMeals
      var self = this;

      if (row.stat == 1) {
        //closeMeals
        weapp.closeMeals(row).then((res) => {
          if (res.data.status) {
            self.getMaterilsData();
            self.$message({
              type: "success",
              message: "已经启用",
            });
            self.isShowDrawer = false;
          } else {
            self.$message({
              type: "info",
              message: "未启用",
            });
          }
        });
      } else {
        weapp.setMeals(row).then((res) => {
          if (res.data.status) {
            self.getMaterilsData();
            self.$message({
              type: "success",
              message: "已经禁用",
            });
            self.isShowDrawer = false;
          } else {
            self.$message({
              type: "info",
              message: "未启用",
            });
          }
        });
      }
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
        // if (parseInt(row.canSubmit)) {
        this.allow_send(toSend);
        // } else {
        //   self.$message({
        //     type: "warning",
        //     message: "未上传素材 请上传后再通过",
        //   });
        // }
      }

      //
    },
    allow_send(data_) {
      var self = this;
      weapp.allowTo(data_).then((res) => {
        if (res.data.status) {
          self.getMaterilsData();
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
      });
    },
    activeChangeUrl() {
      // console.log(this.mealForm);
      var self = this;
      if (!this.mealForm.price || !this.mealForm.day || !this.mealForm.device) {
        this.$message("请输入全部信息");
        return false;
      }
      if (this.isForKeep == 1) {
        weapp.changeMeals(this.mealForm).then((res) => {
          if (res.data.status) {
            self.getMaterilsData();
            self.$message({
              type: "success",
              message: "已经启用",
            });
            self.isShowDrawer = false;
            self.getMaterilsData();
          } else {
            self.$message({
              type: "info",
              message: "未启用",
            });
          }
        });
      }
      if (this.isForKeep == 0) {
        if (!this.imgsetData?.length || !this.imgresaveData?.length) {
          this.$message("请输入全部信息");
          return false;
        }
        var files_ = [];
        this.imgsetData.forEach((setimg_, index) => {
          files_.push(this.uploadFiles(setimg_, "cake", index));
        });

        this.imgresaveData.forEach((resave_, index) => {
          files_.push(this.uploadFiles(resave_, "toy", index));
        });
        Promise.all(files_)
          .then((get_) => {
            // console.log(get_);
            self.mealForm.cake = [];
            self.mealForm.toy = [];
            self.mealForm.material = [];
            get_.forEach((type) => {
              var getdata = type.data.data;
              if (getdata.type) {
                self.mealForm[getdata.type].push(getdata.url);
                self.mealForm.material.push(getdata.materialId);
              }
            });
            weapp.keepMeals(self.mealForm).then((res) => {
              if (res.data.status) {
                self.$message({
                  type: "success",
                  message: "保存成功",
                });
                self.isShowDrawer = false;
              } else {
                self.$message({
                  type: "info",
                  message: "保存失败",
                });
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    uploadFiles(filr, type, index) {
      return new Promise(function (resolve, reject) {
        var resaveData = new FormData();
        resaveData.append("name", type + index);
        resaveData.append("type", type);
        resaveData.append("file", type + index);
        resaveData.append(type + index, filr.file);
        // console.log(filr.file);
        weapp
          .upload(resaveData)
          .then((res) => {
            // console.log(res);
            if (res.data.status) {
              resolve(res);
            } else {
              reject();
              this.$message("上传失败..");
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    html5Reader(file, step) {
      // const reader = new FileReader();
      // var that_ = this;
      // reader.onload = (e) => {};
      // reader.readAsDataURL(file);
    },
    active_Close(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    allow_clearSetLimits() {
      this.getrouteAdmin = "";
    },

    allow_SelectList() {
      var newarr = JSON.parse(JSON.stringify(this.allow_InitData));
      if (this.allow_InitData.length > 0) {
        // if (this.ordersNameValue != "") {
        //   this.allow_mapData = newarr.filter((item) => {
        //     if (this.ordersNameValue != "") {
        //       return (
        //         String(item["EnterpriseRenMobile"]).search(
        //           this.ordersNameValue
        //         ) > -1
        //       );
        //     }
        //   });
        // } else {
        //   this.allow_mapData = [...this.allow_InitData];
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
          // if (this.ordersNameValue != "") {
          //   this.allow_mapData = newarr.filter((item) => {
          //     if (this.ordersNameValue != "") {
          //       return (
          //         String(item["EnterpriseRenMobile"]).search(
          //           this.ordersNameValue
          //         ) > -1 || item["orderStat"] == this.ordersNameSelect
          //       );
          //     }
          //   });
          // }
        } else {
          this.clearCenterList();
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
.ShowDrawer {
  width: 60% !important;
  padding-left: 20px;
}
.ShowDrawerInput {
  width: 33%;
}
.mealFormImg {
  width: 160px;
  height: 80px;
  border: 1px solid #ececec;
}
</style>
