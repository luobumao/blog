export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"字母的博客","icon":"house"} }],
  ["/%E5%8D%9A%E6%96%87/3xui.html", { loader: () => import(/* webpackChunkName: "博文_3xui.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/博文/3xui.html.js"), meta: {"date":1753142400000,"category":["原创","脚本"],"tag":["Shell"],"excerpt":"\n<p>利用shell脚本使用curl调用api实现3xui自动重置客户端流量和入站流量功能。</p>\n","readingTime":{"minutes":1.55,"words":464},"title":"3xui自动重置功能","icon":"pen-to-square","type":"article"} }],
  ["/%E5%8D%9A%E6%96%87/gemini.html", { loader: () => import(/* webpackChunkName: "博文_gemini.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/博文/gemini.html.js"), meta: {"date":1753228800000,"category":["原创","插件"],"tag":["Python"],"excerpt":"\n<p>简单的调用Gemini回答问题或者识别图片的telegram自走机器人插件,上下文和数据库还没做</p>\n","readingTime":{"minutes":3.85,"words":1154},"title":"Pagermaid调用Gemini插件(待完善)","icon":"pen-to-square","type":"article"} }],
  ["/%E5%8D%9A%E6%96%87/rotate.html", { loader: () => import(/* webpackChunkName: "博文_rotate.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/博文/rotate.html.js"), meta: {"date":1753228800000,"category":["原创","插件"],"tag":["Python"],"readingTime":{"minutes":0.05,"words":15},"title":"","icon":"pen-to-square","type":"article"} }],
  ["/%E5%8D%9A%E6%96%87/SmsSender.html", { loader: () => import(/* webpackChunkName: "博文_SmsSender.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/博文/SmsSender.html.js"), meta: {"date":1753142400000,"category":["原创","服务"],"tag":["Python","Vue"],"excerpt":"\n<p>通过全局注册控件实现调用乌龟电信api免费发送短信给自己的号码。</p>\n","readingTime":{"minutes":3.11,"words":933},"title":"向我发送短信控件","icon":"pen-to-square","type":"article"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
  ["/%E5%8D%9A%E6%96%87/", { loader: () => import(/* webpackChunkName: "博文_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/博文/index.html.js"), meta: {"title":"博文"} }],
  ["/category/", { loader: () => import(/* webpackChunkName: "category_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/category/index.html.js"), meta: {"title":"分类","index":false} }],
  ["/category/%E5%8E%9F%E5%88%9B/", { loader: () => import(/* webpackChunkName: "category_原创_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/category/原创/index.html.js"), meta: {"title":"原创 分类","index":false} }],
  ["/category/%E8%84%9A%E6%9C%AC/", { loader: () => import(/* webpackChunkName: "category_脚本_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/category/脚本/index.html.js"), meta: {"title":"脚本 分类","index":false} }],
  ["/category/%E6%8F%92%E4%BB%B6/", { loader: () => import(/* webpackChunkName: "category_插件_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/category/插件/index.html.js"), meta: {"title":"插件 分类","index":false} }],
  ["/category/%E6%9C%8D%E5%8A%A1/", { loader: () => import(/* webpackChunkName: "category_服务_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/category/服务/index.html.js"), meta: {"title":"服务 分类","index":false} }],
  ["/tag/", { loader: () => import(/* webpackChunkName: "tag_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/tag/index.html.js"), meta: {"title":"标签","index":false} }],
  ["/tag/shell/", { loader: () => import(/* webpackChunkName: "tag_shell_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/tag/shell/index.html.js"), meta: {"title":"标签: Shell","index":false} }],
  ["/tag/python/", { loader: () => import(/* webpackChunkName: "tag_python_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/tag/python/index.html.js"), meta: {"title":"标签: Python","index":false} }],
  ["/tag/vue/", { loader: () => import(/* webpackChunkName: "tag_vue_index.html" */"C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/tag/vue/index.html.js"), meta: {"title":"标签: Vue","index":false} }],
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
