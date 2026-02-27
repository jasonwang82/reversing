# AI 办公套件逆向工程调研报告

> 本报告基于对 Claude for Excel、Claude for PowerPoint、Manus Agent 及 Shortcut 四款 AI 办公产品的逆向工程分析，系统梳理其技术实现方案、Prompt 设计、工具体系与安全架构。

---

## 目录

1. [概述](#概述)
2. [Claude for Excel（代号 Pivot）](#claude-for-excel代号-pivot)
3. [Claude for PowerPoint](#claude-for-powerpoint)
4. [Manus Agent](#manus-agent)
5. [Shortcut（电子表格 AI）](#shortcut电子表格-ai)
6. [横向对比分析](#横向对比分析)
7. [共性技术模式](#共性技术模式)
8. [安全架构分析](#安全架构分析)
9. [Prompt 工程分析](#prompt-工程分析)
10. [结论与洞察](#结论与洞察)

---

## 概述

本次调研对象为当前主流 AI 驱动办公产品，覆盖电子表格、演示文稿、通用 AI Agent 三大场景。核心关注点：

| 产品 | 公司 | 核心模型 | 定位 |
|------|------|---------|------|
| Claude for Excel | Anthropic | Claude Opus 4.5 | Excel 智能助手插件 |
| Claude for PowerPoint | Anthropic | Claude Opus 4.5 | PPT 智能助手插件 |
| Manus | Monica/Vida | Claude / 自研 | 通用 AI Agent 平台 |
| Shortcut | 独立团队 | Claude Opus 4.5 | 云端智能表格 |

---

## Claude for Excel（代号 Pivot）

### 1. 产品架构

Claude for Excel 以 Microsoft Office 插件形式集成，内部代号 **Pivot**，入口为 `pivot.claude.ai`。

```
用户本地机器
├── Excel 应用
│   ├── 电子表格数据
│   └── 任务窗格（WebView / OfficeJS 插件）
│       ├── 聊天 UI
│       └── WebSocket/HTTPS 通信
│
└── Anthropic 云端基础设施
    ├── 编排器（Orchestrator）
    │   ├── 接收消息 + 表格上下文
    │   ├── 调用 Claude API
    │   ├── 管理代码执行容器
    │   └── 监控沙盒 .request 文件
    └── gVisor 沙盒（Debian 12）
        ├── Python 3.11 + pandas/numpy 等
        ├── 无直接网络访问
        └── 仅文件 IPC（.request/.response）
```

**核心创新**：通过两层 RPC 机制，允许云端 Python 代码安全地读写用户本地 Excel，Anthropic 永远不直接接触用户文件。

### 2. API 请求结构

**HTTP 请求头**

```http
POST /v1/messages HTTP/2
Host: api.anthropic.com
Origin: https://pivot.claude.ai
anthropic-version: 2023-06-01
anthropic-beta: oauth-2025-04-20,code-execution-2025-08-25,files-api-2025-04-14,code-execution-with-tools-2025-09-08
anthropic-dangerous-direct-browser-access: true
x-stainless-timeout: 600
```

**请求体关键字段**

```json
{
  "model": "claude-opus-4-5-20251101",
  "max_tokens": 50000,
  "stream": true,
  "container": "container_011CXj1EJg1bFSwXLr4LuboX",
  "metadata": { "user_id": "excel-add-in/<base64_email>" },
  "system": "...",
  "tools": [...],
  "messages": [...]
}
```

**Beta 特性矩阵**

| Beta 标头 | 启用日期 | 功能 |
|-----------|---------|------|
| `oauth-2025-04-20` | 2025-04 | OAuth 身份认证 |
| `files-api-2025-04-14` | 2025-04 | 文件上传处理 |
| `code-execution-2025-08-25` | 2025-08 | Python 沙盒执行 |
| `code-execution-with-tools-2025-09-08` | 2025-09 | 程序化工具调用（PTC） |

> `code-execution-with-tools-2025-09-08` 比公开的 `advanced-tool-use-2025-11-20` beta 早约 2 个月，是 Anthropic 为 Pivot 内部实现的早期版本。

### 3. 用户消息格式

每条用户消息包含多个内容块：

```json
{
  "role": "user",
  "content": [
    { "type": "text", "text": "用户的实际问题或请求" },
    { "type": "text", "text": "<user_context>\n当前活跃 Sheet ID: 1\n选中范围: Sheet1!A1:B10\n</user_context>" },
    { "type": "text", "text": "<initial_state>\n{...工作簿元数据...}\n</initial_state>" }
  ]
}
```

- `<user_context>`：每条消息附加，包含当前 sheet ID 和选区
- `<initial_state>`：仅首次消息包含，包含工作簿元数据（sheets、维度、冻结窗格）

### 4. 工具体系

**读取工具（可自由调用）**

| 工具 | 说明 | PTC 支持 |
|------|------|---------|
| `get_sheets_metadata` | 获取工作簿结构信息 | ❌ |
| `get_cell_ranges` | 获取详细单元格信息 | ✅ |
| `get_range_as_csv` | 以 CSV 格式获取数据 | ✅ |
| `search_data` | 跨表格搜索文本 | ❌ |
| `get_all_objects` | 获取数据透视表、图表等 | ❌ |

**写入工具（需明确用户意图）**

| 工具 | 说明 | PTC 支持 |
|------|------|---------|
| `set_cell_range` | 写入值、公式、格式 | ✅ |
| `modify_sheet_structure` | 插入/删除/隐藏/冻结行列 | ❌ |
| `modify_workbook_structure` | 创建/删除/重命名 Sheet | ❌ |
| `modify_object` | 创建/更新数据透视表和图表 | ❌ |
| `clear_cell_range` | 清除内容和/或格式 | ❌ |
| `resize_range` | 调整列宽/行高 | ❌ |
| `copy_to` | 带公式转换的范围复制 | ❌ |

**服务端工具**

| 工具 | 说明 |
|------|------|
| `code_execution` | 在沙盒容器中运行 Python |
| `web_search` | 网络搜索 |

只有 3 个工具支持 PTC（程序化工具调用）：`get_cell_ranges`、`get_range_as_csv`、`set_cell_range`。

### 5. RPC 机制（Python → Excel）

#### Layer 1：Anthropic 程序化工具调用（PTC）API

```
客户端（OfficeJS）        Anthropic API           沙盒（Container）
      │                       │                         │
      │  1. POST /messages     │                         │
      │  （tools + code_exec）  │                         │
      │──────────────────────>│                         │
      │                       │  2. 启动容器，运行 Python  │
      │                       │────────────────────────>│
      │                       │  3. 代码调用 await tool() │
      │                       │<────────────────────────│
      │  4. 响应（tool_use）   │    （容器暂停）           │
      │<──────────────────────│                         │
      │  5. 本地执行工具        │                         │
      │  （OfficeJS → Excel）  │                         │
      │  6. POST /messages     │                         │
      │  （tool_result）       │                         │
      │──────────────────────>│  7. 恢复代码执行          │
      │                       │────────────────────────>│
      │                       │  8. 代码继续/完成          │
      │  9. 最终响应            │<────────────────────────│
      │<──────────────────────│                         │
```

#### Layer 2：沙盒内部 IPC（pfc.py）

在容器内，编排器注入 `pfc.py`，提供异步函数桩。当 Claude 的代码调用 `await get_range_as_csv({...})` 时：

```python
async def _call_client_tool(tool_name: str, **kwargs) -> Any:
    custom_id = uuid.uuid4().hex
    request = {"tool": tool_name, "parameters": kwargs.get("params", {}), "tool_use_id": custom_id}

    # 写入请求文件
    with open(f"{pfc_dir}/{custom_id}.request", "w") as f:
        json.dump(request, f)

    # 通知编排器（绕过捕获的 stdout）
    _original_stdout.write(f"[TOOL_CALL] {json.dumps(request)}\n")

    # 等待响应文件（每 100ms 轮询，超时 4.5min）
    await registry.wait_for_response(custom_id)

    with open(f"{pfc_dir}/{custom_id}.response") as f:
        return json.load(f)["content"]
```

### 6. 沙盒环境规格

| 属性 | 值 |
|------|----|
| 操作系统 | Debian GNU/Linux 12 (Bookworm) |
| 内核 | 4.4.0（gVisor/runsc） |
| Python | 3.11 |
| CPU | 4 核（Intel Emerald Rapids） |
| 内存 | 10 GB |
| 容器生命周期 | 5 分钟 |
| 网络 | 无（完全隔离） |

**可用库**：pandas、numpy、scipy、openpyxl、xlrd、xlsxwriter、pdfplumber、python-docx、python-pptx、pyarrow

---

## Claude for PowerPoint

### 1. 产品架构

与 Excel 版本类似，PowerPoint 版本直接通过 OfficeJS API 操作 PPTX，无需沙盒容器。

**核心差异**：PowerPoint 不需要大型数据处理，因此不使用 gVisor 沙盒，直接在浏览器中通过 `code_execution` 和 `execute_office_js` 操作幻灯片。

### 2. 工具体系

| 工具 | 类型 | 说明 |
|------|------|------|
| `code_execution` | 服务端 | Python 代码执行 |
| `web_search` | 服务端 | 网络搜索 |
| `execute_office_js` | 自定义 | 执行 Office.js JS 代码操作幻灯片 |
| `screenshot_slide` | 自定义 | 截图幻灯片（视觉验证） |
| `edit_slide_chart` | 自定义 | 通过 OOXML 添加/编辑图表 |
| `edit_slide_master` | 自定义 | 编辑幻灯片母版和布局 |
| `edit_slide_xml` | 自定义 | 直接操作幻灯片 OOXML |
| `duplicate_slide` | 自定义 | 复制幻灯片 |
| `verify_slides` | 自定义 | 验证所有幻灯片（布局、覆盖、溢出） |
| `read_slide_text` | 自定义 | 读取形状文本的原始 OOXML |
| `edit_slide_text` | 自定义 | 用 OOXML `<a:p>` 替换形状文本 |

### 3. Prompt 关键规则

**幻灯片编号**
- 用户使用 1 基索引（幻灯片 1、2...）
- API 使用 0 基索引（index 0、1...）

**字体规范**
- 任何元素的最小字号：14pt
- 正文推荐：16pt
- 必须显式设置 `font.size`，不依赖默认值

**图表处理**
- 流程图、时间线、循环图、组织图 → 使用 `edit_slide_xml`（OOXML）而非 `execute_office_js`
- XML 中的文本必须用 `escapeXml()` 转义

**自动调整**
- 使用 `edit_slide_text` 或 JS 编辑文本后，必须调用 `shape.textFrame.autoSizeSetting = "AutoSizeShapeToFitText"`

**演示文稿类型判断逻辑**

```
isDefaultTheme === true + hasContent === false → 空白演示文稿
  → 先调用 edit_slide_master 建立完整主题

isDefaultTheme === true + hasContent === true → 自定义演示文稿
  → 读取现有幻灯片提取视觉风格，逐幻灯片匹配

isDefaultTheme === false → 模板/现有演示文稿
  → 保留现有主题，不修改母版
```

---

## Manus Agent

### 1. 产品架构

Manus 是通用 AI Agent 平台，包含 6 个 CLI 工具，采用模块化二进制架构：

```
Manus 沙盒 / 用户机器
├── 本地工具（无需认证）
│   ├── manus-md-to-pdf        # Markdown → PDF（Chrome 无头浏览器）
│   └── manus-render-diagram   # 渲染 Mermaid/D2/PlantUML → PNG
│
└── 远程工具（需认证）
    ├── manus-upload-file      # S3 文件上传
    ├── manus-export-slides    # 幻灯片导出为 PDF/PPT
    ├── manus-speech-to-text   # 语音转文字（OpenAI Whisper）
    └── manus-mcp-cli          # MCP 客户端（OAuth 2.1）
```

### 2. 技术栈

| 组件 | 技术 |
|------|------|
| 编程语言 | Go（静态链接 ELF 二进制） |
| 浏览器控制 | chromedp（Chrome DevTools Protocol） |
| API 协议 | Connect-RPC（gRPC 兼容） |
| 错误追踪 | Sentry |
| CDN 资源 | Mermaid.js 10.6.1、KaTeX 0.16.25、Highlight.js 11.9.0 |

### 3. 工具模式切换机制

Manus 使用动态工具展开：初始状态暴露 12 个工具，进入某个模式后展开为最多 28 个工具。

**初始工具集（12 个）**

```
plan, message, shell, file, match, search, schedule, expose,
browser, generate, slides, webdev_init_project
```

**模式切换展开**

| 触发工具 | 展开为 | 工具数量 |
|---------|--------|---------|
| `browser` | browser_navigate, browser_view, browser_click, browser_input, browser_scroll, browser_move_mouse, browser_press_key, browser_select_option, browser_save_image, browser_upload_file, browser_find_keyword, browser_fill_form, browser_console_exec, browser_console_view, browser_close | 15 |
| `generate` | generate_image, generate_image_variation, generate_video, generate_speech | 4 |
| `slides` | slides_create, slides_view | 2 |
| `webdev_init_project` | webdev_init_project, webdev_check_status, webdev_restart_server, webdev_add_feature, webdev_save_checkpoint, webdev_rollback_checkpoint, webdev_execute_sql | 7 |

### 4. API 端点（逆向分析）

**BizServer 文件 API**（`gitlab.monica.cn/vida/sdk/bizserver-go.git`）

| 端点 | 用途 |
|------|------|
| `/file.v1.FileService/SandboxSignUrl` | 获取 S3 预签名上传 URL |
| `/file.v1.FileService/SignUrl` | 通用预签名 URL |
| `/file.v1.FileService/BatchSignUrl` | 批量 URL 获取 |

**BizServer Session API**

| 端点 | 用途 |
|------|------|
| `/session.v1.SessionPublicService/CreateSessionFileConvertTask` | 创建转换任务 |
| `/session.v1.SessionPublicService/LoopSessionFileConvertTask` | 轮询转换状态 |

**支持的转换类型**

```protobuf
enum SessionFileConvertType {
  HTML_TO_PDF = 1;
  HTML_TO_PPT = 2;
  PPTX_TO_PNG = 3;
  MARKDOWN_TO_PDF = 4;
  MARKDOWN_TO_DOCX = 5;
}
```

### 5. 认证机制

- 双重认证：BizServer Token + Sandbox API Token
- Token 存储在文件而非环境变量（`~/.manus/secrets/`）
- 预签名 URL 具有时间限制
- 关键配置文件：`~/.manus/.env`、`~/.manus/secrets/sandbox_api_token`

---

## Shortcut（电子表格 AI）

### 1. 产品架构

Shortcut 是基于 LangGraph 的自托管 AI 表格服务，使用 SpreadJS 作为电子表格引擎。

**技术栈**

| 组件 | 技术 |
|------|------|
| Agent 框架 | LangGraph 1.0.7（自托管，API v0.7.10） |
| LLM | Claude Opus 4.5（`claude-opus-4-5-20251101`） |
| 电子表格引擎 | SpreadJS |
| 架构 | 状态机 Agent（action/ask/plan 三模式） |

### 2. 工具体系

| 工具 | 说明 |
|------|------|
| `get_tool_info` | 获取 SpreadJS 函数的 API 文档 |
| `execute_tool` | 执行电子表格命令 |
| `execute_code` | 对工作簿运行 JS/TS 代码 |
| `bash_command` | 执行终端命令 |
| `todo_list` | 管理持久化任务列表 |
| `task` | 启动子 Agent 或多步骤流程 |
| `switch_mode` | 在 action/ask/plan 模式间切换 |
| `prepare_read_session` | 优化大范围读取的上下文 |

### 3. 代码执行模型

LLM 编写 TypeScript/JavaScript 代码，针对 **SpreadJS 类型化外观层**执行：

```
LLM 编写 TypeScript → eval(code, { workbook, general, LineStyle, FormatType, ... })
```

**注入的全局变量**

| 全局变量 | 类型 | 说明 |
|---------|------|------|
| `workbook` | Workbook | 主工作簿实例 |
| `general` | General | 跨工作簿操作与文档的工具对象 |
| `LineStyle` | enum | 边框线样式 |
| `FormatType` | enum | 数字格式预设 |
| `HorizontalAlign` | enum | 单元格水平对齐 |
| `VerticalAlign` | enum | 单元格垂直对齐 |

### 4. 隐藏函数模式

高级功能（数据透视表、数据验证、条件格式）被标记为 `hidden` 以减少 Prompt 冗余。LLM 按需发现：

```typescript
// LLM 调用此函数获取隐藏函数的完整文档
general.getAPIInfo("addPivotTable");
```

**标签体系**

| 标签 | 含义 |
|------|------|
| `action` | 在 action 模式可用（完整读写） |
| `ask` | 在 ask 模式可用（只读） |
| `hidden` | 不在 Prompt 中，通过 `getAPIInfo()` 按需获取 |

### 5. 技能与记忆系统

**内置技能**

- `sec-edgar`：研究和下载 SEC EDGAR 文件（10-K、10-Q、8-K）
- `spreadjs-advanced-api`：访问高级 SpreadJS 功能
- `integrations`：金融数据提供商集成（Bloomberg、FactSet、Capital IQ 等）

**记忆机制**

```markdown
存储位置：/skills/user/user-memories/SKILL.md
记忆 ID 格式：[mem_YYMMDD]
触发条件：用户纠正、分享稳定事实、声明偏好、要求记住时
```

---

## 横向对比分析

### 核心架构对比

| 维度 | Claude for Excel | Claude for PowerPoint | Manus | Shortcut |
|------|-----------------|----------------------|-------|---------|
| 执行环境 | gVisor 沙盒（云端） | 浏览器（本地） | Go 二进制（本地/云端） | LangGraph（自托管） |
| 代码语言 | Python | JavaScript | Go | TypeScript/JavaScript |
| 沙盒隔离 | ✅ gVisor | ❌（无需） | 部分 | ❌ |
| 数据访问 | 通过 RPC 间接 | 直接 OfficeJS | 直接文件系统 | 直接 SpreadJS |
| 模型 | Claude Opus 4.5 | Claude Opus 4.5 | Claude Opus 4.5 | Claude Opus 4.5 |
| max_tokens | 50,000 | 未公开 | 未公开 | 未公开 |
| 请求超时 | 600 秒 | 未公开 | 未公开 | 未公开 |

### 工具设计哲学对比

| 产品 | 设计哲学 |
|------|---------|
| Claude for Excel | 读/写工具严格分离，PTC 仅开放 3 个工具，通过 `allowed_callers` 精细控制 |
| Claude for PowerPoint | 工具按功能分层（JS 操作 / XML 操作 / 验证），强调 OOXML 精确控制 |
| Manus | 动态工具展开，初始精简（12 个），按模式渐进暴露（最多 28 个） |
| Shortcut | 隐藏函数模式，按需发现 API，减少 Prompt 污染 |

### Prompt 结构对比

| 产品 | Prompt 结构 |
|------|-------------|
| Claude for Excel | 单体系统 Prompt + 每条消息注入上下文 |
| Claude for PowerPoint | 单体系统 Prompt，包含详细 OOXML 规则 |
| Manus | 模块化指令，通过 LangGraph config 注入，无单一大型 Prompt |
| Shortcut | 模块化技能文件（SKILL.md），API 规范作为文档注入 |

---

## 共性技术模式

### 1. 上下文注入模式

所有产品都在每条消息中注入运行时上下文，避免 LLM 猜测当前状态：

```json
// Claude for Excel
"<user_context>\n当前活跃 Sheet ID: 1\n选中范围: Sheet1!A1:B10\n</user_context>"

// Claude for PowerPoint  
"initial_state": { "isDefaultTheme": true, "hasContent": false }

// Shortcut
"agent_mode": "action", "platform": "web"
```

### 2. 工具分级暴露

通过控制工具可见性降低 LLM 决策复杂度：

- **Excel**：READ vs WRITE 工具分类 + `allowed_callers` 精细控制
- **PowerPoint**：直接 API vs OOXML API 分层
- **Manus**：初始 12 工具 → 按模式展开至 28 工具
- **Shortcut**：action/ask/hidden 三级标签

### 3. 验证/审计机制

所有产品都内置了防护措施：

- **Excel**：`set_cell_range` 默认拒绝覆盖（需显式 `allow_overwrite=true`），`[TOOL_CALL]` 日志
- **PowerPoint**：`verify_slides` 工具检查形状重叠和越界
- **Manus**：`[TOOL_CALL]` stdout 日志 + 编排器校验
- **Shortcut**：LangGraph 状态机管控

### 4. 大数据处理策略

处理超大数据集的统一模式：

```
> 1000 行 → 必须在代码执行容器中处理
分块读取（500 行/块）
asyncio.gather() 并行获取
禁止 print 原始大数据到 stdout
```

### 5. 金融数据专业化

Claude for Excel 和 Shortcut 均内置金融工具集成：

| 平台 | Excel 函数 |
|------|-----------|
| Bloomberg | `=BDP()`, `=BDH()`, `=BDS()` |
| FactSet | `=FDS()`, `=FDSH()` |
| S&P Capital IQ | `=CIQ()`, `=CIQH()` |
| Refinitiv | `=TR()` |

---

## 安全架构分析

### Claude for Excel 纵深防御

```
Claude 生成代码
     ↓
沙盒（隔离，无网络，gVisor）
     ↓ 写入 .request 文件
编排器（校验请求）
     ↓ 通过 API 暴露 tool_use
客户端（本地校验并执行，通过 OfficeJS）
     ↓ 发送 tool_result
编排器（写入 .response 文件）
     ↓
沙盒读取结果并继续
```

**5 层安全保障**

1. **客户端执行**：所有 Excel 操作通过本地 OfficeJS 执行，Anthropic 不直接接触文件
2. **沙盒计算**：Python 在 gVisor 中运行，无网络/文件系统逃逸
3. **代理 RPC**：每次工具调用经编排器校验后才执行
4. **审计追踪**：所有工具调用通过 `[TOOL_CALL]` 机制记录
5. **覆盖保护**：`set_cell_range` 默认拒绝覆盖，需显式授权

### Manus 认证机制

- 双 Token 认证（BizServer Token + Sandbox API Token）
- Token 存储在受限文件（推荐 chmod 600）
- 预签名 URL 时间限制
- Sentry 错误追踪（发送至 `sentry.butterflyotel.online`）

---

## Prompt 工程分析

### 1. 结构化行为约束

所有产品的 System Prompt 都遵循"先提问、再执行"的行为约束：

**Claude for Excel 示例**
```markdown
对于复杂任务（构建模型、金融分析），必须询问缺失信息：
- "帮我建 DCF 模型" → 询问：公司？时间跨度？折现率假设？
- "分析这些数据" → 询问：您想寻找什么具体洞察？
```

**里程碑确认机制**
- 完成主要阶段后暂停确认
- 不一次性构建整个模型
- 展示中间输出并询问是否继续

### 2. 格式标准化嵌入

财务格式规范直接嵌入 Prompt：

| 元素 | 格式 |
|------|------|
| 蓝色文字（#0000FF） | 硬编码输入/假设 |
| 黑色文字（#000000） | 所有公式和计算 |
| 绿色文字（#008000） | 跨 Sheet 链接 |
| 负数 | 括号表示：(123) 而非 -123 |
| 货币 | `$#,##0` 单位在表头 |
| 百分比 | `0.0%` 格式 |

### 3. 数据来源限制

**极强的来源控制约束（金融数据）**
```markdown
必须仅使用官方来源（SEC EDGAR、公司 IR 页面、官方新闻稿）
绝不使用第三方网站（Seeking Alpha、Yahoo Finance 等）
未经用户明确确认前
```

### 4. 技术细节在 Prompt 中的密度

PowerPoint System Prompt 包含密集的 OOXML 技术细节：
- 精确的命名空间前缀（`a:`、`p:`、`r:`）
- 完整的 XML 示例模板
- 明确的操作限制（"永远不要使用字符串拼接构建 XML"）

这种密度在传统软件文档中少见，体现了 Prompt 作为"API 文档给 LLM"的新范式。

### 5. Shortcut 模块化 Prompt 架构

与其他产品的单体 Prompt 不同，Shortcut 采用模块化设计：
- 核心规则：LangGraph config 注入
- API 文档：按需通过 `getAPIInfo()` 获取
- 技能：独立 SKILL.md 文件按需加载
- 记忆：用户偏好存储在独立文件

这是一种更可扩展的 Prompt 架构，适合功能复杂的产品。

---

## 结论与洞察

### 1. AI 办公产品的核心设计原则

通过对四款产品的逆向分析，提炼出以下核心设计原则：

**安全第一**
- 用户数据永不离开本地（通过 RPC 间接访问）
- 多层沙盒隔离
- 审计日志强制要求

**用户控制权**
- 关键操作前征求确认
- 长任务分阶段执行并确认
- 破坏性操作有额外保护（覆盖确认）

**专业化 Prompt**
- 领域专家级别的格式规范嵌入 Prompt
- 明确的数据来源限制
- 错误处理指导内嵌于规则

### 2. 技术创新点

| 创新点 | 产品 | 描述 |
|--------|------|------|
| PTC（程序化工具调用） | Claude for Excel | 2025-09 内部 beta，比公开版早 2 个月 |
| 文件 IPC in gVisor | Claude for Excel | 用文件轮询替代网络调用，实现沙盒安全 |
| 动态工具展开 | Manus | 初始精简工具集，按需展开降低噪声 |
| 隐藏函数模式 | Shortcut | API 文档按需拉取，减少 Prompt 污染 |
| OOXML 直接操作 | Claude for PowerPoint | 精确控制演示文稿格式，绕过 Office.js 限制 |

### 3. 市场定位差异化

- **Claude for Excel/PowerPoint**：深度 Office 生态集成，企业金融用户为主要目标
- **Manus**：通用 Agent 平台，代码/数据/多媒体全能型
- **Shortcut**：云端表格，强调 LangGraph 状态机和 SpreadJS 技术栈

### 4. 共同技术债务

- 所有产品依赖 Claude Opus 4.5，成本较高
- 复杂的 OOXML 操作仍需大量 Prompt 工程维护
- 金融专业化功能需持续更新（如新的数据提供商集成）
