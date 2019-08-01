# whistle 启动脚本

快速启动 whistle，并且设置好本项目的 whistle 配置。

## 内置命令说明

已内置了四个命令：

- `npm run start-dev`，使用 `8899` 端口启用 whistle，且使用 `dev` 模式规则，对应于 `rules/.whistle.dev.js`
- `npm run start-prod`，使用 `8899` 端口启用 whistle，且使用 `prod` 模式规则，对应于 `rules/.whistle.prod.js`
- `npm run start-dev-8080`，使用 `8080` 端口启用 whistle，且使用 `dev` 模式规则，对应于 `rules/.whistle.dev.js`
- `npm run start-prod-8080`，使用 `8080` 端口启用 whistle，且使用 `prod` 模式规则，对应于 `rules/.whistle.prod.js`


## 自定义启动命令

若内置命令说明不够用，可以自行定义启动脚本 `start.sh` 参数，

- `-p`，指定 whistle 的端口，默认值为 `8899`
- `-m`，指定哪种 whistle 规则，默认值为 `dev`（开发模式下），其他可选值包括 `prod`（适合代理生产环境build模式下的文件）

```
$ ./start.sh -p 8080 -m prod
```