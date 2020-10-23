<template>
  <div>
    <!-- 物业提现信息 -->
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
              <el-table-column prop="orders" label="订单数量"></el-table-column>
              <el-table-column prop="totalBonus" label="分红总金额" ></el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as weapp from "@/apis/model/weapp.js";
export default {
  data() {
    return {
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
      oders: "",
      listLoading: false,
      elementLoadingText: "正在加载...",
    };
  },
  created() {
    this.oders = this.$route.params.id
    weapp.getProperty({ id: this.oders }).then((res) => {
      console.log(res);
      //console.log(this.oders);
      this.orderForm = res.data.data
      // 给定义好的数组赋值
      // this.orderlist = res.data.data;
      this.listLoading = false;
    })
  },
  methods: {
    getMaterilsData() {

    },
    go_property() {
      this.$router.push({
        name: "weappp_property_management",
      });
    },
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
</style>
