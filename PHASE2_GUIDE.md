# Phase 2: Building Categories & Links

This guide will help you implement the category and link management features.

## 📋 Components to Build

### 1. Category Component (`src/components/Category.jsx`)

**Purpose**: Displays a single category with its links

**Props**:
```jsx
{
  id: string,
  name: string,
  links: array,
  position: { x, y },
  size: { width, height },
  onRename: function,
  onDelete: function,
  onAddLink: function,
  onDeleteLink: function,
  isLocked: boolean
}
```

**Features**:
- Display category name
- Show all links with favicons
- Double-click to rename
- Add link button
- Delete category button
- Scrollable if overflow
- Empty state placeholder

### 2. Link Component (`src/components/Link.jsx`)

**Purpose**: Displays a single link with favicon

**Props**:
```jsx
{
  name: string,
  url: string,
  favicon: string,
  onDelete: function
}
```

**Features**:
- Show favicon (from `getFaviconUrl` utility)
- Show link name
- Open in new tab on click
- Delete button on hover

### 3. CategoryGrid Component (`src/components/CategoryGrid.jsx`)

**Purpose**: Layout container for all categories

**Props**:
```jsx
{
  categories: array,
  onAddCategory: function,
  onUpdateCategory: function,
  onDeleteCategory: function,
  isLocked: boolean
}
```

**Features**:
- Bento grid layout (CSS Grid or GridStack)
- Add category button
- Responsive layout
- Empty state when no categories

### 4. AddCategoryModal (`src/components/AddCategoryModal.jsx`)

**Purpose**: Modal to create new categories

**Props**:
```jsx
{
  isOpen: boolean,
  onClose: function,
  onSave: function
}
```

**Features**:
- Input for category name
- Cancel/Save buttons
- Validation (non-empty name)

### 5. AddLinkModal (`src/components/AddLinkModal.jsx`)

**Purpose**: Modal to add links to a category

**Props**:
```jsx
{
  isOpen: boolean,
  onClose: function,
  onSave: function,
  categoryId: string
}
```

**Features**:
- Input for link name
- Input for URL
- URL validation
- Cancel/Save buttons
- Preview favicon before saving

## 🔧 Implementation Steps

### Step 1: Update Data Structure

In `App.jsx`, update the category data structure:

```jsx
const categoryExample = {
  id: 'unique-id',
  name: 'Social Media',
  links: [
    {
      id: 'link-id',
      name: 'Twitter',
      url: 'https://twitter.com',
      favicon: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=32'
    }
  ],
  position: { x: 0, y: 0 },
  size: { width: 300, height: 400 },
  order: 0,
  isLocked: false
};
```

### Step 2: Add Category Management Functions

```jsx
// In App.jsx
const handleAddCategory = (name) => {
  const newCategory = {
    id: Date.now().toString(),
    name,
    links: [],
    position: { x: 0, y: 0 },
    size: { width: 300, height: 400 },
    order: categories.length,
    isLocked: false
  };
  setCategories([...categories, newCategory]);
};

const handleRenameCategory = (id, newName) => {
  setCategories(categories.map(cat => 
    cat.id === id ? { ...cat, name: newName } : cat
  ));
};

const handleDeleteCategory = (id) => {
  if (window.confirm('Delete this category?')) {
    setCategories(categories.filter(cat => cat.id !== id));
  }
};

const handleAddLink = (categoryId, linkData) => {
  setCategories(categories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        links: [...cat.links, {
          id: Date.now().toString(),
          ...linkData,
          favicon: getFaviconUrl(linkData.url)
        }]
      };
    }
    return cat;
  }));
};

const handleDeleteLink = (categoryId, linkId) => {
  setCategories(categories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        links: cat.links.filter(link => link.id !== linkId)
      };
    }
    return cat;
  }));
};
```

### Step 3: Build Link Component First

Start with the simplest component:

```jsx
// src/components/Link.jsx
import { ExternalLink, X } from 'lucide-react';
import './Link.css';

export default function Link({ name, url, favicon, onDelete }) {
  return (
    <div className="link-item">
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="link-content"
      >
        <img 
          src={favicon} 
          alt={name}
          onError={(e) => e.target.src = '/placeholder-icon.png'}
        />
        <span>{name}</span>
        <ExternalLink size={14} className="external-icon" />
      </a>
      <button onClick={onDelete} className="delete-link-btn">
        <X size={14} />
      </button>
    </div>
  );
}
```

### Step 4: Build Category Component

```jsx
// src/components/Category.jsx
import { useState } from 'react';
import { Plus, Trash2, Lock, Unlock } from 'lucide-react';
import Link from './Link';
import './Category.css';

export default function Category({
  id,
  name,
  links,
  onRename,
  onDelete,
  onAddLink,
  onDeleteLink,
  isLocked
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  const handleDoubleClick = () => {
    if (!isLocked) setIsEditing(true);
  };

  const handleSaveRename = () => {
    if (editName.trim()) {
      onRename(id, editName.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="category-card">
      <div className="category-header">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveRename}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveRename()}
            autoFocus
          />
        ) : (
          <h3 onDoubleClick={handleDoubleClick}>{name}</h3>
        )}
        
        <div className="category-actions">
          <button onClick={() => onAddLink(id)}>
            <Plus size={16} />
          </button>
          <button onClick={() => onDelete(id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="category-content">
        {links.length === 0 ? (
          <div className="empty-category">
            <img src="/empty-state.gif" alt="Empty" />
            <p>No links yet</p>
          </div>
        ) : (
          <div className="links-list">
            {links.map(link => (
              <Link
                key={link.id}
                {...link}
                onDelete={() => onDeleteLink(id, link.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 5: Build Modals

Use similar pattern to `ThemePicker.jsx`:
- Overlay with backdrop
- Animated entrance/exit with Framer Motion
- Form inputs
- Cancel/Save buttons

### Step 6: Update App.jsx

Replace the temporary grid with the real `CategoryGrid` component.

## 🎨 Styling Guide

### Category Card
```css
.category-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  max-height: 600px; /* Allows scrolling */
}

.category-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-content {
  flex: 1;
  overflow-y: auto; /* Scrollable */
  padding: var(--spacing-md);
}
```

### Link Item
```css
.link-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.link-item:hover {
  background: var(--color-hover);
}

.link-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  text-decoration: none;
  color: var(--color-text);
}

.link-content img {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
}
```

## 🧪 Testing Checklist

- [ ] Create a new category
- [ ] Rename category by double-clicking
- [ ] Delete category with confirmation
- [ ] Add link with valid URL
- [ ] Link opens in new tab
- [ ] Favicon loads correctly
- [ ] Delete link works
- [ ] Empty state shows when no links
- [ ] Scroll works when many links
- [ ] All data persists after refresh

## 🐛 Edge Cases to Handle

1. **Invalid URLs**: Validate URL format before saving
2. **Duplicate links**: Warn user or prevent duplicates
3. **Long names**: Truncate or wrap text properly
4. **Favicon fails**: Use placeholder icon
5. **Empty category name**: Require non-empty name
6. **Delete confirmation**: Prevent accidental deletions

## 🚀 Next Phase (Phase 3)

After categories and links work:
1. Integrate GridStack.js for drag & drop
2. Add resize handles
3. Implement snap-to-grid
4. Add lock/unlock features
5. Save position and size to localStorage

## 💡 Pro Tips

- **Use unique IDs**: `Date.now()` or UUID library
- **Validate early**: Check data before setState
- **Test with many items**: Ensure performance with 50+ links
- **Mobile responsive**: Test on small screens
- **Keyboard shortcuts**: Add for power users

Good luck building! 🎯
