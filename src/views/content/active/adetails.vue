<template>
  <div class="table-container">
    <el-card>
      <div slot="header">
        <span>订单信息</span>
      </div>
      <el-form
        v-model="activeDetail"
        size="mini"
        inline
        label-position="left"
        label-width="100px"
      >
        <el-row type="flex" justify="start">
          <el-col :span="8">
            <el-form-item label="订单编号:">
              {{ activeDetail.adId }}</el-form-item
            >
            <br />
            <el-form-item label="订单名称:">
              {{ activeDetail.adName }}</el-form-item
            ><br />
            <el-form-item label="客户名称:">
              {{ activeDetail.orderUseName }}</el-form-item
            ><br />
            <el-form-item label="投放时间:">
              <span v-text="[...activeDetail.adDays].join(' |')">
              </span></el-form-item
            ><br />
            <el-form-item label="投放点位:">
              {{ activeDetail.deviceSummary }}</el-form-item
            ><br />
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单创建时间:">
              {{ activeDetail.adTime }}</el-form-item
            ><br />
            <el-form-item label="播放时长:">
              {{ activeDetail.long + "秒" }}</el-form-item
            ><br />
            <el-form-item label="循环周期:">
              <span
                v-text="
                  activeDetail.period ? activeDetail.period + '秒/次' : ''
                "
              >
              </span></el-form-item
            ><br />
          </el-col>
          <el-col :span="8">
            <el-form-item label="投放城市:">
              {{ activeDetail.adCity }}</el-form-item
            ><br />
            <el-form-item label="投放类型:">
              {{ activeDetail.materialFormat }}</el-form-item
            ><br />
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span>点位信息</span>
      </div>
      <el-table
        ref="tableSort"
        :data="active_List"
        :element-loading-text="elementLoadingText"
        style="min-height: 20vh;"
      >
        <!-- <el-table-column label="设备Id" prop="orderId"> </el-table-column> -->
        <el-table-column label="城市" prop="adCity"></el-table-column>
        <el-table-column label="行政区" prop="district"></el-table-column>
        <el-table-column label="小区" prop="community"></el-table-column>
        <el-table-column label="设备数量" prop="deviceAmount"></el-table-column>
        <el-table-column v-if="false" label="素材状态" prop="materialStat">
          <!-- <template slot-scope="scope">
            {{ materialType[scope.row.materialStat] }}
          </template> -->
        </el-table-column>
        <el-table-column v-if="false" label="订单状态" prop="orderStat">
          <template slot-scope="scope">
            {{ orderStatusType[scope.row.orderStat] }}
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="操作" width="180px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="active_Edit(scope.row)"
              >编辑
            </el-button>
            <el-button type="text" @click="active_Delete(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card>
      <div slot="header">
        <span>素材</span>
      </div>
      <div
        v-if="activeUrl.length > 0 && !/jpeg|jpg|png/.test(activeUrl[0])"
        style="display: inline-block;"
      >
        <video width="204.8" height="120" style="margin: 0 8px;" controls>
          <source :src="activeUrl[0]" type="video/mp4" /></video
        ><video width="256" height="160" controls>
          <source :src="activeUrl[1]" type="video/mp4" />
        </video>
      </div>
      <div v-else>
        <el-image
          v-if="activeUrl[0]"
          style="display: inline-block; width: 204.8px; height: 120px;"
          :src="activeUrl[0]"
        ></el-image>
        <el-image
          v-if="activeUrl[0]"
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
          <el-button
            v-if="activityAudit_detailsName === 'medium_activity_details'"
            icon="el-icon-sort"
            type="primary"
            :disabled="activeDetail_change"
            @click="active_beforeChange"
            >更换
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="更换素材"
      :visible.sync="active_dialogVisible"
      width="30%"
      :before-close="active_Close"
      custom-class="active_dialog"
    >
      <el-select v-if="active_dialogVisible" v-model="active_Form">
        <el-option
          v-for="item in active_SelectOption"
          :key="item.materialId"
          :value="item.materialId"
          :label="item.name"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="active_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="activeChangeUrl">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, doDelete } from "@/api/table";
import { getOrdersDevice } from "@/apis/index.js";
import * as actives from "@/apis/model/active";
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
      activeDetail: {},
      active_SelectOption: [],
      active_dialogVisible: false,
      activeUrl: [],
      active_Form: null,
      activityAudit_detailsName: null,
      activeDetail_change: true,
      activeDetail_long: 0,
    };
  },
  created() {
    // this.fetchData();
    this.active_fetchData();

    // console.log(this.$route.params, 12121212);
    // console.log(this.$route.name, 12121212);
    this.activityAudit_detailsName = this.$route.name; // medium_activity_details medium_activityAudit_details
  },
  mounted() {},
  methods: {
    active_fetchData() {
      actives
        .getActiveData({
          adId: this.$route.params.details,
        })
        .then((res) => {
          // console.log(res, "获取数据");
          this.listLoading = false;
          if (res.data.status) {
            this.activeDetail = res.data.data.orderInfo;
            this.activeUrl = res.data.data.materiaUrl;
            this.active_List = res.data.data.deviceInfo;
            this.activeDetail_long = this.activeDetail.long;

            var getStatus = parseInt(this.activeDetail.adStat);
            if (this.activeDetail.adDays.length > 4) {
              this.activeDetail.adDays = this.activeDetail.adDays.map(
                (item) => {
                  return item.slice(5, item.length);
                }
              );
            }

            switch (getStatus) {
              case 1: // 未启动
                this.activeDetail_change = false;
                break;
              case 2: // 启动
                this.activeDetail_change = false;
                break;
              case 4: // 暂停
                this.activeDetail_change = false;
                break;
              default:
                // 不可改
                this.activeDetail_change = true;
                break;
            }
          }
        });
    },
    active_beforeChange(row) {
      actives
        .getValidMyMaterials_({
          long: this.activeDetail_long,
        })
        .then((res) => {
          // console.log(res, "获取"); // materialId
          if (res.data.status) {
            this.active_SelectOption = res.data.data;
            this.active_dialogVisible = true;
          }
        });
    },
    activeChangeUrl() {
      if (this.active_Form) {
        this.active_dialogVisible = false;
        // setchangeMaterialID
        var getFormat = "";
        var getUrl = [];
        var getDur = null;
        this.active_SelectOption.forEach((item) => {
          if (this.active_Form === item.materialId) {
            getFormat = item.format;
            getUrl = item.url;
            getDur = item.dur;
          }
        });
        actives
          .setchangeMaterialID({
            adId: this.$route.params.details,
            materialId: this.active_Form,
            materialFormat: getFormat,
            materiaUrl: getUrl,
            dur: getDur,
          })
          .then((res) => {
            if (res.data.status) {
              this.$baseMessage("已更换使用的素材", "success");
              this.active_Form = null;
              this.active_fetchData();
            } else {
              this.$baseMessage(res.data.message, "warning");
            }
          });
      } else {
        this.$baseMessage("请选择使用的素材", "info");
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
    active_Add() {
      // this.$refs["edit"].showEdit();
      this.$router.replace({ path: "/byui/medium-orders-create" });
      // this.$baseMessage("确认新增订单吗", "success");
    },
    active_Edit(row) {
      // this.$refs["edit"].showEdit(row);
      console.log(row, "编辑");
    },
    active_Delete(row) {
      console.log(row, "删除");
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
