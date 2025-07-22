export const categoriesMap = JSON.parse("{\"category\":{\"/\":{\"path\":\"/category/\",\"map\":{\"脚本\":{\"path\":\"/category/%E8%84%9A%E6%9C%AC/\",\"indexes\":[0]},\"服务\":{\"path\":\"/category/%E6%9C%8D%E5%8A%A1/\",\"indexes\":[1]}}}},\"tag\":{\"/\":{\"path\":\"/tag/\",\"map\":{\"Shell\":{\"path\":\"/tag/shell/\",\"indexes\":[0]},\"Python\":{\"path\":\"/tag/python/\",\"indexes\":[1]},\"Vue\":{\"path\":\"/tag/vue/\",\"indexes\":[1]}}}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });

