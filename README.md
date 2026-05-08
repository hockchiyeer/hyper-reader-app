# HyperReader — Open-Link Reading Workspace（开放链接阅读工作台）

> **互联网的灵魂是超级链接。** HyperReader puts hyperlinks back at the centre of your reading experience, countering algorithm-driven social feeds, zero-click AI summaries, and walled-garden platforms.

HyperReader is a **zero-dependency, zero-backend, single-file** static web application. Open `hyperreader_full_app.html` in any modern browser and start reading the open web without relying on any platform's recommendation engine.

中文说明：HyperReader 是一个**零依赖、无后端、单文件**的静态网页应用。它把阅读、外链、来源判断和查证路径放回用户本地浏览器，让用户不必完全依赖平台推荐算法、AI 摘要或封闭式信息流。

---

## Why This App Exists / 为什么需要这个应用

The internet has shifted from a decentralised library of hyperlinks to a centralised system of algorithmic ad-delivery machines. Key developments driving this:

- **Single sign-on / closed social feeds（单点登录 / 封闭信息流）** — reduced outbound link clicks
- **Short-video platforms（短视频平台）** — shifted attention from long-form reading to passive consumption
- **Algorithm-driven ad-push（广告推送算法）** — replaced genuine social connections with influencer and brand promotion
- **AI Overviews / AI Summaries（AI 概览 / AI 摘要）** — zero-click search results that sever the path between reader and source

HyperReader is designed to reverse these effects locally: it surfaces link density, source diversity, and counter-opinion scores so you can read the open web deliberately.

中文说明：这个应用不是另一个信息流，而是一个本地阅读工作台。它帮助用户看见一篇内容是否有外链、来源是否多元、是否包含原始资料与反方观点，并引导用户从摘要回到原文、从单一来源走向开放链接。

---

## Features / 功能

| Feature / 功能 | Description / 说明 |
|---------|-------------|
| **Reading Queue / 阅读队列** | Seeded and manually added articles, sorted by openness score. 按开放度排列预置与手动添加的阅读材料。 |
| **Search & Filters / 搜索与筛选** | Full-text search by title / source / tag / domain; filter by All · High Openness · Needs Links · Counterpoints · Saved. 支持按标题、来源、标签和域名搜索，并筛选高开放、待补链、反方观点和已保存内容。 |
| **Deep Reader View / 深读室** | Article body + five-axis openness radar (link generosity, source diversity, primary material, viewpoint contrast, platform independence). 显示正文与五轴开放性雷达。 |
| **Outbound Link Panel / 外链面板** | Every article's external links listed with domain labels. 集中列出每篇文章的外部链接和域名。 |
| **Next Jump / 下一跳** | Related articles sharing tags — keeps you on the open web. 根据共同标签推荐下一篇开放阅读材料。 |
| **Text & URL Diagnosis / 文本与 URL 诊断** | Heuristic analysis of pasted text: AI-slop risk, zero-click risk, open reading score, per-claim needs, and repair actions. 本地分析文本的 AI 馊水风险、零点击风险、开放阅读分和补救动作。 |
| **Seven-Step Reading Trail / 七步阅读路径** | Structured reading path: seed → primary → research → counter → weak → community → solution; exportable as Markdown. 生成从起点、原始资料、研究、反方、弱链、社区到解决方案的路径，并可导出 Markdown。 |
| **Source Library / 来源库** | Source openness indicator, active/paused toggle, manual add, JSON export. 管理来源开放度、启用状态、手动新增和 JSON 导出。 |
| **Link Graph Canvas / 外链图谱** | Force-layout canvas showing outbound link connections between articles. 用 Canvas 展示文章之间的外链关系。 |
| **Locale Switcher / 语言切换** | Switch between Simplified Chinese, Traditional Chinese, English, and Malay — persisted across sessions. 支持简体中文、繁体中文、英文和马来文，并持久保存选择。 |
| **localStorage Persistence / 本地持久化** | All state (saved items, sources, trails, locale, last diagnosis) survives browser refresh. 已保存内容、来源、路径、语言和诊断结果会保存在浏览器本地。 |

