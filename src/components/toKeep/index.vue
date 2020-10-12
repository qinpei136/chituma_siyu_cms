<template>
  <div class="vue-uploader">
    <div class="imgList">
      <div v-for="(urls, index) in picsList" :key="urls.name" class="imgItem">
        <img :src="urls.file" class="imgsSty" :style="myStyle" alt="" srcset="" />

        <i class="el-icon-delete potop" @click="delList(index)"></i>
      </div>
      <el-upload
        v-if="picsList.length < parseInt(this.receive)"
        ref="upImg"
        class="upload-demo"
        action=""
        :multiple="false"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="changeUpload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">点击上传</div>
      </el-upload>
    </div>

    <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align: center;">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            :center-box="option.centerBox"
            :info-true="option.infoTrue"
            :fixed-box="option.fixedBox"
          ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button content="向左旋转" placement="bottom">
          <span class="btn turnLeft" @click="handleturnLeft">向左旋转</span>
        </el-button>
        <el-button content="向右旋转" placement="bottom">
          <span class="btn turnRight" @click="handleTurnRight">向右旋转</span>
        </el-button>
        <el-button content="放大" placement="bottom">
          <span class="btn bigger" @click="handleBigger">放大</span>
        </el-button>
        <el-button content="缩小" placement="bottom">
          <span class="btn smaller" @click="handleSmaller">
            缩小
          </span>
        </el-button>
        <el-button content="重置" placement="bottom">
          <span class="btn reset" @click="handleReset">重置</span>
        </el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="finish"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { client } from "@/utils/alioss";
import Cropper from "cropperjs";

export default {
  props: {
    receive: {
      type: Number,
      default: 3,
    },
    inOption: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "png", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 120, // 默认生成截图框宽度
        autoCropHeight: 120, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      picsList: [], //页面显示的数组
      fileinfo: {},
      // 防止重复提交
      fileName: "",
      loading: false,
      myStyle: {"margin-right": "6px","width": "120px","height": "120px"}
    };
  },
  beforeMount() {
    this.option = Object.assign(this.option, this.inOption);
    // if(this.option.autoCropWidth==1200 && this.option.autoCropHeight)
    if(this.option.autoCropWidth!=120){
  
    this.myStyle.width =this.option.autoCropWidth/10 +'px'
    this.myStyle.height =this.option.autoCropHeight/10 +'px'
      }

  },
  methods: {
    // 上传按钮   限制图片大小
    changeUpload(file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!");
        return false;
      }
      this.fileinfo.file = file;
      this.fileName = file.name;
      this.fileinfo.name = file.name;
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.readFiles(file);

      // this.$nextTick(() => {
      //   console.log(file);
      //   this.option.img = file.url;
      //   this.dialogVisible = true;
      // });
      // console.log(file, fileList);
      return false;
    },

    readFiles(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        this.option.img = data;

        this.dialogVisible = true;
      };
      reader.readAsDataURL(file);
    },
    handleAvatarSuccess() {},
    toFile(bs) {
      var reader = new FileReader();
      reader.readAsArrayBuffer(bs);
      reader.onload = function (e) {
        console.info(reader.result); //ArrayBuffer {}

        var buf = new Uint8Array(reader.result);
        console.info(buf); //[228, 184, 173, 230, 150, 135, 229, 173, 151, 231, 172, 166, 228, 184, 178]
        reader.readAsText(new Blob([buf]), "utf-8");
        reader.onload = function () {
          console.info(reader.result); //中文字符串
        };

        //将 ArrayBufferView  转换成Blob
        var buf = new DataView(reader.result);
        console.info(buf); //DataView {}
        reader.readAsText(new Blob([buf]), "utf-8");
        reader.onload = function () {
          console.info(reader.result); //中文字符串
        };
      };
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","); //注意base64的最后面中括号和引号是不转译的
      var _arr = arr[1].substring(0, arr[1].length - 2);
      var mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(_arr),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime,
      });
    },
    convertBase64UrlToBlob(urlData) {
      var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    },
    delList(index) {
      this.picsList.splice(index, 1);
      this.$emit("resaveImg", this.picsList);
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      let self = this;
      this.$refs.cropper.getCropData((data) => {
        // this.$refs.cropper.getCropBlob((data) => {
        this.dialogVisible = false;
        // this.fileinfo.files = window.URL.createObjectURL(data);
        this.fileinfo.url = data;
        const readers = new FileReader();
        readers.onload = (e) => {
          self.fileinfo.file = e.target.result;
          self.picsList.push({ ...self.fileinfo });
          self.$emit("resaveImg", self.picsList);
          self.fileinfo = {};
        };
        let blobs = self.dataURLtoBlob(self.fileinfo.url);
        readers.readAsDataURL(blobs);
        // readers.readAsArrayBuffer(blobs);

        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     this.loading = false;
        //   });
        console.log(this.picsList);
      });
    },

    handleturnLeft() {
      console.log(this.$refs.cropper);
      if (this.option.img) {
        this.$refs.cropper.rotate -= 45;
      }
    },
    handleTurnRight() {
      if (this.option.img) {
        // this.$refs.cropper.rotate(90);
        this.$refs.cropper.rotate += 45;
      }
    },
    handleBigger() {
      if (this.option.img) {
        this.$refs.cropper.scale += 0.1;
      }
    },
    handleSmaller() {
      if (this.option.img) {
        this.$refs.cropper.scale -= 0.1;
      }
    },
    handleReset() {
      if (this.option.img) {
        this.$refs.cropper.scale = 0;
        this.$refs.cropper.rotate = 0;
      }
    },
  },
};
</script>

<style scoped style lang="scss">
.imgList {
  display: inline-flex;
  align-items: top;
}
.imgItem {
  position: relative;
}
.imgList i.potop {
  position: absolute;
  top: 6px;
  left: 101px;
}
.imgsSty {
  margin-right: 6px;
  width: 120px;
  height: 120px;
}
.cropper-content {
  .cropper {
    width: auto;
    height: 300px;
  }
}
</style>
