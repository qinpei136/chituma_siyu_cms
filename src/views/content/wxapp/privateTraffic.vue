<template>
  <div class="table-container">
    <byui-query-form>
      <!-- <byui-query-form-left-panel>
        <div style="width: 500px; height: 3px;"></div>
      </byui-query-form-left-panel> -->

      <byui-query-form>
        <byui-query-form-left-panel>
          <el-form ref="form" :inline="true" @submit.native.prevent>
            <el-form-item label="套餐名称">
              <el-input
                v-model="toSend.meal"
                placeholder="单行输入"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item label="状态">
              <el-select v-model="toSend.state" placeholder="请选择" clearable>
                <el-option
                  v-for="item in state"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-input
                suffix-icon="el-icon-date"
                v-model="toSend.createTime"
                placeholder="单行输入"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="创建人">
              <el-input
                v-model="toSend.adStart"
                placeholder="单行输入"
                clearable
              ></el-input>
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
                icon="el-icon-refresh"
                type="primary"
                @click="clearCenterList"
                >清空
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-circle-plus-outline"
                type="primary"
                @click="
                  () => {
                    this.$router.push({
                      path: '/weapp/privateTrafficDetail/orders/0/true',
                    });
                  }
                "
                >定制套餐
              </el-button>
              <el-button
                icon="el-icon-circle-plus-outline"
                type="primary"
                @click="
                  () => {
                    this.$router.push({
                      path: '/weapp/privateTrafficDetail/nine/0/true',
                    });
                  }
                "
                >福利套餐
              </el-button>
            </el-form-item>
          </el-form>
        </byui-query-form-right-panel>
      </byui-query-form>
    </byui-query-form>

    <!--================私域流量套餐表格区域=============  -->
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="allow_List"
      style="width: 100%;"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column prop="name" label="套餐名称"></el-table-column>
      <el-table-column prop="type" label="套餐类型"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="promPrice" label="促销价"></el-table-column>
      <el-table-column prop="bonusRatio" label="物业分红比例"></el-table-column>
      <el-table-column prop="index" label="排序"></el-table-column>
      <el-table-column prop="stat" label="状态">
        <template slot-scope="scope">
          {{ isUse[scope.row.stat] }}
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column width="150" prop="account" label="创建人">
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
          <el-form-item label="套餐类型">
            <el-radio
              v-model="mealForm.style"
              label="orders"
              :disabled="!isShowkeep || isEdit"
            >
              <!-- <el-input v-model="ordersType" :disabled="!isShowkeep"></el-input> -->
              {{ ordersType }}
            </el-radio>
            <el-radio
              v-model="mealForm.style"
              label="nine"
              :disabled="!isShowkeep || isEdit"
            >
              <!-- <el-input v-model="nineType" :disabled="!isShowkeep"> </el-input> -->
              {{ nineType }}
            </el-radio>
          </el-form-item>
          <el-form-item v-if="mealForm.style == 'nine'" label="套餐名称">
            <el-select
              v-model="mealForm.direction"
              placeholder="请选择"
              clearable
              @change="test"
            >
              <el-option
                v-for="item in allow_MapDirection"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套餐名称" v-if="mealForm.style == 'orders'">
            <el-row type="flex">
              <el-col :span="6">
                <el-input
                  v-model="mealForm.name"
                  :disabled="!isShowkeep"
                  maxlength="8"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="单价">
            <el-row type="flex">
              <el-col :span="6">
                <el-input-number
                  :precision="2"
                  :min="0.01"
                  v-model="mealForm.price"
                  :disabled="!isShowkeep"
                ></el-input-number>
              </el-col>
              <el-col :span="6" v-show="mealForm.style === 'nine'">
                促销价:
                <el-input-number
                  :precision="2"
                  :min="0"
                  v-model="mealForm.promPrice"
                  :disabled="!isShowkeep"
                ></el-input-number>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-show="mealForm.style === 'orders'" label="套餐规格">
            <el-row type="flex">
              <el-col :span="24">
                <el-input-number
                  :min="1"
                  class="guigeSty"
                  :precision="0"
                  v-model="mealForm.device"
                  :disabled="!isShowkeep"
                ></el-input-number
                >&nbsp;&nbsp;屏
                <el-input-number
                  :min="1"
                  class="guigeSty"
                  :precision="0"
                  v-model="mealForm.day"
                  :disabled="!isShowkeep"
                ></el-input-number
                >&nbsp;&nbsp;天
              </el-col>
              <!-- <el-col :span="1">屏 </el-col>
                <el-col :span="3">
                  <el-input
                    v-model="mealForm.day"
                    :disabled="!isShowkeep"
                  ></el-input>
                </el-col>
                <el-col :span="1">天 </el-col> -->
            </el-row>
          </el-form-item>
          <el-form-item v-show="mealForm.style !== 'orders'" label="套餐规格">
            <el-form-item>
              <el-radio v-model="mealForm.priceLimit" :label="false">
                屏/天等于1 1屏/1天
              </el-radio>
              <el-radio v-model="mealForm.priceLimit" :label="true"
                >上限
                <div class="guigeSty" style="margin-right: 10px;">
                  <el-input-number
                    :min="1"
                    :precision="0"
                    v-model="mealForm.device"
                    :disabled="!isShowkeep"
                  ></el-input-number>
                </div>
                屏
                <div class="guigeSty">
                  <el-input-number
                    :min="1"
                    :precision="0"
                    v-model="mealForm.day"
                    :disabled="!isShowkeep"
                  ></el-input-number>
                  天
                </div>
              </el-radio>
            </el-form-item>
            <el-form-item>
              <span class="tip"
                >屏/天等于1，小程序端价格计算为：选择天数✖️屏数乘✖️单价（屏/天不固定）</span
              ><br />
              <span class="tip"
                >上限，小程序端价格计算为：取套餐单价（屏/天为小程序端上限值）</span
              >
            </el-form-item>
          </el-form-item>
          <el-form-item label="轮播图片素材">
            <div v-if="mealForm.playMaterialUrls.length > 0">
              <img
                width="160"
                height="100"
                v-for="src in playMaterialImg"
                :key="src"
                :src="src"
                alt=""
              />
            </div>
            <to-keep
              v-else
              :pic-path="playMaterialImg"
              :receive="5 - playMaterialImg.length - playMaterialVideo.length"
              @resaveImg="allow_setplayMaterialImg"
              :inOption="{
                autoCropWidth: '1280',
                autoCropHeight: '800',
                fixedNumber: [2, 1],
              }"
            ></to-keep>
          </el-form-item>

          <el-form-item label="轮播视频素材">
            <div v-if="mealForm.playMaterialUrls.length > 0">
              <video
                v-for="src in playMaterialVideo"
                :key="src"
                :src="src"
                class="mealFormImg"
                alt=""
                controls
              >
                <source :src="src" type="video/mp4" />
              </video>

              <div v-if="isShowkeep" class="postionToVideo" @click="delVideo">
                <span class="">
                  <i class="el-icon-delete"></i>
                </span>
              </div>
            </div>
            <div v-else>
              <upload-img
                v-if="isShowkeep"
                :edit-data="editData"
                :receive="5 - playMaterialImg.length - playMaterialVideo.length"
                file-type="video"
                @resaveImg="allow_setplayMaterialVideo"
              >
              </upload-img>
            </div>

            <span class="tip">图片格式支持JPG,PNG;视频格式支持MP4;数量不得超过4;裁剪宽高：1280*800</span
            >
          </el-form-item>

          <el-form-item v-show="mealForm.style === 'orders'" label="套餐内容">
            <el-form-item label="蛋糕样式">
              <div
                v-if="mealForm.toy.length > 0"
                style="display: inline-block;"
              >
                <img
                  v-for="src in mealForm.cake"
                  :key="src"
                  :src="src"
                  class="mealFormFxed"
                  alt=""
                />
              </div>
              <to-keep
                v-else
                :pic-path="imgsetData"
                :receive="4"
                @resaveImg="allow_setImg"
              ></to-keep>
              <span class="tip"
                >&nbsp;&nbsp;照片只支持.jpg/png/jpeg格式;最少上传一张，最多不得超过四张</span
              >
            </el-form-item>
            <el-form-item label="玩偶样式">
              <div v-if="mealForm.toy.length > 0">
                <img
                  v-for="src in mealForm.toy"
                  :key="src"
                  :src="src"
                  class="mealFormFxed"
                  alt=""
                />
              </div>
              <to-keep
                v-else
                :pic-path="imgsetData"
                :receive="2"
                @resaveImg="allow_resaveImg"
              ></to-keep>
              <span class="tip"
                >&nbsp;&nbsp;照片只支持.jpg/png/jpeg格式;最少上传一张，最多不得超过二张</span
              >
            </el-form-item>
            <el-form-item label="蛋糕尺寸">
              <div class="priceLimitSty">
                <el-input
                  v-model="mealForm.cakeSize"
                  :disabled="!isShowkeep"
                ></el-input>
              </div>
            </el-form-item>
          </el-form-item>
          <el-form-item> </el-form-item>
          <el-form-item label="月销量默认值">
            <el-row type="flex">
              <el-col :span="3">
                <el-input-number
                  :min="0"
                  :max="9999"
                  :precision="0"
                  v-model.number="mealForm.monthSale"
                  :disabled="!isShowkeep"
                ></el-input-number>
              </el-col>
              <el-col :span="3"> </el-col>
              <el-col :span="3">
                浏览量默认值
              </el-col>
              <el-col :span="3">
                <el-input-number
                  :min="0"
                  :max="9999"
                  style="display: inline-block;"
                  v-model.number="mealForm.viewAmount"
                  :disabled="!isShowkeep"
                ></el-input-number>
              </el-col>
              <span class="tip">&nbsp;&nbsp;注：数值要比月销量高</span>
            </el-row>
          </el-form-item>
          <el-form-item label="投放详情">
            <div class="toDetail">
              <el-table
                :data="(datas = mealForm.details1)"
                border
                style="margin-top: 10px; width: 400px; display: inline-block;"
                :show-header="true == false"
              >
                <el-table-column label="">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.name"
                      :disabled="true"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.value"
                      :disabled="true"
                    ></el-input>
                  </template> </el-table-column
              ></el-table>

              <el-button
                type="primary"
                icon="el-icon-plus"
                circle
                @click="AddListRow(0)"
                style="display: inline-block; margin-left: 10px;"
                v-show="this.mealForm.details2.length == 0"
              ></el-button>

              <el-table
                :data="(datas = mealForm.details2)"
                border
                style="margin-top: 10px; width: 600px;"
                :show-header="true == false"
                v-show="this.mealForm.details2.length > 0"
              >
                <el-table-column label="">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.name"
                      :disabled="!isShowkeep"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.value"
                      :disabled="!isShowkeep"
                    ></el-input>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      v-show="isShowkeep"
                      type="primary"
                      icon="el-icon-plus"
                      circle
                      @click="AddListRow(scope.$index + 1)"
                    ></el-button>
                    <el-button
                      v-show="isShowkeep"
                      type="warning"
                      icon="el-icon-minus"
                      circle
                      @click="handleDelete(scope.$index)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="案例展示">
            <el-row type="flex">
              <el-col :span="18">
                <editor
                  id="editor_id"
                  name="content"
                  height="300px"
                  width="800px"
                  :content="mealForm.exemples"
                  :afterChange="afterChange()"
                  pluginsPath="/static/kindeditor/plugins/"
                  :loadStyleMode="false"
                  @on-content-change="dingzhiChange"
                ></editor>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- v-show="mealForm.style === 'orders'" -->
          <el-form-item label="是否需要创意场景" v-show="false">
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
          <el-form-item
            label="是否需要配送地址"
            v-show="mealForm.style === 'orders'"
          >
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
          <el-form-item label="排序">
            <div class="priceLimitSty">
              <el-input
                v-model.number="mealForm.index"
                placeholder="数值越大 排序越前"
                :disabled="!isShowkeep"
              ></el-input>
            </div>
            <span class="tip"
              >&nbsp;&nbsp;注：数值越大，套餐排序越靠前，数值越小越靠后</span
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="ShowDrawer__footer">
        <el-row>
          <el-col :push="16">
            <el-button @click="isShowDrawer = false">取 消</el-button>
            <el-button
              v-if="isShowkeep"
              type="primary"
              @click="keepChangeMaterils"
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
import VueQuillEditor from "vue-quill-editor";
import Vue from "vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
Vue.use(VueQuillEditor);

