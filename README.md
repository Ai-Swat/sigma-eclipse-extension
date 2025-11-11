# ⚙️ Sigma Private

AI-powered Chrome extension with intelligent chat, page context awareness, and translation capabilities.

## Features

- 💬 **AI Chat Interface** - ChatGPT-like conversational interface with streaming responses
- 📄 **Page Context Integration** - Analyze and interact with current webpage content
- 🌐 **Translation** - Quick translation with bubble UI and context menu integration
- 📁 **File Processing** - Support for PDF, DOCX, XLSX and other document formats
- 🎤 **Voice Input** - Dictation support for hands-free interaction
- 🖼️ **Image Handling** - Drag & drop images with photo viewer
- 🎨 **Modern UI** - Beautiful, responsive interface with light/dark theme support
- 🌍 **Multi-language** - Localization support with language dropdown
- 💾 **Chat History** - Persistent conversation history with search
- 🔒 **Privacy-Focused** - Your data stays secure

## Tech Stack

- **React 18** - Modern UI library with hooks and Context API
- **TypeScript** - Type-safe development
- **Chrome Extension Manifest V3** - Latest extension API with Side Panel
- **Vite 5** - Lightning fast build tool ⚡
- **CSS Modules** - Scoped styling
- **React Markdown** - Rich text rendering with syntax highlighting
- **PDF.js** - PDF document processing
- **Mammoth.js** - DOCX file handling
- **XLSX** - Excel spreadsheet support
- **React Photo View** - Image gallery and viewer
- **OpenAI SDK** - AI chat integration

## Project Structure

```
sigma-private/
├── manifest.json          # Extension manifest (v3)
├── package.json          # Node dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite bundler config ⚡
├── src/
│   ├── sidepanel/        # Side Panel React UI
│   │   ├── index.tsx     # Entry point
│   │   ├── App.tsx       # Main app component
│   │   ├── sidepanel.html # HTML template
│   │   ├── components/   # React components
│   │   │   ├── Header.tsx
│   │   │   ├── ChatContainer.tsx
│   │   │   ├── ChatHistory.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── MessageInputWrapper.tsx
│   │   │   ├── LanguageDropdown.tsx
│   │   │   ├── PageContextIndicator.tsx
│   │   │   └── new-components/
│   │   │       └── app/  # Advanced UI components
│   │   ├── contexts/     # React contexts
│   │   │   ├── dictateContext.tsx
│   │   │   ├── fileContext.tsx
│   │   │   ├── languageContext.tsx
│   │   │   └── pageContext.tsx
│   │   ├── hooks/        # Custom React hooks
│   │   │   ├── useMessageHandling.ts
│   │   │   └── useSummarization.ts
│   │   ├── locales/      # Internationalization
│   │   │   └── prompts.ts
│   │   ├── store/        # State management
│   │   │   └── settings.ts
│   │   └── styles/       # Global styles
│   ├── components/       # Shared components
│   │   ├── app/          # App-level components
│   │   │   ├── authentication-components/
│   │   │   ├── drag-n-drop-wrapper/
│   │   │   ├── photo-view-item/
│   │   │   └── smart-textarea/
│   │   └── ui/           # Base UI components
│   │       ├── base-button/
│   │       ├── checkbox-toggle/
│   │       ├── loader/
│   │       └── tooltip/
│   ├── background/       # Background service worker
│   │   ├── background.ts
│   │   ├── types.ts
│   │   └── handlers/     # Message handlers
│   │       ├── chat-handler.ts
│   │       ├── context-handler.ts
│   │       ├── menu-handler.ts
│   │       └── translation-handler.ts
│   ├── content/          # Content scripts
│   │   ├── content.ts
│   │   ├── page-context.ts
│   │   └── translation/  # Translation UI
│   │       ├── api.ts
│   │       ├── bubble.ts
│   │       ├── popup.ts
│   │       └── event-handlers.ts
│   ├── contexts/         # Global contexts
│   │   ├── chatContext.tsx
│   │   ├── dictateContext.tsx
│   │   ├── fileContext.tsx
│   │   └── themeContext.tsx
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utility functions
│   │   ├── api.ts
│   │   └── file-text-extractor.ts
│   └── libs/             # Helper libraries
├── public/
│   └── icons/            # Extension icons
└── dist/                 # Build output (generated)
```

