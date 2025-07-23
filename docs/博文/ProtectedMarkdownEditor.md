---
icon: material-icon-theme:vue
date: 2025-07-24
category:
  - 原创
  - 服务
tag:
  - Python
  - Vue
---
# 带密码保护的云Markdown编辑器
通过全局注册控件实现云端编辑Markdown并且存取，类似密码本的功能。
<!-- more -->
## client.js配置
```
import { defineClientConfig } from '@vuepress/client';
import ProtectedMarkdownEditor from './components/ProtectedMarkdownEditor.vue';

export default defineClientConfig({
  /**
   * enhance 函数用于增强客户端应用。
   * @param {object} context - 包含 app, router, siteData 的上下文对象。
   */
  enhance({ app, router, siteData }) {
    // 使用 app.component() 来全局注册一个组件。
    // 第一个参数 'ProtectedMarkdownEditor' 是组件的标签名，
    // 你之后可以在 Markdown 文件中直接使用 <ProtectedMarkdownEditor />。
    // 第二个参数是我们导入的组件本身。
    app.component('ProtectedMarkdownEditor', ProtectedMarkdownEditor);
  },
});
```
## 服务端代码
```
# 导入必要的库
import os         # 用于从环境变量中安全地读取敏感信息
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 应用配置 ---
app = Flask(__name__)
CORS(app) 

# 数据库文件名
DATABASE = 'database.db'

# 【安全增强】从环境变量读取密码。
# 这样可以避免将密码直接写入代码。
# 在服务器上，您需要设置一个名为 EDITOR_PASSWORD 的环境变量。
# 'your_default_password' 是一个备用密码，以防环境变量未设置。
CORRECT_PASSWORD = os.environ.get('EDITOR_PASSWORD', 'your_default_password')


# --- 数据库初始化与自愈逻辑 ---

# 此函数只在应用启动时运行一次，确保数据表的结构存在。
# 使用 "IF NOT EXISTS" 是线程/进程安全的，可以避免多进程启动时的竞争问题。
def ensure_table_exists():
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS document (
                id INTEGER PRIMARY KEY,
                content TEXT NOT NULL
            );
        ''')
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"数据库表结构检查/创建失败: {e}")

# 在应用加载时立即执行，准备好数据库表。
ensure_table_exists()


# --- API 路由 ---

@app.route('/text/fetch', methods=['POST'])
def fetch_document():
    data = request.get_json()
    if not data or 'password' not in data:
        return jsonify({"error": "请求格式错误"}), 400

    if data['password'] != CORRECT_PASSWORD:
        return jsonify({"error": "密码错误"}), 401

    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute("SELECT content FROM document WHERE id = 1;")
        row = cursor.fetchone()

        # 【核心自愈逻辑】
        # 如果在数据库中找到了内容 (row is not None)，则直接返回。
        if row:
            conn.close()
            return jsonify({"content": row[0]})
        # 如果没找到内容 (数据库是空的)，则不再返回 404 错误。
        else:
            # 而是立即创建默认内容...
            default_content = """# 欢迎使用

这是从 Python 后端获取的初始内容。
您可以随意编辑，然后按 `Ctrl+S` 保存。
"""
            cursor.execute("INSERT INTO document (id, content) VALUES (?, ?);", (1, default_content))
            conn.commit()
            conn.close()
            # ...然后将这份刚创建的默认内容返回给用户。
            # 这保证了第一次正确访问时，系统能自动完成初始化。
            return jsonify({"content": default_content})
            
    except Exception as e:
        print(f"数据库操作失败: {e}")
        return jsonify({"error": "数据库操作失败"}), 500

@app.route('/text/save', methods=['POST'])
def save_document():
    data = request.get_json()
    if not data or 'content' not in data or 'password' not in data:
        return jsonify({"error": "请求格式错误或缺少密码"}), 400

    if data['password'] != CORRECT_PASSWORD:
        return jsonify({"error": "密码错误，保存失败"}), 401

    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        # 使用 "INSERT OR REPLACE" 是一种非常健壮的写法。
        # 如果 id=1 的行已存在，它会更新内容；如果不存在，它会创建新行。
        # 这进一步增强了代码在任何情况下的稳定性。
        cursor.execute("INSERT OR REPLACE INTO document (id, content) VALUES (?, ?);", (1, data['content']))
        conn.commit()
        conn.close()
        return jsonify({"message": "保存成功"})
    except Exception as e:
        print(f"数据库更新失败: {e}")
        return jsonify({"error": "数据库更新失败"}), 500

# --- 应用启动 ---
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)
# 
```
## ProtectedMarkdownEditor.vue代码部分
```
<template>
  <!-- 根容器 -->
  <div class="vditor-editor-container">
    
    <!-- Toast 通知组件，使用 Vue 的 Transition 实现淡入淡出效果 -->
    <Transition name="toast">
      <div v-if="toastMessage" class="toast-notification">
        {{ toastMessage }}
      </div>
    </Transition>

    <!-- 条件渲染：如果 isLocked 为 true，显示锁定屏幕 -->
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

    <!-- 否则 (isLocked 为 false)，显示编辑器 -->
    <div v-else class="editor-screen">
      <!-- 这个 div 将作为 Vditor 编辑器的挂载点 -->
      <div ref="vditorRef" class="vditor-wrapper"/>
    </div>
  </div>
</template>

<script setup>
// 导入 Vue 的核心功能和 Vditor 编辑器库
import { ref, onBeforeUnmount, nextTick } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

// --- 状态管理 ---
// 使用 ref 创建响应式变量来追踪组件状态
const isLocked = ref(true);          // 控制显示锁定屏幕还是编辑器
const password = ref('');            // 存储用户输入的密码
const errorMessage = ref('');        // 存储解锁时的错误信息
const toastMessage = ref('');        // 存储 Toast 通知的内容
const vditorRef = ref(null);         // 用于获取编辑器挂载点的 DOM 引用
let vditorInstance = null;           // 用于持有 Vditor 的实例对象
let toastTimer = null;               // 用于管理 Toast 的计时器

// --- 配置 ---
const API_BASE_URL = 'https://api.zimubb.com'; // 你的后端 API 地址
const saveIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 2h14.414L22 7.586V22H2zm2 2v16h2v-6h12v6h2V8.414L15.586 4H13v4H6V4zm4 0v2h3V4zm8 16v-4H8v4z"/></svg>`;

