import { hasGlobalComponent } from "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_008bee17e3ecb1b39ca4958c4044f293/node_modules/@vuepress/helper/lib/client/index.js";
import { useScriptTag } from "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/@vueuse+core@13.5.0_vue@3.5.17/node_modules/@vueuse/core/index.mjs";
import { h } from "vue";
import { VPIcon } from "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/@vuepress+plugin-icon@2.0.0_f6420f0e05b74478a478c43b24013299/node_modules/@vuepress/plugin-icon/lib/client/index.js"

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("VPIcon")) {
      app.component(
        "VPIcon",
        (props) =>
          h(VPIcon, {
            type: "iconify",
            prefix: "",
            ...props,
          })
      )
    }
  },
  setup: () => {
    useScriptTag(`https://cdn.jsdelivr.net/npm/iconify-icon@2`);
  },
}
