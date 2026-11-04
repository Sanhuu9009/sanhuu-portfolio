# 三虎 Loui Yue — 个人作品集官网

全栈设计师三虎（Loui Yue）的个人官网：作品集、服务范围、项目经历和联系方式。

纯静态网站，不需要安装任何东西，双击 `index.html` 即可预览。

- 线上地址：<https://sanhuu9009.github.io/sanhuu-portfolio/>
- 仓库：<https://github.com/Sanhuu9009/sanhuu-portfolio>

## 快速开始

```bash
git clone https://github.com/Sanhuu9009/sanhuu-portfolio.git
cd sanhuu-portfolio
python3 -m http.server 8080   # 打开 http://localhost:8080
```

## 改内容

所有文字都在 **`assets/js/data.js`** 里：

- 名字、简介、邮箱、社交链接 → `site`
- 作品 → `projects`（复制一个项目对象改内容即可）
- 服务层级 → `stack`
- 项目经历 → `experience`
- 合作流程 → `process`
- 关于我 → `about`

项目图片放在 `assets/projects/<项目 slug>/`，尺寸要求见该目录下的 README。

## 当前作品

| 项目 | slug | 类型 |
| --- | --- | --- |
| 鹭复航空 VR 科技展厅 | `vr-exhibition-hall` | 空间交互、VR |
| Pulse · 数据分析 SaaS 看板 | `pulse-analytics` | SaaS、Web |
| 沉几 · 实木家具品牌官网 | `chenji-furniture` | 品牌官网 |
| 恒野精工 · 智能制造企业官网 | `hengye-precision` | 企业官网 |
| 拾间建筑事务所 · 官网 | `shijian-architects` | 事务所官网 |
| 南岭能源 · 工商业光储官网 | `nanling-energy` | 企业官网 |
| 澄单 · 企业工单与审批工作台 | `ops-workbench` | B 端后台 |
| Brew · 手冲咖啡社区 App | `brew-coffee` | C 端 App |
| 心屿 · 情绪疗愈 App | `mind-isle` | C 端 App |
| 欧莱雅 Beauty for Good 包装回收 App | `loreal-beauty-for-good` | C 端 App |

## 让 AI 帮你改

把仓库交给 Claude Code、Codex 等工具时，它们会先读 `AGENTS.md`，里面有完整的结构说明、数据格式和设计规范。你可以直接说：

> 新增一个作品：xx 公司的官网，2026 年，我负责设计和前端，图片在 assets/projects/xx/

## 部署到 GitHub Pages

仓库已配置 GitHub Pages：源为 `main` 分支根目录，推送到 `main` 即自动发布。

```bash
git add .
git commit -m "content: 新增项目"
git push
```

1. 打开 <https://github.com/Sanhuu9009/sanhuu-portfolio/settings/pages> 可以改发布源。
2. 一两分钟后访问 <https://sanhuu9009.github.io/sanhuu-portfolio/>。

如果要换自定义域名（如 `sanhuu.cn`），在根目录新建 `CNAME` 文件，内容只有一行域名，并在域名服务商处添加 DNS 记录。

## 功能

- 首屏「设计稿 / 上线版」拖动对比，标注根据真实排版自动测量
- 作品按类型筛选，点击打开详情面板，每个项目有独立链接 `#project/<slug>`
- 深色 / 浅色模式（默认跟随系统）
- 手机、平板、桌面自适应；支持键盘操作和减少动效设置