// --- 工具函数 ---
// 显示一个短暂的浮动提示
const showToast = (message, duration = 3000) => {
  if (toastTimer) clearTimeout(toastTimer);
  toastMessage.value = message;
  toastTimer = setTimeout(() => { toastMessage.value = ''; }, duration);
};

// --- 核心逻辑 ---
// 初始化 Vditor 编辑器
const initializeVditor = (initialContent) => {
  if (!vditorRef.value || vditorInstance) return;

  // 在初始化时计算一次编辑器的初始高度，使其适应屏幕
  const calculateInitialHeight = () => {
    if (!vditorRef.value) return 300;
    const topOffset = vditorRef.value.getBoundingClientRect().top;
    const availableHeight = window.innerHeight - topOffset;
    const bottomPadding = 80;
    const minHeight = 300;
    return Math.max(minHeight, availableHeight - bottomPadding);
  };
  
  // 创建 Vditor 实例
  vditorInstance = new Vditor(vditorRef.value, {
    height: calculateInitialHeight(),
    minHeight: 300,
    mode: 'ir', // 即时渲染模式
    cache: { enable: false },
    toolbar: [ // 自定义工具栏
      { name: 'save', tip: '保存 (Ctrl+S)', hotkey: '⌘S/Ctrl+S', icon: saveIconSVG, click: () => handleSave() },
      '|', 'headings', 'bold', 'italic', 'strike',
      'list', 'ordered-list', 'check', '|',
      'quote', 'code', 'inline-code', 'upload', 'link', 'table', '|',
      'preview', 'fullscreen', 'help',
    ],
    preview: { actions: [] }, // 禁用预览模式下的操作按钮
    after: () => { // 编辑器渲染完成后的回调
      if (vditorInstance) vditorInstance.setValue(initialContent);
    },
    resize: { enable: false } // 【关键修改】禁用右下角的拖动调整大小功能
  });
};

// 处理解锁按钮点击事件
const handleUnlock = async () => {
  errorMessage.value = '';
  if (!password.value) {
    errorMessage.value = '请输入密码。';
    return;
  }
  
  try {
    // 发送 POST 请求到后端 /text/fetch 接口
    const response = await fetch(`${API_BASE_URL}/text/fetch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '解锁失败');
    
    // 解锁成功，更新状态
    isLocked.value = false;
    // 使用 nextTick 确保 DOM 更新（v-if 切换完成）后才执行初始化
    await nextTick();
    initializeVditor(data.content);

  } catch (error) {
    errorMessage.value = error.message;
  }
};

// 处理保存按钮点击事件
const handleSave = async () => {
  if (!vditorInstance) return;

  showToast('正在保存...', 1500);
  const currentContent = vditorInstance.getValue();
  
  try {
    // 发送 POST 请求到后端 /text/save 接口
    const response = await fetch(`${API_BASE_URL}/text/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 【安全交互】将内容和密码一同发送，以供后端验证
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

// --- 生命周期钩子 ---
// 在组件被卸载前执行清理操作
onBeforeUnmount(() => {
  // 销毁 Vditor 实例，释放内存，防止内存泄漏
  if (vditorInstance) {
    vditorInstance.destroy();
    vditorInstance = null;
  }
});
</script>

<style scoped>
/* scoped 样式只会应用到当前组件的元素上，不会污染全局 */
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
/* 全局样式 (没有 scoped)，可以影响到子组件或原生 HTML 元素 */
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
```