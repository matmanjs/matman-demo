#!/bin/bash

echo "Ready to start whistle..."

# 杀掉进程
w2 stop

sleep 1s

# 指定端口及独立空间
w2 start -p 8080

# 使用配置
w2 use .whistle.js --force

echo "whistle start success!"