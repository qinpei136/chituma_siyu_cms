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
              @click="fodder_getQuery"
              >查询
            </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="fodder_List"
      style="min-height: 50vh;"
      stripe
      :fit="true"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column label="素材ID" prop="materialId"> </el-table-column>
      <el-table-column prop="name" label="标题"></el-table-column>
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
            <!-- <video width="60" height="40" controls>
              <source :src="scope.row.url[0]" type="video/mp4" />
              <source />
            </video>
            <video width="64" height="40" controls>
              <source :src="scope.row.url[1]" type="video/mp4" />
              <source />
            </video> -->
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
                : fodderStatus[scope.row.stat]
            "
            class="item"
            effect="dark"
            placement="top-start"
          >
            <el-tag :type="scope.row.stat | statusFilter">
              {{ fodderStatus[scope.row.stat] }}</el-tag
            >
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="date"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="160">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.stat != 0 ? 'info' : 'primary'"
            size="mini"
            plain
            :disabled="scope.row.stat != 0"
            @click="fodder_ListEdit(scope.row.materialId, false)"
            >驳回
          </el-button>
          <el-button
            :type="scope.row.stat != 0 ? 'info' : 'primary'"
            size="mini"
            plain
            :disabled="scope.row.stat != 0"
            @click="fodder_ListEdit(scope.row.materialId, true)"
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
  </div>
</template>

<script>
import { getList, doDelete } from "@/api/table";
// import { getMaterialList, getMyMaterialDelete, MaterialAudit } from "@/apis";

import * as fodderAudit from "@/apis/model/fodderAudit.js";
export default {
  name: "FodderListAudit",
  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "success",
        0: "gray",
        2: "info",
        3: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      fodder_List: [],
      fodder_InitData: [],
      fodder_mapData: [],
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
        0: "未审核",
        1: "审核通过",
        2: "使用中",
        3: "未通过",
        4: "已完成",
      },
      fodder_ImgList: [],
      fodder_ImgIndex: null,
      fodder_ImgdialogVisible: false,
    };
  },
  created() {
    this.fodder_fetchData();
  },
  mounted() {},
  methods: {
    fodder_getData() {
      fodderAudit
        .getMaterialList()
        .then((res) => {
          // console.log(res, "list");
          if (res.data.status) {
            this.fodder_InitData = res.data.data;
            this.fodder_InitData = this.fodder_InitData.reverse();
            this.fodderTotal = this.fodder_InitData.length;
            if (this.fodderTotal > 0) {
              this.fodder_mapData = [...this.fodder_InitData];
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
    fodder_fetchData() {
      this.listLoading = true;
      this.fodder_getData();
    },
    fodderPageChange(val) {
      this.fodder_List = this.fodder_mapData.slice((val - 1) * 20, val * 20);
    },
    fodder_getQuery() {
      this.queryForm.pageNo = 1;
      this.fodderPageChange();
    },
    fodder_getType(fileType) {
      const isAllrowTypes = /jpeg|png|jpg/i.test(fileType);
      return isAllrowTypes;
    },
    fodder_ListEdit(materialId, getVal) {
      var materialIdPost = {};
      materialIdPost["remark"] = "";
      materialIdPost["materialId"] = materialId;
      materialIdPost["isPass"] = getVal;
      if (!getVal) {
        this.$prompt("请输入驳回理由", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          inputErrorMessage: "请输入理由",
        })
          .then(({ value }) => {
            materialIdPost["remark"] = value;
            fodderAudit
              .MaterialAudit(materialIdPost)
              .then((res) => {
                // console.log(res, "提交1");
                if (res.data.status) {
                  this.$baseMessage("已提交", "success");
                }
              })
              .catch((err) => {
                this.$baseMessage("提交失败", "info");
              });
            this.fodder_getData();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入",
            });
          });
      } else {
        fodderAudit
          .MaterialAudit(materialIdPost)
          .then((res) => {
            // console.log(res, "提交2");
            if (res.data.status) {
              this.$baseMessage("已提交", "success");
              this.fodder_getData();
            }
          })
          .catch((err) => {
            this.$baseMessage("提交失败", "info");
          });
      }
    },
    fodder_ListDel(row) {
      if (row.materialId) {
        this.$baseConfirm("你确定要删除当前项吗", null, () => {
          fodderAudit
            .getMyMaterialDelete({ materialId: row.materialId })
            .then((res) => {
              this.$baseMessage("删除成功", "success");
              this.fodder_getData();
              // console.log(res, "deleted");
              // this.fodder_fetchData();
            });
        });
      } else {
        this.$baseMessage("未删除", "info");
      }
    },
    handleClose(done) {
      done();
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
          // this.$alert(
          //   `<div style="display:inline-block;width:204.8px; height:120px; background: url(${val.url[0]}) no-repeat;background-size: cover;"></div><div style="display:inline-block;width:256px; height:160px; background: url(${val.url[1]}) no-repeat;background-size: cover;"></div>`,
          //   "图片预览",
          //   {
          //     dangerouslyUseHTMLString: true,
          //     customClass: "openImgsAudit",
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
.imgShow_ {
  display: inline-block;
  width: 768px;
  height: 450px;
  background-size: cover;
}
</style>
