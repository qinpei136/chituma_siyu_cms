<template>
  <div>
    <!-- 物业管理顶部位置 -->
    <div class="property_Btn">
      <div class="property_ye">新增物业</div>
      <div class="Btn_return">
        <el-button type="primary" @click="btn_return">返回</el-button>
      </div>
    </div>
    <!-- 物业管理订单信息 -->
    <div class="property_xin">物业信息录入</div>
    <el-card>
      <byui-query-form style="width: 100%;">
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item
            label="物业名称"
            class="el-form-item el-form-item1 el-form-item--small"
          >
            <el-input v-model="ordersNameValue" placeholder="请输入" />
          </el-form-item>
          <span class="el-form-item2">
            <el-form-item label="物业联系人">
              <el-input v-model="ordersNameValue" placeholder="请输入" />
            </el-form-item>
          </span>
          <el-form-item label="联系人手机号">
            <el-input v-model="ordersNameValue" placeholder="请输入" />
          </el-form-item>
          <span class="loding">注: 小程序登录时以手机号和验证码登录</span>
          <br />
          <el-form-item label="业务负责人">
            <el-input v-model="ordersNameValue" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="负责人手机号">
            <el-input v-model="ordersNameValue" placeholder="请输入" />
          </el-form-item>
        </el-form>
      </byui-query-form>
    </el-card>
    <!-- 物业管理订单信息 -->
    <div class="property_xin">物业所含小区</div>
    <el-card>
      <byui-query-form>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item label="城市">
            <el-select v-model="toSend.cityType" placeholder="合肥" clearable>
              <el-option
                v-for="item in cityType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="ordersNameValue"
              placeholder="请输入小区/区域关键词"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </byui-query-form>
      <!-- ============穿梭框内容 ====================-->
      <el-transfer
        left-footer
        v-model="value"
        :props="{
          key: 'value',
          label: 'desc',
        }"
        :data="data"
      >
      </el-transfer>
    </el-card>
    <!-- ================取消和保存按钮区域=================== -->
    <div class="fotter">
      <el-row>
        <el-col>
          <el-button @click="isShowDrawer = false">取 消</el-button>
          <el-button v-if="isShowkeep" type="primary" @click="saveCouponsForm"
            >保 存</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as weapp from "@/apis/model/weapp.js";
export default {
  data() {
    return {
      // data: generateData(),
      value: [],

      isShowkeep: true,
      isShowDrawer: false,
      isShowkeep: true,

      ordersNameValue: "",
      toSend: { cityType: "", meal: "", payPrice: "", adStart: "" }, // input绑定的值
      // 城市状态下拉内容
      cityType: [
        { value: 0, label: "长沙" },
        { value: 1, label: "南京" },
      ],
     
      name: "" /* 物业名称 */,
      proResponsi: "" /* 物业联系人 */,
      proPhone: "" /* 联系人手机号 */,
      busResponsi: "" /* 业务负责人 */,
      busPhone: "" /* 业务负责人联系电话 */,
    };
  },
  methods: {
    saveCouponsForm() {
      // this.isShowkeep = false;
    },
    // 返回列表页
    btn_return() {
      this.$router.push({
        name: "weappp_property_management",
      });
    },
  }
};
</script>
<style scoped>
.property_Btn {
  padding: 20px 20px;
  width: 100%;
  display: inline-flex;
  align-content: center;
  justify-content: center;
}
.property_ye {
  width: 90%;
  display: inline-flex;
  align-content: center;
  justify-content: center;
  font-size: 30px;
}
.Btn_return {
  width: 10%;
  display: inline-flex;
  align-content: flex-end;
  justify-content: flex-end;
}
.property_xin {
  padding: 10px 10px;
  font-size: 15px;
  font-weight: 600;
}
.loding {
  font-size: 12px;
  color: grey;
  margin-top: 5px;
}
.fotter {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.el-form-item1 {
  margin-left: 5px;
}
.el-form-item2 {
  margin-left: 17px;
}
.el-form-item {
  margin-left: 20px;
}
</style>
