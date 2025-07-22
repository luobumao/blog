import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://zimubb.com",
  navbarTitle: "$cd /home",
  favicon: "/assets/images/avatar.png",
  docsDir: "docs",
  darkmode: "toggle",
  repo: "https://github.com/luobumao/blog",
  navbar,
  sidebar,
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Language", "Repo", "Outlook", "Search"],
  },
  blog: {
    description: "国家一级借助AI编程表演大师",
    avatar: "/assets/images/avatar.png",
    medias: {
      Telegram: "https://t.me/pink_poop",
      Wechat: "https://u.wechat.com/EEwzuoEX6vGbWn6QNVNlhT4",
    },
  },
  author: {
    name: "字母",
    url: "https://zimubb.com",
    email: "zimuclone@gmail.com",
  },
  plugins: {
    blog: true,
    docsearch: {
      appId: "MZWTWI0E6C",
      apiKey: "e3360620287a9dd14a767df38ade21af",
      indexName: "博客索引",
    },
  },
});
