/**
 * ============================================================
 *  网站内容数据 —— 全站唯一的内容来源（Single source of truth）
 * ============================================================
 *  改文字、加项目、换联系方式，只改这个文件即可。
 *  页面结构和样式不需要动。字段说明见 AGENTS.md「数据结构」一节。
 *
 *  ⚠️ 只放站主明确授权公开的作品。客户项目未经允许不要放上来。
 * ============================================================
 */
window.SITE_DATA = {
  /* ---------- 基本信息 ---------- */
  site: {
    nameCn: "三虎",
    nameEn: "Loui Yue",
    role: "全栈设计师",
    roleEn: "Full-stack designer",
    // 首页大标题下的一段话
    lede: "品牌、界面、前端开发，到 VR 展厅与全息交互：从第一张草图到正式上线，同一个人负责到底。适合想少对接几个团队、又要把事情做好的企业。",
    // 首屏左上角的状态胶囊；available=false 时显示为灰色
    availability: { available: true, text: "现可承接企业项目" },
    email: "louiyue@sanhuu.cn",
    replyNote: "通常 24 小时内回复。可以直接发需求、参考链接或预算范围。",
    // 社交链接：url 留空则不显示
    socials: [
      { label: "GitHub", url: "https://github.com/Sanhuu9009" },
      { label: "Dribbble", url: "" },
      { label: "Behance", url: "" }
    ]
  },

  /* ---------- 作品 ----------
   * 新增项目：复制一个对象，改 slug（唯一、英文小写+短横线）和内容。
   * 数组顺序 = 页面展示顺序。size: "wide" 占满整行，"normal" 占半行。
   * cover: 封面图路径（normal: 1600×1000，wide: 2400×1030，webp）。
   *        留空 "" 时自动生成占位封面，样式由 placeholder 决定：
   *        "web" | "dashboard" | "mobile" | "brand"
   * tone:  占位封面的主色（任意 CSS 颜色）
   */
  projects: [
    {
      slug: "vr-exhibition-hall",
      title: "鹭复航空 VR 科技展厅",
      client: "厦门鹭复航空科技",
      year: "2024",
      size: "wide",
      disciplines: ["空间交互", "UI 设计"],
      summary: "把飞机引擎拆解的全过程做成 VR 科技展厅，观众按拆解前、中、后走完一条完整链路。",
      role: "西安团队负责人：VR 交互、展厅动线、全息展示设计",
      stack: ["Figma", "三维建模", "VR 引擎"],
      cover: "assets/projects/vr-exhibition-hall/cover.webp",
      placeholder: "dashboard",
      tone: "#2E5B8A",
      body: [
        "客户是厦门鹭复航空科技，展厅要做的是绿色航空产业科普：把退役飞机引擎怎么拆、拆下来的材料怎么回收，讲给不同年龄、不同专业背景的观众看。",
        "展厅在 VR 里重建了真实空间，动线分为三个环节：拆解前准备、拆解过程爆炸图演示、拆解后材料回收。虚拟爆炸图逐层展开，每一层都标出零件的材质、用途和回收方式。",
        "我负责西安这边的工作：VR 场景里的交互逻辑、展厅动线与全息展示部分的设计，项目量级 50 万。"
      ],
      highlights: [
        "三个展示环节与真实拆解流程一一对应",
        "爆炸图逐层标注材质、用途与回收方式",
        "按年龄与专业背景做分层讲解，降低理解门槛",
        "获 2024 中国设计未来之星大赛（2024–2025 年度）提名奖"
      ],
      gallery: [
        "assets/projects/vr-exhibition-hall/01.webp",
        "assets/projects/vr-exhibition-hall/02.webp",
        "assets/projects/vr-exhibition-hall/03.webp",
        "assets/projects/vr-exhibition-hall/04.webp",
        "assets/projects/vr-exhibition-hall/06.webp"
      ],
      links: [
        { label: "阅读项目报道", url: "https://mp.weixin.qq.com/s/weWjs1TbOzT6Hvu_hP4Lvw" }
      ]
    },
    {
      slug: "mind-isle",
      title: "心屿 · 情绪疗愈 App",
      client: "个人项目",
      year: "2026",
      size: "normal",
      disciplines: ["UI 设计", "交互设计"],
      summary: "情绪说不清，先从身体信号入手：记录、呼吸练习、情绪日历串成一条疗愈路径。",
      role: "信息架构、交互设计、UI 设计、设计规范",
      stack: ["Figma", "After Effects"],
      cover: "assets/projects/mind-isle/cover.webp",
      placeholder: "mobile",
      tone: "#8A7CF0",
      body: [
        "情绪问题往往说不清。这个 App 先从身体信号入手：心率、睡眠、压力值，把模糊的感受变成能看的曲线。",
        "记录、呼吸训练、情绪日历、周报，以及「专业支持」入口串成一条路径；夜间与冥想场景单独做了深色界面，减少刺激。",
        "除了手机端，还补齐了 Apple Watch 界面、低保真线框和完整设计规范，保证多端一致。"
      ],
      highlights: [
        "用身体数据反推情绪，降低记录门槛",
        "深色模式承载夜间记录与呼吸练习场景",
        "App 与 Apple Watch 双端界面加设计规范"
      ],
      gallery: [
        "assets/projects/mind-isle/01.webp",
        "assets/projects/mind-isle/02.webp",
        "assets/projects/mind-isle/03.webp"
      ],
      links: []
    },
    {
      slug: "loreal-beauty-for-good",
      title: "欧莱雅 Beauty for Good 包装回收 App",
      client: "概念项目",
      year: "2026",
      size: "normal",
      disciplines: ["UI 设计", "品牌"],
      summary: "把空瓶从哪里来、送去哪里、换到什么讲清楚，用积分把回收变成习惯。",
      role: "交互设计、UI 设计、视觉规范",
      stack: ["Figma", "Photoshop"],
      cover: "assets/projects/loreal-beauty-for-good/cover.webp",
      placeholder: "mobile",
      tone: "#2F4A32",
      body: [
        "这是给欧莱雅可持续计划「Beauty for Good」做的包装回收 App：空瓶从哪里来、送到哪里、能换到什么，每一步都要看得见。",
        "核心流程四步走：扫码创建回收单、选择就近回收点、到店出示二维码、积分到账。回收点数据接到新加坡的门店（ION Orchard、Watsons）。",
        "视觉沿用欧莱雅的黑白金和产品摄影，功能上把积分、奖励与社区工作坊放在同一层，让回收和品牌体验不割裂。"
      ],
      highlights: [
        "回收流程四步可视化，每个状态都能查到",
        "积分与奖励体系和门店核销打通",
        "英文界面，按新加坡门店场景设计"
      ],
      gallery: [
        "assets/projects/loreal-beauty-for-good/01.webp"
      ],
      links: []
    }
  ],

  /* ---------- 服务：全栈能力的层级（从上到下） ---------- */
  stack: [
    {
      layer: "品牌与视觉",
      desc: "确定企业长什么样：标识、色彩、字体和使用规范。",
      deliver: ["标识与 VI 规范", "品牌官网视觉", "宣传物料"],
      tools: ["Figma", "Illustrator"]
    },
    {
      layer: "产品与界面",
      desc: "确定产品怎么用：信息架构、交互流程和界面设计。",
      deliver: ["交互原型", "UI 设计", "组件库与设计规范"],
      tools: ["Figma", "Framer"]
    },
    {
      layer: "空间与展陈",
      desc: "把内容放进真实空间：展厅动线、VR 场景与全息交互。",
      deliver: ["展厅动线与内容规划", "VR 场景交互", "全息展示设计"],
      tools: ["Figma", "三维建模", "VR 引擎"]
    },
    {
      layer: "前端开发",
      desc: "把设计稿还原成可上线的网页和应用，细节不打折。",
      deliver: ["响应式官网", "Web 应用", "小程序"],
      tools: ["HTML/CSS", "JavaScript", "React"]
    },
    {
      layer: "后端与部署",
      desc: "接口、数据库、管理后台，以及上线后的维护。",
      deliver: ["API 与数据库", "管理后台", "部署与监控"],
      tools: ["Node.js", "Python", "MySQL"]
    }
  ],

  /* ---------- 项目经历（按时间倒序） ---------- */
  experience: [
    {
      period: "2024",
      client: "厦门鹭复航空科技 × 西北大学现代学院",
      scope: "VR 科技展厅、虚拟拆解演示、全息交互设计",
      note: "西安团队负责人，项目量级 50 万，获中国设计未来之星大赛提名奖"
    },
    {
      period: "2025–2026",
      client: "独立承接",
      scope: "App 界面、信息可视化、官网与小程序",
      note: "从设计到上线一人完成，长期维护"
    }
  ],

  /* ---------- 合作流程（有先后顺序） ---------- */
  process: [
    { title: "沟通需求", text: "聊清楚目标、范围、时间和预算。", time: "1–3 天" },
    { title: "方案与报价", text: "给出页面结构、技术方案和分阶段报价。", time: "2–5 天" },
    { title: "设计", text: "先定视觉方向，再出完整设计稿，确认后开发。", time: "1–3 周" },
    { title: "开发与测试", text: "按设计稿实现，在真实设备上测试。", time: "2–6 周" },
    { title: "上线与维护", text: "部署上线，交付源码与文档，可按月维护。", time: "长期" }
  ],

  /* ---------- 关于 ---------- */
  about: {
    paragraphs: [
      "我是三虎（Loui Yue），一名全栈设计师。做设计的时候会想它怎么实现，写代码的时候会在意它好不好看、好不好用。",
      "做过 VR 科技展厅、App、信息可视化海报，也做企业官网和小程序。跨度看着大，方法其实是同一套：先把信息理清楚，再决定它长什么样、怎么跑起来。",
      "大部分合作方是中小企业：没有完整的设计和研发团队，但需要一个靠谱、能长期维护的官网或内部系统。我负责把从品牌到上线的每一层都接住，减少沟通环节。"
    ],
    toolGroups: [
      { name: "设计", items: ["Figma", "Illustrator", "Photoshop", "After Effects"] },
      { name: "空间与三维", items: ["三维建模", "VR 场景交互", "展厅动线"] },
      { name: "前端与后端", items: ["HTML/CSS", "JavaScript", "Node.js", "Python"] }
    ]
  }
};
