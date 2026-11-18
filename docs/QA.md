# 本地验证记录

## 自动化范围

- Node 内置测试：9 项，覆盖路由、旧地址映射、所有展品深链接、建筑目标、实际应用的 DOM 导航/焦点/历史/重试流程。
- Playwright Chromium：桌面 1440×900、触控模拟 390×844、窄屏触控模拟 320×568。每个尺寸运行 7 个场景，共 21 项。
- 静态检查：生成的 `read.html` 与内容数据一致；本地 HTML/CSS/JS/图片/视频/PDF 路径和锚点、展品可达性、社交信息、重复 ID 和 CNAME。

重跑命令：

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run test:browser
```

## 浏览器流程

| 流程 | 验证内容 |
| --- | --- |
| 入口与四个房间 | 点击/触控开门；四入口同时显示；点击建筑区域逐个进入 Gallery、Study、Observatory、Workshop，再打开物件展品并返回 |
| 首屏与按需加载 | 进入大厅前没有请求四个房间图；展品深链接直接恢复位置；手机使用小图 |
| 兼容地址与历史 | `#experience`、`#projects` 迁移；展品 Back / Forward、刷新、关闭；直接展品链接关闭时留在站内 |
| 键盘与动态效果 | Tab 跳过入口/直读页/门；Space 开门；Escape 关闭地图并恢复焦点；拖动开门；减少动态效果时无镜头缩放 |
| 场景失败 | 拦截 Observatory 图片请求，显示错误和重试；解除拦截后同一 URL 恢复，无需刷新 |
| 手机触控范围 | 四建筑按钮均完整处于视口内，宽高至少 44px；无页面横向溢出 |
| 无 JavaScript | 首页提供直读入口；`read.html` 的项目、经历、简历与联系内容可阅读、锚点可用 |
| 媒体 | 图片请求失败后可重试；视频在手动播放前不请求 WebM；播放时间推进；关闭展品会暂停并清除视频来源 |

## 真实媒体与视觉检查

`scripts/capture-project-media.mjs` 从现有原地址启动 Project 150 和 Contra-like 构建，按原界面提示选择并进入游戏，采集实际 Canvas 图像和原版静音录像。CSS 作业截取完整页面。来源与采集时间保存在 [media-provenance.json](media-provenance.json)。这些页面采集时未出现 JavaScript pageerror。

已检查大门、稳定大厅、书房和带真实媒体的游戏展品在桌面与手机尺寸的截图；修正了过渡帧截图、手机位置标签和展品关闭按钮布局。可审阅图片见 [CHANGES.md](CHANGES.md)。

## 边界

手机测试是 Chromium 的视口与触控模拟，不等同实体 iPhone / Android 测试。本轮未运行 Safari、Firefox 或系统屏幕阅读器，也未执行线上部署后的 Lighthouse、CDN、DNS 或分享平台抓取验证。数值压缩结果来自实际文件大小，不是网络条件下的性能分数。

链接检查验证本地目标存在和正确路由；没有将原 Flask 模板当作在线后端，也没有对外部 itch.io 或 GitHub 的服务可用性作永久保证。主要项目的新素材和事实核对见 [CONTENT-NEEDED.md](CONTENT-NEEDED.md)。
