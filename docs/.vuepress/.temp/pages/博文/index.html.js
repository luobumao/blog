import comp from "C:/Users/liumi/Desktop/blog/docs/.vuepress/.temp/pages/博文/index.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%8D%9A%E6%96%87/\",\"title\":\"博文\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"博文\",\"article\":false,\"feed\":false,\"sitemap\":false,\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"博文\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://zimubb.com/%E5%8D%9A%E6%96%87/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"文档\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"博文\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"readingTime\":{\"minutes\":0,\"words\":1},\"filePathRelative\":null,\"excerpt\":\"\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
