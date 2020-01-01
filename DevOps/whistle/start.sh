#!/bin/bash

echo "Ready to start whistle..."

# whistle 默认端口，但是可以通过 ./start.sh -p 8899 来修改
PORT=8899

# 启动模式，dev 为开发模式， prod 为生产环境build模式，但是可以通过 ./start.sh -m dev 来修改
MODE='dev'

while getopts ":p:m:" opt
do
    case ${opt} in
        p)
        echo "参数a的值$OPTARG"
        PORT=$OPTARG
        ;;
        m)
        echo "参数b的值$OPTARG"
        MODE=$OPTARG
        ;;
        ?)
        echo "未知参数"
        exit 1;;
    esac
done

#echo ${PORT}
#echo ${MODE}

# 杀掉进程
w2 stop

# 指定端口及独立空间
w2 start -p ${PORT}

# 使用配置，如果要强制启用，则需要增加 --force
w2 use rules/.whistle.${MODE}.js --force

echo "whistle start success!"