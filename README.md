# movie 电影

> Thanks to [scott](https://www.imooc.com/t/108492)

## 改进及问题解决方式

1、修改了grunt 配置，实现热更新（实时加载）

2、模板引擎改为了 pug（改了个名字的jade，语法一致，但有所变更）

3、修复了一些报错：mongoose 创建连接时关于Promise

4、加密模块 bcrypt 的替代方案 bcryptjs

...

## 运行环境

请先安装 Mongodb 数据库

## 项目运行

```
# 安装依赖
bower install
npm install

# 开发 (http://localhost:3000)
npm run dev
```

## 项目布局
生成方式：参考文档 [https://github.com/jrainlau/filemap](https://github.com/jrainlau/filemap)
```bash
npm run filemap
```

目录改动： 路由(app/routes) 和 视图(app/views)

```
|__ app
  |__ controllers                             // 控制层
    |__ category.js                              // 电影分类（列表，新增，更新，删除）
    |__ comment.js                               // 电影评论（评论）
    |__ index.js                                 // 首页（按分类展示电影，搜索）
    |__ movie.js                                 // 电影（列表，详情，新增，更新，删除）
    |__ user.js                                  // 用户 （登录，注册，登出，列表）
  |__ middleware                              // 中间件
    |__ permission.js                            // 权限（登录，管理员）
  |__ models                                  // 模型
    |__ category.js                              // 电影分类
    |__ comment.js                               // 电影评论
    |__ movie.js                                 // 电影
    |__ user.js                                  // 用户
  |__ routes                                  // 路由
    |__ admin.js                                 // 后台管理（电影管理，电影类别管理，用户管理）
    |__ index.js                                 // 首页（搜索）
    |__ movie.js                                 // 前台电影（详情）
    |__ user.js                                  // 前台用户（登录，注册，登出，评论）
  |__ schemas                                 // 模式
    |__ category.js                              // 电影类别
    |__ comment.js                               // 电影评论
    |__ movie.js                                 // 电影
    |__ user.js                                  // 用户
  |__ views                                   // 视图
    |__ includes                                 // 通用
      |__ head.pug                                  // 静态资源
      |__ header.pug                                // 头部
    |__ layout.pug                               // 页面模板
    |__ pages                                    // 页面
      |__ admin                                     // 后台
        |__ category_add.pug                           // 电影类别添加
        |__ category_list.pug                          // 电影类别列表
        |__ movie_list.pug                             // 电影列表
        |__ mvoie_add.pug                              // 电影添加
        |__ user_list.pug                              // 用户列表
      |__ index.pug                                 // 首页
      |__ movie                                     // 电影
        |__ detail.pug                                 // 详情
        |__ results.pug                                // 搜索
      |__ user                                      // 用户
        |__ signin.pug                                 // 登录
        |__ signup.pug                                 // 注册
|__ config                                    // 配置
  |__ routes.js                                   // 路由配置
|__ public                                    // 静态资源
  |__ js                                          // javascript
    |__ admin.js                                     // 电影删除，电影类别删除，豆瓣电影资源获取
    |__ detail.js                                    // 电影详情页面评论
  |__ libs                                        // 库
  |__ upload                                      // 上传资源存放
|__ .bowerrc                                  // bower 相关配置
|__ .gitignore                                // git 忽略文件列表
|__ app.js                                    // Nodejs 入口文件
|__ bower.json                                // bower 项目配置
|__ gruntfile.js                              // grunt 配置
|__ package.json                              // npm 项目配置
|__ package-lock.json                         // lock 依赖
|__ README.md                                 // README
```
