# Voyage Tools

[![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)](https://github.com/your-repo/voyage-tools)
[![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/framework-WXT-orange.svg)](https://wxt.dev/)

**一个开箱即用的企业级浏览器扩展工具**

## 📋 项目简介

Voyage Tools 是一个基于 WXT 框架开发的企业级浏览器扩展，为内部多个平台提供功能增强和效率提升工具。该扩展采用模块化设计，支持多个平台的定制化功能，旨在提升开发和管理效率。

## ✨ 核心功能

### 🔧 LCAP 小助手

- **一键登录**：支持预设账号和自定义账号快速登录
- **Cookie 管理**：清空 Cookie、切换语言等快捷操作
- **AI 集成**：集成 DeepSeek AI 服务，提供智能辅助
- **快捷跳转**：生成常用页面跳转按钮

### 📊 RDC板-小助手

- **自动加载**：进入 RDC 板页面自动滚动加载数据
- **随机选择**：随机选择成员功能，支持轮换机制
- **数据管理**：清除选择、重置状态等管理功能
- **AI 晨会总结**：智能生成晨会总结报告

### 🔀 Gerrit 小助手

- **代码审查增强**：提供 Gerrit 和 GitLab 平台的功能增强
- **快捷操作**：简化常用代码审查操作流程

## 🛠 技术栈

### 核心框架

- **[WXT](https://wxt.dev/)** - 现代化浏览器扩展开发框架
- **[Vue 3](https://vuejs.org/)** - 渐进式 JavaScript 框架
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript 超集

### UI & 组件

- **[Naive UI](https://www.naiveui.com/)** - Vue 3 组件库
- **[Ant Design Icons](https://ant.design/components/icon/)** - 图标库
- **[ECharts](https://echarts.apache.org/)** - 数据可视化图表库

### 开发工具

- **[Vite](https://vitejs.dev/)** - 前端构建工具
- **[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)** - 组件自动导入
- **[Less](https://lesscss.org/)** - CSS 预处理器

## 📦 安装与使用

### 环境要求

- Node.js >= 16
- pnpm (推荐) 或 npm

### 开发环境搭建

```bash
# 克隆项目
git clone <repository-url>
cd voyage-tools

# 安装依赖
pnpm install

# 开发模式 (Chrome)
pnpm dev

# 开发模式 (Firefox)
pnpm dev:firefox
```

### 构建与打包

```bash
# 构建扩展 (Chrome)
pnpm build

# 构建扩展 (Firefox)
pnpm build:firefox

# 打包为 zip 文件
pnpm zip

# Firefox 打包
pnpm zip:firefox
```

### 安装扩展

1. 构建完成后，在 `.output` 目录下找到对应浏览器的扩展文件
2. Chrome: 打开 `chrome://extensions/`，启用开发者模式，点击"加载已解压的扩展程序"
3. Firefox: 打开 `about:debugging`，点击"临时载入附加组件"

## 🏗 项目结构

```
voyage-tools/
├── entrypoints/                 # 扩展入口点
│   ├── background/             # 后台脚本
│   ├── content/                # 内容脚本
│   │   ├── board-tools/       # RDC板工具
│   │   ├── lcap-tools/        # LCAP工具
│   │   ├── gerrit-tools/      # Gerrit工具
│   │   └── voyage-tools/      # Voyage工具
│   ├── popup/                  # 弹窗界面
│   ├── options/                # 选项页面
│   ├── common/                 # 公共配置
│   └── types/                  # 类型定义
├── components/                  # 公共组件
├── public/                     # 静态资源
├── wxt.config.ts              # WXT 配置文件
├── package.json               # 项目配置
└── tsconfig.json              # TypeScript 配置
```

## ⚙️ 配置说明

### 功能配置

扩展支持的平台和功能在 `entrypoints/common/config.ts` 中配置：

```typescript
export const featureConfig: Feature[] = [
	{
		label: 'LCAP小助手',
		key: 'lcap',
		enabled: true,
		urlPattern: '(board|frontendcli|frontendrenderdemo|promc|promgr|uac)',
	},
	// ... 其他配置
]
```

### 权限配置

扩展需要以下浏览器权限：

- `storage` - 本地存储
- `cookies` - Cookie 管理
- `webRequest` - 网络请求
- `scripting` - 脚本注入
- `tabs` - 标签页管理
- `activeTab` - 活动标签页
- `<all_urls>` - 访问所有网站

## 🎯 使用指南

### 启用功能

1. 点击浏览器工具栏中的扩展图标
2. 在弹窗中选择要启用的功能模块
3. 对应的功能会在匹配的网站上自动激活

### LCAP 小助手使用

1. 在支持的 LCAP 平台页面上，会自动显示功能面板
2. 使用预设账号或添加自定义账号进行快速登录
3. 使用 Cookie 管理功能进行环境切换

### RDC板小助手使用

1. 进入 RDC 板页面，功能会自动激活
2. 使用"随机一位"功能进行人员选择
3. 利用 AI 功能生成晨会总结

## 🔄 版本历史

### V1.0.2 (最新)

- **新功能**
  - board-tools 新增 AI 晨会总结功能
- **优化**
  - 提升用户体验和性能

### 计划

- 每月至少发布一个版本
- 持续优化现有功能
- 新增更多平台支持

## 🤝 开发贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

### 开发流程

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

### 代码规范

- 使用 TypeScript 开发
- 遵循 Vue 3 最佳实践
- 保持代码简洁和可维护性

## 📄 许可证

本项目采用 [GPL-3.0](LICENSE) 许可证。

## 👥 联系方式

- **作者**: yuan.longhui@xydigit.com
- **项目**: Voyage Tools
- **版本**: 1.0.2

## 🙏 致谢

感谢以下开源项目的支持：

- [WXT Framework](https://wxt.dev/)
- [Vue.js](https://vuejs.org/)
- [Naive UI](https://www.naiveui.com/)
- [ECharts](https://echarts.apache.org/)

---

> 💡 如果这个项目对您有帮助，欢迎 star ⭐ 支持一下！
