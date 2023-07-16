# pp-vue
Power Prophet System's frontend based on [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)
# 配置说明

前端主配置文件为`vue.config.js`，可以进行自定义配置。

系统运行主要配置`src\utils\request.js`下的后端接口路径即可：

```js
// create an axios instance
const service = axios.create({
  //这里需指定后端请求的URL
  baseURL: 'http://localhost:8081/power',
  timeout: 500000, // request timeout
  withCredentials: false
})
```

# 使用说明

```bash
# 环境要求
1. node 版本 16+
2. npm 版本 7.x
# 初次启动，需要安装相关包
npm install
# 安装完成后，启动前端
npm run dev
# 部署到服务器，进行打包
npm run build:prod
```

