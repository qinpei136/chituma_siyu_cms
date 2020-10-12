<template>
  <div class="table-container">
    <el-row>
      <el-col :push="22">
        <el-page-header content="" @back="cancle"> </el-page-header>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="ShowDrawer__content">
          <el-form :model="mealForm" label-width="126px" label-position="left">
            <el-form-item v-if="mealForm.style == 'nine'" label="套餐名称">
              <el-select
                :disabled="!isEdit"
                v-model="mealForm.direction"
                clearable
                change=""
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
                    :disabled="!isEdit"
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
                    :disabled="!isEdit"
                  ></el-input-number>
                </el-col>
                <el-col :span="6" v-show="mealForm.style === 'nine'">
                  促销价:
                  <el-input-number
                    :precision="2"
                    :min="0"
                    v-model="mealForm.promPrice"
                    :disabled="!isEdit"
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
                    :disabled="!isEdit"
                  ></el-input-number
                  >&nbsp;&nbsp;屏
                  <el-input-number
                    :min="1"
                    class="guigeSty"
                    :precision="0"
                    v-model="mealForm.day"
                    :disabled="!isEdit"
                  ></el-input-number
                  >&nbsp;&nbsp;天
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-show="mealForm.style !== 'orders'" label="套餐规格">
              <el-form-item>
                <el-radio v-model="mealForm.priceLimit" :label="true">
                  屏/天等于1 1屏/1天
                </el-radio>
                <el-radio
                  v-model="mealForm.priceLimit"
                  :label="false"
                  v-if="1 == 2"
                  >上限
                  <div class="guigeSty" style="margin-right: 10px;">
                    <el-input-number
                      :min="1"
                      :precision="0"
                      v-model="mealForm.device"
                      :disabled="!isEdit"
                    ></el-input-number>
                  </div>
                  屏
                  <div class="guigeSty">
                    <el-input-number
                      :min="1"
                      :precision="0"
                      v-model="mealForm.day"
                      :disabled="!isEdit"
                    ></el-input-number>
                    天
                  </div>
                </el-radio>
              </el-form-item>
              <!-- <el-form-item>
                <span class="tip"
                  >屏/天等于1，小程序端价格计算为：选择天数✖️屏数乘✖️单价（屏/天不固定）</span
                ><br />
                <span class="tip"
                  >上限，小程序端价格计算为：取套餐单价（屏/天为小程序端上限值）</span
                >
              </el-form-item> -->
            </el-form-item>
            <el-form-item label="轮播图片素材">
              <div
                v-for="src in mealForm.playMaterialUrls.filter(
                  (m) =>
                    m.url &&
                    m.url.indexOf('.mp4') == -1 &&
                    m.url.indexOf('https://') != -1
                )"
                :key="src"
                class="delImg display"
              >
                <img
                  width="120"
                  height="60"
                  :src="src.url"
                  alt=""
                  class="display"
                />
                <el-button
                  :key="src"
                  type="Warning"
                  icon="el-icon-delete"
                  circle
                  class="delButton"
                  @click="delPlayMaterial(src.url)"
                ></el-button>
              </div>
              <to-keep
                class="display"
                :pic-path="playMaterialImg"
                :receive="
                  4 -
                  mealForm.playMaterialUrls.filter(
                    (m) => m.url && m.url.indexOf('https://') != -1
                  ).length
                "
                @resaveImg="allow_setplayMaterialImg"
                :inOption="{
                  autoCropWidth: '1200',
                  autoCropHeight: '600',
                  fixedNumber: [2, 1],
                }"
              ></to-keep>
            </el-form-item>

            <el-form-item label="轮播视频素材">
              <div
                v-for="src in mealForm.playMaterialUrls.filter(
                  (m) =>
                    m.url &&
                    m.url.indexOf('.mp4') != -1 &&
                    m.url.indexOf('https://') != -1
                )"
                :key="src"
                class="delImg display"
                style="margin-right: 20px;"
              >
                <video :src="src.url" class="mealFormImg" alt="" controls>
                  <source :src="src.url" type="video/mp4" />
                </video>
                <el-button
                  type="Warning"
                  icon="el-icon-delete"
                  circle
                  class="delVideoButton"
                  @click="delPlayMaterial(src.url)"
                ></el-button>
              </div>
              <upload-img
                class="display"
                v-if="isEdit"
                :edit-data="editData"
                :receive="
                  4 -
                  mealForm.playMaterialUrls.filter(
                    (m) => m.url && m.url.indexOf('https://') != -1
                  ).length
                "
                file-type="video"
                @resaveImg="allow_setplayMaterialVideo"
              >
              </upload-img>

              <!-- <div v-if="mealForm.playMaterialUrls.length > 0">
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

                <div v-if="isEdit" class="postionToVideo" @click="delVideo">
                  <span class="">
                    <i class="el-icon-delete"></i>
                  </span>
                </div>
              </div>
              <div v-else>
                <upload-img
                  v-if="isEdit"
                  :edit-data="editData"
                  :receive="
                    5 - playMaterialImg.length - playMaterialVideo.length
                  "
                  file-type="video"
                  @resaveImg="allow_setplayMaterialVideo"
                >
                </upload-img>
              </div> -->

              <span class="tip"
                >图片格式支持JPG,PNG;视频格式支持MP4;数量不得超过4;裁剪宽高：1200*600</span
              >
            </el-form-item>

            <el-form-item v-show="mealForm.style === 'orders'" label="套餐内容">
              <el-form-item label="蛋糕样式">
                <div
                  v-for="src in mealForm.cake.filter(
                    (m) => typeof m == 'string'
                  )"
                  :key="src"
                  class="delImg display"
                >
                  <img :src="src" class="mealFormFxed display" alt="" />
                  <el-button
                    :key="src"
                    type="Warning"
                    icon="el-icon-delete"
                    circle
                    class="delButton"
                    @click="delCake(src)"
                  ></el-button>
                </div>
                <to-keep
                  class="display"
                  :pic-path="mealForm.cake"
                  :receive="
                    4 - mealForm.cake.filter((m) => typeof m == 'string').length
                  "
                  @resaveImg="allow_setImg"
                ></to-keep>
                <span class="tip"
                  >&nbsp;&nbsp;照片只支持.jpg/png/jpeg格式;最少上传一张，最多不得超过四张</span
                >
              </el-form-item>
              <el-form-item label="玩偶样式">
                <div
                  v-for="src in mealForm.toy.filter(
                    (m) => typeof m == 'string'
                  )"
                  :key="src"
                  class="delImg"
                  style="display: inline-block;"
                >
                  <img :src="src" class="mealFormFxed" alt="" />
                  <el-button
                    :key="src"
                    type="Warning"
                    icon="el-icon-delete"
                    circle
                    class="delButton"
                    @click="delToy(src)"
                  ></el-button>
                </div>
                <to-keep
                  class="display"
                  :pic-path="mealForm.toy"
                  :receive="
                    2 - mealForm.toy.filter((m) => typeof m == 'string').length
                  "
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
                    :disabled="!isEdit"
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
                    :disabled="!isEdit"
                  ></el-input-number>
                </el-col>
                <el-col :span="3"> </el-col>
                <el-col :span="12">
                  浏览量默认值
                  <el-input-number
                    :min="0"
                    :max="9999"
                    style="display: inline-block;"
                    v-model.number="mealForm.viewAmount"
                    :disabled="!isEdit"
                  ></el-input-number>
                  <span class="tip">&nbsp;&nbsp;注：数值要比月销量高</span>
                </el-col>
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
                        :disabled="!isEdit"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.value"
                        :disabled="!isEdit"
                      ></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        v-show="isEdit"
                        type="primary"
                        icon="el-icon-plus"
                        circle
                        @click="AddListRow(scope.$index + 1)"
                      ></el-button>
                      <el-button
                        v-show="isEdit"
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
                    :editorRead="editorRead"
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
                :disabled="!isEdit"
                :label="true"
                >是</el-radio
              >
              <el-radio
                v-model="mealForm.isScene"
                :disabled="!isEdit"
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
                :disabled="!isEdit"
                :label="true"
                >是</el-radio
              >
              <el-radio
                v-model="mealForm.isAddress"
                :disabled="!isEdit"
                :label="false"
                >否</el-radio
              >
            </el-form-item>
            <el-form-item label="排序">
              <div class="priceLimitSty">
                <el-input
                  v-model.number="mealForm.index"
                  placeholder="数值越大 排序越前"
                  :disabled="!isEdit"
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
              <el-button @click="cancle">取 消</el-button>
              <el-button :disabled="!isEdit" type="primary" @click="save"
                >保 存</el-button
              >
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
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
        { value: "房屋租赁", name: "房屋租赁" },
        { value: "失物招领", name: "失物招领" },
      ],

      allow_RouteOption: allowGetRoute,
      allow_allRouteOption: allowGetRoute,

      getrouteAdmin: "",
      isShowShen: null,
      isUse: ["禁用", "启用"],
      ordersDirection: [],

      ordersType: "定制套餐",
      nineType: "福利套餐",
      palyCount: 4,

      mealForm: {
        id: 0,
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
        priceLimit: true,
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
        stat: 1,
      },
      // isShowDrawer: false,
      editData: {},
      cakeImgs: [],
      toyImgs: [],
      playMaterialImg: [],
      playMaterialVideo: [],

      preViewImg: [],
      isForKeep: 0,
      isEdit: true,
      editorRead: false,
    };
  },
  computed: {},
  watch: {
    // "mealForm.style": {
    //   handler(newStyle, oldStyle) {
    //     if (newStyle != "nine") {
    //       this.mealForm.priceLimit = false;
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },

  created() {
    this.mealForm.id = this.$route.params.id;
    this.mealForm.style = this.$route.params.style;
    this.isEdit = this.$route.params.isEdit;
    if (this.mealForm.style == "orders") {
      this.mealForm.type = "定制套餐";
    } else this.mealForm.type = "福利套餐";
    // alert(this.$route.params.isEdit);
    if (this.mealForm.id > 0) {
      this.initData();
      if (!this.isEdit) {
        this.editorRead = true;
      }
      // this.$route.meta.title = this.mealForm.style;
    }
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
    initData(row, postIsVerify) {
      weapp
        .getMealDetail({ id: this.mealForm.id })
        .then((res) => {
          if (res.data.status) {
            this.mealForm = res.data.data;
            //this.cakeImgs = this.mealForm.cake;
            if (this.mealForm.playMaterialUrls) {
              for (let i = 0; i < this.mealForm.playMaterialUrls.length; i++) {
                let playO = this.mealForm.playMaterialUrls[i].url;
                let playType = playO.substring(playO.lastIndexOf(".") + 1);
                if (
                  playType.toLocaleLowerCase() == "jpg" ||
                  playType.toLocaleLowerCase() == "png"
                ) {
                  this.playMaterialImg.push(playO);
                } else this.playMaterialVideo.push(playO);
              }
              console.log(this.playMaterialVideo);
            }
          }
          this.listLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.listLoading = false;
        });
    },
    AddListRow(index) {
      this.mealForm.details2.splice(index, 0, { name: "", value: "" });
    },
    handleDelete(index) {
      this.mealForm.details2.splice(index, 1);
      console.log(this.mealForm.details2);
    },
    delCake(imgUrl) {
      let index = this.mealForm.cake.indexOf(imgUrl);
      if (index != -1) {
        this.mealForm.cake.splice(index, 1);
      }
    },
    // delPayMaterialImg(imgUrl) {
    //   let index = this.playMaterialImg.indexOf(imgUrl);
    //   if (index != -1) {
    //     this.playMaterialImg.splice(index, 1);
    //   }
    // },
    // delPayMaterialVideo(imgUrl) {
    //   let index = this.playMaterialVideo.indexOf(imgUrl);
    //   if (index != -1) {
    //     this.playMaterialVideo.splice(index, 1);
    //   }
    // },
    delPlayMaterial(imgUrl) {
      let index = this.mealForm.playMaterialUrls.findIndex(
        (m) => m.url == imgUrl
      );
      if (index != -1) {
        this.mealForm.playMaterialUrls.splice(index, 1);
      }
    },
    delToy(imgUrl) {
      let index = this.mealForm.toy.indexOf(imgUrl);
      if (index != -1) {
        this.mealForm.toy.splice(index, 1);
      }
    },
    afterChange() {},
    dingzhiChange(val) {
      this.mealForm.exemples = val;
    },
    allowPageChange(val) {
      this.allow_List = this.allow_mapData.slice((val - 1) * 20, val * 20);
    },
    allow_setImg(data) {
      let imgs = this.mealForm.cake.filter((m) => typeof m == "string");
      this.mealForm.cake = imgs.concat(data);
      // this.cakeImgs = data;
    },
    allow_setPlayMaterial(data) {
      let imgs = this.mealForm.playMaterialUrls.filter(
        (m) => m.url.indexOf("https://") != -1
      );
      this.mealForm.playMaterialUrls = imgs.concat(data);
      // this.cakeImgs = data;
    },
    allow_setplayMaterialImg(data) {
      let imgs = this.mealForm.playMaterialUrls.filter(
        (m) =>
          (m.url && m.url.indexOf("https://") != -1) ||
          typeof m.file != "string"
      );
      this.mealForm.playMaterialUrls = imgs.concat(data);
      //this.playMaterialImg = data;
    },
    allow_setplayMaterialVideo(data) {
      let imgs = this.mealForm.playMaterialUrls.filter((m) => m.url);
      this.mealForm.playMaterialUrls = imgs.concat(data);
      // this.playMaterialVideo = data;
    },
    allow_resaveImg(data) {
      let imgs = this.mealForm.toy.filter((m) => typeof m == "string");
      this.mealForm.toy = imgs.concat(data);
      // this.toyImgs = data;
    },
    delVideo(data) {
      this.mealForm.materiaUrl = "";
      this.preViewImg = [];
    },
    checkData() {
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
      if (self.mealForm.style == "nine") {
        self.mealForm.name =
          typeof self.mealForm.direction == "string"
            ? self.mealForm.direction
            : self.mealForm.direction[0];
      }
      if (!self.mealForm.name) {
        this.$message("套餐名称不能为空");
        return false;
      }
      if (!self.mealForm.price) {
        this.$message("单价不能为空");
        return false;
      }
      if (this.mealForm.price < this.mealForm.promPrice) {
        this.$message("促销价不允许大于单价");
        return false;
      }
      if (self.mealForm.playMaterialUrls.length <= 0) {
        this.$message("请上传轮播素材");
        return false;
      }
      if (self.mealForm.style == "orders") {
        if (self.cakeImgs.length <= 0 && self.mealForm.cake.length <= 0) {
          this.$message("请上传蛋糕样式");
          return false;
        }
        if (self.toyImgs.length <= 0 && self.mealForm.toy.length <= 0) {
          this.$message("请上传玩偶样式");
          return false;
        }
        if (!self.mealForm.cakeSize) {
          self.$message("请输入蛋糕尺寸");
          return false;
        }
      } else {
        if (!self.mealForm.priceLimit) {
          if (!self.mealForm.day) {
            self.$message("请输入屏数");
            return false;
          }
          if (!self.mealForm.device) {
            self.$message("请输入天数");
            return false;
          }
        } else {
          self.mealForm.day = 1;
          self.mealForm.device = 1;
        }
      }
      if (!self.mealForm.monthSale) {
        this.$message("月销量不能为空");
        return false;
      }
      if (!self.mealForm.viewAmount) {
        this.$message("浏览量不能为空");
        return false;
      }

      if (!this.mealForm.exemples) {
        this.$message("请输入案例展示");
        return false;
      }
      if (!this.mealForm.index) {
        this.$message("排序不能为空");
        return false;
      }
      return true;
    },
    save() {
      var loading = this.$loading({
        lock: true,
        text: "拼命保存中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      var self = this;
      if (!this.checkData()) {
        loading.close();
        return false;
      }
      var files_ = [];
      // if (this.isForKeep == 1) {
      //   if (this.preViewImg.length > 0) {
      //     this.preViewImg.forEach((reimg_, index) => {
      //       files_.push(this.uploadFiles(reimg_, "materiaUrl", index));
      //     });
      //     this.uploadThen(files_, true);
      //   } else {
      //     weapp.changeMeals(self.mealForm).then((res) => {
      //       if (res.data.status) {
      //         self.$message({
      //           type: "success",
      //           message: "保存成功",
      //         });
      //         self.isShowDrawer = false;
      //         self.getMaterilsData();
      //       } else {
      //         self.$message({
      //           type: "info",
      //           message: "保存失败",
      //         });
      //       }
      //     });
      //   }
      // }

      // if (this.isForKeep == 0) {
      // console.log(this.preViewImg);

      // if (self.mealForm.style == "orders") {
      //   if (!self.imgsetData?.length || !self.toyImgs?.length) {
      //     self.$message("请输入全部信息");
      //     return false;
      //   }
      // } else if (self.mealForm.style == "nine") {
      //   self.imgsetData = [];
      //   self.toyImgs = [];
      // }
      // self.isShowDrawer = false;
      //self.mealForm.playMaterialUrls = [];

      if (self.mealForm.playMaterialUrls.length > 0) {
        let len = self.mealForm.playMaterialUrls.length;
        let delCount = 0;
        for (let index = 0; index < len; index++) {
          let setimg_ = self.mealForm.playMaterialUrls[index - delCount];
          if (setimg_.url && setimg_.url.indexOf("https://") == -1) {
            files_.push(self.upload64(setimg_.url, "playMaterialUrls", index));
            self.mealForm.playMaterialUrls.splice(index - delCount, 1);
            delCount++;
          } else if (setimg_.file) {
            files_.push(self.uploadFiles(setimg_, "playMaterialUrls1", index));
            self.mealForm.playMaterialUrls.splice(index - delCount, 1);
            delCount++;
          }
          // else if (setimg_.url && setimg_.url.indexOf("https://") == -1) {
          //   files_.push(self.upload64(setimg_.url, "playMaterialUrls", index));
          //   self.mealForm.playMaterialUrls.splice(index - delCount, 1);
          //   delCount++;
          // }
        }
      }

      // if (self.playMaterialImg.length > 0) {
      //   self.playMaterialImg.forEach((setimg_, index) => {
      //     if (setimg_.url)
      //       files_.push(self.upload64(setimg_.url, "playMaterialUrls", index));
      //   });
      // }
      // if (self.playMaterialVideo.length > 0) {
      //   self.playMaterialVideo.forEach((setimg_, index) => {
      //     if (setimg_.file)
      //       files_.push(self.uploadFiles(setimg_, "playMaterialUrls1", index));
      //   });
      // }
      if (self.mealForm.style == "orders") {
        if (self.mealForm.cake.length > 0) {
          let len = self.mealForm.cake.length;
          let delCount = 0;
          for (let index = 0; index < len; index++) {
            let setimg_ = self.mealForm.cake[index - delCount];
            if (setimg_.url) {
              files_.push(self.upload64(setimg_.url, "cake", index));
              self.mealForm.cake.splice(index - delCount, 1);
              delCount++;
            }
          }
          // self.mealForm.cake.forEach((setimg_, index) => {
          //   if (setimg_.url) {
          //     files_.push(self.upload64(setimg_.url, "cake", index));
          //     self.mealForm.cake.splice(index, 1);
          //   }
          // });
        }
        if (self.mealForm.toy.length > 0) {
          // self.mealForm.toy = [];
          let len = self.mealForm.toy.length;
          let delCount = 0;
          for (let index = 0; index < len; index++) {
            let setimg_ = self.mealForm.toy[index - delCount];
            if (setimg_.url) {
              files_.push(self.upload64(setimg_.url, "toy", index));
              self.mealForm.toy.splice(index - delCount, 1);
              delCount++;
            }
          }
          // self.mealForm.toy.forEach((setimg_, index) => {
          //   if (setimg_.url) {
          //     files_.push(self.upload64(setimg_.url, "toy", index));
          //     self.mealForm.toy.splice(index, 1);
          //   }
          // });
        }
      }

      // self.preViewImg.forEach((reimg_, index) => {
      //   files_.push(self.uploadFiles(reimg_, "materiaUrl", index));
      // });
      self.uploadThen(files_, false, loading);
      // }
    },
    uploadThen(files_all, toUpdate, loading) {
      var self = this;

      Promise.all(files_all)
        .then((get_) => {
          console.log(get_);
          get_.forEach((gets) => {
            var getdata = gets.data.data;
            // if (getdata.type === "materiaUrl") {
            //   self.mealForm[getdata.type] = getdata.urls.url;
            //   self.mealForm.materialId = getdata.materialId;

            //   console.log(self.mealForm);
            // } else {
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
            // }
          });
          var toKeep = this.mealForm.id > 0 ? "changeMeals" : "keepMeals"; // changeMeals
          weapp[toKeep](self.mealForm).then((res) => {
            if (res.data.status) {
              loading.close();
              self.$message({
                type: "success",
                message: "保存成功",
              });
              loading.close();
              this.$router.push({
                name: "config_s",
              });
            } else {
              loading.close();
              self.$message({
                type: "info",
                message: "保存失败",
              });
            }
          });
        })
        .catch((err) => {
          loading.close();
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
            loading.close();
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
    cancle() {
      // this.$store.dispatch("weapp-private-traffic-detail", this.$route);
      this.$router.go(-1);
    },
  },
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
  width: 200px;
  height: 100px;
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
  display: block;
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
.delImg {
  position: relative;
}
.delButton {
  position: absolute;
  left: 90px;
  border: 0px solid;
  background-color: transparent;
}
.delVideoButton {
  position: absolute;
  left: 140px;
  top: -10px;
  border: 0px solid;
  background-color: transparent;
}
</style>
