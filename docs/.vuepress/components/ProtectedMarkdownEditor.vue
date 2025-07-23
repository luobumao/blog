<template>
  <div class="vditor-editor-container">
    <Transition name="toast">
      <div v-if="toastMessage" class="toast-notification">
        {{ toastMessage }}
      </div>
    </Transition>

    <div v-if="isLocked" class="lock-screen">
      <h3><span class="icon">🔒</span> 内容已加密</h3>
      <p>请输入密码以解锁和编辑。</p>
      <div class="input-group">
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          @keyup.enter="handleUnlock"
          autofocus
        />
        <button @click="handleUnlock">解锁</button>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>

    <div v-else class="editor-screen">
      <div ref="vditorRef" class="vditor-wrapper"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, nextTick } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

const isLocked = ref(true);
const password = ref('');
const errorMessage = ref('');
const toastMessage = ref('');
const vditorRef = ref(null);
let vditorInstance = null;
let toastTimer = null;

const API_BASE_URL = 'https://api.zimubb.com';
const saveIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 2h14.414L22 7.586V22H2zm2 2v16h2v-6h12v6h2V8.414L15.586 4H13v4H6V4zm4 0v2h3V4zm8 16v-4H8v4z"/></svg>`;

const showToast = (message, duration = 3000) => {
  if (toastTimer) clearTimeout(toastTimer);
  toastMessage.value = message;
  toastTimer = setTimeout(() => { toastMessage.value = ''; }, duration);
};

const initializeVditor = (initialContent) => {
  if (!vditorRef.value || vditorInstance) return;

  const calculateInitialHeight = () => {
    if (!vditorRef.value) return 400;
    const topOffset = vditorRef.value.getBoundingClientRect().top;
    return Math.max(400, window.innerHeight - topOffset - 20);
  };
  
  vditorInstance = new Vditor(vditorRef.value, {
    mode: 'sv',
    preview: {
      mode: 'preview',
      actions: [],
    },
    value: initialContent,
    height: calculateInitialHeight(),
    minHeight: 400,
    cache: { enable: false },
    toolbar: [
      { name: 'save', tip: '保存 (Ctrl+S)', hotkey: '⌘S/Ctrl+S', icon: saveIconSVG, click: () => handleSave() },
      '|',
      'preview', 
      'fullscreen', 
      '|',
      'headings', 'bold', 'italic', 'strike',
      'list', 'ordered-list', 'check', '|',
      'quote', 'code', 'inline-code', 'upload', 'link', 'table', '|',
      'help',
    ],
    resize: { enable: true }
  });
};

const handleUnlock = async () => {
  errorMessage.value = '';
  if (!password.value) {
    errorMessage.value = '请输入密码。';
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/text/fetch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '解锁失败');
    
    isLocked.value = false;
    await nextTick();
    initializeVditor(data.content || '# 欢迎使用\n\n点击工具栏的“预览”按钮切换到编辑模式。');

  } catch (error) {
    errorMessage.value = error.message;
  }
};

const handleSave = async () => {
  if (!vditorInstance) return;

  showToast('正在保存...', 1500);
  const currentContent = vditorInstance.getValue();
  
  try {
    const response = await fetch(`${API_BASE_URL}/text/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: currentContent,
        password: password.value 
      })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '保存失败');
    showToast('✅ 内容已成功保存！');

  } catch (error) {
    showToast(`❌ 保存失败: ${error.message}`);
  }
};

onBeforeUnmount(() => {
  if (vditorInstance) {
    vditorInstance.destroy();
    vditorInstance = null;
  }
});
</script>

<style scoped>
.vditor-editor-container {
  box-sizing: border-box;
  position: relative;
  width: 100%;
}
.lock-screen {
  text-align: center;
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background-color: var(--bg-color-secondary, #fff);
}
.input-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
.editor-screen {
  line-height: normal;
}
.vditor-wrapper {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-color, #e0e0e0);
}
.toast-notification {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 6px;
  box-shadow: var(--card-shadow, 0 4px 12px rgba(0,0,0,0.15));
  z-index: 10001;
  background-color: var(--theme-color, #3eaf7c);
  color: var(--bg-color, #fff);
  font-size: 0.95em;
  font-weight: bold;
  white-space: nowrap;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>

<style>
.lock-screen h3 {
  color: var(--text-color, #2c3e50);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.lock-screen .icon {
  margin-right: 0.5rem;
}
.lock-screen p {
  color: var(--text-color-light, #888);
  margin-top: 0;
}
.lock-screen .input-group input {
  background-color: var(--bg-color-tertiary, #f3f4f6);
  border: 1px solid var(--border-color, #e0e0e0);
  color: var(--text-color, #2c3e50);
  border-radius: 4px;
  font-size: 1rem;
  padding: 0.75rem;
  flex-grow: 1;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.lock-screen .input-group input:focus {
  outline: none;
  border-color: var(--theme-color, #3eaf7c);
  box-shadow: 0 0 0 2px rgba(62, 175, 124, 0.2);
}
.lock-screen .input-group button {
  background-color: var(--theme-color, #3eaf7c);
  color: var(--bg-color, #fff);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  transition: background-color 0.2s;
}
.lock-screen .input-group button:hover {
  background-color: var(--theme-color-dark, #339668);
}
.lock-screen .error-message {
  color: var(--danger-color, #f25643);
  margin-top: 1rem;
  font-weight: bold;
  min-height: 1.2em;
}
.vditor {
  border: none !important;
}
</style>