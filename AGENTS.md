# AGENTS.md — 给 AI Agent 的技术说明

> 本文件写给接手这个仓库的 AI 编码助手（Claude Code、Codex、Cursor 等）。
> 动手前请完整读一遍。人类读者看 `README.md` 即可。

## 1. 项目是什么

三虎 Loui Yue（全栈设计师）的个人作品集官网。静态站点，部署在 GitHub Pages。

- 主要用途：展示作品、说明能承接的企业项目、给出联系方式（louiyue@sanhuu.cn）。
- 目标访客：寻找设计 + 开发外包的企业负责人，中文为主。
- 站主会持续往里加作品，**最常见的任务是「新增/修改一个项目」**，其次是改文案。

## 2. 技术栈与原则

| 项 | 选择 |
| --- | --- |
| 框架 | 无。原生 HTML + CSS + JavaScript（ES5 风格，IIFE） |
| 构建 | 无。没有 npm、没有打包器，文件即成品 |
| 依赖 | 仅 Google Fonts（可选，失败时有回退字体） |
| 部署 | GitHub Pages，从仓库根目录直接发布 |

**原则（不要违背）：**

1. **内容与结构分离。** 所有文字、项目、联系方式都在 `assets/js/data.js`。改内容只改这个文件，不要把文案写死进 `index.html` 或 `main.js`。
2. **零构建。** 不要引入 npm 包、打包器、框架或 TypeScript，除非站主明确要求迁移。直接双击 `index.html` 就应该能打开。
3. **不新增颜色和字号。** 只用 `style.css` 顶部的设计令牌（CSS 变量）。需要新值时先问。
4. **深浅色都要能用。** 任何新增颜色都必须同时在三处定义：`:root`、`@media (prefers-color-scheme: dark)` 里的 `:root:not([data-theme="light"])`、`:root[data-theme="dark"]`。
5. **数据插入 HTML 前必须转义。** `main.js` 里用 `esc()` 包裹文本，用 `safeUrl()` 包裹链接。

## 3. 文件结构

```
.
├── index.html               页面骨架：导航、各区块容器、详情面板 <dialog>
├── assets/
│   ├── css/style.css        全部样式，顶部是设计令牌
│   ├── js/data.js           ★ 全站内容（window.SITE_DATA）
│   ├── js/main.js           渲染与交互逻辑
│   ├── img/                 favicon.svg、og-cover.png/svg
│   └── projects/<slug>/     各项目的封面与详情图
├── AGENTS.md                本文件
├── CLAUDE.md                指向本文件
├── README.md                给站主看的说明
├── .nojekyll                让 GitHub Pages 跳过 Jekyll 处理
└── .gitignore
```

## 4. 数据结构（`assets/js/data.js`）

`window.SITE_DATA` 是一个对象，包含以下键：

### 4.1 `site`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `nameCn` / `nameEn` | string | 「三虎」/「Loui Yue」。改 `nameCn` 时，同步改 `index.html` 里 Noto Sans SC 链接的 `text=` 参数（URL 编码后的汉字） |
| `role` / `roleEn` | string | 首屏副标题 |
| `lede` | string | 首屏一段介绍，建议 60–90 字 |
| `availability` | `{ available: boolean, text: string }` | 首屏状态。`available:false` 时圆点变灰 |
| `email` | string | 联系邮箱，用于首屏按钮和底部大号邮箱 |
| `replyNote` | string | 联系区的说明文字 |
| `socials` | `{ label, url }[]` | `url` 为空则不显示 |

### 4.2 `projects`（作品，数组顺序即展示顺序）

```js
{
  slug: "industrial-brand-site",   // 必填，唯一，小写字母/数字/短横线。用于 URL：#project/<slug>
  title: "制造业企业官网与询盘系统", // 必填
  client: "某智能制造企业",          // 有保密要求时用行业代称
  year: "2025",
  size: "wide",                    // "wide" 整行 | "normal" 半行。建议每 3–5 个项目放一个 wide
  disciplines: ["品牌", "UI 设计", "全栈开发"], // 会自动生成筛选按钮，用词要统一
  summary: "一句话说明做了什么、解决了什么。",  // 卡片和详情页都会显示，≤ 50 字
  role: "品牌设计、UI 设计、前后端开发、部署",
  stack: ["Figma", "Next.js"],
  cover: "assets/projects/industrial-brand-site/cover.webp", // 留空 "" 则生成占位封面
  placeholder: "web",              // 占位封面样式：web | dashboard | mobile | brand
  tone: "#3355FF",                 // 占位封面主色
  body: ["段落一", "段落二"],        // 详情页正文
  highlights: ["要点一", "要点二"],  // 详情页「重点」列表，可为空数组
  gallery: ["assets/projects/<slug>/01.webp"], // 详情页大图，可为空数组
  links: [{ label: "访问网站", url: "https://..." }] // 可为空数组
}
```

**`disciplines` 推荐词表**（保持一致，筛选才不会碎片化）：`品牌`、`UI 设计`、`交互设计`、`空间交互`、`数据可视化`、`工业设计`、`前端开发`、`全栈开发`、`小程序`。新增类别前先确认。

### 4.3 `stack`（服务区的层级，从上到下）

`{ layer, desc, deliver: string[], tools: string[] }`。页面会按数组下标给每层递增缩进，表示层级叠放。建议保持 3–5 层。

### 4.4 `experience`（项目经历，时间倒序）

`{ period, client, scope, note }`。

### 4.5 `process`（合作流程，有先后顺序，页面会自动编号）

`{ title, text, time }`。

### 4.6 `about`

`{ paragraphs: string[], toolGroups: { name, items: string[] }[] }`。

## 5. 常见任务做法

### 新增一个作品

