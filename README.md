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

项目会自动展示在localhost:3000端口上

## 2. 业务介绍

注意： 本项目仅为演示项目，因此实际并未发布到现网，因此所有页面的访问必须通过代理来访问，否则会被跳转到 404 页面的。

### 2.1 简单静态页面(simple.html)

纯静态页面，无接口请求，无用户操作。

- 调试地址: http://localhost:3000/simple.html?now_n_http=1

### 2.2 单一接口展示型页面(transaction.html)

页面依赖单一的接口来展示。

- 调试地址: http://localhost:3000/transaction.html?now_n_http=1

### 2.3 重交互页面(withdraw.html)

页面依赖多个的接口来展示，且有多个用户交互逻辑。

- 调试地址: http://localhost:3000/withdraw.html?now_n_http=1

