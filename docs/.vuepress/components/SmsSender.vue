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
const backendUrl = 'https://api.zimubb.com/send_sms'; 

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