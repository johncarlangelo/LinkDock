# LinkDock 🔗

A beautiful, fully client-side bookmark manager with drag-and-drop categories, custom themes, and sharing capabilities. No backend required!

![LinkDock](https://img.shields.io/badge/React-19.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Features
- **Personal Identity**: Set your username on first visit for personalized welcome messages
- **Smart Categories**: Create, rename, delete, and reorder categories with drag & drop
- **Resizable Layout**: Drag to resize categories with automatic scrollbars for overflow
- **Auto Favicons**: Links automatically fetch and display website favicons
- **Persistent Storage**: Everything saved locally in your browser (localStorage)

### 🎨 Theme System (Monkeytype-Inspired)
- **Default Themes**: Light and Dark mode
- **Custom Themes**: Create unlimited custom themes with:
  - Primary/Secondary colors
  - Background/Surface colors
  - Text colors
  - Real-time preview with CSS variables
- **Color Picker**: Intuitive color wheel + hex input
- **Theme Management**: Save, switch, and delete custom themes

### 📤 Export & Import
- **JSON Export**: Download your entire catalogue as a JSON file
- **Smart Import**: Import with duplicate detection
- **Merge Strategies**: Replace, Skip, or Merge duplicate categories

### 🔗 Sharing
- **One-Click Sharing**: Generate shareable links with encoded catalogue data
- **Read-Only View**: Shared catalogues display owner's username
- **Easy Return**: Switch back to your own LinkDock with one click

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johncarlangelo/LinkDock.git
   cd LinkDock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Drag & Drop**: GridStack.js (planned)
- **Styling**: Vanilla CSS + CSS Variables
- **State Management**: React Hooks + localStorage

## 📁 Project Structure

```
LinkDock/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Main header with actions
│   │   ├── UsernamePrompt.jsx  # First-visit username input
│   │   ├── ThemePicker.jsx     # Theme management panel
│   │   └── *.css               # Component styles
│   ├── hooks/
│   │   └── useLocalStorage.js  # localStorage sync hook
│   ├── utils/
│   │   ├── theme.js            # Theme management
│   │   ├── favicon.js          # Favicon fetching
│   │   ├── share.js            # Share link generation
│   │   └── export.js           # Export/Import logic
│   ├── styles/
│   │   └── globals.css         # Global styles & CSS variables
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # React entry point
├── public/                     # Static assets
├── index.html
├── vite.config.js
└── package.json
```

## 🎯 Roadmap (MVP Features)

### Phase 1: Foundation ✅
- [x] Project setup with React + Vite
- [x] Username prompt on first visit
- [x] Basic theme system (Light/Dark)
- [x] Custom theme creator
- [x] Export/Import functionality
- [x] Share link generation
- [x] localStorage persistence

### Phase 2: Categories & Links (Next)
- [ ] Add/Delete categories
- [ ] Rename categories (double-click)
- [ ] Add links to categories
- [ ] Fetch and display favicons
- [ ] Open links in new tab
- [ ] Empty category placeholders

### Phase 3: Drag & Drop
- [ ] Drag to reorder categories
- [ ] Snap-to-grid behavior
- [ ] Swap on collision
- [ ] Drag constraints
- [ ] Lock position/size options
- [ ] Smooth animations

### Phase 4: Resizing
- [ ] Drag to resize categories
- [ ] Scrollbars for overflow
- [ ] Manual width/height input
- [ ] Maintain aspect ratio option

### Phase 5: Polish
- [ ] Bento grid layout optimization
- [ ] Mobile responsive design
- [ ] Keyboard shortcuts
- [ ] Search functionality
- [ ] Category templates

## 🌐 Deployment

LinkDock is 100% client-side and can be deployed for **free** on:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

## 💾 Data Storage

All data is stored locally in your browser using `localStorage`:
- `linkdock-username`: Your username
- `linkdock-categories`: All categories and links
- `linkdock-current-theme`: Active theme
- `linkdock-custom-themes`: Your custom themes

**Note**: Clearing browser data will erase your LinkDock. Use Export to backup!

## 🔗 Sharing How It Works

1. Your catalogue data is encoded to Base64
2. Encoded data is appended to URL as query parameter
3. Share the generated link with anyone
4. Recipients see a read-only view of your LinkDock
5. No backend or database needed!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

**John Carl Angelo**
- GitHub: [@johncarlangelo](https://github.com/johncarlangelo)

## 🙏 Acknowledgments

- Design inspiration: [Monkeytype](https://monkeytype.com) (theme system)
- Functionality reference: [GridStack.js](https://gridstackjs.com)
- Icons: [Lucide](https://lucide.dev)

---

**Built with ❤️ using React + Vite**

<!-- dont remove or edit after this line -->
*© Hermanos 2026 - For Hermanos. By Hermanos*