<template>
  <div class="orderCreate_container">
    <byui-query-form>
      <byui-query-form-left-panel>
        <el-form :inline="true">
          <el-form-item label="市区:" class="firstFoemItem">
            <el-select
              v-model="userDataAddress.province"
              size="mini"
              clearable
              @change="SelectChange"
            >
              <el-option
                v-for="item in selectedCityoptions"
                :key="item.city_id"
                :label="item.city_name"
                :value="item.city_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行政区:">
            <el-select
              v-model="userDataAddress.area"
              multiple
              size="mini"
              :disabled="disabledOption"
              clearable
              @change="SelectChangeArea"
            >
              <el-option
                v-for="item in selectedOptions"
                :key="item.district_id"
                :label="item.district_name"
                :value="item.district_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小区:">
            <el-select
              v-model="userDataAddress.userId"
              multiple
              size="mini"
              clearable
              :disabled="disabledOption"
            >
              <el-option
                v-for="item in selectedBuildings"
                :key="item.co_id"
                :label="item.co_name"
                :value="item.co_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </byui-query-form-left-panel>
      <byui-query-form-right-panel>
        <el-form
          ref="form"
          :inline="true"
          size="mini"
          :lg="20"
          :xl="18"
          @submit.native.prevent
        >
          <el-form-item label="起始日期:" size="mini">
            <el-date-picker
              v-model="devicePostTimes"
              type="dates"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
              clearable
              :picker-options="pickerOptions"
              @change="timesChange"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="submiteGetTable"
              >查询
            </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      style="min-height: 46vh;"
    >
      <el-checkbox>
        <el-table-column
          label="设备名"
          align="center"
          header-align="center"
          prop="name"
          min-width="180"
          fixed
        >
        </el-table-column>
        <el-table-column
          v-for="it_sole in listForIn"
          :key="it_sole"
          align="center"
          header-align="center"
          :label="listForInTimes[it_sole - 1]"
        >
          <template slot-scope="scope">
            <div class="statusMiddle">
              <el-checkbox-button
                v-model="scope.row[`checked${it_sole - 1}`]"
                @change="
                  choosePoint(scope.row, scope.row['times'][it_sole - 1])
                "
              >
                可选
              </el-checkbox-button>
            </div>
          </template>
        </el-table-column>
      </el-checkbox>
    </el-table>

    <el-dialog title="创建订单" :visible.sync="deviceUnloadShow" width="30%">
      <el-form
        :inline="true"
        size="mini"
        :lg="20"
        :xl="18"
        @submit.native.prevent
      >
        <el-form-item label="订单名称">
          <el-input v-model="orderName"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="客户名称">
          <el-input v-model="orderUseName"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="设备数">{{ deviceUnloadAll }} </el-form-item>
        <el-form-item label="实际点位"
          >{{ deviceUnloadAllPonit }}
        </el-form-item>
        <el-form-item label="播放素材时长"
          >{{ userDataAddress.flag }}秒
        </el-form-item>

        <el-form-item label="循环周期"
          >{{
            userDataAddress.userDataCycle ? userDataAddress.userDataCycle : 120
          }}秒/次
        </el-form-item>
        <el-form-item label="所选日期"
          >{{ deviceShowTimes.join(" |") }}
        </el-form-item>
        <el-form-item label="日期总数"
          >{{ deviceShowTimes.length }}天
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearDatasubmite">取 消</el-button>
        <el-button type="primary" @click="submiteUnloadValue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from "@/api/table";
import { parseTime } from "@/utils/index";

import * as ordersCreate from "@/apis/model/ordersCreate";

import { mock } from "mockjs";

import checkPermission from "@/utils/permission";
import { RouteArr } from "@/router/index";

