<template>
  <div>
    <!-- 物业管理订单信息 -->
    <div class="view_title">
      <div class="property_xin">
        物业信息录入
      </div>
      <el-button type="primary" @click="go_property">返回</el-button>
    </div>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div>
            <el-row class="row_two" style="margin: 8px 40px;">
              <el-col :span="6"> 物业名称：{{ orderForm.name }} </el-col>
              <el-col :span="6"> 物业联系人：{{ orderForm.proResponsi }} </el-col>
              <el-col :span="6"> 联系人电话：{{ orderForm.proPhone }} </el-col>
              <el-col :span="6"> 所含小区：{{ orderForm.cos.length }} </el-col>
            </el-row>
            <el-row class="row_two" style="margin: 8px 40px;">
              <el-col :span="6"> 业务负责人：{{ orderForm.busResponsi }} </el-col>
              <el-col :span="6"> 负责人电话{{ orderForm.busPhone }} </el-col>
              <el-col :span="6"> 订单总数：{{ orderForm.orders }}</el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 小区信息 -->
    <div class="property_xin">小区信息</div>
    <el-row> </el-row>
    <el-row> </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card" style="margin: 8px 40px;">
          <div>
            <el-row class="row_two">
              <el-col :span="6"> 分红总金额：{{ orderForm.totalBonus }} </el-col>
              <el-col :span="6"> 待提现金额：{{ orderForm.drawingBonus }} </el-col>
              <el-col :span="6"> 已提现金额：{{ orderForm.drawBonus }} </el-col>
              <el-col :span="6"> 可提现金额：{{ orderForm.canDrawBonus }} </el-col>
            </el-row>
            <el-table ref="tableSort" v-loading="listLoading" :data="orderForm.cosDetail" style="min-height: 50vh;" :element-loading-text="elementLoadingText">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column prop="community" label="小区名称"></el-table-column>
              <el-table-column prop="city" label="所属城市" width="160px"></el-table-column>
              <el-table-column prop="district" label="行政区"></el-table-column>
              <el-table-column prop="orders" label="订单数量">
                <template slot-scope="scope">
                  <el-link type="success" prop="name" @click="get_orders(scope.row)">{{scope.row.orders}}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="totalBonus" label="分红总金额" ></el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <div class="community_da">
      <div class="community_header">
        <div>分红总金额：</div>
        <div>待提现金额：</div>
        <div>已提现金额：</div>
        <div>可提现金额：</div>
      </div>

      <el-table
        ref="tableSort"
        v-loading="listLoading"
        :data="oderList"
        style="min-height: 50vh;"
        :element-loading-text="elementLoadingText"
      >
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="account" label="小区名称"></el-table-column>
        <el-table-column prop="mobile" label="所属城市" width="160px">
        </el-table-column>
        <el-table-column prop="meal" label="行政区"></el-table-column>

        <el-table-column prop="payPrice" label="订单数量"></el-table-column>
        <el-table-column prop="bonusRatio" label="分红总金额"></el-table-column>
      </el-table>
    </div> -->
    <el-dialog title="订单信息" :visible.sync="coOrderDetailDiag" class="dialogClass">
      <byui-query-form>
        <byui-query-form-left-panel>
          <el-form  ref="form" :inline="true" @submit.native.prevent class="el-form-item el-form-item--small">
            <el-form-item label="订单状态" :label-width="formLabelWidth" >
              <el-select v-model="queryObj.currentStatus" placeholder="请选择" @change="orderStatusSelect">
                <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="订单来源" :label-width="formLabelWidth">
              <el-select v-model="queryObj.currentMeal" placeholder="请选择" @change="orderSourSelect">
                <el-option v-for="item in mealStatus" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-form>
          <div style="width: 500px; height: 3px;"></div>
        </byui-query-form-left-panel>
        <byui-query-form-right-panel>
          <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
            <el-form-item><el-button type="primary" @click="query_SelectList">查询</el-button></el-form-item>
            <el-form-item><el-button type="primary" @click="clearList">清空 </el-button></el-form-item>
            <el-form-item><el-button type="primary" @click="clearCenterList">导出 </el-button></el-form-item>
          </el-form>
        </byui-query-form-right-panel>
      </byui-query-form>
      <el-row>
        <el-col :span="8">订单数/投放中订单数：{{currentTotalOrderNum}}</el-col>
        <el-col :span="8">分红总金额：{{currenttotalDrawBouns}}</el-col>
      </el-row>
      <el-table :data="coOrderDetailData" style="margin-top:20px">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column property="orderName" label="订单来源" width="200"></el-table-column>
        <el-table-column property="account" label="客户微信昵称"></el-table-column>
        <el-table-column property="orderTime" label="下单时间" width="150"></el-table-column>
        <el-table-column property="orderStat" label="订单状态" width="200"></el-table-column>
        <el-table-column property="payPrice" label="订单金额"></el-table-column>
        <el-table-column property="bonusRatio" label="分红比例" width="150"></el-table-column>
        <el-table-column property="bonusVal" label="分红金额" width="200"></el-table-column>
      </el-table>
      <el-pagination
        :background="background"
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="coOrderDetailData.length"
        @current-change="allowPageChange"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="coOrderDetailDiag = false">取 消</el-button>
        <el-button type="primary" @click="coOrderDetailDiag = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as weapp from "@/apis/model/weapp.js"
