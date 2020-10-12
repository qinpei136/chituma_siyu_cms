<template>
  <div class="table-container-init">
    <byui-query-form>
      <byui-query-form-left-panel :span="20">
        <div style="width: 80%; height: 2px;"></div>
      </byui-query-form-left-panel>
      <byui-query-form-right-panel :span="4">
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
              @click="welfareAdd"
              v-text="'添加公益广告'"
            >
            </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="welfare_List"
      style="min-height: 20vh;"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
        :index="indexMethod_"
      >
      </el-table-column>
      <el-table-column label="素材ID" prop="materialId" width="95">
      </el-table-column>
      <el-table-column prop="name" label="标题"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <div v-if="welfare_ImgType(scope.row.url[0])" class="openImg">
            <el-image
              :src="scope.row.url[0]"
              @click="welfare_OpenImg(scope.row, 0)"
            ></el-image>
            <el-image
              :src="scope.row.url[1]"
              @click="welfare_OpenImg(scope.row, 1)"
            ></el-image>
          </div>
          <div v-else class="openImg" @click="welfare_OpenImg(scope.row)">
            <!-- el-im "~@/assets/login_images/background3.jpg" src\assets\login_images\vedioSrc.jpg -->
            <img
              src="~@/assets/login_images/vedioSrc.jpg"
              style="width: 80px; height: 46px;"
            />
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column width="100" align="center" label="审核状态">
        <template slot-scope="scope">
          <el-popconfirm
            placement="top"
            cancel-button-text="不用"
            confirm-button-text="好的"
            cancel-button-type="primary"
            confirm-button-type="primary"
            title="这是一段内容确定删除吗？"
          >
            <el-button
              v-show="scope.row.stat != 1"
              slot="reference"
              @click="welfareShowS(scope.row)"
              >删除1</el-button
            >
            <el-button v-show="scope.row.stat == 1" slot="reference"
              >删除2</el-button
            >
          </el-popconfirm>
         <el-button
              slot="reference"
              @click="welfareShowS(scope.row.materialId)"
              >删除</el-button
            > 
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" prop="date"></el-table-column>
      <el-table-column label="操作" width="180px" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="welfare_Del(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="true"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="welfare_total"
      @current-change="welfarePageChange"
      @size-change="welfareSizeChange"
    ></el-pagination>
    <el-dialog
      title="上传"
      :visible.sync="centerDialogVisible"
      width="40%"
      center
    >
      <div>
        <el-form label-position="right" label-width="80px" style="width: 100%;">
          <el-form-item :label="parseInt(activeVisible) ? '公益广告' : '标题'">
            <el-input
              v-model="uploadFileName"
              placeholder="素材名称"
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
        <span> 5、上传时,前后两个文件类型一致；列如:两个视频文件。 </span><br />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="welfare_ImgClear">取 消</el-button>
        <el-button type="primary" @click="welfare_ImgUpload">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="图片"
      :visible.sync="fodder_ImgdialogVisible"
      width="60%"
      style="margin-top: -4rem;"
      :before-close="handleClose"
    >
      <div
        ref="imgShow"
        class="img_welfare_Show_"
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
  </div>
</template>

<script>
import { getList, doDelete } from "@/api/table";
import * as orders from "@/apis/model/orders.js"; // src\apis\model\orders.js

