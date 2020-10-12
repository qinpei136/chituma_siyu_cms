<template>
  <div>
    <div v-if="!onOff" class="initBox clearFix">
      <!-- 单张图片展示 -->
      <div
        v-if="ifOnePic && picPath"
        class="uploadLogo"
        :style="{ width: 60 * aspectRatio + 'px' }"
      >
        <img :src="picPath" alt @click="showCropedImage_(-1)" />
        <span v-if="returnPicPath" class="close" @click="delPic()"></span>
      </div>
      <!-- 多张图片展示 -->
      <ul v-if="!ifOnePic" :class="{ clearFix: picPath.length }">
        <li
          v-for="(item, index) in picPath"
          :key="index"
          class="uploadpics fl"
          :style="{ width: 87.5 * aspectRatio + 'px' }"
        >
          <div v-if="index > count - 1 ? false : true">
            <img :src="item" alt @click="showCropedImage_(index)" />
            <span class="close" @click="delPic(index)"></span>
          </div>
        </li>
      </ul>
      <!-- 点击图片放大 -->
      <el-image v-model="option.showCropedImage" :footer-hide="true">
        <p slot="header">图片预览</p>
        <img
          v-if="ifOnePic && option.showCropedImage"
          :src="picPath"
          alt
          style="width: 100%;"
        />
        <img
          v-if="!ifOnePic && option.showCropedImage"
          :src="baseUrl + cropedImage"
          alt
          style="width: 100%;"
        />
      </el-image>
      <span class="btn" :class="{ disabled: disabled }" @click="uploadPic"
        >上传</span
      >
      <p class="textTitle">{{ describe }}</p>
      <p class="textTitle red">{{ note }}</p>
    </div>
    <div v-if="onOff">
      <div class="shadeBox"></div>
      <Card style="width: 700px; height: 471px;" class="uploadPic">
        <div class="head">
          <p class="title">上传图片</p>
          <span class="close" @click="_closeShade"></span>
        </div>
        <div class="content">
          <div class="contentTop clearFix">
            <input
              id="fileinput"
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/bmp"
              class="fileinput"
              style="display: none;"
              @change="handleChange"
            />
            <label class="filelabel fl" for="fileinput">&nbsp;选择图片</label>
          </div>
          <div class="contentCenter clearFix">
            <!-- 裁剪框 -->
            <div class="left fl">
              <div class="cropper">
                <img ref="cropimg" alt />
              </div>
            </div>
            <!-- 预览 -->
            <div
              class="right fr"
              :style="{ height: 150 / aspectRatio + 2 + 'px' }"
            >
              <div
                id="preview"
                :style="{ height: 150 / aspectRatio + 'px' }"
              ></div>
            </div>
          </div>
          <div class="contentBottom clearFix">
            <div class="left fl">
              <el-tooltip content="向左旋转" placement="bottom">
                <span class="btn turnLeft" @click="handleturnLeft"></span>
              </el-tooltip>
              <el-tooltip content="向右旋转" placement="bottom">
                <span class="btn turnRight" @click="handleTurnRight"></span>
              </el-tooltip>
              <el-tooltip content="放大" placement="bottom">
                <span class="btn bigger" @click="handleBigger"></span>
              </el-tooltip>
              <el-tooltip content="缩小" placement="bottom">
                <span class="btn smaller" @click="handleSmaller"></span>
              </el-tooltip>
              <el-tooltip content="重置" placement="bottom">
                <span class="btn reset" @click="handleReset"></span>
              </el-tooltip>
            </div>
            <div class="right fr">
              <span class="btn" @click="ok">确认</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
/**
 * 说明：
 *      1.组件支持单张和多张图片上传
 *      2.上传单张图片时，picPath及returnPicPath为String类型
 *      3.上传多张图片时，picPath及returnPicPath为Array类型
 * 参数：
 *      @prarm ifOnePic 是否上传一张图片 默认true
 *      @prarm picPath  当前图片路径数组
 *      @prarm describe  描述
 *      @prarm note  注
 *      @prarm count  控制图片数量  默认6张
 *      @prarm aspectRatio 裁剪框比例 默认比例1/1
 *      @prarm disabled 控制上传按钮是否可以点击 默认false
 *      @prarm picSize 控制上传图片的大小 默认1M
 */
