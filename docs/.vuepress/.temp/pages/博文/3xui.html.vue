<template><div><h1 id="_3xui自动重置入站流量和客户端流量" tabindex="-1"><a class="header-anchor" href="#_3xui自动重置入站流量和客户端流量"><span>3xui自动重置入站流量和客户端流量</span></a></h1>
<h2 id="部署教程" tabindex="-1"><a class="header-anchor" href="#部署教程"><span>部署教程</span></a></h2>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>nano /你的自定义路径/自定义名字.sh</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>把脚本内容修改好后粘贴进去
按Ctrl+X左下角出现提示后按Y然后按回车</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>chmod +x /你的自定义路径/自定义名字.sh</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>crontab -e</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>输入1回车如果你是第一次使用这个指令
把下列一行任务内容填到最后面</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>30 22 15 * * /你的自定义路径/自定义名字.sh</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>上一行表示为每月15日22点30分，按需修改
填完之后按Ctrt+X，左下角出现提示后按Y然后按回车
配置好后可crontab -l查看是否正常保存
建议全部完工后执行:</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>bash /你的自定义路径/自定义名字.sh</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>查看是否运行正常</p>
<h2 id="shell脚本内容" tabindex="-1"><a class="header-anchor" href="#shell脚本内容"><span>shell脚本内容</span></a></h2>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PANEL_URL="https://域名或ip:端口/面板url根路径(不带/)" # 建议使用https，反代后可去掉":端口"不写</span></span>
<span class="line"><span>USERNAME="用户名"</span></span>
<span class="line"><span>PASSWORD="密码"</span></span>
<span class="line"><span>COOKIE_FILE="/tmp/3xui.cookies"</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LOGIN_RESPONSE=$(curl -s -c "$COOKIE_FILE" -X POST "$PANEL_URL/login" \</span></span>
<span class="line"><span>    -H "Content-Type: application/x-www-form-urlencoded" \</span></span>
<span class="line"><span>    -d "username=$USERNAME&#x26;password=$PASSWORD")</span></span>
<span class="line"><span>if ! echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then</span></span>
<span class="line"><span>    echo "登录失败"</span></span>
<span class="line"><span>    echo "$LOGIN_RESPONSE"</span></span>
<span class="line"><span>    rm -f "$COOKIE_FILE"</span></span>
<span class="line"><span>    exit 1</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>echo "登录成功"</span></span>
<span class="line"><span></span></span>
<span class="line"><span>response1=$(curl -s -b "$COOKIE_FILE" -X POST "$PANEL_URL/panel/inbound/resetAllTraffics")</span></span>
<span class="line"><span>if echo "$response1" | grep -q '"success":true'; then</span></span>
<span class="line"><span>    echo "重置所有入站流量: 成功"</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    echo "重置所有入站流量: 失败"</span></span>
<span class="line"><span>    echo "$response1"</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>response2=$(curl -s -b "$COOKIE_FILE" -X POST "$PANEL_URL/panel/inbound/resetAllClientTraffics/-1")</span></span>
<span class="line"><span>if echo "$response2" | grep -q '"success":true'; then</span></span>
<span class="line"><span>    echo "重置所有客户端流量: 成功"</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    echo "重置所有客户端流量: 失败"</span></span>
<span class="line"><span>    echo "$response2"</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rm -f "$COOKIE_FILE"</span></span>
<span class="line"><span>echo "完成."</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="官方api文档" tabindex="-1"><a class="header-anchor" href="#官方api文档"><span>官方api文档</span></a></h2>
<p><a href="https://www.postman.com/hsanaei/3x-ui/collection/q1l5l0u/3x-ui" target="_blank" rel="noopener noreferrer">官方api文档</a></p>
</div></template>


