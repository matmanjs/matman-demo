# matman自动化测试演示项目

本项目是 [matmanjs](https://matmanjs.gitbook.io/cookbook/) 的配套演示项目。

## 1. 如何运行

### 1.1 开发环境配置

安装依赖

```
$ npm install
```

### 1.2 开发过程

#### 1.2.1 命令

运行项目

```sh
# 开发模式
$ npm start
```

项目会自动展示在localhost:3000端口上。

### 1.3 代理

注意： 本项目仅为演示项目，因此实际并未发布到现网，因此所有页面的访问必须通过代理来访问，否则会被跳转到 404 页面的。

推荐使用 [whistle](https://github.com/avwo/whistle) 来设置代理，进入到 `DevOpts/whistle` 下，执行相关命令（可以查看 DevOpts/whistle/README.md），可以快速设置上述的 whistle 代理。

```
$ npm run start-dev
```


也可以自己手动设置，其中 `[project_path]` 为本地项目的绝对路径，需要按实际情况替换。

开发场景下的代理为：

```
cgi.now.qq.com/cgi-bin 127.0.0.1:9527
now.qq.com/maybe/report statusCode://200
now.qq.com 127.0.0.1:3000
```

如果要测试 build 之后的代码，则配置为：

```
cgi.now.qq.com/cgi-bin 127.0.0.1:9527
now.qq.com/maybe/report statusCode://200
now.qq.com/manifest.json [project_path]/build/manifest.json
/^https?://now\.qq\.com/static/(.*)$/ [project_path]/build/static/$1
/^https?://now\.qq\.com/([\w\-]*)(.*)$/ [project_path]/build/index
```

### 1.4 mockstar 桩数据

进入到 `DevOpts/mockstar-app` 中，执行安装和启动命令即可

```
$ npm install
$ npm start
```

## 2. 业务介绍

### 2.1 简单静态页面(simple)

纯静态页面，无接口请求，无用户操作。

- 调试地址: https://now.qq.com/simple

### 2.2 单一接口展示型页面(transaction)

页面依赖单一的接口来展示。

- 调试地址: https://now.qq.com/transaction

### 2.3 重交互页面(withdraw)

页面依赖多个的接口来展示，且有多个用户交互逻辑。

- 调试地址: https://now.qq.com/withdraw

