<p align="center">
  <img src="public/icons/icon-128.png" alt="Sigma Eclipse Logo" width="128" height="128">
</p>

<h1 align="center">Sigma Eclipse Browser Extension</h1>

<p align="center">
  <strong>🌐 AI-Powered Browser Extension for Sigma Browser Ecosystem</strong>
</p>

<p align="center">
  <a href="https://sigmabrowser.com">
    <img src="https://img.shields.io/badge/Sigma-Browser-7C3AED?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Sigma Browser">
  </a>
  <a href="https://github.com/Ai-Swat/sigma-eclipse-llm">
    <img src="https://img.shields.io/badge/Sigma-Eclipse_LLM-10B981?style=for-the-badge&logo=github&logoColor=white" alt="Sigma Eclipse LLM">
  </a>
  <img src="https://img.shields.io/badge/Manifest-V3-3B82F6?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Manifest V3">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-ecosystem">Ecosystem</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-license">License</a>
</p>

---

## 🌟 Overview

**Sigma Eclipse Browser Extension** is a powerful browser extension that brings AI capabilities directly into your browser. It's part of the **Sigma Eclipse** ecosystem and designed to work seamlessly with [Sigma Browser](https://sigmabrowser.com) and [Sigma Eclipse LLM](https://github.com/Ai-Swat/sigma-eclipse-llm) desktop application.

The extension connects to a local AI API running on your machine via Sigma Eclipse LLM, ensuring **complete privacy** — your data never leaves your computer.

## 🔗 Ecosystem

This extension is part of the broader **Sigma** ecosystem:

| Component | Description | Link |
|-----------|-------------|------|
| **Sigma Browser** | AI-first private agentic browser | [sigmabrowser.com](https://sigmabrowser.com) |
| **Sigma Eclipse LLM** | Desktop app for running local LLMs via llama.cpp | [GitHub](https://github.com/Ai-Swat/sigma-eclipse-llm) |
| **Sigma Eclipse Extension** | This browser extension | You are here! |

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Computer                            │
│                                                                 │
│  ┌─────────────────┐         ┌─────────────────────────────┐   │
│  │  Browser        │   API   │  Sigma Eclipse LLM          │   │
│  │  Extension      │◄───────►│  (Local AI Server)          │   │
│  │                 │         │                             │   │
│  │  • Chat UI      │         │  • llama.cpp backend        │   │
│  │  • Translation  │         │  • Local model inference    │   │
│  │  • Summarize    │         │  • No cloud required        │   │
│  └─────────────────┘         └─────────────────────────────┘   │
│                                                                 │
│                    🔒 Everything stays local                    │
└─────────────────────────────────────────────────────────────────┘
```

## ✨ Features

### 💬 AI Chat Interface
- ChatGPT-like conversational interface with streaming responses
- Powered by local LLM through Sigma Eclipse
- Markdown rendering with syntax highlighting
- Persistent chat history with search

### 📄 Page Context Integration
- Analyze and interact with current webpage content
- One-click page summarization
- Smart context extraction

### 🌐 Translation
- Quick translation with elegant bubble UI
- Right-click context menu integration
- Multi-language support

### 📁 File Processing
- **PDF** — Full document parsing with PDF.js
- **DOCX** — Word document support via Mammoth.js
- **XLSX** — Excel spreadsheet processing
- **Images** — Drag & drop with built-in viewer


## 🚀 Installation

### Prerequisites

1. **Sigma Eclipse LLM** must be installed and running on your machine
   - Download from [Sigma Eclipse LLM Releases](https://github.com/Ai-Swat/sigma-eclipse-llm/releases/latest)
   - Follow the setup instructions to run local AI

### Install from Source

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ai-Swat/sigma-eclipse-extension.git
   cd sigma-eclipse-extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```

### Development Mode

```bash
npm run dev
```

This will watch for file changes and automatically rebuild.

## 📖 Usage

### Chat Mode

1. Click the extension icon to open the side panel
2. Type your message in the smart textarea
3. Press Enter or click send
4. Use voice input by clicking the microphone icon

### Page Context

1. Navigate to any webpage
2. Open the side panel
3. Enable page context to include current page in your conversation
4. Use "Summarize" for quick webpage analysis

### Translation

**Context Menu:**
1. Select text on any webpage
2. Right-click → "Translate with Sigma"
3. Translation appears in an overlay

**Inline Bubble:**
1. Select text on any webpage
2. Click the translation bubble that appears
3. Get instant translation

### File Upload

1. Drag and drop files into the chat area
2. Or click the attach button
3. Supported: PDF, DOCX, XLSX, images

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **UI Framework** | React 18 with Hooks & Context API |
| **Language** | TypeScript 5 |
| **Build Tool** | Vite 5 ⚡ |
| **Extension API** | Chrome Manifest V3, Side Panel API |
| **Styling** | CSS Modules |
| **Markdown** | react-markdown + rehype-highlight |
| **PDF Processing** | PDF.js |
| **Document Parsing** | Mammoth.js (DOCX), XLSX |
| **AI Integration** | OpenAI SDK (compatible with local API) |
| **Animations** | Lottie |
| **Tooltips** | Radix UI |

## 📁 Project Structure

```
sigma-eclipse-extension/
├── manifest.json           # Chrome Extension Manifest V3
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── src/
│   ├── sidepanel/          # Side Panel React Application
│   │   ├── App.tsx         # Main app component
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── styles/         # Global styles
│   ├── background/         # Service Worker
│   │   ├── background.ts   # Main background script
│   │   └── handlers/       # Message handlers
│   ├── content/            # Content Scripts
│   │   ├── content.ts      # Main content script
│   │   └── translation/    # Translation UI
│   ├── components/         # Shared components
│   ├── libs/               # Utility libraries
│   └── types/              # TypeScript definitions
├── public/
│   └── icons/              # Extension icons
└── dist/                   # Build output
```

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build for production |
| `npm run dev` | Development mode with watch |
| `npm run preview` | Preview production build |
| `npm run clean` | Clean build artifacts |
| `npm run lint` | Lint TypeScript/React code |
| `npm run format` | Format code with Prettier |

## 🔒 Privacy

- **100% Local Processing** — AI runs on your machine via Sigma Eclipse LLM
- **No Cloud Dependencies** — Your data never leaves your computer
- **No Tracking** — We don't collect any usage data
- **Secure Storage** — Settings stored locally in Chromium's secure storage

## 📋 Permissions

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access current tab information |
| `tabs` | Manage browser tabs |
| `storage` | Store chat history and settings |
| `scripting` | Inject content scripts |
| `sidePanel` | Display chat in Chrome side panel |
| `contextMenus` | Add translation to right-click menu |
| `nativeMessaging` | Communicate with Sigma Eclipse LLM |

## 📄 License

This project is licensed under the **PolyForm Noncommercial License 1.0.0**.

**TL;DR:** Free for personal, educational, and non-commercial use. Contact us for commercial licensing.

See the [LICENSE](LICENSE) file for full details.

## 🙏 Acknowledgments

- [Sigma Browser](https://sigmabrowser.com) — The AI-first private agentic browser
- [Sigma Eclipse LLM](https://github.com/Ai-Swat/sigma-eclipse-llm) — Local LLM runtime
- [llama.cpp](https://github.com/ggerganov/llama.cpp) — The amazing LLM inference engine
- [React](https://react.dev) — UI framework
- [Vite](https://vitejs.dev) — Lightning fast build tool

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://github.com/Ai-Swat">AI SWAT</a></strong>
</p>

<p align="center">
  <a href="#sigma-eclipse-browser-extension">⬆ Back to Top</a>
</p>
