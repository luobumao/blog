export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"字母的博客","icon":"house"} }],
  ["/%E5%8D%9A%E6%96%87/3xui.html", { loader: () => import(/* webpackChunkName: "博文_3xui.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/博文/3xui.html.js"), meta: {"date":1753142400000,"excerpt":"\n<h2>部署教程</h2>\n<div class=\"language- line-numbers-mode\" data-highlighter=\"shiki\" data-ext=\"\" style=\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\"><pre class=\"shiki shiki-themes one-light one-dark-pro vp-code\"><code class=\"language-\"><span class=\"line\"><span>nano /你的自定义路径/自定义名字.sh</span></span></code></pre>\n<div class=\"line-numbers\" aria-hidden=\"true\" style=\"counter-reset:line-number 0\"><div class=\"line-number\"></div></div></div>","readingTime":{"minutes":1.45,"words":434},"title":"3xui自动重置入站流量和客户端流量","icon":"pen-to-square","type":"article"} }],
  ["/%E5%8D%9A%E6%96%87/SmsSender.html", { loader: () => import(/* webpackChunkName: "博文_SmsSender.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/博文/SmsSender.html.js"), meta: {"date":1753142400000,"excerpt":"\n<h2>项目示例</h2>\n","readingTime":{"minutes":2.99,"words":898},"title":"注册控件实现调用api发送短信","icon":"pen-to-square","type":"article"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
  ["/%E5%8D%9A%E6%96%87/", { loader: () => import(/* webpackChunkName: "博文_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/博文/index.html.js"), meta: {"title":"博文"} }],
  ["/category/", { loader: () => import(/* webpackChunkName: "category_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/category/index.html.js"), meta: {"title":"分类","index":false} }],
  ["/tag/", { loader: () => import(/* webpackChunkName: "tag_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/tag/index.html.js"), meta: {"title":"标签","index":false} }],
  ["/article/", { loader: () => import(/* webpackChunkName: "article_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/article/index.html.js"), meta: {"title":"文章","index":false} }],
  ["/star/", { loader: () => import(/* webpackChunkName: "star_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/star/index.html.js"), meta: {"title":"星标","index":false} }],
  ["/timeline/", { loader: () => import(/* webpackChunkName: "timeline_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/timeline/index.html.js"), meta: {"title":"时间轴","index":false} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
