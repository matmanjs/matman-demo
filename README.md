# matman-demo

端对端测试框架 matman 样例

## 开发

首先需要安装依赖

```
$ npm install
```

启动命令

```
# 开发模式
$ npm start

# 构建生产环境版本
$ npm run build
```

## 业务介绍

> 注意： 本项目仅为演示项目，因此实际并未发布到现网，部分场景下需通过代理来访问，否则会被跳转到 404 页面的。

### simple 页

纯静态页面，无接口请求，无用户操作。

- http://127.0.0.1:3000/simple
- http://now.qq.com/simple （使用代理的方式）