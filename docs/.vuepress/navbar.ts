import { navbar } from "vuepress-theme-hope";
export default navbar([
  "/",
  {
    text: "博文内容",
    icon: "pen-to-square",
    prefix: "/博文/",
    children: [
      {
        text: "自开发功能",
        icon: "pen-to-square",
        prefix: "",
        children: [
          { text: "流量充值", icon: "pen-to-square", link: "3xui" },
          { text: "短信发送", icon: "pen-to-square", link: "SmsSender" },
        ],
      },
    ],
  },
  {
    text:"网站导航",
    icon: "pen-to-square",
    prefix: "",
    children:[
        {
          text:"PT站",
          icon: "pen-to-square",
          prefix: "",
          children:[
            { text: "Audiences", icon: "pen-to-square", link: "https://audiences.me/" },
            { text: "M-Team", icon: "pen-to-square", link: "https://next.m-team.cc/" },
            { text: "KamePT", icon: "pen-to-square", link: "https://kamept.com/" },
            { text: "HDTime", icon: "pen-to-square", link: "https://hdtime.org/" },
            { text: "NicePT", icon: "pen-to-square", link: "https://www.nicept.net/" },
          ],
        },
        {
          text: "其他网站",
          icon: "pen-to-square",
          prefix: "",
          children:[
            { text: "GitHub", icon: "book", link: "https://github.com/" },
          ]
        },
    ],
  },
  {
    text: "V2 文档",
    icon: "book",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
