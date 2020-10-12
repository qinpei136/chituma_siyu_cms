<template>
  <div class="table-container">
    <el-card>
      <div slot="header">
        <span>竞价广告信息</span>
        <el-button
          type="primary"
          style="margin-left: 80%;"
          @click="activeChangeUrl"
          >保存</el-button
        >
        <!--   :disabled="this.postForm.stat == 4"
        -->
        <el-button type="primary" @click="activeGoback">返回</el-button>
      </div>
      <el-form
        v-model="postForm"
        size="mini"
        inline
        label-position="left"
        label-width="100px"
      >
        <el-row type="flex" justify="start">
          <el-col :span="8">
            <el-form-item label="订单名称:" size="mini">
              <!-- <el-input v-model="postForm.adName" size="mini"></el-input> -->
              <span v-text="postForm.adName"></span>
            </el-form-item>
            <el-form-item label="客户名称:" size="mini">
              <!-- <el-input v-model="postForm.userName" size="mini"></el-input> -->
              <span v-text="postForm.userName"></span>
            </el-form-item>
            <br />
            <el-form-item label="出价:">
              <el-input
                v-model="postForm.price"
                size="mini"
                style="width: 80px;"
              ></el-input
              >元
            </el-form-item>
            <br />
            <el-form-item label="投放方式:" size="mini">
              CPM
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别:">
              <el-radio v-model="postForm.gender" :label="1">男</el-radio>
              <el-radio v-model="postForm.gender" :label="2">女</el-radio>
              <el-radio v-model="postForm.gender" :label="0">不限</el-radio>
            </el-form-item>
            <br />
            <el-form-item label="投放时长:">
              <el-radio
                v-model="postForm.long"
                :label="5"
                @change="active_noneUrl"
                >{{ 5 + "秒" }}
              </el-radio>
              <el-radio
                v-model="postForm.long"
                :label="15"
                @change="active_noneUrl"
                >{{ 15 + "秒" }}
              </el-radio>
            </el-form-item>
            <br />
            <el-form-item label="时间段:" size="mini">
              <el-button @click="setTimeShow(false)"> 不限</el-button>
              <el-button @click="setTimeShow(true)">自定义</el-button>
              <div v-if="endTimeShow">
                <el-time-select
                  v-model="startTime"
                  placeholder="起始时间"
                  :picker-options="{
                    start: '00:00',
                    step: '01:00',
                    end: '24:00',
                  }"
                >
                </el-time-select>
                <el-time-select
                  v-model="endTime"
                  placeholder="结束时间"
                  :picker-options="{
                    start: '00:00',
                    step: '01:00',
                    end: '24:00',
                    minTime: startTime,
                  }"
                >
                </el-time-select>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-checkbox-group v-model="postForm.age">
          <el-form-item label="年龄:">
            <el-checkbox v-for="age in agekList_arr" :key="age" :label="age">{{
              age + agekList_[age]
            }}</el-checkbox>

            <el-checkbox
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <el-radio v-model="getAge" :label="1">不限</el-radio>
          </el-form-item>
        </el-checkbox-group>
      </el-form>
    </el-card>
    <el-card v-if="active_dialogVisible">
      <div slot="header">
        <span>选择新素材</span>
      </div>
      <el-select v-model="active_Form" @change="active_setUrl">
        <el-option
          v-for="item in active_SelectOption"
          :key="item.materialId"
          :value="item.materialId"
          :label="item.name"
        >
        </el-option>
      </el-select>
    </el-card>
    <el-card v-if="!active_dialogVisible">
      <div slot="header">
        <span>素材</span>
      </div>

      <div
        v-if="activeUrl.length > 0 && !/jpeg|jpg|png/.test(activeUrl[0])"
        style="display: inline-block;"
      >
        <video width="204.8" height="120" style="margin: 0 8px;" controls>
          <source
            v-show="activeUrl[0]"
            :src="activeUrl[0]"
            type="video/mp4"
          /></video
        ><video width="256" height="160" controls>
          <source v-show="activeUrl[0]" :src="activeUrl[1]" type="video/mp4" />
        </video>
      </div>
      <div v-else>
        <el-image
          v-if="activeUrl[0]"
          style="display: inline-block; width: 204.8px; height: 120px;"
          :src="activeUrl[0]"
        ></el-image>
        <el-image
          v-if="activeUrl[1]"
          style="
            display: inline-block;
            width: 256px;
            height: 160px;
            margin: 0 10px;
          "
          :src="activeUrl[1]"
        ></el-image>
      </div>
      <el-row
        type="flex"
        style="margin-top: 2rem; margin-left: 10px; width: 33%;"
      >
        <el-col>
          <el-button
            icon="el-icon-tickets"
            type="primary"
            @click="active_openImg(activeUrl, 0)"
            >查看
          </el-button>
        </el-col>
        <el-col :push="5">
          <el-button
            icon="el-icon-tickets"
            type="primary"
            @click="active_openImg(activeUrl, 1)"
            >查看
          </el-button>
          <el-button icon="el-icon-sort" type="primary" @click="active_noneUrl"
            >更换
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getList, doDelete } from "@/api/table";
import { getOrdersDevice } from "@/apis/index.js";
import * as actives from "@/apis/model/active";

