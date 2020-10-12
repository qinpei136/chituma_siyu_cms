<template>
  <div class="index-container">
    <div id="main-chitu">
      <el-row type="flex" :gutter="2" justify="space-around">
        <el-col v-if="checkPermission([...resaveRoute.slice(0, 3)])">
          <!-- <el-col v-if="activities < 3" > -->
          <el-card shadow="never" class="iCard">
            <div slot="header">
              <span>设备总数：{{ config_total }}</span>
            </div>
            <byui-chart
              :autoresize="true"
              theme="byui-echarts-theme"
              :options="sqs"
              @click="chartsClick"
            />
            <div class="bottom">
              <span
                >在线数:
                <byui-count
                  :start-val="config.startVal"
                  :end-val="config.endVal"
                  :duration="config.duration"
                  :separator="config.separator"
                  :prefix="config.prefix"
                  :suffix="config.suffix"
                  :decimals="config.decimals"
              /></span>
            </div>
          </el-card>
        </el-col>
        <el-col
          :offset="!checkPermission([...resaveRoute.slice(0, 3)]) ? 4 : 0"
        >
          <el-card shadow="never" class="iCard">
            <div slot="header">
              <span>素材总数</span>
            </div>
            <byui-chart
              :autoresize="true"
              theme="byui-echarts-theme"
              :options="sqs2"
            />
            <div class="bottom">
              <span
                >待审核:
                <byui-count
                  :start-val="config2.startVal"
                  :end-val="1154"
                  :duration="config2.duration"
                  :separator="config2.separator"
                  :prefix="config2.prefix"
                  :suffix="config2.suffix"
                  :decimals="config2.decimals"
              /></span>
            </div>
          </el-card>
        </el-col>
        <el-col>
          <el-card shadow="never" class="iCard">
            <div slot="header">
              <span>订单总数</span>
            </div>
            <byui-chart
              :autoresize="true"
              theme="byui-echarts-theme"
              :options="sqs3"
            />
            <div class="bottom">
              <span
                >新增订单:
                <byui-count
                  :start-val="config2.startVal"
                  :end-val="1394"
                  :duration="config2.duration"
                  :separator="config2.separator"
                  :prefix="config2.prefix"
                  :suffix="config2.suffix"
                  :decimals="config2.decimals"
              /></span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="checkPermission([...resaveRoute.slice(0, 3)])" :span="10">
          <!-- getTimesData -->
          <el-table
            :data="getTimesData"
            style="width: 100%;"
            @row-click="evaySpanClick"
          >
            <el-table-column prop="date">
              <div slot="header">
                <h3>
                  订单即将到期
                </h3>
              </div>
              <template slot-scope="scope">
                {{ scope.row.adName }}
              </template>
            </el-table-column>
            <el-table-column prop="address">
              <span slot="header" @click="spanClick" v-text="'查看更多'">
              </span>
              <template slot-scope="scope">
                还有
                <span v-text="getTimes(scope.row.adStop)"></span>
                天即将到期..
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { dependencies, devDependencies } from "../../../package.json";
import { getList, getDatas } from "@/api/changeLog";
import { getDeivceAll, getDeivceEndingAds } from "@/apis/index.js";
import { isLogin } from "@/apis/model/isLogin.js";

