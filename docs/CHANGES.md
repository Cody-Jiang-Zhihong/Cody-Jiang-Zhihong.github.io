# 城堡重做改动与审阅入口

## 本地查看

- 入口：<http://127.0.0.1:4173/>
- 中央大厅：<http://127.0.0.1:4173/#hall>
- 真实游戏媒体：<http://127.0.0.1:4173/#workshop/games>
- 研究深链接：<http://127.0.0.1:4173/#observatory/jepa>
- 简明内容：<http://127.0.0.1:4173/read.html>
- 历史网站：<http://127.0.0.1:4173/legacy/index.html>

预览不在运行时，在仓库根目录执行 `node scripts/serve.mjs`。默认端口 4173。

## 本轮改动

1. 复用认可原型的场景、门动画、建筑和物件坐标。暖色石材、铜金灯光、蓝色点缀和房间构图保留。根首页成为城堡入口。
2. 将内容、路由、场景坐标、媒体渲染和交互分离，运行时仍为原生 HTML/CSS/ES Modules。原型完整保存在 `design-reference/cody-castle-prototype/`；用户最初提供的 `cody-castle-codex-starter/` 原文件保持原状并被忽略，避免重复提交。
3. 保留 Gate → Hall → Gallery / Study / Observatory / Workshop → Exhibit 的路径。Room guide 收录未在场景里单独放置物件的条目，包括旧站的其余项目、经历和相册。
4. 修复旧 `#experience`、`#projects` 和其他旧锚点的迁移；移除活动展品中绕回首页的“原网站”链接，改为简明页、真实资源或明确的历史存档。
5. 保留 `CNAME` 和原资源路径。修复历史简历链接中 NFC/NFD 重音字符不一致的问题，CV 和 SDE / DS / MLE PDF 均可访问。
6. 增加真实图像、全图查看、静音视频、字幕接口、Demo / Code / PDF 链接。采集现有两个游戏的实际游戏画面、原版游戏录屏，以及原 CSS 作业页面；相册使用压缩预览并链接原图。
7. 六张场景提供 768 / 1536 WebP。1536 版合计约 1.09 MB，原六张 PNG 约 14.70 MB；下降约 92.6%。手机每张约 44–77 KB。原始 PNG 保留在参考目录，不在网站运行时加载。
8. 首屏只请求适用尺寸的大门；深链接跳过大门预加载。大厅可空闲预热，房间按需/入口意图加载，节省流量设置关闭推测预加载。超时或失败可重试。
9. 手机竖屏保留完整室内构图和四个入口，建筑内显示简短位置标签，文字与触控尺寸增大。展品使用独立滚动区域，关闭按钮保持可用。
10. 保留键盘、触控、拖动、原生 modal 焦点约束与焦点恢复、Escape、减少动态效果、浏览器前后退、刷新恢复和展品链接复制。
11. 新增无 JavaScript 也能阅读的 `read.html`、页面描述、canonical、Open Graph/Twitter 卡片、分享图、sitemap、robots 和 404 引导页。

## 审阅截图

截图来自本地 Chromium 渲染，使用减少动态效果设置以避开过渡帧；手机图为 390×844 响应式与触控模拟。

| 桌面 | 手机 |
| --- | --- |
| [大门](previews/desktop-gate.webp) | [大门](previews/phone-gate.webp) |
| [大厅](previews/desktop-hall.webp) | [大厅](previews/phone-hall.webp) |
| [书房](previews/desktop-study.webp) | [书房](previews/phone-study.webp) |
| [游戏展品](previews/desktop-games.webp) | [游戏展品](previews/phone-games.webp) |

## 需继续补充

详见 [CONTENT-NEEDED.md](CONTENT-NEEDED.md)。新简历、主要工程/研究项目的真实截图和视频、可公开 Demo / Code、可确认成果、自己的模型与 JiJi 照片仍待提供。现有场景插画没有作为这些素材的替代品。

上线与回滚见 [DEPLOYMENT.md](DEPLOYMENT.md)。本轮准备本地开发分支，正式发布需在审阅后合并至现有 `main` 来源分支。
