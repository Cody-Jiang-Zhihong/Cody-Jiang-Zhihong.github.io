# 沿用 GitHub Pages 的上线与回滚

## 已核实的发布方式

通过仓库 GitHub Pages API 检查：仓库 `Cody-Jiang-Zhihong/Cody-Jiang-Zhihong.github.io`，`build_type: legacy`，来源 `main` 分支 `/` 根目录，`CNAME: codyjiang.com`，HTTPS 强制开启，状态 `built`。检查时远端 `main` 与本地起点均为 `d8aa1f63bf853057636c417ebcf4844e70babe21`。

本次只准备 `castle-redesign` 开发分支和本地预览。没有改变 Pages 设置、DNS、CNAME 或线上分支。根目录静态文件可沿用当前发布模式；`read.html` 已生成并纳入版本控制，发布端无需 Node.js 或 npm。`.nojekyll` 让 Pages 直接提供静态文件。

## 上线

1. 审阅本地城堡、`read.html`、素材占位和 `docs/QA.md`。如有内容更新，先修改 `castle/content.js`，再重新生成简明页。
2. 在开发分支执行以下检查，并提交通过检查的改动：

   ```powershell
   npm.cmd ci
   npm.cmd run build
   npm.cmd test
   npm.cmd run check
   npx.cmd playwright install chromium
   npm.cmd run test:browser
   git diff --check
   ```

3. 记录发布前 `main` 的实际提交（上线时重新读取，勿假定仍为本轮起点）：

   ```powershell
   git fetch origin
   git rev-parse origin/main
   git push -u origin castle-redesign
   ```

4. 为 `castle-redesign` → `main` 创建 PR。建议 squash 合并，记录最终 squash 提交 SHA，便于一次 revert 回滚。确认 PR 包含根目录入口、`castle/`、`read.html`、`.nojekyll`；保留 CNAME 和原有资源路径。
5. 审阅通过后合并 PR。继续保持 Settings → Pages → Deploy from a branch → `main` → `/ (root)`。不需要改为 `dist/` 或另建发布分支。推送到发布来源分支会触发发布，见 [GitHub 官方发布来源说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
6. 在 Actions / Pages 中确认发布成功，也可读取：

   ```powershell
   gh api repos/Cody-Jiang-Zhihong/Cody-Jiang-Zhihong.github.io/pages
   gh api repos/Cody-Jiang-Zhihong/Cody-Jiang-Zhihong.github.io/pages/builds/latest
   ```

7. 实际打开 `https://codyjiang.com/`，检查大门 → 大厅 → 四房间、`/#experience`、`/#projects`、`/#observatory/jepa`、`/read.html`、原游戏地址，以及 CV 和三版简历。分享图地址为 `/castle/assets/social-castle.jpg`。CDN 缓存可能导致短时间显示旧文件，验证时刷新页面。

## 回滚

推荐通过新提交撤销上线，不重写 `main` 历史，也不更改域名。

- **Squash 合并：** 在更新的 `main` 上对发布的 squash SHA 执行 `git revert <发布提交SHA>`，推送新的回滚提交。
- **Merge commit 合并：** 对该合并提交执行 `git revert -m 1 <合并提交SHA>`，推送新的回滚提交。
- **多个普通提交或 fast-forward：** 明确发布范围后，按由新到旧的顺序撤销这些发布提交；避免把之后的正常内容更新一同撤销。

回滚同样会触发当前 Pages 发布。确认构建成功后检查原首页、CNAME、游戏和 PDF。`legacy/index.html` 是阅读存档，不能通过把它直接复制到根目录完成回滚：其中的相对资源地址已为存档目录调整。请使用 Git revert 恢复正式入口。

## 运维限制

GitHub Pages 提供静态文件，不运行 Flask。Hash 深链接由同一个根入口恢复，刷新无需服务器重写。社交平台通常不会为不同 hash 单独抓取元数据，城堡展品共享整站分享卡；简明内容页有独立 canonical 和分享信息。本轮没有部署后的远程性能或实体 iPhone/Safari 测试记录。