import { getList, doDelete } from "@/api/table";
import * as weapp from "@/apis/model/weapp.js";
import { RouteArr } from "@/router/index";
import checkPermission from "@/utils/permission";
import "@/assets/kindeditor/kindeditor-all.js";
import "@/assets/kindeditor/lang/zh-CN.js";
// import * as aa from "@/assets/kindeditor/kindeditor-all.js";
// import * as aa from "@/assets/kindeditor/lang/zh-CN.js";

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
      toSend: {
        state: "",
        meal: "",
        payPrice: "",
        adStart: "",
        createTime: "",
      }, // input绑定的值
      allow_InitData: [],
      allow_mapData: [],
      allow_List: [],
      vv: null,

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
      allow_MapDirection: [
        { value: "家有喜事", name: "家有喜事" },
        { value: "新婚之喜", name: "新婚之喜" },
      ],

      allow_RouteOption: allowGetRoute,
      allow_allRouteOption: allowGetRoute,

      getrouteAdmin: "",
      isShowShen: null,
      // 状态下拉内容值
      state: [
        { value: 1, name: "禁用" },
        { value: 2, name: "启用" },
      ],
      isUse: ["禁用", "启用"],
      ordersDirection: [],

      ordersType: "定制套餐",
      nineType: "福利套餐",
      palyCount: 4,

      mealForm: {
        name: "",
        style: "orders",
        price: 0.01,
        promPrice: 0,
        cakeSize: "",
        cake: [],
        toy: [],
        material: [],
        direction: [],
        day: null,
        device: null,
        index: null,
        isAddress: false,
        isScene: false,
        priceLimit: false,
        materiaUrl: "",
        materialId: "",
        account: sessionStorage.getItem("usr"),
        exemples: "",
        details1: [
          { name: "播放时长", value: "15秒" },
          { name: "播放周期", value: "120秒/次" },
          { name: "每日播放", value: "720次" },
          { name: "屏幕类型", value: "社区智媒屏" },
          { name: "播放地点", value: "小区单元门禁" },
        ],
        details2: [],
        playMaterialUrls: [],
        monthSale: null,
        viewAmount: null,
      },
      isShowDrawer: false,
      editData: {},
      imgsetData: [],
      imgresaveData: [],
      playMaterialImg: [],
      playMaterialVideo: [],

      preViewImg: [],

      isShowkeep: true,
      isForKeep: 0,
      isEdit: false,
      editorK: null,
      getType: null
    };
  },
  computed: {},
  watch: {
    "mealForm.style": {
      handler(newStyle, oldStyle) {
        if (newStyle != "nine") {
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

    // KindEditor;
    // console.log(KindEditor);
    // KindEditor.ready(function (K) {
    // console.log(window.KindEditor);

    // //   console.log(K);
    // // });
    // if (K) {
    //   this.kM = K;
    // }
  },
  methods: {
    checkPermission,
    getMaterilsData() {
      weapp
        .getMeals()
        .then((res) => {
          console.log(res);
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
    test() {
      console.log("11111:" + this.mealForm.direction);
    },
    AddListRow(index) {
      // this.mealForm.details2.push({
      // 	"name":'',"value":''
      // });
      this.mealForm.details2.splice(index, 0, { name: "", value: "" });
      console.log(this.mealForm.details2);
    },
    handleDelete(index) {
      this.mealForm.details2.splice(index, 1);
      console.log(this.mealForm.details2);
    },
    afterChange() {},
    afterChange1() {},
    dingzhiChange(val) {
      this.mealForm.exemples = val;
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
    allow_setplayMaterialImg(data) {
      // console.log(data);
      this.playMaterialImg = data;
    },
    allow_setplayMaterialVideo(data) {
      // console.log(data);
      this.playMaterialVideo = data;
    },
    allow_resaveImg(data) {
      // console.log(data);
      this.imgresaveData = data;
    },
    allow_preViewImg(data) {
      this.preViewImg = data;
    },
    delVideo() {
      this.mealForm.materiaUrl = "";
      this.preViewImg = [];
    },
    delPlayVideo() {
      this.mealForm.materiaUrl = "";
      this.preViewImg = [];
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
      this.mealForm.material = [];
      this.mealForm.materialId = "";
      this.mealForm.materiaUrl = "";
      this.mealForm.name = "";
      this.mealForm.cakeSize = "";
      this.mealForm.day = null;
      this.mealForm.device = null;
      this.mealForm.price = null;
      this.mealForm.promPrice = null;
      this.mealForm.index = null;
      this.mealForm.playMaterialUrls = [];
      this.ordersType = "定制套餐";
      this.nineType = "福利套餐";
      this.playMaterialImg = [];
      this.playMaterialVideo = [];
      this.isEdit = false;

      this.mealForm.style = "orders"; // 默认创建蛋糕套餐

      // KindEditor.ready(function(K) {
      //         editor = K.create('#editor_id', {
      //         });
      // editor.readonly(true);
      //     });
      // let editor = this.kM.create("#editor_id");
      // editor.readonly(true);
    },

    allow_toLimits(row, postIsVerify) {
      sessionStorage.setItem("fromUrl", "/weapp/private-domain-traffic");
      this.mealForm = row;
      console.log('row', row)
      this.$router.push({
        name: "weapp-private-traffic-detail",
        params: {
          style: row.style,
          id: row.id,
          isEdit: postIsVerify,
        },
      });

      // this.createdCenterList();
      // this.isShowkeep = postIsVerify;
      // console.log(row);
      // this.mealForm = { ...row };
      // if (this.mealForm.style === "orders") {
      //   this.ordersType = this.mealForm.type;
      // } else if (this.mealForm.style === "nine") {
      //   this.nineType = this.mealForm.type;
      // }
      // if (this.mealForm.playMaterialUrls) {
      //   for (let i = 0; i < this.mealForm.playMaterialUrls.length; i++) {
      //     let playO = this.mealForm.playMaterialUrls[i].url;
      //     let playType = playO.substring(playO.lastIndexOf(".") + 1);
      //     if (
      //       playType.toLocaleLowerCase() == "jpg" ||
      //       playType.toLocaleLowerCase() == "png"
      //     ) {
      //       this.playMaterialImg.push(playO);
      //     } else this.playMaterialVideo.push(playO);
      //   }
      // }

      // this.isForKeep = 1;
      // this.isEdit = true;
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
    allow_fxedMeals() {
      if (!this.mealForm.price) {
        this.$message("价格没填");
        return false;
      }
      if (!this.mealForm.device) {
        this.$message("设备数没填");
        return false;
      }
      if (!this.mealForm.day) {
        this.$message("天数没填");
        return false;
      }
      if (!this.mealForm.index) {
        this.$message("排序值没填");
        return false;
      }
      if (!this.mealForm.name) {
        this.$message("套餐名没填");
        return false;
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
    checkKeepMaterils() {
      var self = this;

      var reg3 = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
      // if (this.mealForm.promPrice) {
      //   if (!reg3.test(Number(this.mealForm.promPrice))) {
      //     this.$message("请输入至多两位小数点的促销价");
      //     return false;
      //   }
      // }
      // if (!reg3.test(Number(this.mealForm.price)) || !this.mealForm.price) {
      //   this.$message("请输入至多两位小数点的价格");
      //   return false;
      // }
      // if (this.mealForm.name.length > 10) {
      //   this.$message("套餐名称最多只能输入10个数字");
      //   return false;
      // }
      if (this.mealForm.price < this.mealForm.promPrice) {
        this.$message("促销价不允许大于单价");
        return false;
      }
      for (let i = 0; i < this.mealForm.details2.length; i++) {
        if (
          !this.mealForm.details2[i].name ||
          !this.mealForm.details2[i].value
        ) {
          this.$message("投放详情不能有空值");
          break;
          return false;
        }
      }

      if (self.mealForm.style == "nine") {
        if (!self.nineType) {
          self.$message("请输入配置套餐 标题");
          return false;
        }
        self.mealForm.name = self.mealForm.direction;
        self.mealForm.type = self.nineType;
        if (!self.mealForm.priceLimit) {
          self.mealForm.device = 1;
          self.mealForm.day = 1;
        }
        self.mealForm.cakeSize = "";
        self.mealForm.cake = [];
        self.mealForm.toy = [];
        if (self.mealForm.direction.length < 1) {
          self.$message("必选投放方向");
          return false;
        }
      } else {
        if (!self.mealForm.name) {
          this.$message("请输入套餐名称");
          return false;
        }
        self.mealForm.direction = [];
        if (!self.ordersType) {
          self.$message("请输入配置套餐标题");
          return false;
        }
        self.mealForm.type = self.ordersType;
      }
      if (self.mealForm.style == "orders" && !self.mealForm.cakeSize) {
        self.$message("蛋糕尺寸没填");
        return false;
      }
      if (!this.mealForm.exemples) {
        this.$message("请输入案例展示");
        return false;
      }
      if (
        !this.mealForm.price ||
        !this.mealForm.day ||
        !this.mealForm.device ||
        !this.mealForm.index ||
        !this.mealForm.name
      ) {
        this.$message("请输入全部信息");
        this.allow_fxedMeals();
        return false;
      }
      return true;
    },
    keepChangeMaterils() {
      var self = this;
      if (!this.checkKeepMaterils()) {
        return false;
      }
      var files_ = [];

      // console.log(this.isForKeep);
      if (this.isForKeep == 1) {
        if (this.preViewImg.length > 0) {
          this.preViewImg.forEach((reimg_, index) => {
            files_.push(this.uploadFiles(reimg_, "materiaUrl", index));
          });
          this.uploadThen(files_, true);
        } else {
          weapp.changeMeals(self.mealForm).then((res) => {
            if (res.data.status) {
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
      }

      if (this.isForKeep == 0) {
        // console.log(this.preViewImg);

        if (self.mealForm.style == "orders") {
          if (!self.imgsetData?.length || !self.imgresaveData?.length) {
            self.$message("请输入全部信息");
            return false;
          }
        } else if (self.mealForm.style == "nine") {
          self.imgsetData = [];
          self.imgresaveData = [];
        }
        self.isShowDrawer = false;
        self.mealForm.playMaterialUrls = [];
        if (self.playMaterialImg.length > 0) {
          self.playMaterialImg.forEach((setimg_, index) => {
            files_.push(self.upload64(setimg_.url, "playMaterialUrls", index));
          });
        }
        if (self.playMaterialVideo.length > 0) {
          self.playMaterialVideo.forEach((setimg_, index) => {
            files_.push(self.uploadFiles(setimg_, "playMaterialUrls1", index));
          });
        }
        if (self.imgsetData.length > 0) {
          self.mealForm.cake = [];
          self.imgsetData.forEach((setimg_, index) => {
            files_.push(self.upload64(setimg_.url, "cake", index));
          });
        }
        if (self.imgresaveData.length > 0) {
          self.mealForm.toy = [];
          self.imgresaveData.forEach((resave_, index) => {
            files_.push(self.upload64(resave_.url, "toy", index));
          });
        }
        self.preViewImg.forEach((reimg_, index) => {
          files_.push(self.uploadFiles(reimg_, "materiaUrl", index));
        });
        self.uploadThen(files_, false);
      }
    },
    uploadThen(files_all, toUpdate) {
      var self = this;

      Promise.all(files_all)
        .then((get_) => {
          console.log(get_);
          get_.forEach((gets) => {
            var getdata = gets.data.data;
            if (getdata.type === "materiaUrl") {
              self.mealForm[getdata.type] = getdata.urls.url;
              self.mealForm.materialId = getdata.materialId;

              console.log(self.mealForm);
            } else {
              if (getdata.type === "playMaterialUrls1")
                self.mealForm.playMaterialUrls.push({
                  url: getdata.urls.url,
                  imageUrl: getdata.urls.imageUrl,
                });
              else if (getdata.type === "playMaterialUrls")
                self.mealForm.playMaterialUrls.push({
                  url: getdata.url,
                  imageUrl: "",
                });
              else self.mealForm[getdata.type].push(getdata.url);
              self.mealForm.material.push(getdata.materialId);
            }
          });
          var toKeep = toUpdate ? "changeMeals" : "keepMeals"; // changeMeals
          weapp[toKeep](self.mealForm).then((res) => {
            if (res.data.status) {
              self.$message({
                type: "success",
                message: "保存成功",
              });

              self.getMaterilsData();
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
    },
    upload64(filr, type, index) {
      return new Promise(function (resolve, reject) {
        // var resaveFlie = new FormData();
        // resaveFlie.append("name", type  );
        // resaveFlie.append("type", type);
        // resaveFlie.append("file",filr);
        // console.log(filr.file);
        // console.log( typeOf( filr));

        var resaveFlie = {};
        resaveFlie.name = type;
        resaveFlie.type = type;
        resaveFlie.file = filr;

        weapp
          .upload64(resaveFlie)
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
    active_Close(done) {
      done();
    },
    allow_clearSetLimits() {
      this.getrouteAdmin = "";
      this.centerDialogVisible = false;
    },
    // state: "", meal: "", payPrice: "", adStart: ""
    clearCenterList() {
      this.ordersNameValue = "";
      this.ordersNameSelect = "";
      this.toSend.state = "";
      this.toSend.meal = "";
      this.toSend.payPrice = "";
      this.toSend.adStart = "";
      this.toSend.createTime = "";
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
    }
  }
};
</script>
<style lang="scss" scoped>
.avatar-uploader {
  text-align: center;
}
.toDetail {
  ul > li {
    list-style: none;
    color: #9ca9ba;
  }
  ul > li div:last-of-type {
    color: #090d13;
  }
  .toDetailitem {
    display: inline-block;
    border: 1px solid #333;
    width: 150px;
  }
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
  overflow-y: scroll;
}
.ShowDrawerInput {
  width: 33%;
}
.mealFormImg {
  width: 160px;
  height: 80px;
  border: 1px solid #ececec;
}
.mealFormFxed {
  width: 120px;
  height: 120px;
  border: 1px solid #ececec;
}

.postionToVideo {
  position: relative;
  top: -6rem;
  left: 12rem;
}

.priceLimitSty {
  display: inline-block;
  width: 160px;
}
.guigeSty {
  display: inline-block;
  width: 120px;
}
.tip {
  color: #e6a23c;
  font-size: 12px;
}
.lunboImgDiv {
  border: 1px solid #dcdfe6;
  width: 120px;
  height: 90px;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
}
.lunboImgFxed {
  width: 120px;
  height: 60px;
  border: 1px solid #ececec;
}
.vedioDiv {
  border: 1px solid #dcdfe6;
  width: 114px;
  height: 62px;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
}
.display {
  display: inline-block;
}
</style>
