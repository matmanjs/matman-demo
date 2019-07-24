#!/bin/bash

echo "Ready to start whistle..."

# 杀掉进程
w2 stop

# 指定端口及独立空间
w2 start -p 8080

# 使用配置，如果要强制启用，则需要增加 --force
w2 use rules/.whistle.dev.js --force

echo "whistle start success!"