1. 在 `assets/projects/` 下新建 `<slug>/` 文件夹，放入图片：
   - 封面 `cover.webp`：`normal` 用 1600×1000（16:10），`wide` 用 2400×1030（约 21:9）。
   - 详情图 `01.webp`、`02.webp`…：宽 1880px 左右，单张 < 400KB。
2. 在 `data.js` 的 `projects` 数组中合适位置插入对象（见 4.2）。
3. 本地预览，检查：卡片显示正常、筛选数字正确、`#project/<slug>` 能打开详情、上一个/下一个能循环切换。
4. 没有图片时 `cover` 留空，选一个 `placeholder` 和 `tone` 即可。

### 修改或补充内容

`data.js` 里是站主确认可以公开的作品，没有占位示例。补充新条目时不要编造客户名称、数据或成果；不确定的信息先留空或向站主确认。图片来自站主的原始素材，封面与详情图已压缩成 webp，替换时注意保持相同宽高比。

### 新增一个页面区块

1. 在 `index.html` 的 `<main>` 里加 `<section class="section" id="xxx">`（需要底色交替时加 `section-alt`）。
2. 在 `data.js` 加对应数据，在 `main.js` 写 `renderXxx()` 并在文件末尾「启动」处调用。
3. 需要出现在导航时，在 `#navLinks` 加 `<a href="#xxx">`；高亮会自动生效。
4. 区块标题沿用 `.section-head` 结构（`h2` + `.section-note`）。

### 改主色

只改 `--spec`（以及深色主题下对应的 `--spec`、`--spec-soft`、`--spec-grid`、`--on-spec`）。首屏标注、链接悬停、焦点框都会跟着变。

## 6. 关键实现说明

### 首屏「设计稿 / 上线版」对比

- `#heroBuilt`（上线版）和 `#heroSpec`（设计稿）渲染同一段 HTML，后者叠在上面，用 `clip-path` 只显示手柄左侧（CSS 变量 `--split`）。
- `#heroSpec` 设置了 `inert` 和 `aria-hidden`，不可交互、不进入读屏。
- 标注由 `drawSpec()` 根据真实排版**自动测量**生成：带 `data-spec="名称"` 的元素会被画框并标出尺寸；再加 `data-spec-type="text"` 会额外显示字号/字重。窗口缩放、字体加载完成后会重新测量。
- 入场动画是全站唯一的自动动画：从全设计稿扫到「三虎」两字中间。`prefers-reduced-motion` 时直接定位。
- 手柄支持拖动、方向键（Shift 加速）、Home/End。

### 项目详情与路由

- 地址 `#project/<slug>` 打开详情面板（原生 `<dialog>`），关闭后地址回到 `#work`。
- 可以直接把 `https://域名/#project/<slug>` 发给客户。
- 面板内上一个/下一个按数组顺序循环。

### 主题

- 默认跟随系统；点击按钮后写入 `localStorage.theme`，`<head>` 里的内联脚本在渲染前读取，避免闪烁。

## 7. 设计规范（新增内容时遵守）

- **配色**：Porcelain `#EDEFF2` 底、Ink `#15171C` 字、唯一强调色 Spec Blue `#3355FF`。强调色只用于：链接悬停、焦点、设计稿标注、流程时间。不要把它用作大面积背景。
- **字体**：拉丁文 Schibsted Grotesk；中文走系统字体（苹方/雅黑），首屏「三虎」单独加载 Noto Sans SC 900 子集。等宽字体 JetBrains Mono **只用于首屏标注**。
- **圆角分级**：按钮/标签 6px、封面 12px、面板 20px。不要统一成一个值。
- **文案**：短句、主动语态、说清楚做了什么。不用全大写英文小标签，不在标题里单独给某个词换颜色，不在链接文字后面加「→」。
- **动效**：只给用户操作做反馈（悬停、展开、复制成功）。不要给每个区块加滚动入场动画。
- **可访问性**：所有交互元素可用键盘操作、焦点可见；图片必须有 `alt`；颜色对比度满足 WCAG AA。

## 8. 本地预览与检查

```bash
# 任选其一，然后打开 http://localhost:8080
python3 -m http.server 8080
npx serve -l 8080 .
```

直接双击 `index.html` 也能运行（没有 fetch 请求）。

提交前自查：

- [ ] 浏览器控制台无报错（Google Fonts 在离线环境的加载失败可忽略）
- [ ] 375px 宽（手机）和 1440px 宽（桌面）都检查过
- [ ] 深色、浅色都检查过
- [ ] 新图片已压缩，路径大小写与文件名一致（GitHub Pages 区分大小写）
- [ ] `data.js` 是合法 JS（逗号、引号闭合）

## 9. 部署

GitHub 仓库 → Settings → Pages → Source 选 `Deploy from a branch` → 分支 `main`、目录 `/ (root)`。

绑定自定义域名（如 `sanhuu.cn`）：在根目录新建 `CNAME` 文件，内容只有一行域名，并在域名服务商处添加 DNS 记录。不确定域名前不要创建 `CNAME`。

## 10. 字体与国内访问

`fonts.googleapis.com` 在中国大陆访问不稳定。页面在字体加载失败时会回退到系统字体，功能不受影响。如果站主要求国内访问效果一致，可以：

1. 把字体文件下载到 `assets/fonts/`，用 `@font-face` 本地加载（推荐，注意只保留需要的字重）；或
2. 把 `index.html` 里的 `fonts.googleapis.com` 换成可用的国内镜像。

## 11. 提交规范

- 提交信息用中文或英文均可，格式：`类型: 简述`，类型用 `content`（内容）、`feat`（功能）、`style`（样式）、`fix`、`docs`。
  - 例：`content: 新增项目 retail-mini-program`
- 一次提交只做一件事；新增项目时图片和 `data.js` 改动放在同一个提交里。
