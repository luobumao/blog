import { hasGlobalComponent } from "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_008bee17e3ecb1b39ca4958c4044f293/node_modules/@vuepress/helper/lib/client/index.js";
import Badge from "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/vuepress-plugin-components@_74e210a55a8b125b4769256dfa6106c6/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";

import "C:/Users/liumi/Desktop/blog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_008bee17e3ecb1b39ca4958c4044f293/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    
  },
  setup: () => {

  },
  rootComponents: [

  ],
};
