#!/bin/bash

# 安装依赖
echo "📦 Executing: npm install..."
npm install

# 启动开发服务器，并将输出重定向到临时文件
echo "🚀 The document development server is starting..."

LOG_FILE=$(mktemp)

npm run docs:dev > "$LOG_FILE" 2>&1 &

VITEPRESS_PID=$!

# 等待服务初始化1s 如果不行可自定义时长
sleep 1

# 从日志中提取地址
URL=$(grep -o 'http://localhost:[0-9]*' "$LOG_FILE" | head -n1)

if [ -z "$URL" ]; then
  echo "❌ Unable to find the startup address from the log. Please check if the startup was successful."
  cat "$LOG_FILE"
  exit 1
fi

# 打开浏览器
echo "🌐 Opening the browser to access：$URL"
open "$URL"

# 提示用户操作
echo "📌 server is running. Press Ctrl+C to stop...."
wait $VITEPRESS_PID