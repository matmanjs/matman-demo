#!/bin/bash

# mockstar 端口
if [ "$MOCKSTAR_PORT" = "" ]
then
  echo "no MOCKSTAR_PORT"
else
  lsof -i:$MOCKSTAR_PORT | grep $MOCKSTAR_PORT  | grep -v grep | awk '{print $2}' | xargs kill -9
fi


# whistle 端口
if [ "$WHISTLE_PORT" = "" ]
then
  echo "no WHISTLE_PORT"
else
  lsof -i:$WHISTLE_PORT | grep $WHISTLE_PORT  | grep -v grep | awk '{print $2}' | xargs kill -9
fi
