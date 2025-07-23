---
icon: material-icon-theme:vue
date: 2025-07-22
category:
  - 原创
  - 服务
tag:
  - Python
  - Vue
---
# 向我发送短信控件
通过全局注册控件实现调用乌龟电信api免费发送短信给自己的号码。
<!-- more -->
## 项目示例
<SmsSender />
## client.js配置
```
import { defineClientConfig } from '@vuepress/client';
import ProtectedMarkdownEditor from './components/SmsSender.vue';

export default defineClientConfig({
  /**
   * enhance 函数用于增强客户端应用。
   * @param {object} context - 包含 app, router, siteData 的上下文对象。
   */
  enhance({ app, router, siteData }) {
    // 使用 app.component() 来全局注册一个组件。
    // 第一个参数 'SmsSender.vue' 是组件的标签名，
    // 你之后可以在 Markdown 文件中直接使用 <SmsSender.vue />。
    // 第二个参数是我们导入的组件本身。
    app.component('SmsSender.vue', SmsSender.vue);
  },
});
```
## SmsSender.vue代码部分
```
<template>
  <div class="sms-sender-container">
    <h2>发送测试短信</h2>
    <p class="description">在下方输入短信内容，然后点击发送。</p>

    <textarea
      v-model="messageBody"
      class="sms-textarea"
      placeholder="输入短信内容..."
      rows="4"
      :disabled="isLoading"
    ></textarea>
    
    <button 
      @click="sendSms" 
      class="sms-button" 
      :disabled="isLoading"
    >
      {{ isLoading ? '发送中...' : '发送' }}
    </button>
    
    <p 
      v-if="statusMessage" 
      class="status-message" 
      :style="{ color: statusColor }"
    >
      {{ statusMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// --- 响应式状态定义 ---
const messageBody = ref('');
const isLoading = ref(false);
const statusMessage = ref('');
const statusColor = ref('');

// --- 后端 API 地址 ---
// 请确保这里的IP地址和端口是您后端服务器的正确地址
const backendUrl = 'http://124.243.146.108:5000/send_sms'; 

// --- 核心逻辑 ---
const sendSms = async () => {
  // 输入验证
  if (!messageBody.value.trim()) {
    statusMessage.value = '错误：内容不能为空。';
    statusColor.value = 'red';
    return;
  }

  // 更新UI状态为加载中
  isLoading.value = true;
  statusMessage.value = '发送中...';
  statusColor.value = 'black';

  try {
    // 发送 fetch 请求到我们的后端
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: messageBody.value }),
    });

    const data = await response.json();

    // 如果后端返回非2xx状态码，则抛出错误
    if (!response.ok) {
      throw new Error(data.error || `服务器错误 ${response.status}`);
    }

    // 处理成功响应
    statusMessage.value = '发送成功: ' + JSON.stringify(data);
    statusColor.value = 'green';
    messageBody.value = ''; // (可选) 发送成功后清空输入框

  } catch (error) {
    // 处理所有 fetch 过程中可能发生的错误
    statusMessage.value = '发送失败: ' + error.message;
    statusColor.value = 'red';
  } finally {
    // 无论成功或失败，都结束加载状态
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 组件的独立样式，不会影响网站其他部分 */
.sms-sender-container {
  background-color: var(--c-bg-light, #f3f4f6);
  border-radius: 8px;
  padding: 1.5rem 2rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--c-border, #eaecef);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.sms-sender-container > h2 {
  margin-top: 0;
  border-bottom: 1px solid var(--c-border, #eaecef);
  padding-bottom: 0.5rem;
}

.description {
  color: var(--c-text-light);
  font-size: 0.9rem;
}

.sms-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--c-border, #eaecef);
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  resize: vertical;
  transition: border-color 0.2s;
}
.sms-textarea:focus {
  border-color: var(--c-brand, #3eaf7c);
  outline: none;
}

.sms-button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: var(--c-brand, #3eaf7c);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.sms-button:hover {
  filter: brightness(110%);
}

.sms-button:disabled {
  background-color: #a7a7a7;
  cursor: not-allowed;
  opacity: 0.7;
}

.status-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: var(--c-bg-lighter);
  border: 1px solid; /* 颜色由 :style 动态提供 */
  word-break: break-all;
}
</style>
```
## 服务端代码
```
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

# 创建 Flask 应用实例
app = Flask(__name__)

# 为整个应用设置 CORS，允许前端跨源请求
CORS(app) 

# --- 全局常量 ---
# 警告: API密钥直接暴露在代码中，仅适用于个人测试。
API_KEY = "11111"
FROM_NUMBER = "111111"
TO_NUMBER = "111111"
NEKOKO_API_URL = f"https://api.nekoko.tel/sms/send/{TO_NUMBER}"

# --- API 路由 ---
@app.route("/send_sms", methods=["POST"])
def send_sms():
    """接收前端请求，调用外部API，并返回结果"""
    
    # 从请求的JSON体中获取消息内容
    message_body = request.json.get("body")
    if not message_body:
        return jsonify({"error": "请求体中缺少'body'字段"}), 400

    # 准备发送到 nekoko.tel API 的参数
    params = {
        'apikey': API_KEY,
        'from': FROM_NUMBER,
        'body': message_body
    }

    # 使用 requests 库调用外部 API
    try:
        response = requests.get(NEKOKO_API_URL, params=params)
        # 如果API返回错误状态码(如4xx, 5xx)，则抛出异常
        response.raise_for_status()  
        # 将API的成功响应返回给前端
        return response.json()
    except requests.exceptions.RequestException as e:
        # 捕获所有请求相关的错误，并返回一个清晰的错误信息给前端
        return jsonify({"error": "调用外部API时发生错误", "details": str(e)}), 502

# --- 启动服务器 ---
if __name__ == "__main__":
    # 使用 host='0.0.0.0' 使服务器可以从局域网或公网访问
    # debug=False 在生产或性能测试时使用，开发时可以设为 True
    app.run(host='0.0.0.0', port=5000, debug=False)
```