---

## Project Structure / 项目结构

```
hyper-reader-app/
├── hyperreader_full_app.html          # The entire application — HTML + CSS + JS, self-contained
├── package.json                       # Dev-dependency manifest (Cypress + Cucumber only)
├── package-lock.json                  # Locked dependency graph
├── cypress.config.js                  # Cypress configuration + embedded static file server
├── scripts/
│   └── run-cypress.cjs                # Cypress launcher (strips ELECTRON_RUN_AS_NODE on Windows)
└── cypress/
    ├── downloads/                     # Cypress download intercept folder (JSON exports)
    ├── e2e/
    │   ├── hyperreader.feature        # Gherkin BDD scenarios (7 scenarios, 7 tests)
    │   └── step_definitions/
    │       └── hyperreader.steps.js   # Cucumber step implementations (45 steps)
    └── support/
        └── e2e.js                     # Custom Cypress command: openHyperReader
```

---

## Running the App / 运行应用

**No build step. No server. No npm install required.**

中文说明：运行应用本身不需要构建、服务器或安装 npm 依赖；直接用现代浏览器打开 HTML 文件即可。

```bash
# Just open directly in a browser:
start hyperreader_full_app.html          # Windows
open  hyperreader_full_app.html          # macOS
xdg-open hyperreader_full_app.html      # Linux
```

