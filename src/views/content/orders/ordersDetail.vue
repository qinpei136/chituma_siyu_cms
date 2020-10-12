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
              {{ activeDetail.orderUseName }}</el-form-item
            ><br />
            <el-form-item label="客户名称:">
              {{ activeDetail.adName }}</el-form-item
            ><br />
            <el-form-item label="投放点位:">
              {{ activeDetail.deviceSummary }}</el-form-item
            ><br />
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单创建时间:">
              {{ activeDetail.adTime }}</el-form-item
            ><br />
            <el-form-item label="投放起止日期:">
              <span v-text="activeDetail.adStartStop"> </span></el-form-item
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

            <el-form-item label="播放时长:">
              {{ activeDetail.long + "秒" }}</el-form-item
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
        :data="order_List"
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
            <el-button type="text" @click="order_Edit(scope.row)"
              >编辑
            </el-button>
            <el-button type="text" @click="order_Delete(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
      order_List: [],
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
      order_SelectOption: [],
      order_dialogVisible: false,
      activeUrl: [],
      order_Form: null,
      activityAudit_detailsName: null,
    };
  },
  created() {
    // this.fetchData();
    this.order_fetchData();

    // console.log(this.$route.params, 12121212);
    // console.log(this.$route.name, 12121212);
    this.activityAudit_detailsName = this.$route.name; // medium_activity_details medium_activityAudit_details
  },
  mounted() {},
  methods: {
    order_fetchData() {
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
            this.order_List = res.data.data.deviceInfo;
          }
        });
    },
    order_beforeChange(row) {
      actives.getValidMyMaterials().then((res) => {
        // console.log(res, "获取"); // materialId
        if (res.data.status) {
          this.order_SelectOption = res.data.data;
          this.order_dialogVisible = true;
        }
      });
    },
    activeChangeUrl() {
      if (this.order_Form) {
        this.order_dialogVisible = false;
        // setchangeMaterialID
        var getFormat = "";
        var getUrl = [];
        this.order_SelectOption.forEach((item) => {
          if (this.order_Form === item.materialId) {
            getFormat = item.format;
            getUrl = item.url;
          }
        });
        actives
          .setchangeMaterialID({
            adId: this.$route.params.details,
            materialId: this.order_Form,
            materialFormat: getFormat,
            materiaUrl: getUrl,
          })
          .then((res) => {
            if (res.data.status) {
              this.$baseMessage("已更换使用的素材", "success");
              this.order_Form = null;
              this.order_fetchData();
            }
          });
      } else {
        this.$baseMessage("请选择使用的素材", "info");
      }
    },
    order_openImg(getUrl, getSubscript) {
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
    order_Add() {
      // this.$refs["edit"].showEdit();
      this.$router.replace({ path: "/byui/medium-orders-create" });
      // this.$baseMessage("确认新增订单吗", "success");
    },
    order_Edit(row) {
      // this.$refs["edit"].showEdit(row);
      console.log(row, "编辑");
    },
    order_Delete(row) {
      console.log(row, "删除");
    },

    order_Close(done) {
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
.order_dialog {
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
