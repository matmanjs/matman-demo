#!/bin/bash

# 项目根目录
PROJECT_ROOT=$(cd `dirname $0`; cd ../; pwd)

# mockstar 端口
if [ "$MOCKSTAR_PORT" = "" ]
then
  mockstar_port=9527
  export MOCKSTAR_PORT=$mockstar_port
#  MOCKSTAR_PORT=$mockstar_port
else
  mockstar_port=$MOCKSTAR_PORT
fi

# 可能端口被占用，删除之
lsof -i:$mockstar_port | grep $mockstar_port  | grep -v grep | awk '{print $2}' | xargs kill -9


# whistle 端口
if [ "$WHISTLE_PORT" = "" ]
then
  whistle_port=8899
  export WHISTLE_PORT=$whistle_port
#  WHISTLE_PORT=$mockstar_port
else
  whistle_port=$WHISTLE_PORT
fi

# 可能端口被占用，删除之
lsof -i:$whistle_port | grep $whistle_port  | grep -v grep | awk '{print $2}' | xargs kill -9

# 项目构建
cd "$PROJECT_ROOT" || exit
npm run build

# 启动 whistle
w2 stop
w2 start -p $whistle_port
w2 add "$PROJECT_ROOT"/DevOps/whistle/rules/whistle.prod.js --force

# 使用 mockstar
cd "$PROJECT_ROOT"/DevOps/mockstar-app || exit
npm i
mockstar stop
mockstar start -p $mockstar_port

# 使用 matman
cd "$PROJECT_ROOT"/DevOps/matman-app || exit
npm i
npm run build