## Installation

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```

3. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project
   - Click the extension icon in toolbar to open the side panel

### Development Mode (with auto-rebuild)

```bash
npm run dev
```

This will watch for file changes and automatically rebuild.

## Configuration

### API Setup

To enable AI chat functionality:

1. Click the extension icon
2. Click the settings gear icon (⚙️)
3. Enter your AI API key (OpenAI, Anthropic, etc.)
4. Select your preferred model

### Supported AI Providers

- OpenAI (GPT-4, GPT-3.5-turbo)
- Anthropic Claude
- Custom API endpoints

## Usage

### Chat Mode

1. Click the extension icon in the Chrome toolbar to open the side panel
2. Type your message in the smart textarea (with autocomplete support)
3. Press Enter or click the send button
4. Use voice input by clicking the microphone icon

### File Upload

1. Drag and drop files into the chat area
2. Or click the attach button to select files
3. Supported formats: PDF, DOCX, XLSX, images
4. Files are automatically processed and added to context

### Page Context Mode

1. Navigate to any webpage
2. Open the side panel
3. Click the page context indicator to enable
4. The current page content will be included in your chat context
5. Use "Summarize page" feature for quick webpage analysis

### Translation Mode

**Context Menu Translation:**
1. Select text on any webpage
2. Right-click and choose "Translate with Sigma"
3. Translation appears in a popup overlay

**Inline Translation:**
1. Select text on any webpage
2. A translation bubble will appear
3. Click it for instant translation

## Building for Production

```bash
npm run build
```

The production-ready extension will be in the `dist/` folder.

## Scripts

- `npm run build` - Build for production
- `npm run dev` - Development mode with watch
- `npm run preview` - Preview production build
- `npm run clean` - Clean build artifacts
- `npm run lint` - Lint TypeScript/React code
- `npm run format` - Format code with Prettier

## Permissions

This extension requires the following permissions:

- `activeTab` - Access current tab information
- `tabs` - Manage browser tabs
- `storage` - Store chat history, settings, and file data
- `scripting` - Inject content scripts for translation and page context
- `sidePanel` - Display chat interface in Chrome side panel
- `contextMenus` - Add translation option to right-click menu
- `<all_urls>` - Access page content for context and translation

## Privacy

- All data is stored locally in Chrome's storage
- API keys are stored securely
- No data is sent to third parties except your configured AI provider

## Implemented Features ✅

- ✅ AI API integration (OpenAI SDK)
- ✅ Translation service with bubble UI and context menu
- ✅ Multi-language support with localization
- ✅ Theme customization (light/dark mode)
- ✅ Markdown rendering for AI responses
- ✅ Code syntax highlighting (rehype-highlight)
- ✅ Voice input support (dictation)
- ✅ File upload and processing (PDF, DOCX, XLSX, images)
- ✅ Drag & drop interface
- ✅ Chat history with persistence
- ✅ Page context extraction and summarization
- ✅ Side Panel UI integration

## Features in Development

- [ ] Settings/options page
- [ ] Export/import chat history
- [ ] Keyboard shortcuts configuration
- [ ] Authentication and referral system
- [ ] PWA support (install-pwa-button component exists)

## Recent Updates

### ✅ Side Panel UI (Latest)
- Migrated from popup to Chrome Side Panel API
- Persistent sidebar experience
- Better multi-tasking capabilities
- Improved context awareness

### ✅ File Processing System
- PDF document reading with PDF.js
- DOCX support via Mammoth.js
- Excel spreadsheet processing (XLSX)
- Image upload and preview with drag & drop
- Photo viewer integration (react-photo-view)

### ✅ Advanced Translation Features
- Context menu integration
- Inline translation bubble UI
- Multi-language support
- Translation popup with animations

### ✅ Voice & Input Enhancements
- Voice dictation support
- Smart textarea with autocomplete
- Suggestion system
- Markdown and code rendering

### ✅ State Management & Contexts
- React Context API for global state
- Chat context management
- File context handling
- Theme context (light/dark mode)
- Language context for localization

### ✅ Vite Migration
- Migrated from Webpack to Vite 5
- 10-15x faster build times ⚡
- Instant Hot Module Replacement
- Simpler configuration

## Architecture

### Background Service Worker
The extension uses a persistent background service worker that handles:
- Chat message routing (`chat-handler.ts`)
- Page context extraction (`context-handler.ts`)
- Context menu management (`menu-handler.ts`)
- Translation requests (`translation-handler.ts`)

### Content Scripts
Content scripts inject functionality into web pages:
- Page context extraction (`page-context.ts`)
- Translation UI (bubble, popup, event handlers)
- Text selection monitoring

### Side Panel Application
React-based side panel with:
- Component architecture using CSS Modules
- Context API for state management
- Custom hooks for message handling and summarization
- Smart textarea with autocomplete suggestions
- File upload with drag & drop support

### Component Hierarchy
```
App.tsx
├── Header (with language dropdown)
├── ChatContainer
│   ├── ChatHistory (message list)
│   ├── ChatMessage (individual messages)
│   └── MessageInputWrapper
│       └── SmartTextarea (with voice input)
├── PageContextIndicator
└── DragNDropWrapper
    └── PhotoViewItem (for images)
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

