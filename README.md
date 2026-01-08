# LinkDock

**LinkDock** is a minimalist, customizable bookmark manager built with **React**. Organize links in
resizable categories, theme your interface, share your catalogues, and export/import your
bookmarks—all **without a backend**.  

---

## ✨ Features

### Core Identity
- Set a **username** on first visit.
- Shows personalized greetings and ownership on shared catalogues.

### Categories
- Add, delete, **rename** (click or double-click), **resize**, and **reorder** via drag & drop.
- Scrollable content for categories with many links.
- Lock position or resizing to prevent accidental changes.
- Saved automatically in **localStorage**.

### Links
- Add links under categories.
- **Fetches favicons** automatically.
- Opens links in a new tab.
- Empty categories display a placeholder image.
- Saved in **localStorage**.

### Theme System
- Preset **Light** & **Dark** modes.
- Customizable themes via **color picker & hex input**.
- Real-time updates with **CSS variables**.
- Save multiple themes and persist preference in **localStorage**.
- Smooth transitions using **Framer Motion**.

### Export & Import
- Export catalogue as JSON.
- Import JSON with **duplicate detection** (replace, skip, or merge).

### Sharing
- Share your catalogue via a **read-only link**.
- Displays `"You are now viewing <username>'s LinkDock"`.
- Return to your own catalogue with a dedicated button.

---

## 🛠 Tech Stack

- **Framework:** React  
- **Styling:** Vanilla CSS + CSS Variables  
- **Animations:** Framer Motion  
- **Drag & Drop / Resizing:** GridStack.js + Framer Motion  
- **Theme Picker:** `react-color` (color wheel + hex input)  
- **State Management:** React Hooks + LocalStorage  
- **Favicon Handling:** Google Favicon API  
- **Deployment:** GitHub Pages / Vercel (Free)


### _⚠Work in Progress⚠_
