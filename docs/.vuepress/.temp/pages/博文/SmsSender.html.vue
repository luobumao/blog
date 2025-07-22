<template><div><h1 id="向我发送短信控件" tabindex="-1"><a class="header-anchor" href="#向我发送短信控件"><span>向我发送短信控件</span></a></h1>
<p>通过全局注册控件实现调用乌龟电信api免费发送短信给自己的号码。</p>
<!-- more -->
<h2 id="项目示例" tabindex="-1"><a class="header-anchor" href="#项目示例"><span>项目示例</span></a></h2>
<SmsSender /><h2 id="client-js代码部分" tabindex="-1"><a class="header-anchor" href="#client-js代码部分"><span>client.js代码部分</span></a></h2>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>import { defineClientConfig } from 'vuepress/client'</span></span>
<span class="line"><span>import SmsSender from './components/SmsSender.vue'</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default defineClientConfig({</span></span>
<span class="line"><span>  enhance({ app, router, siteData }) {</span></span>
<span class="line"><span>    app.component('SmsSender', SmsSender)</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>})</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="smssender-vue代码部分" tabindex="-1"><a class="header-anchor" href="#smssender-vue代码部分"><span>SmsSender.vue代码部分</span></a></h2>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>&#x3C;template></span></span>
<span class="line"><span>  &#x3C;div class="sms-sender-container"></span></span>
<span class="line"><span>    &#x3C;h2>发送测试短信&#x3C;/h2></span></span>
<span class="line"><span>    &#x3C;p class="description">在下方输入短信内容，然后点击发送。&#x3C;/p></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &#x3C;textarea</span></span>
<span class="line"><span>      v-model="messageBody"</span></span>
<span class="line"><span>      class="sms-textarea"</span></span>
<span class="line"><span>      placeholder="输入短信内容..."</span></span>
<span class="line"><span>      rows="4"</span></span>
<span class="line"><span>      :disabled="isLoading"</span></span>
<span class="line"><span>    >&#x3C;/textarea></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#x3C;button </span></span>
<span class="line"><span>      @click="sendSms" </span></span>
<span class="line"><span>      class="sms-button" </span></span>
<span class="line"><span>      :disabled="isLoading"</span></span>
<span class="line"><span>    ></span></span>
<span class="line"><span>      {{ isLoading ? '发送中...' : '发送' }}</span></span>
<span class="line"><span>    &#x3C;/button></span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#x3C;p </span></span>
<span class="line"><span>      v-if="statusMessage" </span></span>
<span class="line"><span>      class="status-message" </span></span>
<span class="line"><span>      :style="{ color: statusColor }"</span></span>
<span class="line"><span>    ></span></span>
<span class="line"><span>      {{ statusMessage }}</span></span>
<span class="line"><span>    &#x3C;/p></span></span>
<span class="line"><span>  &#x3C;/div></span></span>
<span class="line"><span>&#x3C;/template></span></span>
<span class="line"><span></span></span>
<span class="line"><span>&#x3C;script setup></span></span>
<span class="line"><span>import { ref } from 'vue';</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// --- 响应式状态定义 ---</span></span>
<span class="line"><span>const messageBody = ref('');</span></span>
<span class="line"><span>const isLoading = ref(false);</span></span>
<span class="line"><span>const statusMessage = ref('');</span></span>
<span class="line"><span>const statusColor = ref('');</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// --- 后端 API 地址 ---</span></span>
<span class="line"><span>// 请确保这里的IP地址和端口是您后端服务器的正确地址</span></span>
<span class="line"><span>const backendUrl = 'http://124.243.146.108:5000/send_sms'; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// --- 核心逻辑 ---</span></span>
<span class="line"><span>const sendSms = async () => {</span></span>
<span class="line"><span>  // 输入验证</span></span>
<span class="line"><span>  if (!messageBody.value.trim()) {</span></span>
<span class="line"><span>    statusMessage.value = '错误：内容不能为空。';</span></span>
<span class="line"><span>    statusColor.value = 'red';</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 更新UI状态为加载中</span></span>
<span class="line"><span>  isLoading.value = true;</span></span>
<span class="line"><span>  statusMessage.value = '发送中...';</span></span>
<span class="line"><span>  statusColor.value = 'black';</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    // 发送 fetch 请求到我们的后端</span></span>
<span class="line"><span>    const response = await fetch(backendUrl, {</span></span>
<span class="line"><span>      method: 'POST',</span></span>
<span class="line"><span>      headers: { 'Content-Type': 'application/json' },</span></span>
<span class="line"><span>      body: JSON.stringify({ body: messageBody.value }),</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const data = await response.json();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 如果后端返回非2xx状态码，则抛出错误</span></span>
<span class="line"><span>    if (!response.ok) {</span></span>
<span class="line"><span>      throw new Error(data.error || `服务器错误 ${response.status}`);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 处理成功响应</span></span>
<span class="line"><span>    statusMessage.value = '发送成功: ' + JSON.stringify(data);</span></span>
<span class="line"><span>    statusColor.value = 'green';</span></span>
<span class="line"><span>    messageBody.value = ''; // (可选) 发送成功后清空输入框</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  } catch (error) {</span></span>
<span class="line"><span>    // 处理所有 fetch 过程中可能发生的错误</span></span>
<span class="line"><span>    statusMessage.value = '发送失败: ' + error.message;</span></span>
<span class="line"><span>    statusColor.value = 'red';</span></span>
<span class="line"><span>  } finally {</span></span>
<span class="line"><span>    // 无论成功或失败，都结束加载状态</span></span>
<span class="line"><span>    isLoading.value = false;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>&#x3C;/script></span></span>
<span class="line"><span></span></span>
<span class="line"><span>&#x3C;style scoped></span></span>
<span class="line"><span>/* 组件的独立样式，不会影响网站其他部分 */</span></span>
<span class="line"><span>.sms-sender-container {</span></span>
<span class="line"><span>  background-color: var(--c-bg-light, #f3f4f6);</span></span>
<span class="line"><span>  border-radius: 8px;</span></span>
<span class="line"><span>  padding: 1.5rem 2rem;</span></span>
<span class="line"><span>  margin-top: 1.5rem;</span></span>
<span class="line"><span>  margin-bottom: 1.5rem;</span></span>
<span class="line"><span>  border: 1px solid var(--c-border, #eaecef);</span></span>
<span class="line"><span>  box-shadow: 0 2px 4px rgba(0,0,0,0.05);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.sms-sender-container > h2 {</span></span>
<span class="line"><span>  margin-top: 0;</span></span>
<span class="line"><span>  border-bottom: 1px solid var(--c-border, #eaecef);</span></span>
<span class="line"><span>  padding-bottom: 0.5rem;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.description {</span></span>
<span class="line"><span>  color: var(--c-text-light);</span></span>
<span class="line"><span>  font-size: 0.9rem;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.sms-textarea {</span></span>
<span class="line"><span>  width: 100%;</span></span>
<span class="line"><span>  padding: 0.75rem;</span></span>
<span class="line"><span>  border: 1px solid var(--c-border, #eaecef);</span></span>
<span class="line"><span>  border-radius: 6px;</span></span>
<span class="line"><span>  font-size: 1rem;</span></span>
<span class="line"><span>  box-sizing: border-box;</span></span>
<span class="line"><span>  resize: vertical;</span></span>
<span class="line"><span>  transition: border-color 0.2s;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.sms-textarea:focus {</span></span>
<span class="line"><span>  border-color: var(--c-brand, #3eaf7c);</span></span>
<span class="line"><span>  outline: none;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.sms-button {</span></span>
<span class="line"><span>  margin-top: 1rem;</span></span>
<span class="line"><span>  padding: 0.6rem 1.2rem;</span></span>
<span class="line"><span>  background-color: var(--c-brand, #3eaf7c);</span></span>
<span class="line"><span>  color: white;</span></span>
<span class="line"><span>  border: none;</span></span>
<span class="line"><span>  border-radius: 6px;</span></span>
<span class="line"><span>  font-size: 1rem;</span></span>
<span class="line"><span>  cursor: pointer;</span></span>
<span class="line"><span>  transition: background-color 0.2s, opacity 0.2s;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.sms-button:hover {</span></span>
<span class="line"><span>  filter: brightness(110%);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.sms-button:disabled {</span></span>
<span class="line"><span>  background-color: #a7a7a7;</span></span>
<span class="line"><span>  cursor: not-allowed;</span></span>
<span class="line"><span>  opacity: 0.7;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.status-message {</span></span>
<span class="line"><span>  margin-top: 1rem;</span></span>
<span class="line"><span>  padding: 0.75rem;</span></span>
<span class="line"><span>  border-radius: 6px;</span></span>
<span class="line"><span>  background-color: var(--c-bg-lighter);</span></span>
<span class="line"><span>  border: 1px solid; /* 颜色由 :style 动态提供 */</span></span>
<span class="line"><span>  word-break: break-all;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&#x3C;/style></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="服务端代码" tabindex="-1"><a class="header-anchor" href="#服务端代码"><span>服务端代码</span></a></h2>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>from flask import Flask, request, jsonify</span></span>
<span class="line"><span>from flask_cors import CORS</span></span>
<span class="line"><span>import requests</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 创建 Flask 应用实例</span></span>
<span class="line"><span>app = Flask(__name__)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 为整个应用设置 CORS，允许前端跨源请求</span></span>
<span class="line"><span>CORS(app) </span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 全局常量 ---</span></span>
<span class="line"><span># 警告: API密钥直接暴露在代码中，仅适用于个人测试。</span></span>
<span class="line"><span>API_KEY = "11111"</span></span>
<span class="line"><span>FROM_NUMBER = "111111"</span></span>
<span class="line"><span>TO_NUMBER = "111111"</span></span>
<span class="line"><span>NEKOKO_API_URL = f"https://api.nekoko.tel/sms/send/{TO_NUMBER}"</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- API 路由 ---</span></span>
<span class="line"><span>@app.route("/send_sms", methods=["POST"])</span></span>
<span class="line"><span>def send_sms():</span></span>
<span class="line"><span>    """接收前端请求，调用外部API，并返回结果"""</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # 从请求的JSON体中获取消息内容</span></span>
<span class="line"><span>    message_body = request.json.get("body")</span></span>
<span class="line"><span>    if not message_body:</span></span>
<span class="line"><span>        return jsonify({"error": "请求体中缺少'body'字段"}), 400</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 准备发送到 nekoko.tel API 的参数</span></span>
<span class="line"><span>    params = {</span></span>
<span class="line"><span>        'apikey': API_KEY,</span></span>
<span class="line"><span>        'from': FROM_NUMBER,</span></span>
<span class="line"><span>        'body': message_body</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 使用 requests 库调用外部 API</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        response = requests.get(NEKOKO_API_URL, params=params)</span></span>
<span class="line"><span>        # 如果API返回错误状态码(如4xx, 5xx)，则抛出异常</span></span>
<span class="line"><span>        response.raise_for_status()  </span></span>
<span class="line"><span>        # 将API的成功响应返回给前端</span></span>
<span class="line"><span>        return response.json()</span></span>
<span class="line"><span>    except requests.exceptions.RequestException as e:</span></span>
<span class="line"><span>        # 捕获所有请求相关的错误，并返回一个清晰的错误信息给前端</span></span>
<span class="line"><span>        return jsonify({"error": "调用外部API时发生错误", "details": str(e)}), 502</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 启动服务器 ---</span></span>
<span class="line"><span>if __name__ == "__main__":</span></span>
<span class="line"><span>    # 使用 host='0.0.0.0' 使服务器可以从局域网或公网访问</span></span>
<span class="line"><span>    # debug=False 在生产或性能测试时使用，开发时可以设为 True</span></span>
<span class="line"><span>    app.run(host='0.0.0.0', port=5000, debug=False)</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