import * as biddingActive from "@/apis/model/biddingActive";
export default {
  name: "ComprehensiveTable",
  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    const agekList_m = {
      "0-11": "岁 儿童",
      "12-17": "岁 青少年",
      "18-29": "岁 青年",
      "30-39": "岁 壮年",
      "40-59": "岁 中年",
      "60岁以上": "老年",
    };
    const agekList_s = Object.keys(agekList_m);
    return {
      active_List: [],
      listLoading: true,
      layout: "total, prev, pager, next, jumper", //  layout="prev, pager, next"
      activeTotal: 0,
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
      active_SelectOption: [],
      active_dialogVisible: false,
      activeUrl: [],
      active_Form: null,
      keepMaterialId: "",
      activityAudit_detailsName: null,
      activeDetail_change: true,

      checkList_: {
        0: "男",
        1: "女",
      },
      agekList_: agekList_m,
      agekList_arr: agekList_s,
      isIndeterminate: true,
      getAge: 0,
      postForm: {
        name: "",
        UsrName: "",
        gender: 0,
        material: "",
        age: [],
        checkTime: 15,
        timeList: [],
      },
      startTime: "",
      endTime: "",
      endTimeShow: false,
    };
  },
  watch: {
    "postForm.age": {
      handler(newList, oldList) {
        // ...
        if (newList.length < 1) {
          this.getAge = 1;
        } else {
          this.getAge = 0;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.active_fetchData();
    // medium_activity_details medium_activityAudit_details
    this.activityAudit_detailsName = this.$route.name;
  },
  mounted() {},
  methods: {
    active_fetchData() {
      biddingActive
        .getActiveData({
          id: this.$route.params.details,
        })
        .then((res) => {
          // console.log(res, "获取数据");
          this.listLoading = false;
          // this.postForm.getAge = 1;
          if (res.data.status) {
            this.postForm = res.data.data;
            this.postForm.gender =
              this.postForm.gender.length > 1 ? 0 : this.postForm.gender[0];

            this.postForm.age = this.postForm.age.map((item) => {
              if (item === "60-uncap") {
                return "60岁以上";
              } else {
                return item;
              }
            });

            if (this.postForm.startHour == 0 && this.postForm.stopHour) {
              this.endTimeShow = false;
            } else {
              this.endTimeShow = true;
              this.startTime = this.postForm.startHour + ":00";
              this.endTime = this.postForm.stopHour + ":00";
            }
            this.activeUrl = res.data.data.materiaUrl;
            this.active_Form = res.data.data.materialId;
            this.keepMaterialId = res.data.data.materialId;
          }
        });
    },
    setTimeShow(Show) {
      this.endTimeShow = Show;
      if (!Show) {
        this.startTime = "";
        this.endTime = "";
      }
    },
    handleCheckAllChange(val) {
      this.postForm.age = val ? this.agekList_arr : [];
      this.isIndeterminate = false;
    },
    active_beforeChange(row) {
      actives
        .getValidMyMaterials_({
          long: this.postForm.long,
        })
        .then((res) => {
          // console.log(res, "获取"); // materialId
          if (res.data.status) {
            this.active_SelectOption = res.data.data;
            // this.active_dialogVisible = true;
          }
        });
    },
    active_noneUrl() {
      this.active_beforeChange();
      this.active_Form = null;
      this.active_dialogVisible = true;
    },
    active_setUrl() {
      // console.log(this.active_Form);
      this.active_SelectOption.forEach((item) => {
        if (this.active_Form == item.materialId) {
          this.activeUrl = item.url;
        }
      });

      this.active_dialogVisible = false;
    },
    activeChangeUrl() {
      var patrn1 = /^\d{0,8}(\.\d{0,2})?$/;
      // var patrn = /^([1-9]\d*(.\d{1,2})?)$|^(0.\d?[1-9])$|^(0.[1-9]\d?)$/;
      if (!patrn1.test(this.postForm.price)) {
        this.$baseMessage(
          "请输入正确的出价--（至多带2位小数的正数）",
          "warning"
        );
        return false;
      }
      if (this.active_Form) {
        // this.active_dialogVisible = false;

        if (this.startTime) {
          this.postForm.startHour = this.startTime.slice(0, 2);
        } else {
          this.postForm.startHour = "00";
        }
        if (this.endTime) {
          this.postForm.stopHour = this.endTime.slice(0, 2);
        } else {
          this.postForm.stopHour = "24";
        }

        // 60岁以上
        var getDur = { ...this.postForm };
        if (this.getAge) {
          this.postForm.age = this.agekList_arr;
        }
        var age = this.postForm.age.map((item) => {
          if (item === "60岁以上") {
            return "60-uncap";
          } else {
            return item;
          }
        });
        getDur.age = age;
        getDur.gender = [this.postForm.gender];
        // console.log(JSON.stringify(getDur));

        var getMater = " ";
        this.active_SelectOption.forEach((item) => {
          if (this.active_Form == item.materialId) {
            getMater = item;
          }
        });
        if (this.keepMaterialId !== this.active_Form) {
          getDur.materialId = this.active_Form;
          getDur.materialFormat = getMater.format;
          getDur.materiaUrl = getMater.url;
        }

        biddingActive.resetMaterial(getDur).then((res) => {
          if (res.data.status) {
            this.$baseMessage("已保存更改", "success");
            this.active_Form = null;
            this.activeGoback();
            // this.active_fetchData();
          }
        });
      } else {
        this.$baseMessage("请重新选择使用的素材", "info");
      }
    },
    active_openImg(getUrl, getSubscript) {
      if (getUrl.length > 0) {
        var rg1 = /jpeg|jpg|png/;
        if (!rg1.test(getUrl[0])) {
          this.$alert(
            `<div style="display:inline-block;"><video width="768" height="450" style=" margin: 0 8px;" controls><source  src="${getUrl[getSubscript]}" type="video/mp4" /></source></video></div>`,
            "视频预览",
            {
              dangerouslyUseHTMLString: true,
              customClass: "openImgUrl_openImgs",
            }
          );
        } else {
          this.$alert(
            `<div style="display:inline-block;width:768px; height: 450px; background: url(${getUrl[getSubscript]}) no-repeat;background-size: cover;"></div>`,
            "图片预览",
            {
              dangerouslyUseHTMLString: true,
              customClass: "openImgUrl_openImgs",
            }
          );
        }
      } else {
        this.$message({
          type: "info",
          message: "没有图片",
        });
      }
    },
    activeGoback() {
      this.$router.replace({ path: "/byui/medium-bidding-active" });
    },

    active_Edit(row) {
      // this.$refs["edit"].showEdit(row);
      console.log(row, "编辑");
    },
    active_Close(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>
<style lang="scss">
.active_dialog {
  width: 40%;
}
</style>
<style>
.openImgUrl_openImgs {
  width: 60vw;
  text-align: center;
}
.openImgUrl_openImgs p div {
  margin: 0 10px;
}
</style>
