import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "文档",
  description: "字母的博客",
  theme,
});
