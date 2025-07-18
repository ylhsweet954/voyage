# Voyage Tools 项目说明文档

## 项目概述

**Voyage Tools** 是一个基于 WXT 框架开发的企业级浏览器扩展（版本 1.0.2），主要为内部多个平台提供功能增强和效率提升工具。采用 Vue 3 + TypeScript + Naive UI 技术栈，支持 Chrome 和 Firefox 浏览器。

## 核心架构

### 技术栈

- **框架**: WXT (浏览器扩展开发框架)
- **前端**: Vue 3 + TypeScript + Naive UI（https://www.naiveui.com/zh-CN/light）
- **构建**: Vite + Less
- **图标**: Ant Design Icons

### 项目结构

```
voyage/                                    # 项目根目录
├── .output/                               # 构建输出目录
├── .wxt/                                  # WXT框架缓存
├── public/                                # 静态资源
│   └── icon/                              # 扩展图标
├── components/                            # 公用Vue组件
├── entrypoints/                           # 扩展入口点目录
│   ├── background/                        # 后台脚本
│   │   └── index.ts                       # 后台脚本主文件
│   ├── common/                            # 公共配置和工具
│   │   ├── background.ts                  # 后台相关工具函数
│   │   ├── config.ts                      # 配置文件
│   │   ├── markedDirective.ts             # Markdown指令
│   │   ├── request.ts                     # 请求工具
│   │   ├── requestZteAI.ts                # ZTE AI请求
│   │   └── utils.ts                       # 通用工具函数
│   ├── content/                           # 内容脚本
│   │   ├── board-tools/                   # RDC板工具模块
│   │   │   ├── hooks/                     # Vue Hooks
│   │   │   ├── index.vue                  # 主组件
│   │   ├── gerrit-tools/                  # Gerrit工具模块
│   │   │   └── index.vue                  # 主组件
│   │   ├── lcap-tools/                    # LCAP工具模块
│   │   │   ├── index.vue                  # 主组件
│   │   ├── voyage-tools/                  # Voyage工具模块
│   │   │   ├── index.vue                  # 主组件
│   │   ├── index.ts                       # 内容脚本主入口
│   │   └── useRenderContent.ts            # 渲染工具Hook
│   ├── popup/                             # 扩展弹窗界面
│   │   ├── panes/                         # 设置面板
│   │   │   ├── ai-setting.vue             # AI设置面板
│   │   │   ├── cache-setting.vue          # 缓存设置面板
│   │   │   ├── feature-setting.vue        # 功能设置面板
│   │   │   └── other-setting.vue          # 其他设置面板
│   │   ├── views/                         # 视图页面
│   │   │   ├── index.vue                  # 主视图
│   │   ├── App.vue                        # 弹窗根组件
│   │   ├── index.html                     # 弹窗HTML模板
│   │   ├── main.ts                        # 弹窗入口文件
│   │   └── style.css                      # 弹窗样式
│   ├── options/                           # 选项页面
│   │   ├── App.vue                        # 选项页根组件
│   │   ├── index.html                     # 选项页HTML模板
│   │   └── main.ts                        # 选项页入口文件
│   ├── types/                             # TypeScript类型定义
│   ├── dttestcenter.content.ts            # DT测试中心内容脚本
│   ├── inject.content.ts                  # 注入脚本
│   └── xhr-hook.ts                        # XHR钩子脚本
├── package.json                           # 项目配置文件
├── wxt.config.ts                          # WXT框架配置
```

### 浏览器扩展配置见该文件：

wxt.config.ts

## 开发命令

```bash
# 开发模式
pnpm dev              # Chrome开发

# 打包
pnpm zip              # Chrome打包
```

## 部署说明

扩展构建后在 `.output` 目录下生成对应浏览器的扩展文件，可通过浏览器开发者模式加载或发布到应用商店。项目当前版本为 1.0.2，由 yuan.longhui@xydigit.com 维护。
