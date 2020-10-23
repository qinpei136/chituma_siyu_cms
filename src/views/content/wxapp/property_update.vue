<template>
  <div>
    <!-- 物业管理顶部位置 -->
    <div class="property_Btn">
      <div class="property_ye">{{actionTitle}}</div>
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
            <el-input v-model="selectedProperty.name" placeholder="请输入" />
          </el-form-item>
          <span class="el-form-item2">
            <el-form-item label="物业联系人">
              <el-input v-model="selectedProperty.proResponsi" placeholder="请输入" />
            </el-form-item>
          </span>
          <el-form-item label="联系人手机号">
            <el-input v-model="selectedProperty.proPhone" placeholder="请输入" />
          </el-form-item>
          <span class="loding">注: 小程序登录时以手机号和验证码登录</span>
          <br />
          <el-form-item label="业务负责人">
            <el-input v-model="selectedProperty.busResponsi" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="负责人手机号">
            <el-input v-model="selectedProperty.busPhone" placeholder="请输入" />
          </el-form-item>
        </el-form>
      </byui-query-form>
    </el-card>
    <!-- 物业管理订单信息 -->
    <div class="property_xin">物业所含小区</div>
    <el-card>
        <el-form>
          <el-row>
            <el-col :span=5>
              <el-form-item label="市区:">
                <el-select v-model="selectedProperty.city" size="mini" @change="SelectCity">
                  <el-option v-for="item in cities" :key="item.city_id" :label="item.city_name" :value="item.city_id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span=6>
              <el-form-item label="行政区:">
                <el-select v-model="selectedProperty.district" size="mini" @change="SelectDistrict">
                  <el-option v-for="item in districts" :key="item.district_id" :label="item.district_name" :value="item.district_id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      <!-- 穿梭框内容 -->
      <el-transfer left-footer v-model="selectedProperty.cos" :data="comunities" :titles="titles" :button-texts="['移除', '添加']"></el-transfer>
    </el-card>
    <!-- ================取消和保存按钮区域=================== -->
    <div class="fotter">
      <el-row>
        <el-col>
          <el-button @click="cancelOpt">重 置</el-button>
          <el-button type="primary" @click="saveOpt"
            >保 存</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as weapp from "@/apis/model/weapp.js"
import * as ordersCreate from "@/apis/model/ordersCreate.js"
export default {
  data() {
    return {
      //物业id
      propertyid: 0,
      actionTitle: '修改物业',
      selectedProperty: {
        name: '',   //物业名称
        busResponsi: '',    //业务负责人
        busPhone: '',     //业务负责人电话
        proResponsi: '',  //物业联系人
        proPhone: '',   //物业联系人电话
        city: '',
        district: '',
        userId: [],
        flag: 15,
        amounts: null,
        userDataCycle: "",
        cts: [],
        cos: [],
        devs: ''
      }, 
      cities: [],
      districts: [],
      comunities: [],
      dataTemp: [],
      valueTemp: [],
      titles: ['待选小区', '已选小区']
    };
  },
  methods: {
    saveOpt() {
      // this.isShowkeep = false;
      if(this.selectedProperty.name == '') {
        this.$message('物业名称为空')
        return
      }
      if(this.selectedProperty.busResponsi == '') {
        this.$message('业务负责人为空')
        return
      }
      if(this.selectedProperty.busPhone == '') {
        this.$message('业务负责人电话为空')
        return
      }
      if(this.selectedProperty.proResponsi == '') {
        this.$message('物业联系人为空')
        return
      }
      if(this.selectedProperty.proPhone == '') {
        this.$message('物业联系人电话为空')
        return
      }
      if(this.selectedProperty.cos.length == 0) {
        this.$message('小区为空')
        return
      }
      if(this.propertyid == 0) {    //新增
        weapp.addProperty({...this.selectedProperty}).then(res => {
          if(res.data.status) {
            this.$message('新增成功')
          } else {
            this.$message(res.data.message)
          }
        })
      } else {      //修改
      this.selectedProperty.id = this.propertyid
        weapp.updateProperty({...this.selectedProperty}).then(res => {
          if(res.data.status) {
            this.$message('修改成功')
          } else {
            this.$message(res.data.message)
          }
        })
      }
      console.log(123)
      this.$router.push({
        name: "weappp_property_management",
      })
      console.log(123)
    },
    cancelOpt() {
        this.selectedProperty = {
        name: '',   //物业名称
        busResponsi: '',    //业务负责人
        busPhone: '',     //业务负责人电话
        proResponsi: '',  //物业联系人
        proPhone: '',   //物业联系人电话
        city: '',
        district: '',
        userId: [],
        selectedDistricts: [],
        flag: 15,
        amounts: null,
        userDataCycle: "",
      }
      console.log(this)
      // this.isShowkeep = false;
    },
    // 返回列表页
    btn_return() {
      this.$router.push({
        name: "weappp_property_management",
      });
    },
    SelectCity() {
      ordersCreate.postMyCommunity({city_ids: [this.selectedProperty.city]})
      .then(res => {
        this.districts = res.data.data
      })
    },
    SelectDistrict() {
      ordersCreate.postMyUnit({city_ids: [this.selectedProperty.city],district: [this.selectedProperty.district]})
      .then(res => {
        this.comunities = res.data.data.map(item => {
          return {
            key: item.co_id,
            label: item.co_name
          }
        })
        //this.comunities = res.data.data
      })
    }
  },
  mounted() {
    ordersCreate.getMygetCities()
    .then(res => {
      this.cities = res.data.data
    })
  },
  created() {
    if(this.$route.params.propertyid) {   //修改
      this.propertyid = this.$route.params.propertyid
      weapp.getProperty({id: this.propertyid}).then(res => {
        //console.log(res)
        this.selectedProperty = res.data.data
        this.comunities = this.selectedProperty.cos.map(m=>{
          return {
            label: m.name,
            key: m.id
          }
        })
        this.selectedProperty.cos = this.comunities.map(m => m.key)
        console.log(this.selectedProperty)
      })

    } else {    //添加
      this.actionTitle = '新增物业'
    }
    //console.log(this.oders)
  },
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
