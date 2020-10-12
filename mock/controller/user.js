import { handleRandomImage } from "../utils";
const accessTokens = {
  SuperUser: "SuperUser-accessToken",
  admin: "admin-accessToken",
  editor: "editor-accessToken",
  root: "root-accessToken",
  advertiser: "advertiser-accessToken",
};

export default [
  {
    url: "/publicKey",
    type: "post",
    response: (config) => {
      return {
        code: 200,
        msg: "success",
        data: {
          mockServer: true,
        },
      };
    },
  },
  {
    url: "/login",
    type: "post",
    response: (config) => {
      const { userName } = config.body;
      const accessToken = accessTokens[userName];
      if (!accessToken) {
        return {
          code: 500,
          msg: "帐户或密码不正确。",
        };
      }
      return {
        code: 200,
        msg: "success",
        data: { accessToken },
      };
    },
  },

  {
    url: "/user/info",
    type: "post",
    response: (config) => {
      const { accessToken } = config.body;
      let permissions = ["root"];
      let userName = "root";
      if ("SuperUser-accessToken" === accessToken) {
        permissions = ["SuperUser"];
        userName = "SuperUser";
      }
      if ("root-accessToken" === accessToken) {
        permissions = ["root"];
        userName = "root";
      }
      if ("admin-accessToken" === accessToken) {
        permissions = ["admin"];
        userName = "admin";
      }
      if ("editor-accessToken" === accessToken) {
        permissions = ["editor"];
        userName = "editor";
      }
      if ("advertiser-accessToken" === accessToken) {
        permissions = ["advertiser"];
        userName = "advertiser";
      }
      return {
        code: 200,
        msg: "success",
        data: {
          permissions,
          userName,
          avatar: handleRandomImage(50, 50),
        },
      };
    },
  },

  {
    url: "/logout",
    type: "post",
    response: () => {
      return {
        code: 200,
        msg: "success",
      };
    },
  },
];
