# Cody’s Castle · codyjiang.com

将已认可的城堡原型整合为可直接由 GitHub Pages 发布的静态作品集。正式入口是根目录 `index.html`，运行时没有框架、第三方 CDN 或构建依赖。

## 本地预览

需要 Node.js 22 或以上。在仓库根目录运行：

```powershell
node scripts/serve.mjs
```

打开 <http://127.0.0.1:4173/>。简明内容页：<http://127.0.0.1:4173/read.html>。端口占用时可设置 `$env:PORT = '4174'` 后再运行。预览服务器只绑定本机回环地址；手机检查使用浏览器设备模拟。

开发命令（PowerShell 中使用 `npm.cmd` 可避开 `npm.ps1` 执行策略问题）：

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd test
npm.cmd run check
npx.cmd playwright install chromium
npm.cmd run test:browser
```

`build` 只从 `castle/content.js` 生成 `read.html`，不会打包或改变原有资源。生成页已提交，GitHub Pages 无需执行 npm。`check` 会检查生成页是否过期、本地链接、锚点、媒体文件、展品可达性和 CNAME。

## 体验和维护位置

| 文件 | 用途 |
| --- | --- |
| `index.html` | 沉浸式入口、对话框、SEO 和分享信息 |
| `castle/app.js` | 门、场景切换、导航、历史、焦点、加载与重试 |
| `castle/routes.js` | 深链接和旧锚点迁移 |
| `castle/scene-map.js` | 原型的建筑与物件多边形区域，坐标以 1536×1024 为基准 |
| `castle/content.js` | 房间、事实描述、媒体、Demo / Code / PDF 链接和待补素材 |
| `castle/media.js` | 真实图片、视频、占位和媒体失败重试 |
| `castle/styles.css` | 场景、响应式构图和减少动态效果 |
| `read.html`、`castle/read.css` | 可直接阅读、无需 JavaScript 的作品集 |
| `legacy/index.html`、`theStyle.css` | 历史版原网站及其样式 |
| `design-reference/cody-castle-prototype/` | 原始认可原型，保留为设计参考，不作为发布入口 |
| `scripts/` | 本地服务、内容生成、图片优化、检查、真实项目与审阅截图采集 |

大门支持点击、拖动、Enter 和 Space。大厅左侧为 Gallery，左后为 Study，中间楼梯通往 Observatory，右侧为 Workshop。点击房间物件打开展品；Room guide 提供该房间其余条目。罗盘地图和 Index 是辅助入口。Escape 关闭展品/地图；房间内再按 Escape 返回大厅。所有对话框使用原生 `dialog`，关闭展品后恢复焦点。

保留原型的 Gallery 路由 `#great-hall`。可分享的展品链接例如 `/#observatory/jepa`、`/#workshop/games`、`/#study/cv`。直接访问会恢复房间和展品。旧 `#experience` → `#study/experience`，`#projects` → `#great-hall`，其余旧 About / Resume / Contact / Album 锚点也有对应迁移。

## 资源和内容

场景图保持原构图，提供 768 和 1536 像素 WebP。入口只预加载实际使用的大门尺寸；展品深链接跳过大门资源。大厅按空闲时机预热，房间在点击、悬停或键盘聚焦入口时加载。节省流量/慢速网络不执行推测预加载。图片失败与 12 秒场景超时均可重试。

原 `CNAME`、`myGame/`、`myResume/`、`MyPhotos/`、课程作业和 Flask/SQL 源码保留。旧简历链接的 Unicode 文件名已规范化；五份 PDF 均保留 February 2026 标签。旧游戏以原路径打开，建议使用桌面键盘。Flask HTML 模板明确标为静态存档，GitHub Pages 不提供其 Python 后端。

真实游戏截图、静音录屏和课程页面截图来自现有可运行页面，来源记录见 [media-provenance.json](docs/media-provenance.json)。场景是概念插画，不代表项目界面或自己的模型照片。未提供的新简历、研究图表、项目链接和成果均保留明确占位。

- [改动说明与审阅入口](docs/CHANGES.md)
- [需提供的素材与事实清单](docs/CONTENT-NEEDED.md)
- [验证记录与限制](docs/QA.md)
- [GitHub Pages 上线和回滚](docs/DEPLOYMENT.md)

重新压缩资源：`npm.cmd run assets`。采集项目媒体：启动预览后运行 `node scripts/capture-project-media.mjs`。生成审阅截图：`node scripts/capture-review.mjs`。这些工具仅使用本地页面；不会发布站点。
