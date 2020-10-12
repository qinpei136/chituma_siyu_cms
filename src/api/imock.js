const Mock = require("mockjs");

Mock.mock("/imock/user/info", "post", function (option) {
  // 这里的option是请求的相关参数
  //
  const { accessToken } = JSON.parse(option.body);

  return Mock.mock({
    code: 200,
    msg: "success",
    data: {
      permissions: [accessToken.split("-")[0]],
      userName: accessToken.split("-")[0],
      avatar: "zzxcxc",
    },
  });
});
Mock.mock("/imock/login", "post", function (option) {
  // 这里的option是请求的相关参数
  const { username } = JSON.parse(option.body);
  return Mock.mock({
    code: 200,
    msg: "success",
    data: {
      accessToken: username + "-accessToken",
    },
  });
});
Mock.mock("/imock/logout", "post", function (option) {
  // 这里的option是请求的相关参数
  return Mock.mock({ code: 200, msg: "success" });
});
