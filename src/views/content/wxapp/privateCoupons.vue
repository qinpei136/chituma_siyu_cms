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
          <el-form-item label="优惠券名称">
            <el-input v-model="upConpont.name"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="upConpont.type" placeholder="请选择">
              <el-option
                v-for="(item, index) in TypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="upConpont.state" placeholder="请选择" clearable>
              <el-option
                v-for="item in allow_MapVerify"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
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
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-refresh"
              type="primary"
              @click="clearCenterList"
              >清空</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-refresh"
              type="primary"
              @click="createdCenterList"
              >新建优惠劵
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
      <!-- <el-table-column prop="account" label="序号"></el-table-column> -->
      <!-- <el-table-column prop="phone" label="电号话"></el-table-column> -->
      <el-table-column prop="name" label="优惠券名称"></el-table-column>

      <el-table-column label="优惠券类型">
        <template slot-scope="scope">
          <el-tag>{{ TypeList[scope.row.type].name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="获取方式">
        <template slot-scope="scope">
          <el-tag>{{ gainWayType[scope.row.gainWay] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderTime" width="200px" label="使用有效期">
        <template slot-scope="scope">
          <span
            v-text="
              scope.row.days
                ? `领取后${scope.row.days}天内有效`
                : scope.row.startDate && scope.row.endDate
                ? `${reTimes(scope.row.startDate)}
                ~${reTimes(scope.row.endDate)}`
                : ''
            "
          ></span>
        </template>
      </el-table-column>
      <el-table-column prop="adStart" label="发布数量/剩余数量">
        <template slot-scope="scope">
          <span v-text="` ${scope.row.totalCount}/${scope.row.stock}`"></span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="account" label="创建人"> </el-table-column> -->
      <el-table-column prop="state" label="投放状态">
        <template slot-scope="scope">
          <el-tag>{{ couponsStatus[scope.row.state] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400px" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="warning"
            plain
            size="mini"
            @click="allow_toLimits(scope.row, false)"
          >
            查看
          </el-button>
          <el-button
            v-show="!parseInt(scope.row.state)"
            type="success"
            plain
            size="mini"
            @click="allow_toLimits(scope.row, true)"
          >
            修改
          </el-button>

          <el-button
            v-show="!parseInt(scope.row.state) || scope.row.state == 2"
            type="primary"
            plain
            size="mini"
            @click="allow_toClose(scope.row, 1)"
          >
            投放
          </el-button>
          <el-button
            v-show="scope.row.state == 1"
            type="success"
            plain
            size="mini"
            @click="allow_toClose(scope.row, 2)"
          >
            暂停投放
          </el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            @click="allow_toClose(scope.row, -1)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="新增优惠券"
      direction="rtl"
      :visible.sync="isShowDrawer"
      :before-close="active_Close"
      custom-class="ShowDrawer"
    >
      <div class="ShowDrawer__content">
        <el-form :model="CouponsForm" label-width="126px" label-position="left">
          <el-form-item label="优惠券名称">
            <el-row type="flex">
              <el-col :span="6">
                <el-input
                  v-model="CouponsForm.name"
                  :disabled="!isShowkeep"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="优惠券类型">
            <el-radio
              v-model="CouponsForm.type"
              :label="0"
              :disabled="!isShowkeep"
              >代金券</el-radio
            >
            <el-radio
              v-model="CouponsForm.type"
              :label="1"
              :disabled="!isShowkeep"
              >折扣券</el-radio
            >
            <div class="priceFormat">
              使用条件
            </div>
            <el-form-item
              :label="discounts[CouponsForm.type]['name']"
              class="CouponspriceLimit"
            >
              <el-input v-model="CouponsForm.baseline" :disabled="!isShowkeep">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item
              :label="discounts[CouponsForm.type]['discount']"
              class="CouponspriceLimit"
            >
              <el-input v-model="CouponsForm.reduce" :disabled="!isShowkeep">
                <template slot="append"
                  >{{ discounts[CouponsForm.type]["fontIs"] }}
                </template>
              </el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label="获取方式">
            <el-radio v-model="CouponsForm.gainWay" :label="0">
              系统发放
            </el-radio>
            <!-- <el-radio v-model="CouponsForm.gainWay" :label="1"> 其他 </el-radio> -->
            <el-form-item label="发放人群">
              <el-radio
                v-model="CouponsForm.giveOutType"
                :label="0"
                :disabled="!isShowkeep"
                >新人卷</el-radio
              >
              <el-radio v-model="CouponsForm.giveOutType" disabled :label="1">
                支付奖励卷
              </el-radio>
            </el-form-item>
          </el-form-item>
          <el-form-item label="使用有效期">
            <el-radio
              v-model="CouponsForm.validityType"
              :label="0"
              :disabled="!isShowkeep"
            >
              <span> 领取后</span>
              <el-input
                v-model="CouponsForm.days"
                :disabled="!!CouponsForm.validityType"
                class="CouponsInputLimit"
              >
              </el-input>
              <span> 天内有效</span>
            </el-radio>
            <el-radio
              v-model="CouponsForm.validityType"
              :label="1"
              :disabled="!isShowkeep"
            >
              <el-date-picker
                v-model="CouponsDay"
                :disabled="!CouponsForm.validityType"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="setCouponsDay"
              ></el-date-picker>
            </el-radio>
          </el-form-item>
          <el-form-item label="每人限领">
            <el-input-number
              v-model="CouponsForm.receiveCount"
            ></el-input-number
            >张
          </el-form-item>
          <el-form-item label="发布数量">
            <el-input-number
              v-model="CouponsForm.totalCount"
              :disabled="!isShowkeep"
            ></el-input-number
            >张
          </el-form-item>
          <el-form-item v-show="setState" label="是否投放">
            <el-radio
              v-model="CouponsForm.state"
              :label="1"
              :disabled="!isShowkeep"
              >是</el-radio
            >
            <el-radio
              v-model="CouponsForm.state"
              :label="0"
              :disabled="!isShowkeep"
              >否</el-radio
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="ShowDrawer__footer">
        <el-row>
          <el-col :push="16">
            <el-button @click="isShowDrawer = false">取 消</el-button>
            <el-button v-if="isShowkeep" type="primary" @click="saveCouponsForm"
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
import * as coupons from "@/apis/model/coupons.js";
import * as activitys from "@/apis/json/activity";
import * as utils from "@/utils/index";

import checkPermission from "@/utils/permission";

export default {
  name: "MediumActivity",
  components: {},

  data() {
    var onstate = -1;
    return {
      couponsContent: {
        couponsType: "1",
      },
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
      couponsStatus: {
        0: "待投放",
        1: "投放中",
        2: "已暂停",
        3: "完成",
        [onstate]: "删除",
      },
      gainWayType: {
        0: "系统发放",
        1: "其他",
      },

      allow_MapVerify: [],
      getrouteAdmin: "",
      isShowShen: null,
      isUse: ["禁用", "启用"],
      discounts: [
        {
          name: "消费金额满减",
          discount: "满减金额",
          fontIs: "元",
        },
        {
          name: "折扣金额满减",
          discount: "折扣额度",
          fontIs: "折",
        },
      ],
      CouponsDay: [],
      pickerOptions: activitys.pickerOptions,

      CouponsForm: {
        name: "",
        type: 0,
        baseline: null,
        reduce: null,
        gainWay: 0,
        giveOutType: 0,
        validityType: 0,
        days: null,
        startDate: null,
        endDate: null,
        receiveCount: 1,
        totalCount: null,
        state: 0,
      },
      isShowDrawer: false,
      setState: true,

      editData: {},
      upConpont: { name: "", state: 100, type: 100 },
      isShowkeep: true,
      isForKeep: 0,
      TypeList: [
        {
          name: "代金券",
          value: 0,
        },
        {
          name: "折扣券",
          value: 1,
        },
        {
          name: "全部",
          value: 100,
        },
      ],
      TypeListSlelct: "",
    };
  },
  computed: {},
  watch: {
    "CouponsForm.validityType": {
      handler: function (val, oldval) {
        // console.log(!val);
        if (!val) {
          this.CouponsDay = [];
        } else {
          this.CouponsForm.days = null;
        }
      },
      deep: true, //对象内部的属性监听，也叫深度监听
    },
  },
  created() {
    var getStateList = Object.keys(this.couponsStatus);
    getStateList = getStateList.filter((item) => {
      return item != -1;
    });
    this.allow_MapVerify = getStateList.map((item) => {
      return {
        value: Number(item),
        name: this.couponsStatus[item],
      };
    });
    this.allow_MapVerify.push({
      value: 100,
      name: "全部",
    });
    this.fetchData();
  },
  mounted() {},
  methods: {
    checkPermission,
    reTimes(time) {
      return utils.parseTime(time, "{y}-{m}-{d}");
    },

    getMaterilsData() {
      coupons
        .CouponsList(this.upConpont)
        .then((res) => {
          if (res.data.status) {
            this.allow_InitData = res.data.data;
            this.allowTotal = this.allow_InitData.length;
            this.allow_mapData = [...this.allow_InitData];
            this.allowPageChange(1);
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
    setCouponsDay() {
      if (this.CouponsDay?.length != 2) {
        return false;
      }
      this.CouponsForm.startDate = utils.parseTime(
        this.CouponsDay[0],
        "{y}-{m}-{d}"
      );
      this.CouponsForm.endDate = utils.parseTime(
        this.CouponsDay[1],
        "{y}-{m}-{d}"
      );
    },
    allow_setLimits(stat) {
      coupons
        .postSignUpAccount({
          account: this.CouponsForm.account,
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

    createdCenterList() {
      this.isShowDrawer = true;
      this.isShowkeep = true;
      this.isForKeep = 0;
      this.clearCouponItem();
    },

    allow_toLimits(row, postIsVerify) {
      this.isShowDrawer = true;
      this.isShowkeep = postIsVerify; //:disabled="!isShowkeep"
      this.setState = false;
      this.isForKeep = 1;
      this.CouponsForm = { ...row };
      this.clearTimes();
    },
    allow_updata(row, postIsVerify) {
      var self = this;
      this.isShowDrawer = true;
      this.isForKeep = 1;
      this.CouponsForm = { ...row };
    },

    clearTimes() {
      if (this.CouponsForm.validityType) {
        //days  CouponsForm.validityType
        this.CouponsDay = [
          this.CouponsForm.startDate,
          this.CouponsForm.endDate,
        ];
        this.CouponsForm.days = null;
      } else {
        this.CouponsForm.startDate = null;
        this.CouponsForm.endDate = null;
      }
    },
    clearCouponItem() {
      this.CouponsDay = [];
      this.CouponsForm.days = null;
      this.CouponsForm.startDate = null;
      this.CouponsForm.endDate = null;

      this.CouponsForm.id = null;
      this.CouponsForm.name = null;
      this.CouponsForm.baseline = null;
      this.CouponsForm.reduce = null;
      this.CouponsForm.totalCount = null;
      this.CouponsForm.state = 0;
      this.setState = true;
    },
    allow_toClose(row, postIsVerify) {
      var self = this;
      var Upstate = { ...row };
      Upstate.state = Number(postIsVerify);
      coupons.CouponsdelPay(Upstate).then((res) => {
        if (res.data.status) {
          self.getMaterilsData();
          self.$message({
            type: "success",
            message: "保存成功",
          });
        }
      });
    },

    checkCouponsForm() {
      var self = this;
      var regCoupons = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
      var re = /^[0-9]+$/;
      var str = this.CouponsForm.type == 1 ? "折扣额度" : "满减金额";

      if (
        !self.CouponsForm.name ||
        !self.CouponsForm.baseline ||
        !self.CouponsForm.reduce ||
        !self.CouponsForm.receiveCount ||
        !self.CouponsForm.totalCount ||
        !self.CouponsForm.reduce
      ) {
        self.$message("请输入全部信息");
        return false;
      }
      if (self.CouponsForm.validityType == 0 && !self.CouponsForm.days) {
        console.log("no days");
        self.$message("请输入有效时间");
        return false;
      }
      if (self.CouponsForm.validityType == 1 && self.CouponsDay.length != 2) {
        self.$message("请输入选择起止时间");
        return false;
      }
      if (!regCoupons.test(Number(self.CouponsForm.baseline))) {
        self.$message("请输入至多两位小数点的金额");
        return false;
      }

      if (!regCoupons.test(Number(self.CouponsForm.reduce))) {
        self.$message("请输入至多两位小数点的" + str);
        return false;
      }
      if (
        self.CouponsForm.type == 0 &&
        Number(self.CouponsForm.reduce) > Number(self.CouponsForm.baseline)
      ) {
        self.$message("满减金额不能大于原价");
        return false;
      }
      if (self.CouponsForm.type == 1 && Number(self.CouponsForm.reduce) > 10) {
        self.$message("折扣数字不能大于10");
        return false;
      }
      if (self.CouponsForm.days) {
        console.log("days ");
        var getNumber = re.test(self.CouponsForm.days);
        if (!getNumber) {
          self.$message("请输入正整数的天数");
          return false;
        }
        console.log(getNumber);
      }
      if (
        self.CouponsForm.receiveCount < 1 ||
        !re.test(self.CouponsForm.receiveCount)
      ) {
        console.log("receiveCount ");
        self.$message("请输入正整数的 没人限领张数");
        return false;
      }
      if (
        self.CouponsForm.totalCount < 1 ||
        !re.test(self.CouponsForm.totalCount)
      ) {
        console.log("totalCount ");
        self.$message("请输入正整数的 领卷总数");
        return false;
      }
      return true;
    },
    saveCouponsForm() {
      var self = this;
      this.clearTimes();
      if (!self.checkCouponsForm()) {
        return false;
      }

      if (this.isForKeep == 1) {
        coupons.CouponsUpData(this.CouponsForm).then((res) => {
          if (res.data.status) {
            self.getMaterilsData();
            self.$message({
              type: "success",
              message: "保存成功",
            });
            self.isShowDrawer = false;
            self.getMaterilsData();
          } else {
            self.$message({
              type: "info",
              message: "保存失败",
            });
          }
        });
      }
      if (this.isForKeep == 0) {
        coupons.keepCoupons(self.CouponsForm).then((res) => {
          if (res.data.status) {
            self.getMaterilsData();
            self.$message({
              type: "success",
              message: "保存成功",
            });
            self.isShowDrawer = false;
            self.getMaterilsData();
          } else {
            self.$message({
              type: "info",
              message: "保存失败",
            });
          }
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
        coupons
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
      done();
    },

    allow_SelectList() {
      this.getMaterilsData();
    },
    clearCenterList() {
      this.upConpont = { name: "", state: 100, type: 100 };
      this.getMaterilsData();
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
.CouponsFormImg {
  width: 160px;
  height: 80px;
  border: 1px solid #ececec;
}

.CouponspriceLimit {
  width: 21rem;
}
.CouponsInputLimit {
  width: 4rem;
}
.priceFormat {
  display: inline-block;
  position: relative;
  left: -262px;
  top: 32px;
}
</style>
