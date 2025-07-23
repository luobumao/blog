export const categoriesMap = JSON.parse("{\"category\":{\"/\":{\"path\":\"/category/\",\"map\":{\"原创\":{\"path\":\"/category/%E5%8E%9F%E5%88%9B/\",\"indexes\":[0,1,2,3]},\"脚本\":{\"path\":\"/category/%E8%84%9A%E6%9C%AC/\",\"indexes\":[2]},\"插件\":{\"path\":\"/category/%E6%8F%92%E4%BB%B6/\",\"indexes\":[0,1]},\"服务\":{\"path\":\"/category/%E6%9C%8D%E5%8A%A1/\",\"indexes\":[3]}}}},\"tag\":{\"/\":{\"path\":\"/tag/\",\"map\":{\"Shell\":{\"path\":\"/tag/shell/\",\"indexes\":[2]},\"Python\":{\"path\":\"/tag/python/\",\"indexes\":[0,1,3]},\"Vue\":{\"path\":\"/tag/vue/\",\"indexes\":[3]}}}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });

