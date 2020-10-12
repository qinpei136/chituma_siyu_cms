<template>
  <div class="vue-uploader">
    <div class="file-list">
      <div v-if="fileType === 'image'">
        <section
          v-for="(file, index) of files"
          :key="index"
          class="file-item draggable-item"
        >
          <img
            :src="file.src"
            alt
            ondragstart="return false;"
            :style="imagess"
          />
          <!-- <p class="file-name">{{ file.name }}</p> -->
          <span class="file-remove" @click="remove(index)">+</span>
        </section>
      </div>
      <div v-if="fileType === 'video'">
        <section
          v-for="(file, index) of files"
          :key="index"
          class="file-item draggable-item"
        >
          <video :src="file.src" class="orderFormImg" controls>
            <source :src="file.src" type="video/mp4" />
          </video>
          <span class="file-remove" @click="remove(index)">+</span>
        </section>
      </div>

      <section v-if="fileType === 'image'" class="file-item">
        <div
          v-if="files.length < parseInt(this.receive)"
          class="add"
          :style="{ height: heights + 'px' }"
          @click="add"
        >
          <img
            v-if="EditData.imageUrl"
            :src="EditData.imageUrl"
            alt
            :style="imagess"
          />
          <span v-else :style="imagess">+</span>
        </div>
      </section>
      <section v-if="fileType === 'video'" class="file-item">
        <div
          v-if="files.length < parseInt(this.receive)"
          class="add"
          :style="{ height: heights + 'px' }"
          @click="add"
        >
          <video v-if="EditData.imageUrl" :src="EditData.imageUrl" controls>
            <source :src="EditData.imageUrl" type="video/mp4" />
          </video>
          <span v-else :style="imagess">+</span>
        </div>
      </section>
    </div>

    <input
      ref="file"
      type="file"
      name="file"
      multiple="multiple"
      @change="fileChanged"
    />
  </div>
</template>
<script>
export default {
  name: "Upload",
  props: {
    /* eslint-disable */
    EditData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    receive: {
      type: Number,
      default: 3,
    },
    modelnimg: {
      type: Object,
      default: function () {
        return {};
      },
    },
    fileType: { type: String, default: "image" },
  },
  data() {
    return {
      name: "ManageContent",
      meg: "helloworld",
      status: "ready",
      files: [],
      point: {},
      ZDbucket: "",
      uploading: false,
      percent: 1,
      Value4: "",
      imgWidth: null,
      imgHeight: null,
      heights: "",
      widths: "",
    };
  },

  computed: {
    /* eslint-disable vue/no-side-effects-in-computed-properties */
    imagess() {
      this.widths = this.modelnimg.width;
      this.heights = this.modelnimg.height;
      if (this.modelnimg.height > 200) {
        this.widths = this.modelnimg.width / 3;
        this.heights = this.modelnimg.height / 3;
      }
      return {
        width: this.widths + "px",
        height: this.heights + "px",
      };
    },
  },
  watch: {
    EditData(val) {
      this.EditData = val;
    },
    modelnimg(val) {
      this.modelnimg = val;
    },
  },
  created() {
    this.status = "ready";
  },
  mounted() {},
  methods: {
    add() {
      if (this.files.length > parseInt(this.receive)) {
        this.$message.error("已到达上传上限");
        return false;
      }
      this.$refs.file.click();
    },
    submitAdd() {
      var that = this;
      const allFile = that.files;
      console.log(allFile);
      for (var i = 0; i < allFile.length; i++) {
        var f = allFile[i].file;
        const isLt2M = f.size / 1024 / 1024 < 2;
        var boxScope = 5;
        const isWidth =
          (that.imgWidth < that.modelnimg.width + boxScope &&
            that.imgWidth > that.modelnimg.width - boxScope) ||
          (that.imgWidth < that.modelnimg.width * 2 + boxScope &&
            that.imgWidth > that.modelnimg.width * 2 - boxScope);
        const isHeight =
          (that.imgHeight < that.modelnimg.height + boxScope &&
            that.imgHeight > that.modelnimg.height - boxScope) ||
          (that.imgHeight < that.modelnimg.height * 2 + boxScope &&
            that.imgHeight > that.modelnimg.height * 2 - boxScope);

        if (!isLt2M) {
          that.$message.error("请上传2M以下的文件");
          return false;
        }
      }
    },
    finished() {
      this.files = [];
      this.status = "ready";
    },
    remove(index) {
      this.files.splice(index, 1);
    },
    fileChanged() {
      var that = this;
      const list = this.$refs.file.files;
      console.log(this.receive);
      if (list.length > parseInt(this.receive)) {
        this.$message.error("已到达上传上限");
        return false;
      }
      for (let i = 0; i < list.length; i++) {
        if(list[i].type!="video/mp4")
        {
          this.$message.error("请上传视频文件");
          return false;
        }
        else
        {
          if (!this.isContain(list[i])) {
          const item = {
            name: list[i].name,
            size: list[i].size,
            file: list[i],
          };
          this.html5Reader(list[i], item);
          this.files.push(item);
        }
        }
        
      }
      this.$refs.file.value = "";
      let sendFile = this.files;
      this.$emit("resaveImg", sendFile);
    },
    // 将图片文件转成BASE64格式
    html5Reader(file, item) {
      const reader = new FileReader();
      var that_ = this;
      reader.onload = (e) => {
        const data = e.target.result;
        if (that_.fileType !== "video") {
          const img = new Image();
          img.src = data;
          img.onload = function () {
            // console.log('图片宽度', img.width)
            // console.log('图片高度', img.height)
            that_.imgWidth = img.width;
            that_.imgHeight = img.height;
            that_.$set(item, "src", data);
          };
        } else {
          var video = document.createElement("video");
          video.preload = "metadata";
          video.src = URL.createObjectURL(file);
          video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
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
              that_.files = [];
              return false;
            }

            if (video.duration < 16) {
              that_.$set(item, "src", data);
            } else {
              that_.$baseMessage("请上传时长小于15秒的视频", "error");
              that_.files = [];
              return false;
            }
          };
        }
      };
      reader.readAsDataURL(file);
    },
    isContain(file) {
      return this.files.find(
        (item) => item.name === file.name && item.size === file.size
      );
    },
  },
};
</script>

