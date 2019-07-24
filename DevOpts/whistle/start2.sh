#!/bin/bash

echo "Ready to start whistle..."

# 杀掉进程
w2 stop -S whistle-fastest

# 指定端口及独立空间
w2 start -S whistle-fastest -p 8080

# 使用配置
w2 use .whistle.js -S whistle-fastest --force

echo "whistle start success!"