# 🎨 WebCraft AI — Web Design Agent

> A conversational AI agent specialized in web design and development, powered by Claude Sonnet.

![WebCraft AI](https://img.shields.io/badge/AI-Claude%20Sonnet-6EE7B7?style=flat-square) ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square)

---

## ✨ Features

- **Code generation** — Complete, functional HTML, CSS, JavaScript, and React
- **UI/UX Design** — Color palettes, typography, layouts, and compositions
- **Design systems** — Reusable components and design tokens
- **Animations** — CSS animations, transitions, and micro-interactions
- **Accessibility** — WCAG analysis and improvements
- **Trends** — Up-to-date knowledge of modern web design

## 🚀 Quick start

### Prerequisites

- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

```bash
git clone https://github.com/your-username/webcraft-ai
cd webcraft-ai
npm install
```

### Configuration

```bash
cp .env.example .env
# Edit .env and add your Anthropic API key
```

### Development

```bash
npm run dev
# Open http://localhost:5173
```

### Production build

```bash
npm run build
npm run preview
```

---

## 🗂️ Project structure

```
webcraft-ai/
├── src/
│   ├── App.jsx          # Main agent component
│   └── main.jsx         # Entry point
├── public/
│   └── favicon.svg      # Agent icon
├── docs/
│   └── prompts.md       # Recommended prompts guide
├── .env.example         # Environment variable template
├── vite.config.js       # Vite + API proxy config
├── package.json
└── index.html
```

---

## 💡 Usage examples

| Prompt | Result |
|--------|--------|
| `Design a landing page for a startup` | Full layout with hero, features, and CTA |
| `Create a color palette for a luxury brand` | 5 colors with CSS variables and rationale |
| `Responsive navbar with animations` | Functional HTML/CSS/JS code |
| `Product card component in React` | Component with props, state, and styles |
| `Hero section with animated gradient` | CSS gradient animations + markup |

---

## ⚙️ Environment variables

```env
# .env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

> ⚠️ **Security**: In production, never expose your API key on the client. Use a server proxy (included in `vite.config.js` for development).

---

## 🛠️ Tech stack

- **Frontend**: React 18 + Vite 5
- **AI**: Claude Sonnet 4 (Anthropic)
- **Styles**: Vanilla CSS with custom properties
- **Fonts**: Syne + DM Mono (Google Fonts)
- **Deploy**: Compatible with Vercel, Netlify, Cloudflare Pages

---

## 📖 Prompts guide

See [`docs/prompts.md`](./docs/prompts.md) for a curated collection of optimized prompts.

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'feat: add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © 2025 WebCraft AI
