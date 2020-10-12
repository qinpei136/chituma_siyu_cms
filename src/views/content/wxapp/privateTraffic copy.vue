<template>
  <div class="table-container">
    <byui-query-form>
      <byui-query-form-left-panel>
        <!-- <el-form ref="form" :inline="true" @submit.native.prevent>
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
                v-for="item in allow_MapVerify"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form> -->
        <div style="width: 500px; height: 3px;"></div>
      </byui-query-form-left-panel>
      <byui-query-form-right-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <!-- <el-form-item>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="allow_SelectList"
              >查询
            </el-button>
          </el-form-item> -->
          <el-form-item>
            <el-button
              icon="el-icon-refresh"
              type="primary"
              @click="clearCenterList"
              >清空
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-refresh"
              type="primary"
              @click="createdCenterList"
              >新建套餐
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
      <el-table-column prop="name" label="套餐名称"></el-table-column>
      <el-table-column prop="index" label="排序"></el-table-column>

      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="stat" label="状态">
        <template slot-scope="scope">
          {{ isUse[scope.row.stat] }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <!-- <el-table-column prop="account" label="创建人"> </el-table-column> -->
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
            type="primary"
            plain
            size="mini"
            @click="allow_toLimits(scope.row, true)"
            >修改
          </el-button>
          <el-button
            type="primary"
            plain
            size="mini"
            @click="allow_setMeals(scope.row, false)"
          >
            {{ isUse[parseInt(scope.row.stat) ? 0 : 1] }}
          </el-button>
          <el-button
            v-show="!(scope.row.stat * 1)"
            type="primary"
            plain
            size="mini"
            @click="allow_delMeals(scope.row, false)"
            >删除
          </el-button>
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
                <el-input
                  v-model="mealForm.name"
                  :disabled="!isShowkeep"
                ></el-input>
              </el-col>
              <el-col :span="2">
                单价
              </el-col>
              <el-col :span="8">
                <div class="priceLimitSty">
                  <el-input
                    v-model="mealForm.price"
                    :disabled="!isShowkeep"
                  ></el-input>
                </div>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="套餐内容配置">
            <el-radio
              v-model="mealForm.style"
              label="orders"
              :disabled="!isShowkeep"
              >蛋糕套餐</el-radio
            >
            <el-radio
              v-model="mealForm.style"
              label="nine"
              :disabled="!isShowkeep"
              >DIY套餐</el-radio
            >
          </el-form-item>
          <el-form-item v-show="mealForm.style === 'orders'">
            <el-form-item label="蛋糕样式">
              <div style="display: inline-block;">
                <img
                  v-for="src in mealForm.cake"
                  :key="src"
                  :src="src"
                  class="mealFormImg"
                  alt=""
                />
              </div>
              <upload-img
                v-if="isShowkeep"
                :edit-data="editData"
                @resaveImg="allow_setImg"
              >
              </upload-img>
            </el-form-item>
            <el-form-item label="蛋糕尺寸">
              <div class="priceLimitSty">
                <el-input
                  v-model="mealForm.cakeSize"
                  :disabled="!isShowkeep"
                ></el-input>
              </div>
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
          </el-form-item>
          <el-form-item>
            <el-form-item label="是否需要创意场景">
              <el-radio
                v-model="mealForm.isScene"
                :disabled="!isShowkeep"
                :label="true"
                >是</el-radio
              >
              <el-radio
                v-model="mealForm.isScene"
                :disabled="!isShowkeep"
                :label="false"
                >否</el-radio
              >
            </el-form-item>
            <el-form-item v-show="mealForm.style === 'orders'" label="套餐规格">
              <el-row type="flex">
                <el-col :span="3">
                  <el-input
                    v-model="mealForm.device"
                    :disabled="!isShowkeep"
                  ></el-input>
                </el-col>
                <el-col :span="1">屏 </el-col>
                <el-col :span="3">
                  <el-input
                    v-model="mealForm.day"
                    :disabled="!isShowkeep"
                  ></el-input>
                </el-col>
                <el-col :span="1">天 </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-show="mealForm.style !== 'orders'" label="套餐规格">
              <el-form-item>
                <el-radio v-model="mealForm.priceLimit" :label="true">
                  1屏1天
                </el-radio>
              </el-form-item>
              <el-form-item>
                <el-radio v-model="mealForm.priceLimit" :label="false">
                  <div class="priceLimitSty">
                    <el-input
                      v-model="mealForm.device"
                      :disabled="!isShowkeep"
                    ></el-input>
                  </div>
                  屏
                  <div class="priceLimitSty">
                    <el-input
                      v-model="mealForm.day"
                      :disabled="!isShowkeep"
                    ></el-input>
                    天
                  </div>
                </el-radio>
              </el-form-item>
            </el-form-item>

            <el-form-item label="是否需要配送地址">
              <el-radio
                v-model="mealForm.isAddress"
                :disabled="!isShowkeep"
                :label="true"
                >是</el-radio
              >
              <el-radio
                v-model="mealForm.isAddress"
                :disabled="!isShowkeep"
                :label="false"
                >否</el-radio
              >
            </el-form-item>
          </el-form-item>

          <el-form-item label="排序">
            <div class="priceLimitSty">
              <el-input
                v-model="mealForm.index"
                :disabled="!isShowkeep"
              ></el-input>
            </div>
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
import { getList, doDelete } from "@/api/table";

import * as actives from "@/apis/model/active";
import * as weapp from "@/apis/model/weapp.js";
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

      allow_RouteOption: allowGetRoute,
      allow_allRouteOption: allowGetRoute,

      getrouteAdmin: "",
      isShowShen: null,
      isUse: ["禁用", "启用"],
      mealForm: {
        cakeSize: "12x12",
        name: "88套餐",
        price: null,
        cake: [],
        toy: [],
        day: 1,
        device: 20,
        material: [],
        style: "orders",
        index: null,
        isAddress: true,
        priceLimit: false,

        isScene: false,
      },
      isShowDrawer: false,
      editData: {},
      imgsetData: [],
      imgresaveData: [],
      isShowkeep: true,
      isForKeep: 0,
    };
  },
  computed: {},
  watch: {
    "mealForm.style": {
      handler(newStyle, oldStyle) {
        if (newStyle === "orders") {
          this.mealForm.priceLimit = false;
        }
      },
      deep: true,
      immediate: true,
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
      weapp
        .getMeals()
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
      weapp
        .postSignUpAccount({
          account: this.mealForm.account,
          accountType: this.getrouteAdmin,
          isVerify: stat,
        })
        .then((res) => {
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

    allow_setImg(data) {
      // console.log(data);
      this.imgsetData = data;
    },
    allow_resaveImg(data) {
      // console.log(data);
      this.imgresaveData = data;
    },
    allowSetLimits(getUploadStatus) {
      if (this.getrouteAdmin) {
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
    createdCenterList() {
      this.isShowDrawer = true;
      this.isShowkeep = true;
      this.isForKeep = 0;
      this.mealForm.cake = [];
      this.mealForm.toy = [];
      this.mealForm.name = "";
      this.mealForm.cakeSize = "";
      // this.mealForm.device = "";
      this.mealForm.price = null;
    },

    allow_toLimits(row, postIsVerify) {
      console.log(row, postIsVerify);
      this.isShowDrawer = true;
      this.isShowkeep = postIsVerify;
      this.mealForm = row;
      this.mealForm.style = "orders";
      this.isForKeep = 1;
    },
    allow_tosee(row, postIsVerify) {
      console.log(row, postIsVerify);
      this.isShowDrawer = true;
      this.mealForm = row;
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
              message: "已经禁用",
            });
            self.isShowDrawer = false;
          } else {
            self.$message({
              type: "info",
              message: "未成功",
            });
          }
        });
      } else {
        weapp.setMeals(row).then((res) => {
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
              message: "未成功",
            });
          }
        });
      }
    },
    allow_delMeals(row) {
      var self = this;
      weapp.delMeals(row).then((res) => {
        if (res.data.status) {
          self.getMaterilsData();
          self.$message({
            type: "success",
            message: "已经删除",
          });
          self.isShowDrawer = false;
        } else {
          self.$message({
            type: "info",
            message: "删除失败",
          });
        }
      });
    },
    activeChangeUrl() {
      var self = this;
      if (!this.mealForm.price || !this.mealForm.day || !this.mealForm.device) {
        this.$message("请输入全部信息");
        return false;
      }
      var files_ = [];
      var self = this;
      this.imgsetData.forEach((setimg_, index) => {
        files_.push(this.uploadFiles(setimg_, "cake", index));
      });

      this.imgresaveData.forEach((resave_, index) => {
        files_.push(this.uploadFiles(resave_, "toy", index));
      });
      if (this.isForKeep == 1) {
        //新增 套餐
        // console.log(this.imgsetData); //
        // console.log(this.imgresaveData);
        if (this.imgsetData?.length || this.imgresaveData?.length) {
          Promise.all(files_)
            .then((get_) => {
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
        } else {
          console.log(this.imgsetData);
          console.log(this.imgresaveData);
        }
      }
      if (this.isForKeep == 0) {
        if (!this.imgsetData?.length || !this.imgresaveData?.length) {
          this.$message("请输入全部信息");
          return false;
        }
        Promise.all(files_)
          .then((get_) => {
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
      this.centerDialogVisible = false;
    },

    allow_SelectList() {
      // var newarr = JSON.parse(JSON.stringify(this.allow_InitData));
      // if (this.allow_InitData.length > 0) {
      //   if (this.ordersNameValue != "") {
      //     this.allow_mapData = newarr.filter((item) => {
      //       if (this.ordersNameValue != "") {
      //         return (
      //           String(item["EnterpriseRenMobile"]).search(
      //             this.ordersNameValue
      //           ) > -1
      //         );
      //       }
      //     });
      //   } else {
      //     this.allow_mapData = [...this.allow_InitData];
      //   }
      //   if (!isNaN(parseInt(this.ordersNameSelect))) {
      //     this.allow_mapData = newarr.filter((item) => {
      //       return item["isVerify"] == this.ordersNameSelect;
      //     });
      //     if (this.ordersNameValue != "") {
      //       this.allow_mapData = newarr.filter((item) => {
      //         if (this.ordersNameValue != "") {
      //           return (
      //             String(item["EnterpriseRenMobile"]).search(
      //               this.ordersNameValue
      //             ) > -1 || item["isVerify"] == this.ordersNameSelect
      //           );
      //         }
      //       });
      //     }
      //   }
      //   this.allowTotal = this.allow_mapData.length;
      //   this.allowPageChange(1);
      // console.log(this.allow_InitData);
      // }
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

.priceLimitSty {
  display: inline-block;
  width: 120px;
}
</style>
