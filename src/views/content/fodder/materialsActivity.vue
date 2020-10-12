<template>
  <div class="table-container-audit">
    <byui-query-form>
      <byui-query-form-left-panel>
        <div style="width: 80%; height: 2px;"></div>
      </byui-query-form-left-panel>
      <byui-query-form-right-panel>
        <el-form
          v-show="false"
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <!-- <el-form-item>
            <el-input v-model="queryForm.title" placeholder="标题" />
          </el-form-item>-->
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="activeAudit_getQuery"
              >查询
            </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="activeAudit_List"
      style="min-height: 50vh;"
      stripe
      :fit="true"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
        :index="indexMethod"
      >
      </el-table-column>
      <el-table-column min-width="140">
        <template slot="header">
          <div class="order_sty">
            订单名称
            <span v-text="'|ID'"></span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="order_sty">
            {{ scope.row.adName }}<span v-text="'|' + scope.row.adId"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="起止时间" width="210">
        <template slot-scope="scope">
          {{ scope.row.adStart }} |{{ scope.row.adStop }}
        </template>
      </el-table-column>
      <el-table-column prop="devicesAmount" label="已选点位"></el-table-column>
      <el-table-column
        prop="adTime"
        label="创建时间"
        min-width="90"
      ></el-table-column>
      <el-table-column label="订单状态" prop="adStat">
        <template slot-scope="scope">
          <!-- {{ fodderStatus[scope.row.adStat] }} -->
          <el-tooltip
            :content="fodderStatus[scope.row.adStat]"
            class="item"
            effect="dark"
            placement="top-start"
          >
            <el-tag :type="scope.row.adStat | statusFilter">
              {{ fodderStatus[scope.row.adStat] }}</el-tag
            >
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="160">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="activity_ListEdit(scope.row)"
            >查看
          </el-button>
          <el-button
            :type="scope.row.adStat != 0 ? 'info' : 'primary'"
            size="mini"
            plain
            :disabled="scope.row.adStat != 0"
            @click="activeAudit_ListEdit(scope.row.adId, false)"
            >驳回
          </el-button>
          <el-button
            :type="scope.row.adStat != 0 ? 'info' : 'primary'"
            size="mini"
            plain
            :disabled="scope.row.adStat != 0"
            @click="activeAudit_ListEdit(scope.row.adId, true)"
            >通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :layout="layout"
      :page-size="20"
      :total="fodderTotal"
      @current-change="fodderPageChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getList, doDelete } from "@/api/table";
// import { getMaterialList, getMyMaterialDelete, submitMyActive } from "@/apis";

import * as activityAudit from "@/apis/model/myActive.js";
export default {
  name: "FodderListAudit",
  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "info",
        1: "primary",
        2: "success",
        3: "danger",
        4: "warning",
        5: "danger",
        6: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      activeAudit_List: [],
      activeAudit_InitData: [],
      activeAudit_mapData: [],
      listLoading: true,
      layout: "total, prev, pager, next, jumper",
      fodderTotal: 0,
      background: true,
      elementLoadingText: "正在加载...",
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      fodderStatus: {
        0: "待审核",
        1: "待投放",
        2: "投放中",
        3: "已完成",
        4: "已暂停",
        5: "未通过",
      },
    };
  },
  created() {
    this.activeAudit_fetchData();
  },
  mounted() {},
  methods: {
    activeAudit_getData() {
      activityAudit
        .getMyActiveDevice()
        .then((res) => {
          // console.log(res, "list");
          if (res.data.status) {
            // console.log(res.data.data);

            this.activeAudit_InitData = res.data.data;
            this.activeAudit_InitData = this.activeAudit_InitData.reverse();
            this.fodderTotal = this.activeAudit_InitData.length;
            if (this.fodderTotal > 0) {
              this.activeAudit_mapData = [...this.activeAudit_InitData];
              this.fodderPageChange(1);
            }
          }
          this.listLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.listLoading = false;
        });
    },
    activeAudit_fetchData() {
      this.listLoading = true;
      this.activeAudit_getData();
    },
    fodderPageChange(val) {
      this.queryForm.pageNo = val;
      this.activeAudit_List = this.activeAudit_mapData.slice(
        (val - 1) * 20,
        val * 20
      );
    },
    activeAudit_getQuery() {
      this.queryForm.pageNo = 1;
      this.fodderPageChange();
    },
    indexMethod(index) {
      return (this.queryForm.pageNo - 1) * 20 + index + 1;
    },
    activeAudit_getType(fileType) {
      const isAllrowTypes = /jpeg|png|jpg/i.test(fileType);
      return isAllrowTypes;
    },
    activity_ListEdit(row) {
      this.$router.push({
        path: "/byui/medium-activity-audit/" + row["adId"],
      });
    },
    activeAudit_ListEdit(adId, getVal) {
      var activeAudit_Post = {};
      activeAudit_Post["remark"] = "";
      activeAudit_Post["adId"] = adId;
      activeAudit_Post["isPass"] = getVal;
      if (!getVal) {
        this.$prompt("请输入驳回理由", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          inputErrorMessage: "请输入理由",
        })
          .then(({ value }) => {
            activeAudit_Post["remark"] = value;
            activityAudit
              .submitMyActive(activeAudit_Post)
              .then((res) => {
                // console.log(res, "提交1");
                if (res.data.status) {
                  this.$baseMessage("已提交", "success");
                }
              })
              .catch((err) => {
                this.$baseMessage("提交失败", "info");
              });
            this.activeAudit_getData();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入",
            });
          });
      } else {
        activityAudit
          .submitMyActive(activeAudit_Post)
          .then((res) => {
            // console.log(res, "提交2");
            if (res.data.status) {
              this.$baseMessage("已提交", "success");
              this.activeAudit_getData();
            }
          })
          .catch((err) => {
            this.$baseMessage("提交失败", "info");
          });
      }
    },
    activeAudit_ListDel(row) {
      if (row.adId) {
        this.$baseConfirm("你确定要删除当前项吗", null, () => {
          activityAudit.getMyMaterialDelete({ adId: row.adId }).then((res) => {
            this.$baseMessage("删除成功", "success");
            this.activeAudit_getData();
          });
        });
      } else {
        this.$baseMessage("未删除", "info");
      }
    },

    activeAudit_OpenImg(val) {
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
          this.$alert(
            `<div style="display:inline-block;width:204.8px; height:120px; background: url(${val.url[0]}) no-repeat;background-size: cover;"></div><div style="display:inline-block;width:256px; height:160px; background: url(${val.url[1]}) no-repeat;background-size: cover;"></div>`,
            "图片预览",
            {
              dangerouslyUseHTMLString: true,
              customClass: "openImgsAudit",
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
  },
};
</script>
<style lang="scss" scoped>
.openImgsAudit {
  p div {
    margin: 0 10px;
  }
}
.table-container-audit {
  .openImg {
    div {
      margin: 0 8px;
    }
    video {
      margin: 0 3px;
    }
  }
  .order_sty {
    display: flex;
    justify-content: space-between;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
    text-align: start;
    span {
      word-break: keep-all;
    }
  }
}
</style>
<style>
.openImgsAudit {
  width: 40vw;
  text-align: center;
}
.openImgsAudit p div {
  margin: 0 10px;
}
</style>
