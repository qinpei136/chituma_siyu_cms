<template>
  <div id="signup_main">
    <el-form
      id="useLuleForm"
      ref="ruleForm"
      v-model="signup"
      :model="ruleForm"
      size="mini"
      :validate-on-rule-change="false"
      status-icon
      :rules="rules"
    >
      <el-row type="flex">
        <el-col :span="12" class="box">
          <el-form-item label="用户名" prop="usrName">
            <el-input
              v-model="ruleForm.usrName"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="firstPass">
            <el-input
              v-model="ruleForm.firstPass"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              v-model="ruleForm.checkPass"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input
              v-model="ruleForm.enterpriseName"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业邮箱" prop="enterpriseMail">
            <el-input
              v-model="ruleForm.enterpriseMail"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="所在地区">
            <el-cascader
              v-model="selectedOptions"
              placeholder=" 搜索 :省、市、区"
              :options="regionDataOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细街道" prop="enterpriseDetailed">
            <el-input
              v-model="ruleForm.enterpriseDetailed"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮编">
            <el-input
              v-model="ruleForm.enterprisePostalCode"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业经营范围">
            <el-input
              v-model="ruleForm.enterpriseBusinessScope"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="box">
          <el-form-item
            label="企业统一社会信用代码"
            prop="enterpriseUnifiedsocialCode"
          >
            <el-input
              v-model="ruleForm.enterpriseUnifiedsocialCode"
              type="text"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="enterpriseRen">
            <el-input v-model.number="ruleForm.enterpriseRen"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="enterpriseRenMobile">
            <el-input v-model.number="ruleForm.enterpriseRenMobile"></el-input>
          </el-form-item>
          <el-form-item label="座机号码">
            <el-input v-model.number="ruleForm.enterpriseRenTell"></el-input>
          </el-form-item>
          <el-form-item>
            <div>
              <el-upload
                id="before-uploader"
                action=""
                :multiple="false"
                :show-file-list="false"
                :before-upload="beforeLoadChange"
                @abort="true"
              >
                <!--  :on-success="handleAvatarSuccess" -->
                <img
                  v-if="beforeLoadSrc"
                  :src="beforeLoadSrc"
                  height="200px"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div v-if="!beforeLoadSrc" class="upLoadSrcText">
                  <span>
                    上传营业执照
                  </span>
                  <br />
                  <span>
                    只接收 jpg|jpeg|png格式的图片
                  </span>
                </div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="submitForm_bottom">
              <el-button type="primary" @click="submitForm('ruleForm')"
                >注册</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
              <el-button @click="loginBack">返回登录页</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      title="提交成功"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>还有{{ endCloseTime }}秒自动返回登录页...</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="before_close">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import { getSignUp } from "@/apis/index.js";
