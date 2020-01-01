# whistle 配置

whistle 官方文档： https://wproxy.org/whistle/ 。

## 启动 whistle

一般情况使用 `w2 start` 启动项目即可，如果需要制定端口，可以使用 `-p` 来指定端口，例如 `w2 start -p 8080` 。


## 使用自定义规则的生成文件

语法规则： `w2 add [filepath]` 。详见： https://wproxy.org/whistle/cli.html 。

推荐如下实践：

- 因为可能有多个规则文件，因此规则文件放置在 `rules` 目录下集中管理；
- 规则文件命名规则为 `.whistle.xxx.js` ，例如 `.whistle.dev.js` 和 `.whistle.prod.js`； 