<style scoped>
.vue-uploader {
  display: inline-block;
  width: 100%;
}

.vue-uploader .file-list {
  padding: 2px 0px;
}

.vue-uploader .file-list:after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
  line-height: 0;
  height: 0;
  font-size: 0;
}
.vue-uploader .file-list .file-item {
  float: left;
  position: relative;
  width: 20%;
  text-align: center;
}

.vue-uploader .file-list .file-item img {
  width: 160px;
  height: 80px;
}
.vue-uploader .add > img {
  width: 160px;
}
.vue-uploader .file-list .file-item .file-remove {
  position: absolute;
  right: 12px;
  display: none;
  top: 4px;
  width: 14px;
  height: 14px;
  color: white;
  cursor: pointer;
  line-height: 12px;
  border-radius: 100%;
  transform: rotate(45deg);
  background: rgba(0, 0, 0, 0.5);
}

.vue-uploader .file-list .file-item:hover .file-remove {
  display: inline;
}

.vue-uploader .file-list .file-item .file-name {
  margin: 0;
  word-break: break-all;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.vue-uploader .add {
  width: 160px;
  height: 80px;
  margin-left: 10px;
  float: left;
  text-align: center;
  line-height: 80px;
  border: 1px dashed #ececec;
  font-size: 30px;
  cursor: pointer;
}

.vue-uploader .upload-func {
  display: flex;
  padding: 10px;
  margin: 0px;
  background: #f8f8f8;
  border-top: 1px solid #ececec;
}

.vue-uploader .upload-func .progress-bar {
  flex-grow: 1;
}

.vue-uploader .upload-func .progress-bar section {
  margin-top: 5px;
  background: #00b4aa;
  border-radius: 3px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  transition: all 0.5s ease;
}
</style>
<style>
.vue-uploader .upload-func .operation-box {
  flex-grow: 0;
  padding-left: 10px;
}

.vue-uploader .upload-func .operation-box button {
  padding: 4px 12px;
  color: #fff;
  background: #007acc;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}

.vue-uploader > input[type="file"] {
  display: none;
}

.orderFormImg {
  width: 200px;
  height: 120px;
}
</style>