import * as sign from "@/apis/model/sign.js";
export default {
  data() {
    var requiredusrName = (rule, value, callback) => {
      let regPass = /^\w{6,18}$/;
      if (!regPass.test(value)) {
        setTimeout(() => {
          callback(new Error(" 请输入6-18位由字母数字组成的用户名"));
        }, 100);
      } else {
        callback();
      }
    };

    var requiredfirstPass = (rule, value, callback) => {
      let regPass2 = /^\w{6,18}$/;
      if (!regPass2.test(value)) {
        setTimeout(() => {
          callback(new Error(" 请输入6-18位由字母数字组成的密码"));
        }, 100);
      } else {
        callback();
      }
      // if (value === "") {
      //   callback(new Error("请输入密码"));
      // } else {
      //   if (this.ruleForm.firstPass !== "") {
      //     this.$refs.ruleForm.validateField("checkPass");
      //   }
      //   callback();
      // }
    };
    var requiredcheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.firstPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var requiredenterpriseName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入企业名称"));
      } else {
        callback();
      }
    };
    var requiredenterpriseMail = (rule, value, callback) => {
      let regMail = /^\w+@[a-z0-9]+\.[a-z]{2,6}$/;
      if (!regMail.test(value)) {
        setTimeout(() => {
          callback(new Error("请输入邮箱号"));
        }, 100);
      } else {
        callback();
      }
    };
    var validateenterpriseDetailed = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入 详细街道地址"));
      } else {
        callback();
      }
    };
    var validateenterpriseUnifiedsocialCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入 企业统一社会信用代码"));
      } else {
        callback();
      }
    };
    var validateenterpriseRen = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入 联系人"));
      } else {
        callback();
      }
    };
    var validateenterpriseRenMobile = (rule, value, callback) => {
      // callback(new Error("请输入 联系人电话"));
      // let reg1 = /^\d{4,13}$/;
      let reg1 = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!reg1.test(value)) {
        setTimeout(() => {
          callback(new Error("请输入 联系人电话"));
        }, 100);
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        usrName: "", // 用户名
        firstPass: "", // 密码1
        checkPass: "", // 密码2
        enterpriseName: "", // 企业名称
        enterpriseMail: "", // 企业邮箱
        enterpriseDetailed: "", // 详细街道地址
        enterpriseAddress: [], // 企业所在省区[省、市、区 ]
        enterpriseUnifiedsocialCode: "", // 企业统一社会信用代码
        enterpriseRen: "", // 联系人
        enterpriseRenMobile: "", // 联系人电话
        enterpriseRenTell: "", // 座机号码
        enterprisePostalCode: "", // 邮编
        enterpriseBusinessScope: "", // 企业经营范围
        enterpriseImage: "", // 营业执照url
      },
      rules: {
        usrName: [
          // { required: true, message: "请输入6位以上的账号名", trigger: "blur" },
          // {
          //   type: "number",
          //   validator: requiredusrName,
          //   trigger: ["blur", "change"],
          // },
          { required: true, validator: requiredusrName, trigger: "blur" },
        ],
        firstPass: [
          { required: true, validator: requiredfirstPass, trigger: "blur" },
        ],
        checkPass: [
          { required: true, validator: requiredcheckPass, trigger: "blur" },
        ],
        enterpriseName: [
          {
            required: true,
            validator: requiredenterpriseName,
            trigger: "blur",
          },
        ],
        enterpriseMail: [
          {
            required: true,
            validator: requiredenterpriseMail,
            trigger: "blur",
          },
        ],
        enterpriseDetailed: [
          {
            required: true,
            validator: validateenterpriseDetailed,
            trigger: "blur",
          },
        ],
        enterpriseUnifiedsocialCode: [
          {
            required: true,
            validator: validateenterpriseUnifiedsocialCode,
            trigger: "blur",
          },
        ],
        enterpriseRen: [
          {
            required: true,
            validator: validateenterpriseRen,
            trigger: "blur",
          },
        ],
        enterpriseRenMobile: [
          {
            required: true,
            validator: validateenterpriseRenMobile,
            trigger: "blur",
          },
        ],
      },
      signup: {
        province: null,
        city: null,
        area: null,
      },
      regionDataOptions: regionData,
      selectedOptions: [],
      beforeLoadFile: null,
      beforeLoadSrc: null,
      endLoadSrc: null,
      endCloseTime: 6,
      dialogVisible: false,
    };
  },
  methods: {
    submitForm(formName) {
      if (this.selectedOptions.length > 2 && this.beforeLoadFile) {
        sign
          .getUsrName({
            account: this.ruleForm.usrName,
          })
          .then((res) => {
            if (res.data.status) {
              var getArea = [];
              getArea = Object.keys(this.signup).map((item) => {
                return this.signup[item];
              });
              this.ruleForm.enterpriseAddress = getArea;
              // console.log(this.beforeLoadFile);
              // console.log(this.ruleForm);
              // var postRule = new FormData();
              // Object.keys(this.ruleForm).forEach((item) => {
              //   postRule.append(item, this.ruleForm[item]);
              // });
              // postRule.append("formImg", this.beforeLoadFile);
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  var sendFile = new FormData();
                  sendFile.append("postFile", this.beforeLoadFile);

                  var postData = { ...this.ruleForm };
                  // postData["account"] = postData["usrName"];
                  // postData["password"] = postData["checkPass"];
                  // postData["mobile"] = postData["enterpriseRenMobile"];
                  // postData["companyName"] = postData["enterpriseName"];
                  // postData["industry"] = postData["enterpriseBusinessScope"];
                  // delete postData["usrName"];
                  // delete postData["checkPass"];
                  // delete postData["enterpriseRenMobile"];
                  // delete postData["enterpriseName"];
                  // delete postData["enterpriseBusinessScope"];
                  // console.log(postData);
                  sign.getSignUp(sendFile).then((res) => {
                    if (res.data.status) {
                      this.endLoadSrc = res.data.url;
                      if (this.endLoadSrc) {
                        // 传数据 //postSignUp
                        postData["enterpriseImage"] = this.endLoadSrc;
                        sign.postSignUp(postData).then((responce) => {
                          // console.log(responce);
                          if (responce.data.status) {
                            this.getback();
                          }
                        });
                      }
                    } else {
                      this.$message({
                        type: "info",
                        message: "图片上传失败 请重新提交",
                      });
                    }
                  });
                } else {
                  // console.log("error submit!!");
                  this.$message({
                    type: "info",
                    message: "请把信息补充完整",
                  });
                  return false;
                }
              });
            } else {
              this.ruleForm.usrName = "";
              this.$message({
                type: "error",
                message: "用户名已注册，请重新填写",
              });
            }
          });
      } else {
        this.$message({
          type: "info",
          message: "请选择地区和上传图片",
        });
      }
    },
    resetForm(formName) {
      this.beforeLoadSrc = null;
      this.$refs[formName].resetFields();
    },
    loginBack() {
      this.$router.push({
        path: "/login",
      });
    },
    getback() {
      this.dialogVisible = true;
      var CloseTimes = setInterval(() => {
        if (this.endCloseTime < 1) {
          this.before_close();
          clearInterval(CloseTimes);
        }
        this.endCloseTime--;
      }, 1000);
    },
    handleClose(done) {
      this.loginBack();
    },
    before_close() {
      this.dialogVisible = false;
      this.endCloseTime = -1;
      this.loginBack();
    },
    handleChange(value) {
      this.signup.province = this.selectedOptions[0]
        ? CodeToText[this.selectedOptions[0]]
        : null;
      this.signup.city = this.selectedOptions[1]
        ? CodeToText[this.selectedOptions[1]] === "市辖区"
          ? "直辖市"
          : ""
        : null;
      this.signup.area = this.selectedOptions[2]
        ? CodeToText[this.selectedOptions[2]]
        : null;
      // }
    },
    beforeLoadChange(file) {
      try {
        this.beforeLoadChangeReader5(file);
      } catch (error) {
        console.log(error);
      }
      return false;
    },
    beforeLoadChangeReader5(file) {
      const reader = new FileReader();
      var that_ = this;
      reader.onload = (e) => {
        const isLt2M = file.size < 1024 * 1024 * 2;
        const isAllrowType = /jpeg|png|jpg/i.test(file.type);
        if (!isAllrowType) {
          that_.$baseMessage(
            "请上传正确的文件类型（ 图片传jpg/jpeg/png格式）",
            "error"
          );
          return false;
        }
        if (!isLt2M) {
          that_.$baseMessage("请上传2M以下的文件", "error");
          return false;
        } else {
          const img = new Image();
          img.src = e.target.result;
          img.onload = function () {
            that_.beforeLoadFile = file;
            that_.beforeLoadSrc = e.target.result;
          };
        }
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>
<style lang="scss" scoped>
#signup_main {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  padding: 0 10%;
  overflow: hidden;
  background: url("~@/assets/login_images/background3.jpg") center center fixed
    no-repeat;
  background-size: cover;
  #useLuleForm {
    .el-form-item {
      label {
        padding: 0 !important;
      }
    }
  }
  .box {
    background: #fff;
    margin-top: 40px;
    height: 100vh;
    padding: 0 44px;
    padding-top: 3%;
    .submitForm_bottom {
      margin-top: 6rem;
      margin-left: 54%;
    }
  }
  .box:last-of-type {
    background: rgb(231, 219, 219);
  }

  #before-uploader {
    margin: 0 auto;
    width: 60%;
    height: 100px;
    padding: 0;
    border: dashed 2px #f0e0e0;
    text-align: center;
    i {
      width: 100% !important;
      height: 100% !important;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
    }
    .upLoadSrcText {
      color: #95a9a7;
    }
  }
  #before-uploader:after {
    content: "";
    height: 100%;
    width: 0;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
