import { Layout, NotFound, injectDarkMode, setupDarkMode, setupSidebarItems, scrollPromise } from "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_f75718ed18d4ccb730f1580efe0bb74c/node_modules/vuepress-theme-hope/lib/bundle/exports/base.js";

import { defineCatalogInfoGetter } from "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/@vuepress+plugin-catalog@2._66c9d3c2ec025a7068d0f3893467044f/node_modules/@vuepress/plugin-catalog/lib/client/index.js"
import { h } from "vue"
import { resolveComponent } from "vue"
import { Blog, BloggerInfo, SocialMedias, setupBlog } from "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_f75718ed18d4ccb730f1580efe0bb74c/node_modules/vuepress-theme-hope/lib/bundle/exports/blog.js";
import "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_f75718ed18d4ccb730f1580efe0bb74c/node_modules/vuepress-theme-hope/lib/bundle/styles/blog/bundle.scss";

import "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_008bee17e3ecb1b39ca4958c4044f293/node_modules/@vuepress/helper/lib/client/styles/colors.css";
import "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_008bee17e3ecb1b39ca4958c4044f293/node_modules/@vuepress/helper/lib/client/styles/normalize.css";
import "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_008bee17e3ecb1b39ca4958c4044f293/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";
import "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_f75718ed18d4ccb730f1580efe0bb74c/node_modules/vuepress-theme-hope/lib/bundle/styles/bundle.scss";

defineCatalogInfoGetter((meta) => {
  const title = meta.title;
  const shouldIndex = meta.index ?? true;
  const icon = meta.icon;

  return shouldIndex ? {
    title,
    content: icon ? () =>[h(resolveComponent("VPIcon"), { icon, sizing: "both" }), title] : null,
    order: meta.order,
    index: meta.index,
  } : null;
});

export default {
  enhance: ({ app, router }) => {
    const { scrollBehavior } = router.options;

    router.options.scrollBehavior = async (...args) => {
      await scrollPromise.wait();

      return scrollBehavior(...args);
    };

    // inject global properties
    injectDarkMode(app);

    app.component("BloggerInfo", BloggerInfo);
    app.component("SocialMedias", SocialMedias);
  },
  setup: () => {
    setupDarkMode();
    setupSidebarItems();
    setupBlog();
  },
  layouts: {
    Layout,
    NotFound,
    Blog,
  }
};