import Cropper from "cropperjs";
// import "@/css/cropper.min.css";
import "cropperjs/dist/cropper.min.css";

export default {
  name: "ToKeep",
  props: {
    ifOnePic: {
      type: Boolean,
      default: true,
    },
    picPath: [String, Array],
    // picPath: {
    //   validator: function (value) {
    //     if (typeof value === 'string') {
    //       return true
    //     } else if (value instanceof Array) {
    //       if (value.length === 1 && value[0] === '') {
    //         return false
    //       }
    //       return true
    //     } else {
    //       return false
    //     }
    //   }
    // },
    describe: {
      type: String,
      default: "仅支持JPG、JPEG、PNG、BMP格式，文件小于10M",
    },
    note: {
      type: String,
      default: "",
    },
    count: {
      type: Number,
      default: 6,
    },
    aspectRatio: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    picSize: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      onOff: false,
      returnPicPath: [],
      cropper: {},
      cropedImage: "",
      option: {
        showCropedImage: false,
      },
      imgData: {
        accept: "image/jpeg, image/png, image/jpg, image/bmp",
      },
    };
  },
  computed: {
    baseUrl() {
      return this.$store.state.TrackerUrl;
    },
  },
  watch: {
    returnPicPath: function () {
      this.picPath = this.returnPicPath;
    },
  },
  created() {},
  mounted() {},
  methods: {
    getCropper() {
      let img = this.$refs.cropimg;
      this.cropper = new Cropper(img, {
        aspectRatio: this.aspectRatio, // 裁剪框的宽高比
        dragMode: "move", // 定义cropper的拖拽模式
        preview: "#preview", // 添加额外的元素(容器)以供预览
        restore: false, // 在调整窗口大小后恢复裁剪的区域
        center: false, // 裁剪框在图片正中心
        highlight: false, // 在裁剪框上方显示白色的区域(突出裁剪框)
        cropBoxMovable: true, // 是否通过拖拽来移动剪裁框
        toggleDragModeOnDblclick: false, // 当点击两次时可以在“crop”和“move”之间切换拖拽模式
      });
    },
    handleChange(e) {
      let file = e.target.files[0];
      console.log(file);
      let type = file.type;
      let size = file.size;
      console.log("size", size);
      if (type === "" || this.imgData.accept.indexOf(type) === -1) {
        this.$Message.error("请选择我们支持的图片格式！");
        // 关闭弹层
        this._closeShade();
        return false;
      }
      if (!this.ifOnePic) {
        if (this.returnPicPath.length >= this.count) {
          this.$Message.error("最多上传" + this.count + "张！");
          // 关闭弹层
          this._closeShade();
          return false;
        }
      }
      if (size > this.picSize * 1048576) {
        this.$Message.error("请选择" + this.picSize + "M以内的图片！");
        return false;
      }
      let reader = new FileReader();
      reader.onload = () => {
        this.cropper.replace(reader.result);
        reader.onload = null;
      };
      reader.readAsDataURL(file);
    },
    uploadPic() {
      if (this.disabled) {
        return;
      }
      if (!this.ifOnePic) {
        if (this.picPath.length >= this.count) {
          this.$Message.error("最多上传" + this.count + "张！");
          return false;
        }
      }
      this.onOff = true;
      this.$nextTick(() => {
        this.getCropper();
      });
    },
    showCropedImage_(index) {
      if (index >= 0) {
        this.cropedImage = this.picPath[index];
      }
      this.option.showCropedImage = true;
    },
    ok() {
      let _this = this;
      if (document.getElementById("fileinput").files[0]) {
        // 进行上传
        this.cropper.getCroppedCanvas().toBlob(function (blob) {
          console.log("blob", blob);

          var objectURL = URL.createObjectURL(blob);
          var formData = new FormData();
          var fileName = new Date().getTime() + ".png";
          formData.append("file", blob, fileName);
          // _this.$axios
          //   .post(_this.HOST + _this.$http.Connector.upload, formData, {
          //     headers: {
          //       "Content-Type": "multipart/form-data",
          //     },
          //   })
          //   .then((res) => {
          //     // 清除裁剪框
          var pushdata = {
            name: fileName,
            file: objectURL,
          };
          _this.cropper.destroy();
          _this.returnPicPath = [];
          _this.returnPicPath.push(pushdata);
          // if (_this.ifOnePic) {
          //   _this.returnPicPath = res.data;
          // } else {
          //   // _this.returnPicPath = _this.picPath;
          //   _this.returnPicPath = [];
          //   _this.returnPicPath.push(objectURL);
          // }
          // console.log("_this.returnPicPath");
          // console.log(_this.returnPicPath);
          _this.sendMsgToParent();
          // 关闭弹框
          _this._closeShade();
          // })
          // .catch((error) => {
          //   _this.$Message.error("上传图片出错！");
          // });
        }, "image/jpeg");
      }
    },
    sendMsgToParent() {
      this.$emit("listenToChildEvent", this.returnPicPath);
    },
    _closeShade() {
      this.onOff = false;
    },
    handleturnLeft() {
      if (document.getElementById("fileinput").files[0]) {
        this.cropper.rotate(-90);
      }
    },
    handleTurnRight() {
      if (document.getElementById("fileinput").files[0]) {
        this.cropper.rotate(90);
      }
    },
    handleBigger() {
      if (document.getElementById("fileinput").files[0]) {
        this.cropper.zoom(0.1);
      }
    },
    handleSmaller() {
      if (document.getElementById("fileinput").files[0]) {
        this.cropper.zoom(-0.1);
      }
    },
    handleReset() {
      if (document.getElementById("fileinput").files[0]) {
        this.cropper.reset();
      }
    },
    delPic(index) {
      let _this = this;
      if (_this.ifOnePic) {
        _this.returnPicPath = "";
      } else {
        _this.returnPicPath = this.picPath;
        _this.returnPicPath.splice(index, 1);
      }
      this.sendMsgToParent();
    },
  },
};
</script>

