#!/bin/bash

# 构建命令，你可以根据需要修改为 yarn build / npm run custom:build 等
echo "Building is in progress..."
npm run docs:build

# 检查上一步是否成功
if [ $? -ne 0 ]; then
  echo "❌ Build failed, stop execution"
  exit 1
fi

echo "✅ Build succeeded！"

# 获取提交信息，如果为空则使用默认值
read -p "Please enter the commit message (or press Enter to use the default value 'chore: update build files'）：" commit_msg

if [ -z "$commit_msg" ]; then
  commit_msg="chore: update build files"
fi

# Git 操作
echo "Adding files to git..."
git add .

echo "Committing changes..."
git commit -m "$commit_msg"

echo "Pushing to the remote repository..."
git push

echo "🎉 Completed: Build, commit, and push successfully！"