<template>
  <div>
    <div class="property_xin">
      物业分红明细<span class="property_zhu"
        >注：订单收入是指已完成投放的订单分红明细</span
      >
    </div>
    <el-card class="box-card">
      <div>
        <el-row class="row_two" style="margin: 8px 40px;">
          <el-col :span="6"> 分红总金额：{{ parentRow.totalBonus }} </el-col>
          <el-col :span="6"> 待提现金额：{{ parentRow.drawingBonus }} </el-col>
          <el-col :span="6"> 已提现金额：{{ parentRow.drawBonus }} </el-col>
        </el-row>
      </div>
    </el-card>

    <byui-query-form>
      <byui-query-form-left-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-select v-model="queryObj.type" placeholder="收益类型" clearable>
              <el-option
                v-for="item in state"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="queryObj.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form>
        <div style="width: 500px; height: 3px;"></div>
      </byui-query-form-left-panel>

      <byui-query-form-right-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-button type="primary" @click="query_SelectList"
              >查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clearList">清空 </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clearCenterList">导出 </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>
    <!-- ================订单表格区域============= -->
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="propertyBoundsDetailAry"
      style="width: 100%;"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column prop="createTimeStr" label="记录时间" width="200px"></el-table-column>
      <el-table-column prop="bonus" label="分红金额"></el-table-column>
      <el-table-column prop="state" label="类型">
        <template slot-scope="scope">
          <div v-if="scope.row.state=='订单收入'">
            <el-link type="success" @click="get_ordersDetail(scope.row)">{{scope.row.state}}</el-link>
          </div>
          <div v-else>{{scope.row.state}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="restBonus" label="剩余分红金额"></el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="propertyBoundsDetailAryOrig.length"
      @current-change="allowPageChange"
    ></el-pagination>
    <el-dialog title="订单信息" :visible.sync="orderDetailDiag" class="dialogClass">
      <el-table :data="orderDetailAry" style="margin-top:20px">
        <el-table-column property="orderName" label="订单来源" width="200"></el-table-column>
        <el-table-column property="adCommunity" label="投放小区"></el-table-column>
        <el-table-column property="account" label="客户微信昵称" width="150"></el-table-column>
        <el-table-column property="orderTime" label="下单时间" width="200"></el-table-column>
        <el-table-column property="orderStat" label="订单状态"></el-table-column>
        <el-table-column property="payPrice" label="订单金额" width="150"></el-table-column>
        <el-table-column property="bonusRatio" label="分红比例" width="200"></el-table-column>
        <el-table-column property="bonusVal" label="分红金额" width="200"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderDetailDiag = false">取 消</el-button>
        <el-button type="primary" @click="orderDetailDiag = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as weapp from "@/apis/model/weapp.js";
export default {
  data() {
    return {
      propertyid: 0,
      parentRow: {},
      oderList: [],
      orderForm: {},
      filterDate: "",
      listLoading: false,
      queryObj: {
        type: '',   //收益类型
        dateRange: ''
      },
      // 收益类型下拉内容值
      state: [
        { value: "订单收入", name: "订单收入" },
        { value: "物业提现", name: "物业提现" },
      ],
      // 分页功能内容区域
      background: true,
      allowTotal: 0,
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        title: "",
      },
      elementLoadingText: "正在加载...",
      layout: "total, prev, pager, next, jumper",
      propertyBoundsDetailAry: [],
      propertyBoundsDetailAryOrig: [],
      orderDetailDiag: false,
      orderDetailAry: []    //只有一条记录,
    };
  },
  created() {
    //console.log(this.$route)
    var Storeage=window.localStorage
    if(this.$route.params.propertyid && this.$route.params.parentRow ) {
      this.propertyid = this.$route.params.propertyid
      this.parentRow = this. $route.params.parentRow

      Storeage["propertyid"] = this.propertyid
      Storeage["parentRow"] = this.parentRow
    } else {
      this.propertyid = Storeage["propertyid"]
      this.parentRow = Storeage["parentRow"]
      console.log(this.propertyid)
      console.log(this.parentRow)
    }
    //console.log(this.parentRow)
    weapp.getPropertyBounsDetail({id: this.propertyid}).then(res => {
      //console.log(res)
      this.propertyBoundsDetailAryOrig = res.data.data
      this.propertyBoundsDetailAry = this.propertyBoundsDetailAryOrig.slice(0, this.queryForm.pageSize);
      //console.log(res)
    })
    //console.log(this.propertyid)
  },
  methods: {
    allowPageChange(val) {
      console.log(val)
      this.propertyBoundsDetailAry = this.propertyBoundsDetailAryOrig.slice((val - 1) * this.queryForm.pageSize, val * this.queryForm.pageSize);
    },
    // 查询方法
    query_SelectList() {
      this.propertyBoundsDetailAry = this.propertyBoundsDetailAryOrig
      if(this.queryObj.type!="") {
        this.propertyBoundsDetailAry = this.propertyBoundsDetailAry.filter(m => {
          return m.state == this.queryObj.type
        })
      }
      if(this.queryObj.dateRange.length > 1) {
        this.propertyBoundsDetailAry = this.propertyBoundsDetailAry.filter(m => {
          var tempStr = m.createTimeStr.substr(0, 10)
          return tempStr >= this.queryObj.dateRange[0] && tempStr <= this.queryObj.dateRange[1]
        })
      }
    },
    // 清空的方法
    clearList() {
      this.queryObj = {
        type: '',
        dateRange: ''
      }
      this.propertyBoundsDetailAry = this.propertyBoundsDetailAryOrig
    },
    // 导出方法
    clearCenterList() {},
    get_ordersDetail(row) {
      console.log(row)
      weapp.getBonusOrder({
        orderId: row.orderId
      }).then(res=>{
        //console.log(res)
        this.orderDetailAry = [res.data.data]
        //console.log(this.orderDetailAry)
        this.orderDetailDiag = true
      })

    }
  },
};
</script>
<style scoped>
.property_xin {
  padding: 10px 10px;
  font-size: 20px;
  font-weight: 600;
  margin-left: 10px;
}
.property_zhu {
  font-size: 12px;
  color: grey;
  margin-left: 15px;
}
.oders_da {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
}
.oder_count {
  width: 20%;
  height: 150px;
  border: 1px solid black;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.rung {
  margin-bottom: 10px;
}
.dialogClass {
  width: 100%;
}
</style>
