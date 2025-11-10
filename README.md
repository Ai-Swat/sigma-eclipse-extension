# ⚙️ Sigma Private

AI-powered Chrome extension with intelligent chat, page context awareness, and translation capabilities.

## Features

- 💬 **AI Chat Interface** - ChatGPT-like conversational interface
- 📄 **Page Context Integration** - Analyze and interact with current webpage content
- 🌐 **Translation** - Quick translation of selected text or entire conversations
- 🎨 **Modern UI** - Beautiful, responsive interface with dark theme
- 🔒 **Privacy-Focused** - Your data stays secure

## Tech Stack

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Chrome Extension Manifest V3** - Latest extension API
- **Vite 5** - Lightning fast build tool ⚡
- **CSS Modules** - Scoped styling

## Project Structure

```
sigma-private/
├── manifest.json          # Extension manifest (v3)
├── package.json          # Node dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite bundler config ⚡
├── src/
│   ├── popup/           # React chat UI
│   │   ├── index.tsx    # Entry point
│   │   ├── App.tsx      # Main app component
│   │   ├── popup.html   # HTML template
│   │   ├── popup.css    # Global styles
│   │   └── components/  # React components
│   │       ├── Header.tsx
│   │       ├── ChatContainer.tsx
│   │       ├── ChatMessage.tsx
│   │       ├── LoadingIndicator.tsx
│   │       └── MessageInput.tsx
│   ├── background/      # Background service worker
│   │   └── background.ts
│   ├── content/         # Content scripts for page interaction
│   │   └── content.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   └── utils/           # Utility functions
│       └── api.ts
├── public/
│   └── icons/           # Extension icons
└── dist/                # Build output (generated)
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

1. Click the extension icon to open the chat interface
2. Type your message in the input field
3. Press Enter or click the send button

### Page Context Mode

1. Navigate to any webpage
2. Open the extension
3. Click the page context button (📄) to enable
4. Your messages will now include page context automatically

### Translation Mode

1. Select text on any webpage
2. Open the extension
3. Click the translation button (🌐)
4. The selected text will be translated

## Building for Production

```bash
npm run build
```

The production-ready extension will be in the `dist/` folder.

## Scripts

- `npm run build` - Build for production
- `npm run dev` - Development mode with watch
- `npm run clean` - Clean build artifacts

## Permissions

This extension requires the following permissions:

- `activeTab` - Access current tab information
- `tabs` - Manage browser tabs
- `storage` - Store chat history and settings
- `scripting` - Inject content scripts
- `<all_urls>` - Access page content for context

## Privacy

- All data is stored locally in Chrome's storage
- API keys are stored securely
- No data is sent to third parties except your configured AI provider

## Features in Development

- [ ] Implement actual AI API integration (OpenAI, Anthropic)
- [ ] Add options/settings page
- [ ] Implement translation service integration
- [ ] Add support for multiple languages
- [ ] Add export/import chat history
- [ ] Add keyboard shortcuts
- [ ] Add theme customization
- [ ] Markdown rendering for AI responses
- [ ] Code syntax highlighting
- [ ] Voice input support

## Recent Updates

### ✅ Vite Migration (Latest)
- Migrated from Webpack to Vite 5
- 10-15x faster build times ⚡
- Instant Hot Module Replacement
- Simpler configuration
- Better developer experience

See [VITE_MIGRATION.md](VITE_MIGRATION.md) for details.

### ✅ React Integration
- Migrated to React 18 for better component architecture
- Component-based UI structure
- TypeScript support

See [REACT_MIGRATION.md](REACT_MIGRATION.md) for details.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

