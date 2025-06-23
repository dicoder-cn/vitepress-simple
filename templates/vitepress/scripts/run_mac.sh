#!/bin/bash

# 构建命令，你可以根据需要修改为 yarn build / npm run custom:build 等
echo "正在执行构建..."
npm run build

# 检查上一步是否成功
if [ $? -ne 0 ]; then
  echo "❌ 构建失败，停止执行。"
  exit 1
fi

echo "✅ 构建成功！"

# 获取提交信息，如果为空则使用默认值
read -p "请输入提交信息（或直接回车使用默认值 'chore: update build files'）：" commit_msg

if [ -z "$commit_msg" ]; then
  commit_msg="chore: update build files"
fi

# Git 操作
echo "正在添加文件到 git..."
git add .

echo "正在提交更改..."
git commit -m "$commit_msg"

echo "正在推送到远程仓库..."
git push

echo "🎉 完成：构建、提交并推送成功！"#!/bin/bash

# 进入项目目录（如果你已经在项目目录中可以删除这行）
# cd /path/to/your/project

# 安装依赖
echo "正在执行 npm install..."
npm install

# 启动开发服务器
echo "正在执行 npm run docs:dev..."
npm run docs:dev
