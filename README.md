# matman 自动化测试演示项目

本项目是 [matmanjs](https://matmanjs.github.io/matman/) 的配套演示项目，提供了一些示例，详解了如何使用 matman 这套框架来做端对端测试。


## 1. 如何运行

### 1.1 启动项目

本项目是基于 [create-react-app](https://github.com/facebook/create-react-app)  来初始化项目的，更多资料可以直接查看官方文档。

安装依赖：

```sh
$ npm install
```

执行如下命令即可启动开发，而在开发模式下，会默认启动 `3000` 端口，正常情况下会自动打开浏览器并加载 http://localhost:3000/ 页面。

```sh
# 开发模式
$ npm start



### 1.2 代理

为了模拟真实场景，我们需要借助代理来访问。总共提供了数个页面，各页面地址详见 "2. 业务介绍"。

#### 1.2.1 自动设置代理

推荐使用 [whistle](https://github.com/avwo/whistle) 来设置代理，运行如下命令自动设置代理，具体可以阅读 [DevOps/whistle/README.md](./DevOps/whistle/README.md) 。

```
# 开发场景
$ npm run use-whistle-dev

# 生产环境
$ npm run use-whistle-prod
```

#### 1.2.2 手动设置代理

也可以自己手动设置，其中 `[project_path]` 为本地项目的绝对路径，需要按实际情况替换。

> 默认情况下，开发场景项目启动端口为 `3000`， mockstar 启动端口为 `9527` 。

场景一： 开发场景，代理如下：

```
cgi.now.qq.com/cgi-bin 127.0.0.1:9527
now.qq.com/maybe/report statusCode://200
now.qq.com 127.0.0.1:3000
now.qq.com/manifest.json [project_path]/public/manifest.json
```

场景二： 生产环境，代理如下：

```
cgi.now.qq.com/cgi-bin 127.0.0.1:9527
now.qq.com/maybe/report statusCode://200
now.qq.com/manifest.json [project_path]/build/manifest.json
/^https?://now\.qq\.com/static/(.*)$/ [project_path]/build/static/$1
/^https?://now\.qq\.com/([\w\-]*)(.*)$/ [project_path]/build/index
```

### 1.3 mockstar 桩数据

进入到 `DevOps/mockstar-app` 中，执行安装和启动命令即可

```
$ npm install
$ npm start
```

### 1.4 matman 端对端测试模块

进入到 `DevOps/matman-app` 中，执行安装命令

```
$ npm install
```

## 2. 业务介绍

### 2.1 简单静态页面(simple)

移动端 H5 纯静态页面，无接口请求，无用户操作。

- 调试地址: https://now.qq.com/simple


### 2.2 单一接口展示型页面(transaction)

移动端 H5 页面，依赖一条接口数据来展示。

- 调试地址: https://now.qq.com/transaction


### 2.3 重交互页面(withdraw)

移动端 H5 页面，依赖多条接口数据来展示，且有多个用户交互逻辑。

- 调试地址: https://now.qq.com/withdraw


## 3. 执行自动化测试


- `npm test`：执行单元测试和端对端测试，并且负责初始化端对端测试的环境依赖
- `npm run test:unit`：只执行单元测试
- `npm run test:e2e`：只执行端对端测试，并且负责初始化端对端测试的环境依赖
