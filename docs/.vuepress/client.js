import { defineClientConfig } from 'vuepress/client'
import SmsSender from './components/SmsSender.vue'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('SmsSender', SmsSender)
  },
})