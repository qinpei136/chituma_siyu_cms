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
          <el-form-item label="行政区:" class="nextFoemItem">
            <el-select
              v-model="userDataAddress.area"
              multiple
              filterable
              :filter-method="filterMethodXz"
              size="mini"
              :disabled="disabledOption"
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
          <el-form-item label="小区:" class="lastFoemItem">
            <el-select
              v-model="userDataAddress.userId"
              multiple
              filterable
              size="mini"
              :filter-method="filterMethod"
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
          <el-form-item label="广告时长:" size="mini">
            <el-select
              v-model="userDataAddress.flag"
              size="mini"
              style="width: 120px;"
            >
              <el-option
                v-for="imte in 3"
                v-show="imte !== 2"
                :key="imte * 5"
                :label="imte * 5 + '秒'"
                :value="imte * 5"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="周期:" size="mini">
            <el-select
              v-model="userDataAddress.userDataCycle"
              size="mini"
              style="width: 120px;"
            >
              <el-option
                v-for="imte in 4"
                v-show="imte !== 3"
                :key="imte * 30"
                :label="imte * 30 + 's/次'"
                :value="imte * 30"
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
            <span> {{ devicePostTimes ? devicePostTimes.length : "" }}</span>
            天
          </el-form-item>
          <el-form-item label="设备数" class="last_FoemItem">
            <el-input v-model="userDataAddress.amounts"> </el-input>
          </el-form-item>
          <br />
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="submiteGetTable"
              >查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-back"
              type="primary"
              native-type="submit"
              @click="
                () => {
                  this.$router.push({ path: '/byui/medium-orders-init' });
                }
              "
              >返回
            </el-button>
          </el-form-item>
        </el-form>
      </byui-query-form-right-panel>
    </byui-query-form>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      empty-text="请查询"
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
    <byui-query-form-bottom-panel>
      <el-row type="flex" justify="space-around" align="bottom">
        <el-col
          v-show="
            checkPermission([...resaveRoute.slice(0, 3)]) &&
            initDeviceData.length > 0
          "
          :span="3"
        >
          <el-button
            icon="el-icon-position"
            type="primary"
            native-type="submit"
            @click="submiteUnloadAll"
          >
            全选
          </el-button>
        </el-col>
        <el-col :span="18">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :total="total"
            :page-size="20"
            :current-page="pageNo"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </el-col>
        <el-col :span="3">
          <el-button
            icon="el-icon-position"
            type="primary"
            native-type="submit"
            @click="submiteUnload"
          >
            提交
          </el-button>
        </el-col>
      </el-row>
    </byui-query-form-bottom-panel>
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
        <!-- <el-form-item label="选取点位数">
          <el-input v-model="deviceUnloadAllPonitSelect"></el-input>
        </el-form-item> -->

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
      keepDistricts: [], // 小区楼列表
      keepBuildings: [], // 小区楼列表
      userDataAddress: {
        province: null, // 课程名称
        city: [],
        area: [],
        userId: [],
        flag: 15,
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

          var b_date = new Date();
          b_date.setDate(b_date.getDate() - 1);
          var beforeDate = new Date(b_date);

          var n_date = new Date();
          n_date.setDate(n_date.getDate() + 239);
          var nextDate = new Date(n_date);
          return time.getTime() < beforeDate || time.getTime() > nextDate;
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
  mounted() {
    window.addEventListener("keyup", this.handleKeyup);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.handleKeyup, false);
  },
  methods: {
    checkPermission,
    // handleKeyup(event) {
    //   const e = event || window.event || arguments.callee.caller.arguments[0];
    //   if (!e) return;
    //   const { key, keyCode } = e;
    //   // console.log(keyCode);
    //   // console.log(key);
    //   if (keyCode == 13 || key == "Enter") {
    //     this.submiteGetTable();
    //   }
    // },
    submiteGetTable() {
      var loading = this.$loading({
        lock: true,
        text: "拼命保存中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (this.userDataAddress.province && this.devicePostTimes.length > 0) {
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
      loading.close();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.list = this.initDeviceData.slice((val - 1) * 20, val * 20);
    },
    timesChange() {
      if (this.devicePostTimes && this.devicePostTimes.length > 0) {
        this.devicePostTimes.sort((a, b) => {
          return (
            parseInt(a.replace(/\D/g, ""), 10) -
            parseInt(b.replace(/\D/g, ""), 10)
          );
        });
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
      // console.log(this.initDeviceData);
      // console.log(this.list);
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
              this.keepDistricts = res.data.data;
              // if (getOptionCommunity.length > 0) {
              //   getOptionCommunity.forEach((item) => {
              //     this.selectedOptions = this.selectedOptions.concat(
              //       item["communities"]
              //     );
              //   });
              // }
            }
          });
      } else {
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
              this.keepBuildings = res.data.data;

              var co_id_ = this.selectedBuildings.map((item) => {
                return item.co_id;
              });

              this.userDataAddress.userId = this.userDataAddress.userId.map(
                (item) => {
                  if (co_id_.indexOf(item) > -1) {
                    return item;
                  }
                }
              );

              // console.log(this.selectedBuildings);
              // console.log(this.userDataAddress.userId);
            }
          });
      } else {
        this.userDataAddress.userId = [];
        this.selectedBuildings = [];
      }
    },
    filterMethodXz(e) {
      if (e) {
        this.selectedOptions = this.selectedOptions.filter((item) => {
          return (
            item.pinyin.search(e) > -1 || item.district_name.search(e) > -1
          );
        });
      } else {
        this.selectedOptions = this.keepDistricts;
      }
    },
    filterMethod(e) {
      if (e) {
        this.selectedBuildings = this.selectedBuildings.filter((item) => {
          return item.pinyin.search(e) > -1 || item.co_name.search(e) > -1;
        });
      } else {
        this.selectedBuildings = this.keepBuildings;
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
          if (deviceTimes.length > 1) {
            deviceTimes = deviceTimes.sort(function (a, b) {
              return (
                Date.parse(a.replace(/-/g, "/")) -
                Date.parse(b.replace(/-/g, "/"))
              );
            });
          }
          this.deviceShowTimes = deviceTimes;
        } else {
          this.deviceShowTimes = this.devicePostTimes;
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
        // console.log(JSON.stringify(shoundPost));
        this.deviceUnloadAll = this.initDeviceData.length;
        this.deviceUnloadAllPonit = shoundPost.length;
        this.devicePostItem = [...shoundPost];
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
      // if (this.devicePonitSelectFlag) {
      //   this.devicePostItem = this.devicePostItem.splice(
      //     0,
      //     this.deviceUnloadAllPonitSelect
      //   );
      // }
      // console.log(this.orderName);
      // console.log(this.orderUseName);

      var loading = this.$loading({
        lock: true,
        text: "拼命保存中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (this.devicePostItem.length < 1) {
        this.$baseMessage("没有选中任何设备", "info");
      } else {
        // console.log(12345);
        // console.log(JSON.stringify(this.devicePostItem));
        // console.log(this.selectedCityoptions);
        // console.log(this.userDataAddress.province);
        var getCityName = "";
        this.selectedCityoptions.forEach((item) => {
          if (item["city_id"] === this.userDataAddress.province) {
            getCityName = item["city_name"];
          }
        });
        var cityStr = getCityName;
        cityStr = cityStr.slice(0, cityStr.indexOf("市") + 1);
        // console.log(cityStr);
        if (this.orderName && this.orderUseName) {
          this.deviceUnloadShow = false;
          ordersCreate
            .postTowerDevice({
              orderName: this.orderName,
              orderUseName: this.orderUseName,
              TowerDeviceData: [...this.devicePostItem],
              howLong: this.userDataAddress.flag,
              ordersCreateTimes: this.deviceShowTimes,
              deviceUuids: [...this.device_uuids],
              cityName: cityStr,
              district: [...this.userDataAddress.area],
              co_ids: [...this.userDataAddress.userId],
              period: this.userDataAddress.userDataCycle
                ? this.userDataAddress.userDataCycle
                : 120,
            })
            .then((res) => {
              this.devicePostItem = [];
              if (res.data.status) {
                // console.log("上传成后功");
                this.$baseMessage("成功添加设备", "success");
                this.$router.push("/byui/medium-orders-init");
              } else {
                this.$baseMessage(res.data.message, "info");
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
      }
      loading.close();
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
      this.initDeviceData.forEach((item) => {
        for (let index = 0; index < this.listForIn; index++) {
          this.$set(item, `checked${index}`, false);
        }
      });
      // this.list.forEach((item) => {
      //   for (let index = 0; index < this.listForIn; index++) {
      //     this.$set(item, `checked${index}`, false);
      //   }
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
.orderCreate_container {
  .firstFoemItem {
    .el-select {
      width: 124px;
      display: inline-block;
    }
  }
  .nextFoemItem {
    .el-select {
      width: 124px;
      display: inline-block;
    }
  }
  .lastFoemItem {
    .el-select {
      width: 18rem;
      display: inline-block;
    }
  }
  .last_FoemItem {
    .el-input {
      width: 4rem;
      display: inline-block;
    }
  }
}
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

/* .firstFoemItem .el-select {
  width: 120px;
  display: inline-block;
} */
</style>