import * as activityStatus from "@/apis/json/activity.js"
import { Store } from 'vuex';
export default {
  data() {
    return {
      orderStatus: [],
      mealStatus: [],
      queryObj: {
        currentStatus: '',
        currentMeal: ''
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        title: "",
      },
      currentTotalOrderNum: 0,
      currenttotalDrawBouns: 0,
      orderForm: {
        //业务负责人
        busResponsi: null,
			  //业务负责人电话
        busPhone: null,
			  //物业联系人
        proResponsi: null,
			  //物业联系人电话
        proPhone: null,
			  //覆盖城市
        cts: null,
			  //物业包含小区数
        cos: 2,
        _id: "5f82c7c922f0ad7a1808f7fd",
			  //物业Id
        id: 2,
			  //物业名称
        name: null,
			  //状态
        state: "启用",
			  //创建时间
        createTime: "2020-10-11T09:52:45.033Z",
        __v: 0,
			  //创建人
        createAccount: null,
        devs: null,
			  //包含的订单数
        orders: 14,
			  //分红总金额
        totalBonus: 73.5,
			  //可提现金额
        canDrawBonus: 21,
			  //已提现金额
        drawBonus: 31.5,
			  //待提现金额
        drawingBonus: 21,
        cosDetail: []
      },
      orderId: "",
      listLoading: false,
      elementLoadingText: "正在加载...",
      formLabelWidth: "100px",
      queryForm: {},
      coOrderDetailDiag: false,
      coOrderDetailData: [],
      coOrderDetailDataOrig: [],   //小区订单详情表
      background: true,
      layout: "total, prev, pager, next, jumper",
    };
  },
  created() {
    //this.orderStatus = activityStatus.activeStatus
    var Storeage=window.localStorage
    if(this.$route.params.id) {
      this.orderId = this.$route.params.id
      Storeage["propertyId"] = this.orderId
    } else {
      this.orderId = Storeage["propertyId"]
    }
    //console.log(this.orderId)
    weapp.getProperty({ id: this.orderId }).then((res) => {
      //console.log(res.data.data);
      //console.log(this.oders);
      this.orderForm = res.data.data
      // 给定义好的数组赋值
      // this.orderlist = res.data.data;
      this.listLoading = false;
    })
  },
  methods: {
    allowPageChange(val) {
      console.log(val)
      this.coOrderDetailData = this.coOrderDetailData.slice((val - 1) * this.queryForm.pageSize, val * this.queryForm.pageSize);
    },
    getMaterilsData() {

    },
    query_SelectList() {},
    clearList() {
      this.queryObj = {
        currentStatus: '',
        currentMeal: ''
      }
      this.coOrderDetailData = this.coOrderDetailDataOrig
    },
    clearCenterList() {},
    orderStatusSelect(e) {
      this.coOrderDetailData = this.coOrderDetailDataOrig.filter(item => {
        return item.orderStat == e
      })
    },
    orderSourSelect(e) {
      this.coOrderDetailData = this.coOrderDetailDataOrig.filter(item => {
        return item.orderName == e
      })
    },
    go_property() {
      this.$router.push({
        name: "weappp_property_management",
      });
    },
    get_orders(row) {
      //console.log(row)
      this.coOrderDetailDiag = true
      weapp.getCoDetailMana({
        adCommunity: row.communityId
      }).then(res => {
        //console.log(res.data.data)
        this.coOrderDetailDataOrig = res.data.data
        this.coOrderDetailData = res.data.data
        var set = new Set()
        var set1 = new Set()
        this.mealStatus = []
        this.coOrderDetailData.forEach(item=>{
          if(!set.has(item.orderName)) {
            set.add(item.orderName)
          }
          if(!set1.has(item.orderStat)) {
            set1.add(item.orderStat)
          }
        })
        set.forEach(item => {
          this.mealStatus.push({
            label: item,
            value: item
          })
        })
        set1.forEach(item => {
          this.orderStatus.push({
            label: item,
            value: item
          })
        })
      })
    }
  },
};
</script>
<style scoped>
.view_title {
  padding: 10px 10px;
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
}
.propertyt_da {
  width: 100%;
  height: 200px;
  border: 1px solid black;
}
.property_xin {
  padding: 10px 10px;
  font-size: 15px;
  font-weight: 600;
}
.viwe_dada {
  width: 100%;
  height: 100px;
  margin-left: 50px;

  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
}
.view_two {
  width: 100%;
  margin-left: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
}
.view_count1 {
  width: 25%;
}
.view_count {
  width: 25%;
}
/* 小区信息区域样式 */
.community_da {
  width: 100%;
  height: 500px;
  border: 1px solid black;
}
.community_header {
  width: 100%;
  padding: 30px 30px;
  display: inline-flex;
  justify-content: space-around;
}
.row_two {
  padding: 20px 20px;
}
.dialogClass {
  width: 100%;
  height: 100%;
}
</style>
