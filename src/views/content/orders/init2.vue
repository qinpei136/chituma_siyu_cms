<template>
  <div class="table-container-init">
    <byui-query-form>
      <byui-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <!-- <el-dropdown @command="handleCommands">
              <span class="el-dropdown-link">
                {{ activeUsrName[active_Get]
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in active_Init"
                  :key="item.value"
                  :command="item.value"
                  v-text="item.label"
                >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </el-form-item>
          <el-form-item>
            <!-- <el-input
              v-model="ordersNameValue"
              :placeholder="activeUsrName[active_Get]"
              clearable
            ></el-input> -->
          </el-form-item>
        </el-form>
      </byui-query-form-left-panel>
      <byui-query-form-right-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="orders_ListAdd"
              >创建新订单
            </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="orders_List"
      :element-loading-text="elementLoadingText"
      style="min-height: 20vh;"
    >
      <el-table-column label="订单ID" prop="orderId"> </el-table-column>
      <el-table-column label="订单名称" prop="orderName"></el-table-column>
      <el-table-column label="设备数量" prop="devicesAmount"></el-table-column>
      <el-table-column label="审核状态" prop="orderStat">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderStat == 1 ? 'warning' : 'info'">
            {{ scope.row.orderStat == 1 ? "待审核" : "审核通过" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="orderStat">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderStat == 1 ? 'warning' : 'info'">
            {{ scope.row.orderStat == 1 ? "使用中" : "未使用" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="orderTime"></el-table-column>

      <el-table-column label="操作" width="180px" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="orders_ListEdit(scope.row)"
              >编辑
            </el-button> -->
          <el-button
            v-if="false"
            type="primary"
            size="mini"
            plain
            @click="orders_Listdetails(scope.row)"
            >查看
          </el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="orders_ListDel(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <byui-query-form-bottom-panel>
      <el-row type="flex" justify="space-around" align="bottom">
        <el-col :span="18">
          <el-pagination
            :background="background"
            :page-size="20"
            :layout="layout"
            :total="ordersTotal"
            @current-change="ordersPageChange"
          ></el-pagination>
        </el-col>
      </el-row>
    </byui-query-form-bottom-panel>
  </div>
</template>

<script>
import { getList, doDelete } from "@/api/table";
import * as orders from "@/apis/model/orders.js"; // src\apis\model\orders.js

import checkPermission from "@/utils/permission";
export default {
  name: "MediumOrdersInit",
  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "info",
        1: "success",
        2: "warning",
        3: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: [],
      matter_List: [],
      matter_InitData: [],
      matter_mapData: [],

      orders_InitData: [],
      orders_mapData: [],
      orders_List: [],

      listLoading: true,
      layout: "total, prev, pager, next, jumper", //  layout="prev, pager, next"
      total: 0,
      matterTotal: 0,
      ordersTotal: 0,
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      background: true,
      matter_DialogVisible: false,
      activeVisible: "0",
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
      matterStatusType: {
        0: "未审核",
        1: "审核通过",
        2: "使用中",
        3: "审核未通过",
      },
      materialsActiveStatus: {
        0: "未投放",
        1: "已投放",
        2: "使用中",
        3: "已结束",
        4: "已过期",
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
      isAllow: false,

      fodder_ImgList: [],
      fodder_ImgIndex: null,
      fodder_ImgdialogVisible: false,
    };
  },
  created() {
    this.getMaterilsData();
  },
  mounted() {},
  methods: {
    checkPermission,
    getMaterilsData() {
      try {
        // 获取数据
        orders.getOrdersDevice({}).then((res) => {
          if (res.data.status) {
            // console.log(res, "获取数据");
            this.listLoading = false;
            this.orders_InitData = res.data.data;
            this.orders_InitData = this.orders_InitData.reverse();
            this.ordersTotal = this.orders_InitData.length;
            if (this.ordersTotal > 0) {
              this.orders_mapData = [...this.orders_InitData];
              this.ordersPageChange(1);
            }
          }
        });
      } catch (error) {
        console.log(error);
        this.listLoading = false;
      }
    },
    ordersPageChange(val) {
      this.orders_List = this.orders_mapData.slice((val - 1) * 20, val * 20);
    },
    orders_ListAdd() {
      this.$router.push({ path: "/byui/medium-orders-create" }).catch((err) => {
        console.log(err);
      });
    },
    orders_ListEdit(row) {
      console.log(row, "编辑");
    },
    orders_Listdetails(row) {
      // console.log(row, "查看");
      this.$router.push({
        path: "/byui/medium_order/" + 114,
      });
    },
    orders_ListDel(row) {
      if (parseInt(row.orderStat) === 1) {
        this.$baseMessage("正在使用中，不可删除", "warning");
        return false;
      }
      this.$baseConfirm("你确定要删除当前项吗", null, () => {
        orders
          .delMyMaterialDelete({
            orderId: row["orderId"],
          })
          .then((res) => {
            // console.log(res);
            this.$baseMessage("删除成功", "success");
            this.getMaterilsData();
          });
      });
    },
    handleClose(done) {
      done();
    },

    handleAvatarSuccess() {},
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
.active_dialog {
  width: 40%;
  margin: 2rem auto;
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
.initImgShow_ {
  display: inline-block;
  width: 768px;
  height: 450px;
  background-size: cover;
}
</style>
