<template>
  <div class="table-container">
    <div class="ShowDrawer__content">
      <el-form :model="mealForm" label-width="126px" label-position="left">
        <el-form-item label="联系电话">
          <el-row type="flex">
            <el-col :span="8">
              <el-input v-model="formData.tel"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="用户协议">
          <el-row type="flex">
            <el-col :span="18">
              <editor
                id="editor_id"
                height="300px"
                width="100%"
                :content="formData.agreement"
                :afterChange="afterChange()"
                pluginsPath="/static/kindeditor/plugins/"
                :loadStyleMode="false"
                @on-content-change="onContentChange"
              ></editor>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="关于我们">
          <el-row type="flex">
            <el-col :span="18">
              <editor
                id="editor_id1"
                height="300px"
                width="100%"
                :content="formData.aboutUs"
                :afterChange="afterChange1()"
                pluginsPath="/static/kindeditor/plugins/"
                :loadStyleMode="false"
                @on-content-change="onContentChange1"
              ></editor>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="首页社区服务">
          <el-row type="flex">
            <el-col :span="18">
              <editor
                id="editor_id2"
                height="300px"
                width="100%"
                :content="formData.homePageService"
                pluginsPath="/static/kindeditor/plugins/"
                :loadStyleMode="false"
                @on-content-change="onContentChange2"
              ></editor>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <div class="ShowDrawer__footer">
      <el-row>
        <el-col :push="10">
          <el-button type="primary" @click="save">保 存</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getList, doDelete } from "@/api/table";

import * as actives from "@/apis/model/active";
import * as weapp from "@/apis/model/weapp.js";
import { RouteArr } from "@/router/index";
import checkPermission from "@/utils/permission";
import * as model from "@/apis/model/model.js";

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
      formData: {
        id: "",
        agreement: "",
        aboutUs: "",
        tel: "",
        homePageService: "",
      },
    };
  },
  computed: {},
  created() {
    this.initData();
  },
  methods: {
    checkPermission,
    initData() {
      model
        .getGlobalConfig()
        .then((res) => {
          if (res.data.status) {
            this.formData = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    afterChange() {},
    afterChange1() {},
    onContentChange(val) {
      this.formData.agreement = val;
    },
    onContentChange1(val) {
      this.formData.aboutUs = val;
    },
    onContentChange2(val) {
      this.formData.homePageService = val;
    },
    save() {
      var self = this;

      if (!this.formData.tel) {
        this.$message("请输入联系电话");
        return false;
      }

      if (!this.formData.agreement) {
        this.$message("请输入用户协议");
        return false;
      }

      if (!this.formData.aboutUs) {
        this.$message("请输入关于我们");
        return false;
      }
      model
        .updateGlobalConfig({ ...this.formData })
        .then((res) => {
          if (res.data.status) {
            this.$message("保存成功");
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
</style>
