<template>
  <div>
    <!-- ========物业管理头部区域=================== -->
    <byui-query-form>
      <byui-query-form-left-panel>
        <el-form
          ref="form"
          :inline="true"
          @submit.native.prevent
          class="el-form-item el-form-item--small"
        >
          <el-form-item label="物业/负责人">
            <el-input
              v-model="queryObj.properyStr"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="创建日期">
            <el-date-picker
              v-model="queryObj.createDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
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
          <el-form-item>
            <el-button type="primary" @click="propertyAdd">新增物业 </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>
    <!-- ==========================物业管理表格======================= -->
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="propertyList"
      style="min-height: 50vh;"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
        :index="indexMethod"
      ></el-table-column>

      <el-table-column label="物业名字">
        <template slot-scope="scope">
          <el-link prop="name" @click="go_orders(scope.row)">{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="proResponsi" label="联系人" width="160px"></el-table-column>
      <el-table-column prop="proPhone" label="联系人电话" width="200px"></el-table-column>
      <el-table-column prop="cos" label="所含小区"></el-table-column>
      <el-table-column prop="orders" label="订单总数" width="100px"></el-table-column>
      <el-table-column prop="totalBonus" label="分红总额"></el-table-column>
      <el-table-column prop="canDrawBonus" width="160px" label="可提金额"></el-table-column>
      <el-table-column prop="createAccount" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="150px"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作" width="450px" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="go_view(scope.row, false)"
            >查看
          </el-button>
          <el-button
            type="success"
            plain
            size="mini"
            @click="go_update(scope.row, true)"
            >修改
          </el-button>
          <el-button
            type="info"
            plain
            size="mini"
            @click="draw_bouns(scope.row, true)"
            >提现
          </el-button>
          <el-button
            v-if="scope.row.state === '启用'"
            type="warning"
            plain
            size="mini"
            @click="stopProperty(scope.row, false)"
            >停用
          </el-button>
          <el-button
            v-if="scope.row.state === '停用'"
            type="warning"
            plain
            size="mini"
            @click="stopProperty(scope.row, true)"
            >启用
          </el-button>
          <el-button
            v-if="scope.row.state === '停用'"
            type="danger"
            plain
            size="mini"
            @click="remProperty(scope.row, false)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 提现弹框区域 -->
    <el-dialog
      title="提示"
      :visible.sync="drawbounsDiag"
      width="30%"
      center
    >
      <el-row>
        <el-col :span="24">
          <!-- <el-card class="box-card"> -->
          <div>
            <el-row class="row_two" style="margin: 8px 40px;">
              <el-col :span="10"> 物业名字：{{ currentRow.name }} </el-col>
            </el-row>
            <el-row class="row_two" style="margin: 8px 40px;">
              <el-col :span="10"> 可提现金额：{{ currentRow.canDrawBonus }} </el-col>
            </el-row>
            <el-row class="row_two" style="margin: 8px 40px;">
              <el-col :span="6"> 提现数值：</el-col>
              <el-col :span="6">
                <el-input v-model="currentRow.drawBonus" placeholder="请输入" clearable></el-input>
              </el-col>
            </el-row>
            <div class="inp_row">输入的数值不得超过可提现金额</div>
          </div>
          <!-- </el-card> -->
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="drawbounsDiag = false">取 消</el-button>
        <el-button type="primary" @click="draw_bouns_opt"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分页功能 -->
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize" :total="propertyList.length" @current-change="allowPageChange"></el-pagination>
  </div>
</template>
<script>
import * as weapp from "@/apis/model/weapp.js"
export default {
  data() {
    return {
      orderForm: { name: "", meal: "" },
      listLoading: false,
      centerDialogVisible: false,
      elementLoadingText: "正在加载...",
      propertyList: [],
      propertyListOrig: [],
      queryObj: {
        properyStr: '',
        createDate: ''
      },
      // 状态
      statusList: [
        {
          name: "启用",
          status: "gray",
          value: 0,
        },
        {
          name: "停用",
          status: "green",
          value: 1,
        },
      ],
      // 分页功能内容区域
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      layout: "total, prev, pager, next, jumper",
      allowTotal: 0,
      background: true,
      drawbounsDiag: false,
      currentRow: {
        id: '',
        name: '',
        canDrawBonus: 0,
        drawBonus: 0
      },
      currentRow: {}
    };
  },
  created() {
    weapp.getProperties().then((res) => {
      if (res.data.status) {
        this.propertyList = res.data.data;
        this.propertyListOrig = res.data.data;
        this.listLoading = false;
      }
    })
  },
  methods: {
    indexMethod(index) {
      return (this.queryForm.pageNo - 1) * this.queryForm.pageSize + index + 1;
    },
    // 跳转到新增物业
    propertyAdd() {
      this.$route.params.propertyid = null
      this.$router.push({
        name: "property_update",      //与更新公用一个
      })
    },
    // 跳转到物业名称订单
    go_orders(row) {
      this.$router.push({
        name: "Property_orders",
        params: {
          propertyid: row.id,
          parentRow: row
        },
      });
    },
    // 查询事件
    query_SelectList() {
      if(this.queryObj.properyStr==''&& this.queryObj.createDate=='' ) 
        return 

      this.propertyList = this.propertyListOrig
      if(this.queryObj.properyStr != "" ) {
        this.propertyList = this.propertyList.filter(m => {
          return m.name.indexOf(this.queryObj.properyStr)>=0 || m.busResponsi.indexOf(this.queryObj.properyStr) >=0
        })
      }
      if(this.queryObj.createDate != "") {
        this.propertyList = this.propertyList.filter(m => {
          return m.createTime == this.queryObj.createDate
        })
      }
    },
    go_view(row, postIsVerify) {
      // this.mealForm = row;
      this.$router.push({
        name: "property_view",
        params: {
          id: row.id,
        },
      });
    },
    // 清空方法
    clearList() {
      this.queryObj.properyStr = ""
      this.queryObj.createDate = ""
      this.propertyList = this.propertyListOrig
      // this.getMaterilsData();
    },
    // 导出方法
    clearCenterList() {},
    // 修改方法
    go_update(row) {
      this.$router.push({
        name: "property_update",
        params: {
          propertyid: row.id,
        },
      })
    },
    //提现
    draw_bouns(row) {
      this.currentRow = row
      //this.currentRow.name = row.name
      //this.currentRow.canDrawBonus = row.canDrawBonus
      this.currentRow.drawBonus = 0
      this.currentRow.id = row.id
      this.drawbounsDiag = true
    },
    draw_bouns_opt() {
      let RegObj = new RegExp(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/)
      if(!RegObj.test(this.currentRow.drawBonus)) {
        this.$message('提现金额有非法字符')
        return
      }
      if(this.currentRow.drawBonus > this.currentRow.canDrawBonus) {
        this.$message('提现金额超过总额')
        return
      }
      if(this.currentRow.drawBonus < 0) {
        this.$message('提现金额需为正值')
        return
      }
      weapp.drawBouns({
        id: this.currentRow.id,
        bonus: this.currentRow.drawBonus
      }).then(res => {
        //console.log(res)
        console.log(this.currentRow.drawBonus)
        if(res.data.status) {
          this.currentRow.canDrawBonus -= this.currentRow.drawBonus
          this.currentRow.drawBonus = 0
          this.drawbounsDiag = false
          this.$message('提现成功')
        } else {
          this.$message('提现失败')
        }
      })
    },
    drawOpt() {
      this.drawbounsDiag = false
    },
    allowPageChange(val) {
      this.propertyList = this.propertyListOrig.slice((val - 1) * this.queryForm.pageSize, val * this.queryForm.pageSize);
    },
    stopProperty(row, flag) {
      this.currentRow = row
      if(flag) {    //启用
        weapp.startProperty({
          id: row.id
        }).then(res => {
          if(res.data.status) {
            row.state = '启用'
          } else {
            this.$message('停用失败')
          }
        })
      } else {    //停用
        weapp.stopProperty({
          id: row.id
        }).then(res => {
          if(res.data.status) {
            row.state = '停用'
          } else {
            this.$message('停用失败')
          }
        })
      }
    },
    remProperty(row, flag) {    //删除
        weapp.remProperty({
          id: row.id
        }).then(res => {
          if(res.data.status) {
            for(var i =0 ;i< this.propertyList.length;i++) {
              if(this.propertyList[i].id == row.id) {
                this.propertyList.splice(i, 1)
                return
              }
            }
            // this.propertyList= this.propertyList.filter(item => {
            //   //console.log(item)
            //   if(item.id !=row.ie) {
            //     console.log(item)
            //     return item
            //   }
            // })
          } else {
            this.$message('删除失败')
          }
        })
      console.log(row, flag)
    },
    //提现弹框时间
    // open() {
    //   this.$prompt("请输入邮箱", "提示", {

    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    //     inputErrorMessage: "邮箱格式不正确",
    //   })
    //     .then(({ value }) => {
    //       this.$message({
    //         type: "success",
    //         message: "你的邮箱是: " + value,
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "取消输入",
    //       });
    //     });
    // },
    // 点击物业名称跳转新页面
    go_name() {
      this.$router.push({
        name: "wxapp/property_name",
      });
    },
  },
};
</script>
<style scoped>
.inp_row {
  margin-left: 40px;
  color: red;
  font-size: 12px;
}
</style>
