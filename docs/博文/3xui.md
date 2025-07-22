---
icon: pen-to-square
date: 2025-07-22
category:
  - 脚本
tag:
  - Shell
---
# 3xui自动重置功能
利用shell脚本使用curl调用api实现3xui自动重置客户端流量和入站流量功能。
<!-- more -->
## 部署教程
```
nano /你的自定义路径/自定义名字.sh
```
把脚本内容修改好后粘贴进去
按Ctrl+X左下角出现提示后按Y然后按回车
```
chmod +x /你的自定义路径/自定义名字.sh
```
```
crontab -e
```
输入1回车如果你是第一次使用这个指令
把下列一行任务内容填到最后面
```
30 22 15 * * /你的自定义路径/自定义名字.sh
```
上一行表示为每月15日22点30分，按需修改
填完之后按Ctrt+X，左下角出现提示后按Y然后按回车
配置好后可crontab -l查看是否正常保存
建议全部完工后执行:
```
bash /你的自定义路径/自定义名字.sh
```
查看是否运行正常
## shell脚本内容
```
#!/bin/bash

PANEL_URL="https://域名或ip:端口/面板url根路径(不带/)" # 建议使用https，反代后可去掉":端口"不写
USERNAME="用户名"
PASSWORD="密码"
COOKIE_FILE="/tmp/3xui.cookies"

LOGIN_RESPONSE=$(curl -s -c "$COOKIE_FILE" -X POST "$PANEL_URL/login" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=$USERNAME&password=$PASSWORD")
if ! echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo "登录失败"
    echo "$LOGIN_RESPONSE"
    rm -f "$COOKIE_FILE"
    exit 1
fi
echo "登录成功"

response1=$(curl -s -b "$COOKIE_FILE" -X POST "$PANEL_URL/panel/inbound/resetAllTraffics")
if echo "$response1" | grep -q '"success":true'; then
    echo "重置所有入站流量: 成功"
else
    echo "重置所有入站流量: 失败"
    echo "$response1"
fi

response2=$(curl -s -b "$COOKIE_FILE" -X POST "$PANEL_URL/panel/inbound/resetAllClientTraffics/-1")
if echo "$response2" | grep -q '"success":true'; then
    echo "重置所有客户端流量: 成功"
else
    echo "重置所有客户端流量: 失败"
    echo "$response2"
fi

rm -f "$COOKIE_FILE"
echo "完成."
```
## 官方api文档
[官方api文档](https://www.postman.com/hsanaei/3x-ui/collection/q1l5l0u/3x-ui)