import checkPermission from "@/utils/permission";
const statusMap = {
  published: "success",
  draft: "gray",
  0: "待审核",
  1: "审核通过",
  2: "审核驳回",
  3: "danger",
};
export default {
  name: "WelfareActive",
  components: {},
  filters: {
    welfareFilter(status) {
      const statusMap_ = {
        0: "primary",
        1: "success",
        2: "danger",
        3: "danger",
      };
      return statusMap_[status];
    },
  },
  data() {
    return {
      welfareFilter_: statusMap,
      imgShow: true,
      visible: true,
      popoverId: "",
      welfare_InitList: [],
      welfare_mapList: [],
      welfare_List: [],

      listLoading: true,
      layout: "total, prev, pager, next, jumper", //  layout="prev, pager, next"
      welfare_total: 0,

      ordersTotal: 0,
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      background: true,
      centerDialogVisible: false,

      activeVisible: "1",
      selectRows: "",
      elementLoadingText: "正在加载...",
      orderStatusType: {
        0: "未付款",
        1: "进行中",
        2: "已付款",
      },
      welfareStatus: {
        0: "未审核",
        1: "审核通过",
        2: "使用中",
        3: "审核未通过",
      },
      uploadFileName: "",
      imgSrc: "",
      vadioSrc: "",
      getFile: null,
      imgSrc1: "",
      vadioSrc1: "",
      getFile1: null,
      getType: null,

      vadioTime: null,
      vadioTime1: null,

      fodder_ImgList: [],
      fodder_ImgIndex: null,
      fodder_ImgdialogVisible: false,
    };
  },
  created() {
    // if (this.$route.name !== "medium_welfare_active") {
    //   this.activeVisible = "1";
    // }

    this.welfare_fetchData();
  },
  mounted() {},
  methods: {
    checkPermission,
    welfare_fetchData() {
      try {
        orders
          .getMyMaterialList({
            type: this.activeVisible,
          })
          .then((res) => {
            if (res.data.status) {
              this.welfare_InitList = res.data.data;
              this.welfare_InitList = this.welfare_InitList.reverse();
              this.welfare_total = this.welfare_InitList.length;
              if (this.welfare_total > 0) {
                this.welfare_mapList = [...this.welfare_InitList];
                this.welfarePageChange(1);
              }
            }
            this.listLoading = false;
          });
      } catch (error) {
        console.log(error);
        this.listLoading = false;
      }
    },
    welfarePageChange(val) {
      this.queryForm.pageNo = val;
      this.welfare_List = this.welfare_mapList.slice((val - 1) * 20, val * 20);
    },
    indexMethod_(index) {
      return (this.queryForm.pageNo - 1) * 20 + index + 1;
    },
    welfareShowS(row) {
      console.log(row.materialId);
      console.log(row);

      // const values = `popover-${index}`;popconfirm_
      // console.log(values);

      // this.$refs[values].doClose();
      // this.$refs[values].style.display = "none";
      // console.log(this.$refs[`popover-${index}`]);
    },
    welfareSizeChange(val) {
      this.queryForm.pageSize = 1;
      this.welfare_fetchData();
    },
    welfare_ImgClear() {
      this.imgSrc = "";
      this.imgSrc1 = "";
      this.uploadFileName = "";
      this.vadioSrc = "";
      this.vadioSrc1 = "";
      this.getFile = null;
      this.getFile1 = null;
      this.getType = null;

      this.vadioTime = null;
      this.vadioTime1 = null;

      this.centerDialogVisible = false;
    },
    welfare_ImgUpload() {
      if (this.getFile && this.getFile1 && this.uploadFileName) {
        var form_upload = new FormData();
        this.centerDialogVisible = false;
        form_upload.append("name", this.uploadFileName);
        form_upload.append("type", this.activeVisible);
        form_upload.append("file", this.getFile);
        form_upload.append("file1", this.getFile1);
        form_upload.append(
          "vadioTime",
          this.vadioTime1 ? parseInt(this.vadioTime1) : -1
        );
        orders
          .postMaterials(form_upload)
          .then((res) => {
            // console.log(res, "upoad");
            if (res.data.status) {
              this.$baseMessage("上传成功", "success");
              this.welfare_ImgClear(); //清除
              this.welfare_fetchData();
            } else {
              this.getType = null;
              this.$baseMessage("上传失败", "error");
            }
          })
          .catch((error) => {
            this.getType = null;
            this.welfare_ImgClear(); //清除
            this.$baseMessage("上传失败", "error");
            // console.log(error, "上传");
          });
      } else {
        this.$baseMessage("请写标题和上传2个文件", "info");
      }
    },

    welfareAdd() {
      this.centerDialogVisible = true;
    },
    handleClose(done) {
      done();
    },
    welfare_OpenImg(val, imgIndex) {
      if (val.url) {
        var rg1 = /jpeg|jpg|png/;
        if (!rg1.test(val.url[0])) {
          this.$alert(
            `<div style="display:inline-block;"><video width="204.8" height="120" style=" margin: 0 8px;" controls><source  src="${val.url[0]}" type="video/mp4" /></video><video width="256" height="160" controls><source  src="${val.url[1]}" type="video/mp4" /></video></div>`,
            "视频预览",
            {
              dangerouslyUseHTMLString: true,
              customClass: "openImgs",
            }
          );
        } else {
          // this.$alert(
          //   `<div style="display:inline-block;width:204.8px; height:120px; background: url(${val.url[0]}) no-repeat;background-size: cover;"></div><div style="display:inline-block;width:256px; height:160px; background: url(${val.url[1]}) no-repeat;background-size: cover;"></div>`,
          //   "图片预览",
          //   {
          //     dangerouslyUseHTMLString: true,
          //     customClass: "openImgs",
          //   }
          // );
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
    welfare_ImgType(fileType) {
      const isAllrowTypes = /jpeg|png|jpg/i.test(fileType);
      return isAllrowTypes;
    },
    changeFile(file, tap) {
      // console.log(file, tap);
      try {
        this.welfare_h5Reader(file, tap);
      } catch (error) {
        console.log(error);
      }
      return false;
    },
    welfare_h5Reader(file, step) {
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
        if (this.getType) {
          if (!this.getType.test(file.type) && !that_.getFile1) {
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
                "info"
              );
            }
          };
          if (/video/i.test(file.type)) {
            this.getType = /video/;
            var video = document.createElement("video");
            video.preload = "metadata";
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
              window.URL.revokeObjectURL(video.src);
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
                }秒..请上传15秒或5秒的视频`;
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
            this.getType = /jpeg|png|jpg/;
          }
        }
      };
      reader.readAsDataURL(file);
    },
    handleAvatarSuccess() {},
    welfare_Del(row) {
      if (row.materialId) {
        this.$baseConfirm("你确定要删除当前项吗", null, () => {
          orders
            .getMyMaterialDelete({ materialId: row.materialId })
            .then((res) => {
              // this.$baseMessage(res.msg, "success");
              // console.log(res, "deleted");
              // this.fetchData();
              this.$baseMessage("删除成功", "success");
              this.welfare_fetchData();
            });
        });
      } else {
        this.$baseMessage("未删除", "info");
      }
    },
  },
};
</script>
<style lang="scss">
.table-container-init {
  .openImg {
    div {
      margin: 0 8px;
    }
    video {
      margin: 0 3px;
    }
  }
}
.openImgs {
  p div {
    margin: 0 10px;
  }
}
.uploaderAll {
  > div {
    display: inline-block;
    width: 40%;
    margin: 0 24px;
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
<style>
.openImgs {
  width: 40vw;
  text-align: center;
}
.openImgs p div {
  margin: 0 10px;
}
.img_welfare_Show_ {
  display: inline-block;
  width: 768px;
  height: 450px;
  background-size: cover;
}
</style>
