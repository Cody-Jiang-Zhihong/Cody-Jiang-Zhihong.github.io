# 需要 Cody 提供的素材和事实

以下条目已在展品里保留明确占位。现有资料来自旧网站和已认可原型；本轮没有补写未提供的成果、任职状态或数值。可按项目逐个提供，不需要一次准备齐。

| 条目 | 具体需要 | 当前处理 |
| --- | --- | --- |
| CV / Resume | 最新完整 CV，以及 SDE、DS、MLE 三版简历；确认教育、毕业日期和当前职位 | 保留五份 February 2026 PDF，未标为最新 |
| AbyssalPact | 可公开的实际游戏/AI 调试截图 2–4 张、15–30 秒视频、Demo 或发行页、Code 链接；个人职责、团队归属、开始/结束日期 | 保留已有架构和敌方回合流程描述；Demo / Code 和当前状态待补 |
| JEPA | 课程报告/海报、模型图、预测视频、评价图表、代码地址；数据来源、实验设置、个人贡献、可确认结果 | 明确是 2024 年 9–12 月 NYU Deep Learning 课程项目；不新增论文或结果主张 |
| Steam Review Radar | 实际仪表盘/图表、Demo、Code；数据规模和时间、个人职责、验证过的结论 | 保留旧站的 Negative Binomial / XGBoost 与流程概述 |
| AI Code & Technical Debt | 实际分析结果/仪表盘、方法说明、Demo、Code；研究范围、个人贡献和可验证发现 | 保留 Python / Dask / Git / Docker / static analysis 概述 |
| NVIDIA Options Pipeline | 实际图表/流程图、Demo、Code；数据日期、来源、个人贡献和结果 | 恢复旧站项目条目，未增加结果 |
| Airline Ticket System | 运行中的 Flask 应用截图；如需在线 Demo，提供可访问的后端地址和运行说明 | Code 链接可用；HTML 模板仅作静态存档 |
| 已有游戏 | 完整按键说明、原始开发源仓库；可补充更有代表性的关卡录像 | 已从现有构建采集两张真实游戏画面和一段原版游戏静音录屏，Demo 原地址保留 |
| 模型/微缩作品 | 自己作品的照片：建议 6–12 张，包含全景、细节和过程；作品名称、时间、材料、改造/上色说明 | 仅展示明确文字占位；城堡插画不作为作品照片 |
| JiJi | 真实照片，可选一段说明 | 保留原型说明，插画中的猫未作为真实照片 |
| About / Experience | 当前教育/就业状态；访谈工具合作署名；2021 项目的机构、导师、论文和数值依据；其他经历有无更新 | 新展品不重复未确认的数值；历史版独立保存旧文案并标明历史内容 |
| Contact | 确认现有 NYU 邮箱是否继续作为对外联系地址；可选补充公开职业资料链接 | 继续使用原站已有邮箱和 itch.io 地址 |

图片建议提供原始 PNG/JPEG/WebP，横图宽 1600 像素以上；录像建议 720p/1080p、10–30 秒，MP4 或 WebM，可附字幕。无需用生成图代替真实项目截图。现有作品集支持全图查看、图片失败重试、视频手动播放、海报、字幕、Demo、Code 和 PDF 链接。

维护方法：把素材放入 `castle/media/`，编辑 `castle/content.js`，再执行 `npm.cmd run build` 和 `npm.cmd run check`。图片数据示例：

```js
{ type: 'image', src: '/castle/media/arcade.webp',
  alt: 'Actual Contra-like browser build', caption: 'Actual browser build' }
```

视频可使用 `type: 'video'`、`src`、`poster`、`caption`，有对白时增加 `tracks: [{ src, lang, label }]`。未准备好的素材继续使用 `{ type: 'pending', label: '具体缺少的材料' }`，并在 `missing` 中列出事实或链接缺口。
