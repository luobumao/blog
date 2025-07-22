import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://zimubb.com",
  navbarTitle: "$cd /home",
  favicon: "/assets/images/avatar.png",
  docsDir: "docs",
  darkmode: "toggle",
  navbar,
  sidebar,
  blog: {
    description: "一个记忆力很差的中年人",
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
  },
});
