<template>
  <div class="table-container">
    <el-card shadow="never">
      <div slot="header">
        <span>已选择设备订单</span>
      </div>

      <byui-query-form>
        <byui-query-form-left-panel>
          <div style="width: 100%; height: 20px;"></div>
        </byui-query-form-left-panel>
        <byui-query-form-right-panel>
          <el-form ref="form" :inline="true" @submit.native.prevent>
            <el-form-item>
              <el-button
                icon="el-icon-plus"
                type="primary"
                @click="ordersListAdd"
                >创建新订单
              </el-button>
            </el-form-item>
          </el-form>
        </byui-query-form-right-panel>
      </byui-query-form>

      <el-table
        ref="tableSort"
        v-loading="listLoading"
        :data="ordersList"
        :element-loading-text="elementLoadingText"
        style="min-height: 20vh;"
      >
        <el-table-column label="设备序号" prop="orderId"> </el-table-column>
        <el-table-column label="订单名称" prop="orderName"></el-table-column>
        <el-table-column label="创建时间" prop="orderTime"></el-table-column>
        <el-table-column
          label="设备数量"
          prop="devicesAmount"
        ></el-table-column>
        <!-- <el-table-column label="素材状态" prop="materialStat">
          <template slot-scope="scope">
            {{ materialType[scope.row.materialStat] }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="orderStat">
          <template slot-scope="scope">
            {{ orderStatusType[scope.row.orderStat] }}
          </template>
        </el-table-column> -->

        <el-table-column label="状态" prop="orderStat">
          <template slot-scope="scope">
            <el-tag :type="scope.row.orderStat == 1 ? 'warning' : 'info'">
              {{ scope.row.orderStat == 1 ? "使用中" : "未使用" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="ordersListEdit(scope.row)"
              >编辑
            </el-button> -->
            <el-button type="text" @click="orders_ListDel(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <byui-query-form-bottom-panel>
        <el-row type="flex" justify="space-around" align="bottom">
          <el-col :span="18">
            <el-pagination
              :background="background"
              :page-size="20"
              :layout="layout"
              :total="ordersTotal"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </el-col>
        </el-row>
      </byui-query-form-bottom-panel>
    </el-card>
    <el-card shadow="never">
      <div slot="header">
        <span>已上传素材</span>
      </div>
      <byui-query-form>
        <byui-query-form-left-panel>
          <div style="width: 80%; height: 2px;"></div>
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
                @click="materialsListAdd"
                >添加素材
              </el-button>
            </el-form-item>
          </el-form>
        </byui-query-form-right-panel>
      </byui-query-form>

      <el-table
        ref="tableSort"
        v-loading="listLoading"
        :data="materialsListInit"
        style="min-height: 20vh;"
        :element-loading-text="elementLoadingText"
      >
        <el-table-column label="素材ID" prop="materialId" width="95">
        </el-table-column>
        <el-table-column prop="name" label="标题"></el-table-column>
        <!-- <el-table-column label="图片">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.url[0]"
              @click="materilsopenImg(scope.row)"
            ></el-image>
          </template>
        </el-table-column> -->
        <el-table-column label="图片">
          <template slot-scope="scope">
            <div v-if="fodder_getType(scope.row.url[0])" class="openImg">
              <el-image
                :src="scope.row.url[0]"
                @click="fodder_OpenImg(scope.row, 0)"
              ></el-image>
              <el-image
                :src="scope.row.url[1]"
                @click="fodder_OpenImg(scope.row, 1)"
              ></el-image>
            </div>
            <div v-else class="openImg" @click="fodder_OpenImg(scope.row)">
              <img
                src="~@/assets/login_images/vedioSrc.jpg"
                style="width: 80px; height: 46px;"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="素材状态">
          <template slot-scope="scope">
            <el-tooltip
              :content="
                parseInt(scope.row.stat) === 3
                  ? scope.row.remark
                  : materialsStatus[scope.row.stat]
              "
              class="item"
              effect="dark"
              placement="top-start"
            >
              <el-tag :type="scope.row.stat | statusFilter">
                {{ materialsStatus[scope.row.stat] }}</el-tag
              >
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="date" width="200"></el-table-column>
        <el-table-column label="操作" width="180px" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="handleEdit(scope.row)"
            >编辑
          </el-button> -->
            <el-button type="text" @click="materialsListDelete(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="图片"
        :visible.sync="fodder_ImgdialogVisible"
        width="60%"
        style="margin-top: -4rem;"
        :before-close="handleClose"
      >
        <div
          ref="imgShow"
          class="imgShow_"
          :style="`background: url(${fodder_ImgList[fodder_ImgIndex]})  center center / 100% 100% no-repeat; `"
        ></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fodder_ImgdialogVisible = false">关闭</el-button>
          <el-button
            type="primary"
            @click="
              () => {
                fodder_ImgIndex === 0
                  ? (fodder_ImgIndex = 1)
                  : (fodder_ImgIndex = 0);
              }
            "
            v-text="fodder_ImgIndex === 0 ? '第二张' : '第一张'"
          >
          </el-button>
        </span>
      </el-dialog>
      <!-- <el-dialog
        title="上传"
        :visible.sync="centerDialogVisible"
        width="40%"
        center
      >
        <div>
          <el-form
            label-position="right"
            label-width="80px"
            style="width: 100%;"
          >
            <el-form-item label="标题">
              <el-input
                v-model="uploadFileName"
                placeholder="素材名称"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-upload
            id="uploader"
            class="avatar-uploader"
            action=""
            :multiple="false"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="changeFile"
            @abort="true"
          >
            <img v-if="imgSrc" :src="imgSrc" height="200px" class="avatar" />
            <img v-else-if="imgSrc" :src="imgSrc" height="200px" class="avatar" />
            <video v-else-if="vadioSrc" width="320" height="240" controls>
              <source :src="vadioSrc" type="video/mp4" />
              <source :src="vadioSrc" type="video/ogg" />
              <source :src="vadioSrc" type="video/webm" />
              您的浏览器不支持Video标签。
            </video>
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div style="padding-left: 140px; color: #77771f; margin-top: 20px;">
          <span> 1、可上传图片/视频 </span><br />
          <span> 2、图片只接收png,jpeg,jpg格式；视频只接收MP4格式 </span><br />
          <span> 3、图片/视频大小不超过5M </span>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="clearCenterDialog">取 消</el-button>
          <el-button type="primary" @click="MaterialListImgUpload"
            >确 定</el-button
          >
        </span>
      </el-dialog> -->
      <el-dialog
        title="上传资源"
        :visible.sync="matter_DialogVisible"
        width="40%"
        center
      >
        <div>
          <el-form
            label-position="right"
            label-width="80px"
            style="width: 100%;"
          >
            <el-form-item label=" 标题">
              <el-input
                v-model="uploadFileName"
                placeholder="请输入标题"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="uploaderAll">
            <div>
              <el-upload
                id="uploader"
                class="avatar-uploader"
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
                <img
                  v-if="imgSrc"
                  :src="imgSrc"
                  width="204.8px"
                  class="avatar"
                />
                <!-- <img v-else-if="imgSrc" :src="imgSrc" height="200px" class="avatar" /> -->
                <video v-else-if="vadioSrc" width="204.8" controls>
                  <source :src="vadioSrc" type="video/mp4" />
                  <source :src="vadioSrc" type="video/ogg" />
                  <source :src="vadioSrc" type="video/webm" />
                  您的浏览器不支持Video标签。
                </video>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="color: #77771f; margin-top: 20px;"
                >只接收1024px*600px<br />的图片和视频</span
              >
            </div>
            <div>
              <el-upload
                id="uploader1"
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
                <img
                  v-if="imgSrc1"
                  :src="imgSrc1"
                  width="256px"
                  class="avatar"
                />
                <!-- <img v-else-if="imgSrc" :src="imgSrc" height="200px" class="avatar" /> -->
                <video v-else-if="vadioSrc1" width="256" height="160" controls>
                  <source :src="vadioSrc1" type="video/mp4" />
                  <source :src="vadioSrc1" type="video/ogg" />
                  <source :src="vadioSrc1" type="video/webm" />
                  您的浏览器不支持Video标签。
                </video>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="color: #77771f; margin-top: 20px;"
                >只接收1280px*800px<br />的图片/视频</span
              >
            </div>
          </div>
        </div>
        <div style="padding-left: 140px; color: #77771f; margin-top: 20px;">
          <span> 1、可上传图片/视频 </span><br />
          <span> 2、图片只接收png,jpeg,jpg格式；视频只接收MP4格式 </span><br />
          <span> 3、图片/视频大小不超过5M </span><br />
          <span> 4、图片/视频尺寸只接收 1024*600或1280*800 </span><br />
          <span> 5、上传时,前后两个文件类型一致；列如:两个视频文件。 </span
          ><br />
          <span> 6、两个文件同为视频时，请保持视频时长一致。 </span><br />
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="matter_ImgClear">取 消</el-button>
          <el-button
            type="primary"
            :disabled="isAllow"
            @click="MaterialListImgUpload"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-pagination
        :background="true"
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="materialsCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getList, doDelete } from "@/api/table";
import * as orders from "@/apis/model/orders.js"; // src\apis\model\orders.js
export default {
  name: "ComprehensiveTable",
  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        3: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      imgShow: true,
      list: [],
      ordersList: [],
      materialsListInit: [],
      materialsList: [],
      initOrdersData: [],
      initMaterialsData: [],
      materialsSelect: [],
      materialIdSelect: [],
      listLoading: true,
      layout: "total, prev, pager, next, jumper", //  layout="prev, pager, next"
      total: 0,
      ordersTotal: 0,
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      background: true,
      selectRows: "",
      elementLoadingText: "正在加载...",
      materialType: {
        0: "未上传",
        1: "已上传",
      },
      orderStatusType: {
        0: "未付款",
        1: "进行中",
        2: "已付款",
      },
      materialsStatus: {
        0: "未审核",
        1: "审核通过",
        2: "使用中",
        3: "审核未通过",
      },
      materialsActiveStatus: {
        0: "未投放",
        1: "已投放",
        2: "使用中",
        3: "已结束",
        4: "已过期",
      },

      fodder_ImgList: [],
      fodder_ImgIndex: null,
      fodder_ImgdialogVisible: false,

      matter_DialogVisible: false,
      activeVisible: 0,
      uploadFileName: "",
      imgSrc: "",
      vadioSrc: "",
      getFile: null,
      imgSrc1: "",
      vadioSrc1: "",
      getFile1: null,
      myType: null,

      vadioTime: null,
      vadioTime1: null,
      isAllow: false,
    };
  },
  created() {
    this.getMaterilsData();
  },
  mounted() {},
  methods: {
    getMaterilsData() {
      try {
        orders.getOrdersDevice({}).then((res) => {
          if (res.data.status) {
            // console.log(res, "获取数据");
            this.initOrdersData = res.data.data;
            this.ordersTotal = this.initOrdersData.length;
            if (this.ordersTotal > 0) {
              this.ordersList = this.initOrdersData.slice(0, 20);
            }
          }
        });
        orders.getMyMaterialList({ type: 0 }).then((res) => {
          if (res.data.status) {
            console.log(res);
            this.materialsList = res.data.data;
            this.materialsListInit = this.materialsList.slice(0, 20);

            this.total = res.data.data.length;
          }
          this.listLoading = false;
        });
      } catch (error) {
        console.log(error);
        this.listLoading = false;
      }
    },
    handleCurrentChange(val) {
      this.ordersList = this.initOrdersData.slice((val - 1) * 20, val * 20);
    },
    materialsCurrentChange(val) {
      this.materialsListInit = this.materialsList.slice(
        (val - 1) * 20,
        val * 20
      );
    },
    ordersListAdd() {
      this.$router.replace({ path: "/byui/medium-orders-create" });
      // this.$baseMessage("确认新增订单吗", "success");
    },
    ordersListEdit(row) {
      console.log(row, "编辑");
    },
    ordersListDelete(row) {
      console.log(row, "删除");
    },
    handleClose(done) {
      done();
    },
    fodder_getType(fileType) {
      const isAllrowTypes = /jpeg|png|jpg/i.test(fileType);
      return isAllrowTypes;
    },
    fodder_OpenImg(val, imgIndex) {
      if (val.url) {
        var rg1 = /jpeg|jpg|png/;
        if (!rg1.test(val.url[0])) {
          this.$alert(
            `<div style="display:inline-block;"><video width="204.8" height="120" style=" margin: 0 8px;" controls><source  src="${val.url[0]}" type="video/mp4" /></video><video width="256" height="160" controls><source  src="${val.url[1]}" type="video/mp4" /></video></div>`,
            "视频预览",
            {
              dangerouslyUseHTMLString: true,
              customClass: "openImgsAudit",
            }
          );
        } else {
          this.fodder_ImgList = val.url;
          this.fodder_ImgIndex = imgIndex;
          this.fodder_ImgdialogVisible = true;
        }
      } else {
        this.$message({
          type: "info",
          message: "没有图片",
        });
      }
    },
    orders_ListDel(row) {
      if (parseInt(row.orderStat) === 1) {
        this.$baseMessage("正在使用中，不可删除", "warning");
        return false;
      }
      this.$baseConfirm("你确定要删除当前项吗", null, () => {
        orders
          .delMyMaterialDelete({
            orderId: row["orderId"],
          })
          .then((res) => {
            // console.log(res);
            this.$baseMessage("删除成功", "success");
            this.getMaterilsData();
          });
      });
    },
    materialsListAdd() {
      this.matter_DialogVisible = true;
    },
    // changeFile(file) {
    //   try {
    //     this.html5Reader(file);
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   return false;
    // },
    // html5Reader(file) {
    //   const reader = new FileReader();
    //   var that_ = this;
    //   reader.onload = (e) => {
    //     const isLt5M = file.size / 1024 / 1024 < 5;
    //     const isAllrowType = /video\/mp4|jpeg|png|jpg/i.test(file.type);
    //     if (!isAllrowType) {
    //       that_.$baseMessage(
    //         "请上传正确的文件类型（视频传MP4格式，图片传jpg/jpeg/png格式）",
    //         "error"
    //       );
    //       return false;
    //     }
    //     if (!isLt5M) {
    //       that_.$baseMessage("请上传5M以下的文件", "error");
    //       return false;
    //     } else {
    //       const img = new Image();
    //       img.src = e.target.result;
    //       img.onload = function () {
    //         // this.$set(item, "src", e.target.result);
    //         /*   获取当前图片信息及宽、高-开始 */
    //         console.log("图片宽度", img.width);
    //         console.log("图片高度", img.height);
    //         var inSize1 = img.width === 1024 && img.height === 600;
    //         var inSize2 = img.width === 1280 && img.height === 800;
    //         if (inSize1 || inSize2) {
    //           that_.getFile = file;
    //           that_.imgSrc = e.target.result;
    //         } else {
    //           that_.$baseMessage(
    //             "请上传正确的文件尺寸 1024*600或1280*800",
    //             "error"
    //           );
    //         }
    //       };
    //       if (/video/i.test(file.type)) {
    //         var video = document.createElement("video");
    //         video.preload = "metadata";
    //         video.src = URL.createObjectURL(file);
    //         video.onloadedmetadata = () => {
    //           window.URL.revokeObjectURL(video.src);
    //           console.log("视频宽度", video.videoWidth);
    //           console.log("视频高度", video.videoHeight);
    //           console.log("视频时长", video.duration);
    //           var inSize3 =
    //             video.videoWidth === 1024 && video.videoHeight === 600;
    //           var inSize4 =
    //             video.videoWidth === 1280 && video.videoHeight === 800;
    //           if (inSize3 || inSize4) {
    //             if (video.duration < 16) {
    //               that_.getFile = file;
    //               that_.vadioSrc = e.target.result;
    //             } else {
    //               that_.$baseMessage("请上传时长小于15秒的视频", "error");
    //             }
    //           } else {
    //             that_.$baseMessage(
    //               "请上传正确的文件尺寸 1024*600或1280*800",
    //               "error"
    //             );
    //           }
    //         };
    //       }
    //     }
    //   };
    //   reader.readAsDataURL(file);
    // },
    changeFile(file, tap) {
      // console.log(file, tap);

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
            // this.$set(item, "src", e.target.result);
            /*   获取当前图片信息及宽、高-开始 */
            // console.log("图片宽度", img.width);
            // console.log("图片高度", img.height);
            var inSize1 = img.width === 1024 && img.height === 600;
            var inSize2 = img.width === 1280 && img.height === 800;
            if (step === 1 && inSize1) {
              that_.getFile = file;
              that_.imgSrc = e.target.result;
            } else if (step === 2 && inSize2) {
              that_.getFile1 = file;
              that_.imgSrc1 = e.target.result;
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
              // console.log(video.duration);
              // console.log(that_.vadioTime);
              // console.log(that_.vadioTime1);
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
                } else if (step === 2 && inSize4) {
                  that_.getFile1 = file;
                  that_.vadioTime1 = Math.round(parseFloat(video.duration));
                  that_.vadioSrc1 = e.target.result;
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
    clearCenterDialog() {
      this.imgSrc = "";
      this.uploadFileName = "";
      this.vadioSrc = "";
      this.getFile = null;
      this.matter_DialogVisible = false;
    },
    matter_ImgClear() {
      this.imgSrc = "";
      this.imgSrc1 = "";
      this.uploadFileName = "";
      this.vadioSrc = "";
      this.vadioSrc1 = "";
      this.getFile = null;
      this.getFile1 = null;
      this.vadioTime = null;
      this.vadioTime1 = null;
      this.myType = null;

      this.matter_DialogVisible = false;
    },
    MaterialListImgUpload() {
      this.isAllow = true;
      setTimeout(() => {
        this.isAllow = false;
      }, 800);
      if (this.getFile && this.getFile1 && this.uploadFileName) {
        var form_upload = new FormData();
        this.matter_DialogVisible = false;
        form_upload.append("name", this.uploadFileName);
        form_upload.append("type", this.activeVisible);
        form_upload.append("file", this.getFile);
        form_upload.append("file1", this.getFile1);
        form_upload.append(
          "vadioTime",
          this.vadioTime1 ? Math.round(parseFloat(this.vadioTime1)) : -1
        );
        //  (form_upload)
        orders
          .postMaterials(form_upload)
          .then((res) => {
            // console.log(res, "upoad");
            if (res.data.status) {
              this.$baseMessage("上传成功", "success");
              this.matter_ImgClear(); //清除
              this.getMaterilsData();
            } else {
              this.myType = null;
              this.$baseMessage("上传失败", "error");
            }
          })
          .catch((error) => {
            this.myType = null;
            this.matter_ImgClear(); //清除
            this.$baseMessage("上传失败", "error");
            // console.log(error, "上传");
          });
      } else {
        this.$baseMessage("请写标题和上传2个文件", "info");
      }
      // if (this.getFile) {
      //   var form_upload = new FormData();
      //   form_upload.append("name", this.uploadFileName);
      //   form_upload.append("file", this.getFile);
      //   orders
      //     .postMaterials(form_upload)
      //     .then((res) => {
      //       // console.log(res, "upoad");
      //       if (res.data.status) {
      //         this.$baseMessage("上传成功", "success");
      //         this.clearCenterDialog(); //清除
      //         this.getMaterilsData();
      //       } else {
      //         this.$baseMessage("上传失败", "error");
      //       }
      //     })
      //     .catch((error) => {
      //       this.$baseMessage("上传失败", "error");
      //       console.log(error, "上传");
      //     });
      // } else {
      //   this.$baseMessage("请上传文件", "info");
      // }
    },
    materialsListDelete(row) {
      if (parseInt(row.stat) === 2) {
        this.$baseMessage("正在使用中，不可删除", "warning");
        return false;
      }
      if (row.materialId) {
        this.$baseConfirm("你确定要删除当前项吗", null, () => {
          orders
            .getMyMaterialDelete({ materialId: row.materialId })
            .then((res) => {
              // this.$baseMessage(res.msg, "success");
              console.log(res, "deleted");
              // this.fetchData();
              this.$baseMessage("删除成功", "success");
              this.getMaterilsData();
            });
        });
      } else {
        this.$baseMessage("未删除", "info");
      }
    },
    materilsopenImg(val) {
      if (val.url) {
        this.$alert(
          '<div style="display:inline-block; height:40vh;"><img src="' +
            val.url +
            '" alt="" srcset="" style=" height: 100%;max-width: 100%;">' +
            "</div>",
          "图片样式",
          {
            dangerouslyUseHTMLString: true,
          }
        );
      } else {
        this.$message({
          type: "info",
          message: "没有图片",
        });
      }
    },
    handleAvatarSuccess() {},
    handleSizeChange(val) {
      this.queryForm.pageSize = 1;
      this.getMaterilsData();
    },
  },
};
</script>
<style lang="scss">
.showForm {
  display: inline-block;
  vertical-align: middle;
  position: relative;
  margin: 0 auto;
  text-align: center;
  width: 100%;
  img {
    display: inline-block;
    max-height: 100px;
    margin: 0 auto;
    vertical-align: middle;
  }
  .filebutton {
    position: relative;
    display: inline-block;
    margin: 0 auto;
    overflow: hidden;
  }
  .filebutton input {
    position: absolute;
    top: 0;
    opacity: 0;
    font-size: 100px;
  }
  .filebutton div {
    font-size: 25px;
    background: #009dff;
    border-radius: 8px;
    color: white;
    padding: 10px 15px;
  }
}
.showForm:after {
  content: "";
  display: inline-block;
  width: 0;
  height: 100%;
  vertical-align: middle;
}
.avatar-uploader {
  text-align: center;
}
#uploader {
  margin: 0 auto;
  padding: 0;
  i {
    width: 24rem !important;
    height: 50px !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
  }
}
.imgShow_ {
  display: inline-block;
  width: 768px;
  height: 450px;
  background-size: cover;
}

.uploaderAll {
  display: inline-flex;
  text-align: center;
  align-items: baseline;
}
.uploaderAll .avatar-uploader {
  width: 256px;
  height: 56px;
}
.uploaderAll {
  > div {
    display: inline-block;
    width: 40%;
    margin: 8px 24px;
    text-align: center;
    #uploader {
      border: 1px dashed #009dff;
      min-height: 60px;
    }
    #uploader1 {
      border: 1px dashed #009dff;
      min-height: 60px;
    }
    i {
      width: 100% !important;
      height: 48px;
      text-align: center;
      max-height: 128px;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
    }
  }
}
.uploaderAll:first {
  > div {
    width: 40%;
    i {
      height: 60px;
      max-height: 120px;
    }
  }
  > div:first {
    background-color: #009dff;
  }
}
</style>
