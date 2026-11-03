# 项目图片目录

每个项目一个子文件夹，文件夹名与 data.js 中的 `slug` 一致：

```
assets/projects/<slug>/cover.webp   # 封面（normal: 1600×1000，wide: 2400×1030）
assets/projects/<slug>/01.webp      # 详情页大图，宽度 1880px 左右
```

然后在 data.js 对应项目里填写 `cover` 和 `gallery` 路径。