import checkPermission from "@/utils/permission";
import { RouteArr } from "@/router/index";
import ByuiCount from "@/plugins/byuiCount";
import ByuiChart from "@/plugins/echarts";
// import AppLink from "@/layouts/components/Link";
import store from "@/store";
export default {
  name: "Index",
  components: { ByuiCount, ByuiChart },
  data() {
    var getShows = RouteArr.indexOf(store.getters["user/permissions"][0]);
    return {
      updateTime: process.env.VUE_APP_UPDATE_TIME,
      nodeEnv: process.env.NODE_ENV,
      dependencies: dependencies,
      devDependencies: devDependencies,
      reverse: true,
      resaveRoute: RouteArr,
      activities: getShows,
      //其他信息
      userAgent: navigator.userAgent,
      config: {
        startVal: 0,
        endVal: 0,
        decimals: 0,
        prefix: "",
        suffix: "",
        separator: ",",
        duration: 800,
      },
      config_total: null,
      config2: {
        startVal: 0,
        endVal: this.$baseLodash.random(1000, 20000),
        decimals: 0,
        prefix: "",
        suffix: "",
        separator: ",",
        duration: 8000,
      },
      sqs: {
        grid: {
          top: "8%",
          left: "2%",
          right: "4%",
          bottom: "0%",
          containLabel: true,
        },

        xAxis: [
          {
            type: "category",
            data: ["总数", "在线", "离线"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b} : {c} {d}",
        },
        position: function (point, params, dom, rect, size) {
          // 固定在顶部
          return [point[0], "10%"];
        },
        series: [
          {
            name: "设备",
            type: "bar",
            barWidth: "60%",
            data: [0, 0, 0],
            label: {
              color: "#3D383A",
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["#006699", "#0AAF9F", "#E89589", "#29AAE3"];
                  return colorList[params.dataIndex];
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      sqs2: {
        backgroundColor: "#fff",

        title: {
          text: "素材总数",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc",
          },
        },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },

        visualMap: {
          show: false,
          min: 0,
          max: 600,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
          {
            name: "素材",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "待审核" },
              { value: 310, name: "审核通过" },
              { value: 274, name: "已结束" },
              { value: 235, name: "已过期" },
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
              color: "#ccc",
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      },
      sqs3: {
        backgroundColor: "#fff",
        title: {
          text: "订单总数",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc",
          },
        },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },

        series: [
          {
            name: "订单",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 47, name: "新增订单" },
              { value: 204, name: "到期订单" },
              { value: 22, name: "待执行任务" },
              { value: 25, name: "作废订单" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      },
      getTimesData: [],
      prev: null,
      times: null,
    };
  },
  watch: {
    $route() {
      if ("Index" === this.$route.name) {
        this.fetchData();
      }
      this.debounce(this.checkLogin(), 10000);
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.checkLogin();
  },
  methods: {
    checkPermission,
    checkLogin() {
      isLogin().then((res) => {
        if (!res.data.status) {
          this.$baseMessage(`请重新登录`);
          this.$store.dispatch("user/logout").then(() => {
            this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          });
        }
      });
    },
    debounce(fn, wait) {
      var timer = null;
      return function () {
        console.log(timer);

        if (timer !== null) {
          clearTimeout(timer);
        }
        timer = setTimeout(fn, wait);
      };
    },
    throttle(fn, delay) {
      this.prev = Date.now();
      return function () {
        var now = Date.now();
        if (now - this.prev > delay) {
          fn();
          this.prev = Date.now();
        }
      };
    },
    fetchData() {
      try {
        getDeivceAll().then((res) => {
          var sqsArr = [];
          var getAqs = res.data.data;
          this.config.endVal = getAqs["online"];
          this.config_total = getAqs["total"];

          for (var it in getAqs) {
            sqsArr.push(getAqs[it]);
          }
          this.sqs.series[0].data = sqsArr;
          this.sqs.series[0].label = {
            show: true,
            position: "top",
            color: "#3D383A",
          };
        });
        getDeivceEndingAds().then((res) => {
          // console.log(res.data.data);
          if (res.data.status) {
            this.getTimesData = res.data.data;
          }
        });
      } catch (e) {
        console.log(e, "getDatas");
      }
    },
    handleClick(e) {
      this.$baseMessage(`点击了${e.name},这里可以写跳转`);
    },
    handleZrClick(e) {},
    handleChangeTheme() {
      this.$baseEventBus.$emit("theme");
    },
    chartsClick(event) {
      console.log(event["dataIndex"]);
    },
    spanClick() {
      var mainArrs = [];
      this.getTimesData.forEach((item) => {
        mainArrs.push(item.adId);
      });
      this.gotoActive(mainArrs);
    },
    evaySpanClick(row) {
      var mainArr = [];
      mainArr = [row.adId];
      this.gotoActive(mainArr);
    },
    gotoActive(MainArr) {
      if (this.checkPermission([...this.resaveRoute.slice(0, 3)])) {
        this.$router.push({
          name: "medium_admin_activity",
          params: {
            mainArr: MainArr,
          },
        });
      } else {
        this.$router.push({
          name: "medium_advertiser_activity",
          params: {
            mainArr: MainArr,
          },
        });
      }
    },
    getTimes(time) {
      var get_time = new Date(time);
      var cha = get_time - new Date();
      if (cha < 0) {
        return 0;
      } else {
        return parseInt(Math.ceil(cha / 1000 / 60 / 60 / 24));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#main-chitu {
  width: 100%;
  .iCard {
    width: 25rem;
    .echarts {
      margin: 0 auto;
      width: 100%;
      height: 260px;
    }
  }
}
</style>
