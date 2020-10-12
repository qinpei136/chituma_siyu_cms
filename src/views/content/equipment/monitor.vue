<template>
  <div class="table-container">
    <byui-query-form>
      <byui-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item label="播放情况:" class="lastFoemItem">
            <el-radio-group v-model="stateLable" clearable>
              <el-radio-button
                v-for="item in playState"
                :key="item.value"
                :label="item.label"
              >
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="订单名称：">
            <el-input
              v-model="toSend.orderName"
              placeholder="订单名称"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="设备状态：">
            <el-select
              v-model="toSend.deviceState"
              placeholder="投放状态"
              clearable
            >
              <el-option
                v-for="item in equipmentState"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市区/行政/小区：">
            <el-input
              v-model="toSend.name"
              placeholder="市区/行政/小区"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </byui-query-form-left-panel>
      <byui-query-form-right-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="activeGetData"
              >查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-refresh"
              type="primary"
              @click="activeClearGetData"
              >清空
            </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="pageList"
      :row-class-name="tableRowClassName"
      style="min-height: 50vh;"
      :element-loading-text="elementLoadingText"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="false" type="selection" width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        :index="indexMethod"
      >
      </el-table-column>

      <el-table-column sortable prop="0" label="订单名称"></el-table-column>
      <el-table-column prop="1" label="订单编号"></el-table-column>
      <el-table-column sortable prop="2" label="城市"></el-table-column>
      <el-table-column sortable prop="3" label="区域"> </el-table-column>
      <el-table-column sortable prop="4" label="小区"> </el-table-column>
      <el-table-column prop="5" label="设备名称"> </el-table-column>
      <el-table-column sortable prop="6" label="设备状态">
        <template slot-scope="scope">
          <el-tag>
            {{
              equipmentState.filter((m) => m.value == scope.row[6]).length > 0
                ? equipmentState.filter((m) => m.value == scope.row[6])[0].label
                : ""
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable prop="7" label="播放次数"> </el-table-column>
      <el-table-column sortable prop="8" label="最后播放时间">
      </el-table-column>
    </el-table>

    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="activityTotal"
      @current-change="activityPageChange"
      @size-change="activitySizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import * as model from "@/apis/model/model.js";

import * as actives from "@/apis/model/active";
import * as activitys from "@/apis/json/activity";
// import * as userCoupon from "@/apis/model/userCoupon";

import { downs } from "@/utils/getDownloadExcel"; // src\utils\getDownloadExcel.js
import { parseTime } from "@/utils/index.js";
import * as utils from "@/utils/index";
import * as ordersCreate from "@/apis/model/ordersCreate";
export default {
  name: "MediumActivitys",
  components: {},
  filters: {},
  data() {
    return {
      pageName: "",
      allList: [],
      pageList: [],
      playState: [
        { value: 3, label: "5分钟内未播放" },
        { value: 2, label: "1小时内未播放" },
        { value: 1, label: "本日未播放" },
      ],
      stateLable: "",
      listLoading: false,
      layout: "total, prev, pager, next,  jumper",
      activityTotal: 0,
      background: true,
      elementLoadingText: "正在加载...",
      queryForm: {
        pageNo: 1,
        pageSize: 20,
      },

      active: 1,
      multipleSelection: [],

      toSend: { name: "", query: "", deviceState: "", orderName: "" },
      // equipmentState: {
      //   0: "离线",
      //   1: "在线",
      // },
      equipmentState: [
        { value: 100, label: "全部" },
        { value: 0, label: "离线" },
        { value: 1, label: "在线" },
      ],
      getWay: {
        0: "系统发放",
        1: "其他",
      },
      postForm: {
        name: "",
        UsrName: "",
        gender: 0,
        getAge: 1,
        material: "",
        ageList: [],
        checkTime: 15,
        timeList: [],
        price: "",
      },
    };
  },
  watch: {
    "postForm.ageList": {
      handler(newList, oldList) {
        if (newList.length < 1) {
          this.postForm.getAge = 1;
        } else {
          this.postForm.getAge = 0;
        }
      },
      deep: true,
      immediate: true,
    },
    stateLable: {
      handler(val) {
        if (val) {
          let data = this.playState.filter((m) => m.label == val);
          if (data.length > 0) {
            this.toSend.query = data[0].value;
            this.initData();
          }
        }
        // this.list = [];
        // this.initDeviceData = [];
        this.pageNo = 1;
        this.total = 0;
      },
    },
  },
  created() {
    this.pageName = this.$route.name;
    // this.initData();
  },
  mounted() {},
  methods: {
    initData() {
      if (this.toSend.query == "") {
        this.$message({
          type: "info",
          message: "请先选择播放情况",
        });
        return false;
      }
      this.listLoading = true;
      model
        .showMonitor({ ...this.toSend })
        .then((res) => {
          if (res.data.status) {
            let data = res.data.data;
            console.log(this.toSend);
            if (this.toSend.name) {
              data = data.filter(
                (m) =>
                  m[2].indexOf(this.toSend.name) != -1 ||
                  m[3].indexOf(this.toSend.name) != -1 ||
                  m[4].indexOf(this.toSend.name) != -1
              );
            }
            if (this.toSend.orderName) {
              data = data.filter(
                (m) => m[0].toString().indexOf(this.toSend.orderName) != -1
              );
            }
            if (this.toSend.deviceState != 100) {
              data = data.filter(
                (m) => m[6].toString().indexOf(this.toSend.deviceState) != -1
              );
            }
            this.activityTotal = data.length;
            this.allList = [...data];
            this.activityPageChange(1);
          }
          this.listLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.listLoading = false;
        });
    },
    activityPageChange(val) {
      this.queryForm.pageNo = val;
      this.pageList = this.allList.slice(
        (val - 1) * this.queryForm.pageSize,
        val * this.queryForm.pageSize
      );
    },
    activitySizeChange(val) {
      this.queryForm.pageSize = val;
      this.activityPageChange(1);
    },
    indexMethod(index) {
      return (this.queryForm.pageNo - 1) * this.queryForm.pageSize + index + 1;
    },

    tableRowClassName({ row, rowIndex }) {
      var getMainArr = this.$route.params.mainArr;
      getMainArr = getMainArr ? getMainArr : [];
      if (getMainArr.indexOf(row.adId) > -1) {
        return "warning-row";
      }
      return "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    activeGetData() {
      this.initData();
    },
    activeClearGetData() {
      this.toSend.query = 100;
      this.toSend.name = "";
      this.initData();
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar-uploader {
  text-align: center;
}
.active_order_sty {
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
.el-dropdown-link_ {
  cursor: pointer;
  border: 1px solid #91b1d0;
}
</style>

<style>
.boxCard {
  width: 100%;
}
.clearfix {
  display: inline-block;
  text-align: start;
}
.el-table .warning-row {
  background: #a8edea;
}

.el-table .success-row {
  background: #49b50f;
}
.maEledalog {
  margin-top: 0;
  width: 66%;
}
</style>
