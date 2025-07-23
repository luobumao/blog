import { navbar } from "vuepress-theme-hope";
export default navbar([
  {text: "首页", icon: "ant-design:home-filled", link: "/" },
  {
    text: "快速导航",
    icon: "ant-design:bulb-filled",
    prefix: "/博文/",
    children: [
      {
        text: "项目代码",
        icon: "ant-design:code-filled",
        prefix: "",
        children: [
          { text: "流量重置", icon: "ant-design:code-outlined", link: "3xui.html#shell脚本代码" },
          { text: "短信发送", icon: "ant-design:code-outlined", link: "SmsSender.html#client-js代码部分" },
          { text: "Gemini插件", icon: "ant-design:code-outlined", link: "gemini.html#插件代码" },
          { text: "Rotate插件", icon: "ant-design:code-outlined", link: "rotate.html#插件代码" },

        ],
      },
    ],
  },
  {
    text:"网站存档",
    icon: "ant-design:compass-filled",
    prefix: "",
    children:[
        {
          text:"PT站",
          icon: "ant-design--aliyun-outlined",
          prefix: "",
          children:[
            { text: "Audiences", icon: "ant-design:file-outlined", link: "https://audiences.me/" },
            { text: "M-Team", icon: "ant-design:file-outlined", link: "https://next.m-team.cc/" },
            { text: "KamePT", icon: "ant-design:file-outlined", link: "https://kamept.com/" },
            { text: "HDTime", icon: "ant-design:file-outlined", link: "https://hdtime.org/" },
            { text: "NicePT", icon: "ant-design:file-outlined", link: "https://www.nicept.net/" },
          ],
        },
        {
          text: "其他网站",
          icon: "ant-design:code-filled",
          prefix: "",
          children:[
            { text: "GitHub", icon: "ant-design:file-outlined", link: "https://github.com/" },
          ]
        },
    ],
  },
  {
    text: "V2 文档",
    icon: "ant-design:code-filled",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