export default {
  name: "SelectExcel",
  data() {
    return {
      resaveRoute: RouteArr,
      list: [],
      listForIn: null,
      listForInTimes: [],
      initDeviceData: [],
      listLoading: false,
      multipleSelection: [],
      downloadLoading: false,
      filename: "",
      bookType: "xlsx",
      elementLoadingText: "正在加载...",
      options: [],
      selectedCityoptions: [],
      selectedOptions: [], // 市区列表
      selectedBuildings: [], // 小区楼列表
      userDataAddress: {
        province: null, // 课程名称
        city: [],
        area: [],
        userId: [],
        flag: 5,
        amounts: null,
        userDataCycle: "",
      },
      orderName: "",
      orderUseName: "",
      disabledOption: true,
      pageNo: 1,
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
      },
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,

      devicePostTimes: [],
      deviceShowTimes: [],

      device_uuids: [],
      devicePostItem: [],
      deviceUnloadAll: 0,
      deviceUnloadAllPonit: 0,
      deviceUnloadAllPonitSelect: null,
      devicePonitSelectFlag: false,
      deviceUnloadShow: false,

      pickerOptions: {
        disabledDate(time) {
          // console.log(time.getTime() < Date.now());
          var d = new Date();
          d.setDate(d.getDate() + 29);
          var nextDate = new Date(d);
          return time.getTime() < Date.now() || time.getTime() > nextDate;
        },
        shortcuts: [
          {
            text: "连续",
            onClick(picker) {
              var gettimes = picker;
              if (picker.value && picker.value.length > 1) {
                var long =
                  picker.value[picker.value.length - 1] - picker.value[0];
                var allLong = long / 24 / 60 / 60 / 1000;
                var dateArr = [];
                var obj = {};
                for (var index = 0; index < allLong + 1; index++) {
                  var ndate = "";
                  obj[index] = new Date(picker.value[0]);
                  dateArr.push(
                    new Date(obj[index].setDate(obj[index].getDate() + index))
                  );
                }
                gettimes.$emit("pick", dateArr);
              }
            },
          },
        ],
      },
    };
  },
  computed: {
    timesLib(nth) {
      return (nth) => {
        var day1 = new Date();
        return parseTime(day1.setDate(day1.getDate() + nth), "{y}-{m}-{d}");
      };
    },
  },
  watch: {
    userDataAddress: {
      handler(getValue) {
        this.list = [];
        this.initDeviceData = [];
        this.pageNo = 1;
        this.total = 0;
      },
      deep: true,
      immediate: true,
    },
    devicePostTimes: {
      handler(getValue) {
        this.list = [];
        this.initDeviceData = [];
        this.pageNo = 1;
        this.total = 0;
      },
      deep: true,
      immediate: true,
    },
    "cityName.name": {
      handler(newName, oldName) {
        // ...
      },
      deep: true,
      immediate: true,
    },
    deviceUnloadAllPonitSelect(getValue) {
      this.devicePonitSelectFlag = false;
      if (getValue > 0 && getValue <= this.deviceUnloadAllPonit) {
        this.deviceUnloadAllPonitSelect = getValue;
        this.devicePonitSelectFlag = true;
      } else if (getValue > this.deviceUnloadAllPonit) {
        this.deviceUnloadAllPonitSelect = this.deviceUnloadAllPonit;
      }
    },
  },
  created() {
    ordersCreate.getMygetCities().then((res) => {
      if (res.data.status) {
        this.selectedCityoptions = res.data.data;
      }
    });
  },
  methods: {
    checkPermission,
    submiteGetTable() {
      if (this.userDataAddress?.province && this.devicePostTimes?.length > 0) {
        this.pageNo = 1;
        this.total = 0;
        ordersCreate
          .postMyMediaTask({
            city_ids: [this.userDataAddress.province],
            district: [...this.userDataAddress.area],
            co_ids: [...this.userDataAddress.userId],
            cs_ids: [],
            howLong: this.userDataAddress.flag,
            start: parseTime(this.devicePostTimes[0]),
            stop: parseTime(
              this.devicePostTimes[this.devicePostTimes.length - 1]
            ),
            ordersCreateTimes: this.devicePostTimes,
            period: this.userDataAddress.userDataCycle
              ? this.userDataAddress.userDataCycle
              : 120,
            amount: this.userDataAddress.amounts
              ? this.userDataAddress.amounts
              : null,
          })
          .then((res) => {
            if (res.data.status) {
              this.initDeviceData = res.data.data;
              this.total = this.initDeviceData.length;

              this.listForInTimes = [];
              this.devicePostItem = [];
              if (this.total > 0) {
                this.listForIn = this.initDeviceData[0]["times"]?.length;
                this.initDeviceData[0]["times"].map((item) => {
                  if (this.listForIn > 7) {
                    this.listForInTimes.push(item["date"].slice(5));
                  } else {
                    this.listForInTimes.push(item["date"]);
                  }
                });
                if (this.total >= 20) {
                  this.list = this.initDeviceData.slice(0, 20);
                } else {
                  this.list = this.initDeviceData;
                }
              } else {
                this.initDeviceData = [];
                this.list = [];
                this.$baseMessage("搜索出了零条结果", "success");
              }

              this.clearData();
            }
          });
      } else {
        this.$baseMessage("搜索必选条件，市区和起止时间", "info");
      }
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.list = this.initDeviceData.slice((val - 1) * 20, val * 20);
    },
    timesChange() {
      if (this.devicePostTimes && this.devicePostTimes.length > 0) {
      } else {
        this.$baseMessage("请至少选中一个日期", "info");
      }
    },
    choosePoint(rows, time) {
      var resave = false;
      this.devicePostItem.forEach((item, index) => {
        if (item.uuid == rows.uuid && item.date == time.date) {
          resave = true;
          this.devicePostItem.splice(index, 1);
        }
      });
      if (!resave) {
        this.devicePostItem.push({
          uuid: rows.uuid,
          date: time.date,
        });
      }
      // console.log(this.devicePostItem);
      // console.log(1212);
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    SelectChange() {
      // 获取行政区
      if (this.userDataAddress.province.length > 0) {
        this.selectedOptions = [];
        this.selectedBuildings = [];
        this.userDataAddress.area = [];
        this.userDataAddress.userId = [];
        ordersCreate
          .postMyCommunity({
            city_ids: [this.userDataAddress.province],
          })
          .then((res) => {
            // 社区 selectedCityoptions
            if (res.data.status) {
              this.disabledOption = false;
              var getOptionCommunity = res.data.data;
              // this.selectedOptions = res.data.data[0]["communities"] ? res.data.data[0]["communities"] : [];
              this.selectedOptions = getOptionCommunity;
              // if (getOptionCommunity.length > 0) {
              //   getOptionCommunity.forEach((item) => {
              //     this.selectedOptions = this.selectedOptions.concat(
              //       item["communities"]
              //     );
              //   });
              // }
            }
          });
      }
    },
    SelectChangeArea() {
      // 获取 小区
      //    city_ids: [this.userDataAddress.province],
      // : [...this.userDataAddress.area],
      // co_ids: [...this.userDataAddress.userId],
      if (this.userDataAddress.area.length > 0) {
        ordersCreate
          .postMyUnit({
            city_ids: [this.userDataAddress.province],
            district: [...this.userDataAddress.area],
          })
          .then((res) => {
            // 社区 selectedCityoptions
            if (res.data.status) {
              this.selectedBuildings = res.data.data;
            }
          });
      }
    },
    submiteUpTimes() {
      // devicePostTimes
    },
    submiteUnload() {
      if (this.devicePostItem.length < 1) {
        this.$baseMessage("没有选中任何设备", "info");
        return false;
      } else {
        // console.log(this.devicePostItem);
        var devicePostArr = [];
        this.devicePostItem.forEach((item) => {
          if (devicePostArr.indexOf(item.uuid) < 0) {
            devicePostArr.push(item.uuid);
          }
        });
        this.device_uuids = devicePostArr;
        this.deviceUnloadAll = devicePostArr.length;
        this.deviceUnloadAllPonit = this.devicePostItem.length;
        this.deviceUnloadAllPonitSelect = this.deviceUnloadAllPonit;
        this.deviceUnloadShow = true;
        if (this.deviceUnloadAll != this.initDeviceData.length) {
          var deviceTimes = [];
          this.devicePostItem.forEach((item) => {
            if (deviceTimes.indexOf(item.date) < 0) {
              deviceTimes.push(item.date);
            }
          });
          deviceTimes = deviceTimes.sort(function (a, b) {
            return (
              Date.parse(a.replace(/-/g, "/")) -
              Date.parse(b.replace(/-/g, "/"))
            );
          });
          this.deviceShowTimes = deviceTimes;
        }
      }
    },
    submiteUnloadAll() {
      if (this.devicePostTimes.length > 0 && this.initDeviceData.length > 0) {
        var shoundPost = [];
        this.devicePostItem = [];

        this.device_uuids = [];
        this.deviceUnloadAllPonitSelect = 0;
        this.initDeviceData.forEach((item) => {
          this.device_uuids.push(item["uuid"]);
          if (item["times"].length > 0) {
            item["times"].forEach((timeItem) => {
              shoundPost.push({
                uuid: item["uuid"],
                date: timeItem["date"],
              });
            });
          }
        });
        // console.log(shoundPost);
        this.deviceUnloadAll = this.initDeviceData.length;
        this.deviceUnloadAllPonit = shoundPost.length;
        this.devicePostItem = shoundPost;
        this.deviceUnloadAllPonitSelect = this.deviceUnloadAllPonit;
        this.deviceShowTimes = this.devicePostTimes;
        this.deviceUnloadShow = true;
      } else {
        this.$message({
          type: "info",
          message: "请先搜索出设备",
        });
      }
    },

    submiteUnloadValue() {
      if (this.devicePonitSelectFlag) {
        this.devicePostItem = this.devicePostItem.splice(
          0,
          this.deviceUnloadAllPonitSelect
        );
      }
      // console.log(this.orderName);
      // console.log(this.orderUseName);
      // console.log(this.devicePostItem);
      // console.log(this.selectedCityoptions);
      // console.log(this.userDataAddress.province);
      var getCityName = "";
      this.selectedCityoptions.forEach((item) => {
        if (item["city_id"] === this.userDataAddress.province) {
          getCityName = item["city_name"];
        }
      });
      if (this.orderName && this.orderUseName) {
        this.deviceUnloadShow = false;
        ordersCreate
          .postTowerDevice({
            orderName: this.orderName,
            orderUseName: this.orderUseName,
            TowerDeviceData: this.devicePostItem,
            howLong: this.userDataAddress.flag,
            ordersCreateTimes: this.deviceShowTimes,
            deviceUuids: [...this.device_uuids],
            cityName: getCityName,
            district: [...this.userDataAddress.area],
            co_ids: [...this.userDataAddress.userId],
            period: this.userDataAddress.userDataCycle
              ? this.userDataAddress.userDataCycle
              : 120,
          })
          .then((res) => {
            this.devicePostItem = [];
            if (res.data.status) {
              console.log("上传成后功");
              this.$baseMessage("成功添加设备", "success");
              this.$router.push("/byui/medium-orders-init");
            }

            this.clearDatasubmite();
            this.clearData();
          })
          .catch((err) => {
            this.$baseMessage("提交失败", "info");
          });
      } else {
        this.$baseMessage("必填：订单名，客户名 ", "info");
      }
    },
    clearDatasubmite() {
      this.devicePostItem = [];
      this.device_uuids = [];
      this.deviceUnloadAllPonit = 0;
      this.deviceUnloadAllPonitSelect = 0;
      this.deviceUnloadShow = false;
      this.orderName = "";
      this.orderUseName = "";
      this.deviceShowTimes = [];
      if (this.list.length > 0) {
        this.clearData();
      }
    },
    clearData() {
      this.list.forEach((item) => {
        for (let index = 0; index < this.listForIn; index++) {
          this.$set(item, `checked${index}`, false);
          // item[`checked${index}`] = false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.statusMiddle {
  display: inline-block;
  vertical-align: middle;

  div {
    display: inline-block;
    vertical-align: middle;
    width: 2rem;
    height: 2rem;
  }
  .el-button {
    margin-left: 20px;
    vertical-align: middle;
  }
}
.orderCreate_container {
  .firstFoemItem {
    .el-select {
      width: 144px;
      display: inline-block;
    }
  }
}
</style>
<style>
#PonitSelectSty {
  width: 80%;
  margin-top: 4px;
}
#PonitSelectSty input {
  width: 4rem;
}
.el-checkbox-button:last-child .el-checkbox-button__inner {
  border-radius: 30px;
}
</style>