The only external dependency is the [Tabler icon font](https://tabler.io/icons) loaded from jsDelivr CDN. The app is fully functional without it (icons won't render, but all features work).

中文说明：唯一的外部资源是 Tabler 图标字体。如果 CDN 无法加载，图标可能不显示，但核心功能仍可使用。

---

## Application Architecture / 应用架构

中文说明：应用集中在 `hyperreader_full_app.html`：CSS 负责界面布局，HTML 定义各个视图，JavaScript 负责状态、国际化、渲染、诊断、路径生成、图谱绘制和本地持久化。

```
hyperreader_full_app.html
│
├── CSS  (lines 9–1076)
│   ├── CSS custom properties / design tokens
│   ├── Layout: sidebar + topbar + content grid
│   ├── Component styles: cards, panels, bars, trail steps, source cards
│   └── Responsive breakpoints (1040px, 760px)
│
├── HTML (lines 1078–1396)
│   ├── <aside class="sidebar">     — brand + nav + source strip
│   ├── <header class="topbar">     — search input + locale select + action buttons
│   └── <section class="content">
│       ├── #view-queue             — metric grid + article feed + focus/zero-click panels
│       ├── #view-reader            — article body + openness radar + link list + next jump
│       ├── #view-graph             — <canvas id="linkCanvas">
│       ├── #view-diagnose          — diagnosis form + result panel
│       ├── #view-trail             — seven-step trail list + trail params
│       └── #view-sources           — source grid + add-link form
│
└── JavaScript (lines 1397–3257)
    ├── Data layer
    │   ├── STORAGE_KEY = "hyperreader.openweb"
    │   ├── translations{}           — 4 locales × ~95 keys each
    │   ├── seedSources[]            — 5 pre-loaded sources
    │   └── seedItems[]              — 7 pre-loaded articles
    ├── State object
    │   ├── view, filter, query, locale, selectedId
    │   ├── sources[], items[], trail[], trailLocale
    │   └── lastDiagnosis
    ├── i18n
    │   ├── t(key, params)           — interpolated translation lookup
    │   └── applyLocale()            — patches [data-i18n*] attributes on every locale change
    ├── Render pipeline
    │   └── renderAll() → applyLocale + renderNav + renderMetrics + renderFeed
    │                   + renderReader + renderSources + renderSourceStrip
    │                   + renderFocus + renderZeroClick + renderTrail
    │                   + renderDiagnosis (if lastDiagnosis exists)
    ├── Diagnosis engine
    │   ├── runDiagnosis()           — heuristic scoring: link density, slop risk, zero-click risk
    │   ├── classifyClaim()          — per-sentence need classification
    │   └── buildDiagnosisActions()  — context-aware repair suggestions
    ├── Trail builder
    │   └── buildTrail(seedId)       — 7-step path from seed item through item pool
    ├── Graph renderer
    │   └── drawGraph()              — canvas force-layout with mouse hover tooltip
    └── Persistence
        ├── persist()                — serialise state to localStorage
        └── loadState()              — deserialise on startup
```

---

## Openness Score / 开放度评分

Each article is scored 0–100 across five axes, averaged into a single **Openness Index**:

中文说明：每篇内容会按五个维度计算 0–100 分，并平均成一个开放度指数。分数越高，表示越容易追溯来源、跨站阅读和进入多元观点。

| Axis / 维度 | Formula / 公式 | Colour / 颜色 |
|------|---------|--------|
| Link Generosity / 外链慷慨度 | `min(100, links × 4.2)` | Green / 绿色 |
| Source Diversity / 来源多元度 | `item.diversity` (0–100) | Blue / 蓝色 |
| Primary Material / 原始资料度 | `item.primary` (0–100) | Rust / 铁锈色 |
| Viewpoint Contrast / 观点对照度 | `item.contrast` (0–100) | Violet / 紫色 |
| Platform Independence / 平台独立度 | `item.independence` (0–100) | Gold / 金色 |

Articles with openness ≥ 75 are tagged **green**; < 52 are tagged **rust**.

中文说明：开放度大于或等于 75 的文章会标记为绿色；低于 52 的文章会标记为铁锈色，提醒用户需要补链或交叉阅读。

---

## Diagnosis Heuristics / 诊断启发式

The text/URL diagnosis tool runs entirely in-browser with no API calls:

中文说明：诊断工具完全在浏览器本地运行，不调用 API。它根据外链数量、域名数量、标题党词汇、模糊归因和平台互动词汇估算风险。

| Signal / 信号 | Effect on score / 对分数的影响 |
|--------|----------------|
| Outbound URL count / 外部 URL 数量 | Raises open score, lowers zero-click risk. 提高开放分，降低零点击风险。 |
| Distinct domain count / 不同域名数量 | Raises source diversity score. 提高来源多元度。 |
| Hype words / 刺激性词汇（震惊, exclusive, tergempar …） | Raises slop risk. 提高 AI 馊水或标题党风险。 |
| Vague attribution / 模糊归因（专家表示, experts say …） | Raises slop risk + zero-click risk. 提高内容风险与零点击风险。 |
| Platform engagement words / 平台互动词（转发, subscribe …） | Raises slop risk. 提高平台化传播风险。 |

Repair actions are generated based on mode (feed / search / article / chat) and goal (verify / understand / debate / archive).

中文说明：补救动作会根据阅读场景和目标生成，例如补原始链接、补第二个独立域名、替换模糊出处、打开原文、整理反方观点或保存档案副本。

---

## Locales / 语言

Switch language using the **globe icon selector** in the top toolbar.

中文说明：可通过顶部工具栏的地球图标选择界面语言。

| Code | Language | Persisted? |
|------|----------|------------|
| `zh-Hans` | Simplified Chinese (default) | ✅ |
| `zh-Hant` | Traditional Chinese | ✅ |
| `en` | English | ✅ |
| `ms` | Malay | ✅ |

The selected locale is saved in `localStorage` under the `hyperreader.openweb` key and restored on every page load.

中文说明：语言选择会保存到 `localStorage` 的 `hyperreader.openweb` 键中，下次打开或刷新页面时自动恢复。

**How localisation works:**

```
setLocale(locale)
  └─► state.locale = locale
      persist()              — saves to localStorage
      renderAll()
        └─► applyLocale()
              ├── document.documentElement.lang = locale
              ├── document.title = t("app.title")
              ├── [data-i18n]              → element.textContent
              ├── [data-i18n-placeholder]  → element.placeholder
              ├── [data-i18n-title]        → element.title
              └── [data-i18n-aria-label]   → element.ariaLabel
```

To add a new locale: add a new key to the `translations` object and add an `<option>` to `#localeSelect`.

To add new translatable strings: add `data-i18n="your.key"` (or `data-i18n-placeholder` / `data-i18n-title`) to the element, then add the key to all four locale objects.

中文说明：新增语言时，需要同时更新 `translations` 对象和 `#localeSelect` 选项；新增可翻译文本时，需要在 HTML 上加入对应 `data-i18n*` 属性，并在四个语言对象里补齐同一个 key。

---

## localStorage Schema / 本地存储结构

All state is stored as a single JSON blob under key `hyperreader.openweb`:

中文说明：应用状态会集中保存在一个 JSON 对象中，方便导出、调试和重置。

```jsonc
{
  "locale": "zh-Hans",          // Active locale code
  "selectedId": "open-hyperlink-soul",  // Currently open article ID
  "focusIndex": 0,              // Focus panel rotation index
  "sources": [ /* SourceObject[] */ ],
  "items":   [ /* ItemObject[] */ ],
  "trail":   [ /* { title, note }[] */ ],
  "trailLocale": "zh-Hans",    // Locale in which trail was generated
  "lastDiagnosis": { /* DiagnosisResult | null */ }
}
```

**ItemObject shape:**
```jsonc
{
  "id": "string",
  "title": "string",
  "source": "string",
  "domain": "string",
  "type": "blog | news | research | archive | community",
  "date": "YYYY-MM-DD",
  "links": 0,           // Outbound link count (drives link generosity score)
  "diversity": 0,       // Source diversity score 0–100
  "primary": 0,         // Primary material score 0–100
  "contrast": 0,        // Viewpoint contrast score 0–100
  "independence": 0,    // Platform independence score 0–100
  "saved": false,
  "read": false,
  "tags": ["string"],
  "stance": "core | analysis | counter | solution | needs-links | manual",
  "summary": "string",
  "body": ["paragraph strings"],
  "outlinks": [{ "label": "string", "url": "string", "domain": "string" }]
}
```

To **reset** the workspace, clear the key:

中文说明：如需重置工作台，清除这个 localStorage key 即可。

```js
localStorage.removeItem("hyperreader.openweb");
```

---

## Testing / 测试

### Install dependencies / 安装依赖

```bash
npm install
```

### Run the full BDD suite (headless) / 运行完整 BDD 测试

```bash
npm run test:e2e
```

### Open Cypress interactively / 打开 Cypress 交互界面

```bash
npm run cypress:open
```

### Expected result / 预期结果

```
7 passing (≈10s)
```

### Test architecture / 测试架构

| Layer / 层级 | Technology / 技术 |
|-------|-----------|
| Test runner / 测试运行器 | Cypress 15.14.2 |
| Scenario format / 场景格式 | Gherkin / Cucumber (`.feature` files) |
| Step binding / 步骤绑定 | `@badeball/cypress-cucumber-preprocessor` 24.0.1 |
| Bundler / 打包器 | `@bahmutov/cypress-esbuild-preprocessor` + esbuild 0.28.0 |
| App server / 应用服务器 | Embedded Node.js HTTP server inside `cypress.config.js` |

`cypress.config.js` starts a temporary static file server on a random port before each run — no external server setup is required.

中文说明：测试运行前会由 `cypress.config.js` 自动启动临时静态服务器，不需要手动开服务。

### BDD scenario coverage / BDD 场景覆盖

| Scenario / 场景 | What it covers / 覆盖内容 |
|----------|---------------|
| Localize the core interface and persist the selected locale / 本地化并持久保存语言 | All 4 locale switches, `<html lang>` attribute, search placeholder, nav label text, locale persistence across `cy.reload()`. 覆盖四种语言切换、页面语言属性、搜索占位文字、导航文字和刷新后的语言恢复。 |
| Search and filters refine the reading queue / 搜索与筛选阅读队列 | Text search, needs-links filter, saved filter, queue subtitle. 覆盖文本搜索、待补链筛选、已保存筛选和队列副标题。 |
| Reader actions save an item, build a trail, and copy Markdown / 阅读器操作 | Reader view, openness score rows, save counter, trail generation, clipboard write. 覆盖深读视图、开放度评分、保存计数、路径生成和剪贴板写入。 |
| Diagnose text and copy the diagnosis result / 文本诊断与复制 | Empty-input validation toast, heuristic diagnosis run, result panel content, clipboard copy. 覆盖空输入提示、启发式诊断、结果面板和复制诊断。 |
| Add, validate, toggle, and export sources / 来源新增、校验、切换与导出 | Empty-form validation, manual source add, reader view after add, source pause toggle, JSON export download. 覆盖表单校验、手动新增、暂停来源和 JSON 导出。 |
| Navigation exposes every primary workspace / 主工作区导航 | All 4 primary nav items activate correct views. 覆盖主要视图切换。 |
| The link graph renders to a non-empty canvas / 外链图谱渲染 | Canvas dimensions and pixel content. 覆盖 Canvas 尺寸和非空像素内容。 |

### Cypress environment note / Cypress 环境说明

Some shells (particularly PowerShell on Windows) set `ELECTRON_RUN_AS_NODE=1`, which prevents Cypress's Electron binary from launching. The npm scripts route through `scripts/run-cypress.cjs`, which deletes that variable before spawning the Cypress child process.

中文说明：某些 Windows PowerShell 环境会设置 `ELECTRON_RUN_AS_NODE=1`，导致 Cypress Electron 无法启动。本项目的 npm 脚本会通过 `scripts/run-cypress.cjs` 删除该变量后再启动 Cypress。

---

## Troubleshooting / 常见问题

| Symptom / 现象 | Likely cause / 可能原因 | Fix / 解决方法 |
|---------|-------------|-----|
| Icons not showing / 图标不显示 | CDN blocked (offline or firewall) / CDN 被阻挡 | Functional; icons are decorative only. 功能仍可使用，图标只是装饰。 |
| Locale not restored on refresh / 刷新后语言没有恢复 | `localStorage` cleared by browser privacy mode / 浏览器清除了本地存储 | Disable private/incognito mode or allow site data. 关闭隐私模式或允许网站数据。 |
| `npm run test:e2e` hangs / 测试卡住 | `ELECTRON_RUN_AS_NODE=1` set in environment / 环境变量影响 Cypress Electron | Use the npm script (which strips that variable); do not call `cypress run` directly. 使用 npm 脚本，不直接调用 `cypress run`。 |
| Download test fails / 下载测试失败 | Browser download folder permissions / 下载目录权限问题 | Ensure `cypress/downloads/` is writable. 确认目录可写。 |
| Canvas test times out / Canvas 测试超时 | Slow CPU / headless GPU rendering / CPU 慢或无头渲染较慢 | Increase `defaultCommandTimeout` in `cypress.config.js`. 提高默认命令超时时间。 |

---

## Contributing / 贡献指南

1. **New article / source seed data（新增文章或来源种子资料）** — add entries to `seedItems[]` and `seedSources[]` in `hyperreader_full_app.html`.
2. **New translation key（新增翻译 key）** — add `data-i18n="new.key"` to the element; add `"new.key"` to all four locale objects in the `translations` constant.
3. **New BDD scenario（新增 BDD 场景）** — add a `Scenario:` block to `cypress/e2e/hyperreader.feature` and matching step bindings in `cypress/e2e/step_definitions/hyperreader.steps.js`.
4. **New diagnosis heuristic（新增诊断启发式）** — extend `hypeWords`, `vagueWords`, or `platformWords` arrays, or add logic to `buildDiagnosisActions()`.

---

## License / 许可证

This project is released for public use. See repository root for licence details.

中文说明：本项目可公开使用。许可细节请查看仓库根目录中的相关文件。
