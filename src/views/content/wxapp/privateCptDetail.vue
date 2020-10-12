<template>
  <div class="table-container">
    <div>
      <el-row>
        <el-col :push="22">
          <el-page-header content="" @back="goBack"> </el-page-header>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-card class="box-card" style="margin: 8px 40px;">
            <div slot="header" class="clearfix">
              <span>订单信息</span>
            </div>
            <div>
              <el-row>
                <el-col :span="6"> 订单状态：{{ stateName }} </el-col>
                <el-col :span="6"> 订单编号：{{ orderForm.orderId }} </el-col>
                <el-col :span="12">
                  下单时间：{{ orderForm.orderTime }}
                </el-col>
              </el-row>
              <el-row class="orderFormSty">
                <el-col :span="6"> 套餐名称：{{ orderForm.meal }} </el-col>
                <el-col :span="6"> 总价：￥{{ orderForm.price }} </el-col>
                <el-col :span="6">
                  优惠折扣：￥-{{
                    orderForm.couponPrice > 0 ? orderForm.couponPrice : 0
                  }}
                </el-col>
                <el-col :span="6">
                  实际支付：￥{{
                    orderForm.payPrice > 0
                      ? orderForm.payPrice
                      : orderForm.price
                  }}
                </el-col>
              </el-row>
              <el-row v-show="orderForm.style == 'orders'" class="orderFormSty">
                <el-col :span="12">
                  蛋糕样式：<img :src="orderForm.cake" alt="" class="cakeSty" />
                </el-col>
                <el-col :span="12" te>
                  玩偶样式：<img :src="orderForm.toy" alt="" class="cakeSty" />
                </el-col>
              </el-row>
              <el-row v-show="orderForm.style == 'orders'" class="orderFormSty">
                <el-col :span="6"> 蛋糕尺寸：{{ orderForm.cakeSize }} </el-col>
                <el-col :span="12" v-if="1 == 2">
                  创意场景：{{ orderForm.scene }}
                </el-col>
              </el-row>
              <!-- <el-row v-if="orderForm.style != 'nine'" class="orderFormSty">
                <el-col :span="2">
                  创意场景：
                </el-col>
                <el-col :span="4"> {{ orderForm.scene }} </el-col>
              </el-row> -->
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-card class="box-card" style="margin: 0 40px;">
            <div slot="header" class="clearfix">
              <span> 投放小区</span>
            </div>
            <div>
              <el-row>
                <el-col :span="2">
                  投放时间
                </el-col>
                <el-col :span="2">
                  {{ [...orderForm.adDays].join("/") }}
                </el-col>
              </el-row>
              <el-row class="orderFormSty">
                <el-col :span="2">
                  投放地点
                </el-col>
                <el-col :span="5">
                  {{ orderForm.cityName }}
                </el-col>
              </el-row>
              <el-row class="">
                <el-col :span="2">投放单元</el-col>
                <el-col :span="20">
                  {{ [...orderForm.deviceNames].join("/") }}
                </el-col>
              </el-row>
              <el-row class="orderFormSty">
                <el-col :span="2">
                  用户上传素材
                </el-col>
                <el-col :span="20">
                  <div v-if="orderForm.materiaUrl2.toString() != ''">
                    <img
                      v-for="item in orderForm.materiaUrl2"
                      :key="item"
                      :src="item"
                      alt=""
                      class="orderFormImg"
                    />
                  </div>
                  <div v-if="orderForm.materiaUrl2.toString() == ''">
                    <video
                      v-if="orderForm.materiaUrl"
                      key="materiaUrl"
                      :src="orderForm.materiaUrl.url"
                      class="orderFormImg"
                      controls
                    >
                      <source
                        :src="orderForm.materiaUrl.url"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </el-col>
              </el-row>
              <el-row class="orderFormSty">
                <el-col :span="2">
                  已合成素材：
                </el-col>
                <el-col :span="20"
                  ><video
                    v-if="orderForm.materiaUrl"
                    key="materiaUrl"
                    :src="orderForm.materiaUrl.url"
                    class="orderFormImg"
                    controls
                  >
                    <source :src="orderForm.materiaUrl.url" type="video/mp4" />
                  </video>
                </el-col>
              </el-row>
              <el-row class="orderFormSty">
                <!-- <el-col :span="2"> 投放广告素材</el-col>
                <el-col :span="20">
                  <div v-if="getType === 'mp4'">
                    <video
                      v-for="item in orderForm.materiaUrl"
                      :key="item"
                      :src="item"
                      class="orderFormImg"
                      controls
                    >
                      <source :src="item" type="video/mp4" />
                    </video>
                  </div>
                  <div v-if="getType1 === 'mp4'">
                    <video
                      v-for="item in orderForm.materiaUrl1"
                      :key="item"
                      :src="item"
                      class="orderFormImg"
                      controls
                    >
                      <source :src="item" type="video/mp4" />
                    </video>
                  </div>
                  <br />
                  <div v-if="getType2 === 'mp4'">
                    原文件
                    <video
                      v-for="item in orderForm.materiaUrl2"
                      :key="item"
                      :src="item"
                      class="orderFormImg"
                      controls
                    >
                      <source :src="item" type="video/mp4" />
                    </video>
                  </div>

                  <div v-if="getType === 'img'">
                    <img
                      v-for="item in orderForm.materiaUrl"
                      :key="item"
                      :src="item"
                      alt=""
                      class="orderFormImg"
                    />
                  </div>
                  <div v-if="getType1 === 'img'">
                    <img
                      v-for="item in orderForm.materiaUrl1"
                      :key="item"
                      :src="item"
                      alt=""
                      class="orderFormImg"
                    />
                  </div>
                  <br />
                  <div v-if="getType2 === 'img'">
                    用户上传素材
                    <img
                      v-for="item in orderForm.materiaUrl2"
                      :key="item"
                      :src="item"
                      alt=""
                      class="orderFormImg"
                    />
                  </div>
                </el-col> -->
                <el-col>
                  <el-button
                    v-if="isShowStatus"
                    type="primary"
                    @click="clearCenterDown"
                  >
                    下载</el-button
                  >
                  <!-- <el-button
                    v-if="isShowStatus"
                    type="primary"
                    @click="clearCenterUp"
                    >上传</el-button
                  > -->
                  <el-button
                    v-if="isShowAllow"
                    type="primary"
                    @click="allow_toMeals(false)"
                    >驳回</el-button
                  >
                  <el-button
                    v-if="isShowAllow"
                    type="primary"
                    @click="allow_toMeals(true)"
                    >通过</el-button
                  >
                  <!-- //clearCenterDown
									<el-button></el-button>  @click="clearCenterUp"-->
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <!-- v-show="orderForm.style == 'orders'" -->
        <el-col :span="24">
          <el-card
            v-show="orderForm.style == 'orders'"
            class="box-card"
            style="margin: 8px 40px;"
          >
            <div slot="header" class="clearfix">
              <span>配送地址</span>
            </div>
            <div>
              <el-row>
                <el-col :span="6"> 姓名：{{ orderForm.account }} </el-col>
                <el-col :span="6"> 手机号：{{ orderForm.phone }} </el-col>
                <el-col :span="6">
                  配送时间：{{
                    orderForm.deliverTime
                      ? orderForm.deliverTime.replace("T", " ")
                      : ""
                  }}
                </el-col>
              </el-row>
              <el-row class="orderFormSty">
                <el-col :span="24">
                  地址：{{
                    orderForm.city != ""
                      ? orderForm.city + "/" + orderForm.address
                      : ""
                  }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="上传资源"
      :visible.sync="matter_DialogVisible"
      width="60%"
      custom-class="matterUpload"
      center
    >
      <div>
        <div class="upload_file">
          <h3>模板一</h3>
          <div>
            <el-upload
              class="avatar-uploader1"
              action=""
              :multiple="false"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="
                (e) => {
                  changeFile(e, 1);
                  return false;
                }
              "
              @abort="true"
            >
              <img v-if="imgSrc" :src="imgSrc" width="204.8px" class="avatar" />
              <!-- <img v-else-if="imgSrc" :src="imgSrc" height="200px" class="avatar" /> -->
              <video v-else-if="vadioSrc" width="204.8" controls>
                <source :src="vadioSrc" type="video/mp4" />
                <source :src="vadioSrc" type="video/ogg" />
                <source :src="vadioSrc" type="video/webm" />
                您的浏览器不支持Video标签。
              </video>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="spanText">1024px*600px</span>
          </div>
          <div>
            <el-upload
              class="avatar-uploader"
              action=""
              :multiple="false"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="
                (e) => {
                  changeFile(e, 2);
                  return false;
                }
              "
              @abort="true"
            >
              <img v-if="imgSrc1" :src="imgSrc1" width="256px" class="avatar" />
              <!-- <img v-else-if="imgSrc" :src="imgSrc" height="200px" class="avatar" /> -->
              <video v-else-if="vadioSrc1" width="256" height="160" controls>
                <source :src="vadioSrc1" type="video/mp4" />
                <source :src="vadioSrc1" type="video/ogg" />
                <source :src="vadioSrc1" type="video/webm" />
                您的浏览器不支持Video标签。
              </video>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="spanText">1280px*800px</span>
          </div>
        </div>
        <div class="upload_file">
          <h3>模板二</h3>
          <div>
            <el-upload
              class="avatar-uploader1"
              action=""
              :multiple="false"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="
                (e) => {
                  changeFile(e, 3);
                  return false;
                }
              "
              @abort="true"
            >
              <img
                v-if="imgSrc3"
                :src="imgSrc3"
                width="204.8px"
                class="avatar"
              />
              <!-- <img v-else-if="imgSrc" :src="imgSrc" height="200px" class="avatar" /> -->
              <video v-else-if="vadioSrc3" width="204.8" controls>
                <source :src="vadioSrc3" type="video/mp4" />
                <source :src="vadioSrc3" type="video/ogg" />
                <source :src="vadioSrc3" type="video/webm" />
                您的浏览器不支持Video标签。
              </video>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="spanText">1024px*600px</span>
            <div style="color: #77771f; margin-top: 20px;">
              只接收1024px*600px<br />的图片和视频
            </div>
          </div>
          <div>
            <el-upload
              class="avatar-uploader"
              action=""
              :multiple="false"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="
                (e) => {
                  changeFile(e, 4);
                  return false;
                }
              "
              @abort="true"
            >
              <img v-if="imgSrc4" :src="imgSrc4" width="256px" class="avatar" />
              <!-- <img v-else-if="imgSrc" :src="imgSrc" height="200px" class="avatar" /> -->
              <video v-else-if="vadioSrc4" width="256" height="160" controls>
                <source :src="vadioSrc4" type="video/mp4" />
                <source :src="vadioSrc4" type="video/ogg" />
                <source :src="vadioSrc4" type="video/webm" />
                您的浏览器不支持Video标签。
              </video>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="spanText">1280px*800px</span>
            <div style="color: #77771f; margin-top: 20px;">
              只接收1280px*800px<br />的图片/视频
            </div>
          </div>
        </div>
      </div>
      <div style="padding-left: 140px; color: #77771f; margin-top: 20px;">
        <span> 1、可上传图片/视频 </span><br />
        <span> 2、图片只接收png,jpeg,jpg格式；视频只接收MP4格式 </span><br />
        <span> 3、图片/视频大小不超过5M </span><br />
        <span> 4、图片/视频尺寸只接收 1024*600或1280*800 </span><br />
        <span> 5、上传时,前后两个文件类型一致；列如:两个视频文件。 </span><br />
        <span> 6、两个文件同为视频时，请保持视频时长一致。 </span><br />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="matter_ImgClear">取 消</el-button>
        <el-button type="primary" :disabled="isAllow" @click="matterImgUpload"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as weapp from "@/apis/model/weapp.js";
import * as getFile from "@/utils/getfile.js";
import checkPermission from "@/utils/permission";

export default {
  name: "MediumActivity",
  components: {},

  data() {
    return {
      listLoading: true,
      getrouteAdmin: "",
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
      orderForm: {
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
        materiaUrl: { imageUrl: "", url: "" },
        materiaUrl2: [],
      },
      stateName: "",
      isShowDrawer: false,
      isShowStatus: false,
      isShowAllow: false,
      imgsetData: [],
      imgresaveData: [],
      isForKeep: 0,
      getType: "",
      getType1: "",
      getType2: "",
      getType3: "",

      matter_DialogVisible: false,
      activeVisible: true,
      imgSrc: "",
      vadioSrc: "",
      getFile: null,
      imgSrc1: "",
      vadioSrc1: "",
      getFile1: null,
      myType: null,

      imgSrc3: "",
      vadioSrc3: "",
      getFile3: null,
      imgSrc4: "",
      vadioSrc4: "",
      getFile4: null,

      vadioTime: null,
      vadioTime1: null,
      vadioTime3: null,
      vadioTime4: null,

      isAllow: false,

      fodder_ImgList: [],
      fodder_ImgIndex: null,
      fodder_ImgdialogVisible: false,
    };
  },
  computed: {},

  created() {
    this.fetchData();
    if (this.$route.params.status == 0 || this.$route.params.status == 10) {
      this.isShowStatus = true;
    }
    console.log(this.isShowStatus);
  },
  mounted() {},
  methods: {
    checkPermission,
    getMaterilsData() {
      weapp
        .getOrdersItem({
          orderId: this.$route.params.orderId,
        })
        .then((res) => {
          if (res.data.status) {
            this.orderForm = res.data.data;

            let stateInfo = this.statusList.filter((item) => {
              return item.value == this.orderForm.orderStat;
            });
            if (stateInfo.length > 0) this.stateName = stateInfo[0].name;
            if (this.orderForm.materiaUrl2?.length) {
              let rg = /.mp4/;
              this.getType2 = rg.test(this.orderForm.materiaUrl2[0])
                ? "mp4"
                : "img";
            }
            if (this.orderForm.materiaUrl?.length) {
              let rg2 = /.mp4/;
              this.getType = rg2.test(this.orderForm.materiaUrl[0])
                ? "mp4"
                : "img";
            }

            if (this.orderForm.orderStat == 10) {
              this.isShowAllow = true;
            } else {
              this.isShowAllow = false;
            }
            console.log(this.orderForm);
          }
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
    handleAvatarSuccess() {},
    order_setLimits(stat) {
      weapp
        .postSignUpAccount({
          account: this.orderForm.account,
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
    order_setImg(data) {
      this.imgsetData = data;
    },
    order_resaveImg(data) {
      // console.log(data);
      this.imgresaveData = data;
    },
    createdCenterList() {
      this.isShowDrawer = true;
      this.isForKeep = 0;
      this.orderForm.cake = [];
      this.orderForm.toy = [];
    },

    order_toLimits(row, postIsVerify) {
      console.log(row, postIsVerify);
      this.orderForm = row;
      this.$router.push({
        name: "privatecp_item",
        params: {
          orderId: row.orderId,
        },
      });
    },
    order_tosee(row, postIsVerify) {
      console.log(row, postIsVerify);
      this.isShowDrawer = true;
      this.orderForm = row;
    },
    order_setMeals(row, postIsVerify) {
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
    allow_toMeals(allow) {
      var self = this;
      var toSend = { ...this.orderForm };
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
        // if (parseInt(self.orderForm.canSubmit)) {
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
    uploadFiles(filr, type, index) {
      return new Promise(function (resolve, reject) {
        var resaveData = new FormData();
        resaveData.append("name", type + index);
        resaveData.append("type", type);
        resaveData.append("file", type + index);
        resaveData.append(type + index, filr.file);
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

    order_clearSetLimits() {
      this.getrouteAdmin = "";
    },
    changeFile(file, tap) {
      try {
        this.html5Reader(file, tap);
      } catch (error) {
        console.log(error);
      }
      return false;
    },
    html5Reader(file, step) {
      const reader = new FileReader();
      var that_ = this;
      reader.onload = (e) => {
        const isLt5M = file.size / 1024 / 1024 < 5;
        const isAllrowType = /video\/mp4|jpeg|png|jpg/i.test(file.type);
        if (!isAllrowType) {
          that_.$baseMessage(
            "请上传正确的文件类型（视频传MP4格式，图片传jpg/jpeg/png格式）",
            "error"
          );
          return false;
        }
        if (this.myType) {
          // vadioTime
          if (!this.myType.test(file.type) && !that_.getFile1) {
            that_.$baseMessage("请上传相同类型的文件", "info");
            return false;
          }
        }

        if (!isLt5M) {
          that_.$baseMessage("请上传5M以下的文件", "error");
          return false;
        } else {
          const img = new Image();
          img.src = e.target.result;
          img.onload = function () {
            // console.log("图片宽度", img.width);
            // console.log("图片高度", img.height);
            var inSize1 = img.width === 1024 && img.height === 600;
            var inSize2 = img.width === 1280 && img.height === 800;
            if (step === 1 && inSize1) {
              that_.getFile = file;
              that_.imgSrc = e.target.result;
            } else if (step === 3 && inSize1) {
              that_.getFile3 = file;
              that_.imgSrc3 = e.target.result;
            } else if (step === 2 && inSize2) {
              that_.getFile1 = file;
              that_.imgSrc1 = e.target.result;
            } else if (step === 4 && inSize2) {
              that_.getFile4 = file;
              that_.imgSrc4 = e.target.result;
            } else {
              that_.$baseMessage(
                "请上传正确的文件尺寸 1024*600或1280*800",
                "error"
              );
            }
          };
          if (/video/i.test(file.type)) {
            this.myType = /video/;
            var video = document.createElement("video");
            video.preload = "metadata";
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
              window.URL.revokeObjectURL(video.src);
              // console.log("视频宽度", video.videoWidth);
              // console.log("视频高度", video.videoHeight);
              // console.log("视频时长", video.duration);
              var inSize3 =
                video.videoWidth === 1024 && video.videoHeight === 600;
              var inSize4 =
                video.videoWidth === 1280 && video.videoHeight === 800;
              if (
                !(
                  Math.round(parseFloat(video.duration)) == 15 ||
                  Math.round(parseFloat(video.duration)) == 5
                )
              ) {
                var showmassage = `这个视频是${
                  Math.round(video.duration * 100) / 100
                } 秒..请上传15秒或5秒的视频`;
                that_.$baseMessage(showmassage, "warning");
                return false;
              }

              if (that_.vadioTime || that_.vadioTime1) {
                if (that_.vadioTime) {
                  if (
                    that_.vadioTime !== Math.round(parseFloat(video.duration))
                  ) {
                    that_.$baseMessage("请上传相同时长的视频", "info");
                    return false;
                  }
                }
                if (that_.vadioTime1) {
                  if (
                    that_.vadioTime1 !== Math.round(parseFloat(video.duration))
                  ) {
                    that_.$baseMessage("请上传相同时长的视频", "info");
                    return false;
                  }
                }
              }

              if (video.duration < 16) {
                if (step === 1 && inSize3) {
                  that_.getFile = file;
                  that_.vadioTime = Math.round(parseFloat(video.duration));
                  that_.vadioSrc = e.target.result;
                } else if (step === 3 && inSize3) {
                  that_.getFile3 = file;
                  that_.vadioTime3 = Math.round(parseFloat(video.duration));
                  that_.vadioSrc3 = e.target.result;
                } else if (step === 2 && inSize4) {
                  that_.getFile1 = file;
                  that_.vadioTime1 = Math.round(parseFloat(video.duration));
                  that_.vadioSrc1 = e.target.result;
                } else if (step === 4 && inSize4) {
                  that_.getFile4 = file;
                  that_.vadioTime4 = Math.round(parseFloat(video.duration));
                  that_.vadioSrc4 = e.target.result;
                } else {
                  that_.$baseMessage(
                    "请上传正确的文件尺寸 1024*600或1280*800",
                    "info"
                  );
                }
              } else {
                that_.$baseMessage("请上传时长小于15秒的视频", "error");
              }
            };
          } else {
            this.myType = /jpeg|png|jpg/;
          }
        }
      };
      reader.readAsDataURL(file);
    },
    goBack() {
      var form_url = sessionStorage.getItem("fromUrl");
      console.log(form_url);
      if (form_url === "/weapp/private-house") {
        this.$router.push({
          name: "config_h",
          params: {
            shows: true,
          },
        });
      } else {
        this.$router.push({
          path: form_url,
        });
      }
    },
    download(url, name) {
      try {
        var urs = `${window.location.origin}/sy/dowload?name=${name}`;
        console.log(urs);

        var aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.setAttribute("download", name);
        aLink.href = urs;
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
      } catch (error) {
        console.log(error);
      }
    },
    clearCenterDown(row) {
      console.log(this.orderForm.materiaUrl);
      console.log(this.orderForm.materiaUrl2);
      if (this.orderForm.materiaUrl2.toString("") != "") {
        this.orderForm.materiaUrl2.forEach((item, index) => {
          let name = item.split("/");
          if (name.length > 0) {
            name = name[name.length - 1];
            console.log(item.search(/https:\/\/privflow/) > -1);
            if (item.search(/https:\/\/privflow/) > -1) {
              // item.replace( )
              item = item.replace(/https:\/\/privflow/g, "https://ad");
            }
            console.log(item);
            // return false;
            this.download(item, name);
          }
        });
      } else {
        let item = this.orderForm.materiaUrl.url;
        let name = item.split("/");
        if (name.length > 0) {
          name = name[name.length - 1];
          console.log(item.search(/https:\/\/privflow/) > -1);
          if (item.search(/https:\/\/privflow/) > -1) {
            // item.replace( )
            item = item.replace(/https:\/\/privflow/g, "https://ad");
          }
          console.log(item);
          // return false;
          this.download(item, name);
        }
      }
    },
    clearCenterUp() {
      this.matter_DialogVisible = true;
    },
    matterImgUpload() {
      var self = this;
      // console.log(this.getFile);
      // console.log(this.getFile1);
      // console.log(this.getFile3);
      // console.log(this.getFile4);

      this.isAllow = true;
      setTimeout(() => {
        this.isAllow = false;
      }, 800);
      if (this.getFile && this.getFile1 && this.getFile3 && this.getFile4) {
        var longtime1 = Math.round(parseFloat(self.vadioTime1))
          ? Math.round(parseFloat(self.vadioTime1))
          : -1;
        var longtime2 = Math.round(parseFloat(self.vadioTime3))
          ? Math.round(parseFloat(self.vadioTime3))
          : -1;
        Promise.all([
          self.uploadMyFile(
            "resetMeals",
            self.$route.params.orderId,
            self.getFile,
            self.getFile1,
            longtime1
          ),
          self.uploadMyFile(
            "resetMeals2",
            self.$route.params.orderId,
            self.getFile3,
            self.getFile4,
            longtime2
          ),
        ])
          .then((res) => {
            console.log("upend", res);
            if (res.length > 1) {
              self.getMaterilsData();
              self.matter_ImgClear();
              self.$baseMessage("上传成功", "success");
            }
          })
          .catch((err) => {
            alert(err);
          });
      } else {
        this.$baseMessage("请写标题和上传4个文件", "info");
      }
    },
    uploadMyFile(path, orderId, file1, file2, long) {
      return new Promise(function (resolve, reject) {
        let form_upload = new FormData();

        form_upload.append("name", "file");
        form_upload.append("orderId", orderId);
        form_upload.append("file", file1);
        form_upload.append("file1", file2);
        form_upload.append("vadioTime", long);
        weapp[path](form_upload)
          .then((res) => {
            // console.log(res, "upoad");
            if (res.data.status) {
              resolve(res.data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    matter_ImgClear() {
      this.imgSrc = "";
      this.imgSrc1 = "";
      this.imgSrc3 = "";
      this.imgSrc4 = "";

      this.vadioSrc = "";
      this.vadioSrc1 = "";
      this.vadioSrc3 = "";
      this.vadioSrc4 = "";

      this.getFile = null;
      this.getFile1 = null;
      this.getFile3 = null;
      this.getFile4 = null;

      this.vadioTime = null;
      this.vadioTime1 = null;
      this.vadioTime3 = null;
      this.vadioTime4 = null;
      this.myType = null;

      this.matter_DialogVisible = false;
    },
  },
};
</script>

<style lang="scss">
.matterUpload {
  height: 98vh;
}

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
.orderFormSty {
  margin: 20px 0;
}
.orderFormImg {
  width: 160px;
  height: 80px;
  margin: 4px;
  border: 1px solid #ececec;
}
.cakeSty {
  width: 120px;
  height: 120px;
  margin: 4px;
  border: 1px solid #ececec;
  vertical-align: middle;
}
.matterUpload .el-dialog__body {
  height: 32rem;
}
.upload_file {
  display: inline-flex;
  text-align: center;
  justify-content: center;
  align-items: baseline;
  width: 100%;
}

.upload_file:last-child {
  margin-top: 3rem;
}

.upload_file .avatar-uploader {
  margin: 4px 24px;
  width: 256px;
  height: 56px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: #8c8787 solid 1px;
}
.upload_file .avatar-uploader1 {
  margin: 4px 24px;
  width: 204px;
  height: 56px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: #8c8787 solid 1px;
}
.active_dialog {
  width: 40%;
  margin: 2rem auto;
}
.spanText {
  color: #676363;
  font-size: 10px;
}
</style>
