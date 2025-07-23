import { defineClientConfig } from 'vuepress/client';
import SmsSender from './components/SmsSender.vue';
import ProtectedMarkdownEditor from './components/ProtectedMarkdownEditor.vue';

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('SmsSender', SmsSender);
    app.component('ProtectedMarkdownEditor', ProtectedMarkdownEditor);
  },
});