<style lang="scss" scoped>
.initBox {
  .btn {
    display: block;
    background-color: #00aaa4;
    width: 80px;
    height: 30px;
    background: rgba(0, 170, 164, 1);
    border: 1px solid #2d8cf0;
    border-radius: 2px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    color: rgba(255, 255, 255, 1);
    line-height: 30px;
    font-size: 14px;

    &:hover {
      background: #00bdb8;
      border: 1px solid #00bdb8;
      transition: all 0.2s;
    }
  }

  .disabled {
    background: #ccc;
    border: 1px solid #ccc;

    &:hover {
      background: #ccc;
      border: 1px solid #ccc;
      transition: all 0.2s;
    }
  }

  .textTitle {
    background: #fff;
    font-size: 12px;
    color: #888888;
    line-height: 1.2;
    padding-top: 5px;
    letter-spacing: -1px;
    text-align: left;
  }

  .red {
    color: #e96d7d;
  }

  .uploadLogo {
    margin-right: 10px;
    margin-bottom: 20px;
    width: 60px;
    height: 60px;
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .uploadpics {
    height: 87.5px;
    margin-right: 39px;
    margin-bottom: 20px;
    position: relative;

    img {
      height: 100%;
      width: 100%;
    }
  }

  .close {
    display: block;
    width: 12px;
    height: 12px;
    // background: url("../../images/close.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 4px;
    right: 2px;
    cursor: pointer;
  }
}

.shadeBox {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(55, 55, 55, 0.6);
  height: 100%;
  z-index: 1063;
}

.uploadPic {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 1200;
  transform: translateX(-50%) translateY(-50%);
  -ms-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  -o-transform: translateX(-50%) translateY(-50%);

  .head {
    width: 100%;
    height: 34px;
    background: rgba(234, 235, 236, 1);
    box-shadow: 0px 2px 0px 0px rgba(204, 204, 204, 0.5);

    .title {
      text-align: left;
      line-height: 34px;
      padding-left: 11px;
    }

    .close {
      display: block;
      position: absolute;
      width: 15px;
      height: 15px;
      top: 11px;
      right: 11px;
      // background-image: url("../../images/uploadPic/close.png");
      background-size: 15px 15px;
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
    }
  }

  .content {
    padding: 14px;
    width: 100%;

    .contentTop {
      width: 100%;
      height: 50px;

      .filelabel {
        width: 90px;
        height: 30px;
        display: inline-block;
        border: 1px solid #2d8cf0;
        border-radius: 2px;
        cursor: pointer;
        color: white;
        font-size: 14px;
        text-align: center;
        transition: all 0.2s;
        line-height: 30px;
        font-weight: 400;
        background: #00aaa4;
        box-sizing: border-box;

        &:hover {
          background: #00bdb8;
          border: 1px solid #00bdb8;
          transition: all 0.2s;
        }
      }
    }

    .contentCenter {
      width: 100%;

      .left {
        width: 500px;
        height: 305px;

        .cropper {
          width: 500px;
          height: 305px;
          box-sizing: border-box;
          border: 1px solid #c3c3c3;
          width: 100%;
          height: 100%;

          img {
            max-height: 100%;
          }
        }
      }

      .right {
        width: 150px;
        border: 1px solid #c3c3c3;

        #preview {
          width: 150px;
          overflow: hidden;
        }
      }
    }

    .contentBottom {
      padding-top: 20px;
      width: 100%;

      .left {
        .btn {
          display: inline-block;
          background-color: #00aaa4;
          width: 30px;
          height: 30px;
          background: rgba(0, 170, 164, 1);
          border: 1px solid #2d8cf0;
          border-radius: 2px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          margin-right: 10px;

          &:hover {
            background: #00bdb8;
            border: 1px solid #00bdb8;
            transition: all 0.2s;
          }
        }

        .turnLeft {
          &:after {
            content: "";
            width: 18px;
            height: 21px;
            // background: url("../../images/uploadPic/turnLeft.png") no-repeat;
            background-size: 100% 100%;
            display: block;
            margin: 3.5px 6px;
          }
        }

        .turnRight {
          &:after {
            content: "";
            width: 18px;
            height: 21px;
            // background: url("../../images/uploadPic/turnRight.png") no-repeat;
            background-size: 100% 100%;
            display: block;
            margin: 3.5px 6px;
          }
        }

        .bigger {
          &:after {
            content: "";
            width: 21px;
            height: 21px;
            // background: url("../../images/uploadPic/bigger.png") no-repeat;
            background-size: 100% 100%;
            display: block;
            margin: 3.5px 4.5px;
          }
        }

        .smaller {
          &:after {
            content: "";
            width: 21px;
            height: 21px;
            // background: url("../../images/uploadPic/smaller.png") no-repeat;
            background-size: 100% 100%;
            display: block;
            margin: 3.5px 4.5px;
          }
        }

        .reset {
          &:after {
            content: "";
            width: 18px;
            height: 18px;
            // background: url("../../images/uploadPic/turnArround.png") no-repeat;
            background-size: 100% 100%;
            display: block;
            margin: 5.5px 6px;
          }
        }
      }

      .right {
        .btn {
          display: inline-block;
          width: 90px;
          height: 30px;
          background: rgba(0, 170, 164, 1);
          border-radius: 2px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 30px;
          text-align: center;
          margin-right: 33px;
          cursor: pointer;

          &:hover {
            background: #00bdb8;
            transition: all 0.2s;
          }
        }
      }
    }
  }
}
</style>
