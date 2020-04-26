# matman-app

本项目用于端对端测试。


## 编写端对端测试用例

本项目的端对端测试是基于 [matmanjs](https://github.com/matmanjs/matman) 来实现，更多资料请查看官方文档。


### 准备工作

在开始写端对端测试用例之前，需要先将开发环境准备好：

- 启动项目构建
- 启动 whistle，并配置好代理
- 启动 mockstar

正如自己要开发项目一样，准备好了上述条件之后，才便于编写端对端测试用例。


### 编写端对端测试脚本和用例

建议先写端对端测试脚本，例如 `src/testers/page-simple/cases/basic-check/index.js`  ，编写前端爬虫脚本，例如 `src/testers/page-simple/crawlers/get-page-info.js` 。

端对端测试脚本是一个纯 node 模板，因此可以直接执行。需要注意的是，前端爬虫脚本因为要打包成一个 js 文件，因此需要运行 `npm run build` 构建一下。


测试脚本完成之后，再写测试用例，例如 `src/testers/page-simple/cases/basic-check/index.test.js` 。


## 如何进行端对端测试

端对端测试需要先执行构建：

```
npm run build
```

构建完成之后，运行测试命令即可：

```
npm run test
```
