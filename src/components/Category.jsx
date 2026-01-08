import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from './Link';
import './Category.css';

export default function Category({
  id,
  name,
  links = [],
  onRename,
  onDelete,
  onAddLink,
  onDeleteLink,
  isLocked = false
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  const handleDoubleClick = () => {
    if (!isLocked) {
      setIsEditing(true);
    }
  };

  const handleSaveRename = () => {
    if (editName.trim() && editName.trim() !== name) {
      onRename(id, editName.trim());
    } else {
      setEditName(name); // Reset if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      setEditName(name);
      setIsEditing(false);
    }
  };

  const handleDeleteCategory = () => {
    if (window.confirm(`Delete "${name}" category and all its links?`)) {
      onDelete(id);
    }
  };

  return (
    <motion.div
      className="category-card"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <div className="category-header">
        <div className="category-title-section">
          <GripVertical size={16} className="drag-handle" />
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveRename}
              onKeyDown={handleKeyPress}
              className="category-name-input"
              autoFocus
              maxLength={50}
            />
          ) : (
            <h3 
              onDoubleClick={handleDoubleClick}
              className="category-name"
              title="Double-click to rename"
            >
              {name}
            </h3>
          )}
        </div>
        
        <div className="category-actions">
          <button 
            onClick={() => onAddLink(id)}
            className="action-btn add-btn"
            title="Add link"
          >
            <Plus size={16} />
          </button>
          <button 
            onClick={handleDeleteCategory}
            className="action-btn delete-btn"
            title="Delete category"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="category-content">
        {links.length === 0 ? (
          <div className="empty-category">
            <div className="empty-icon">📦</div>
            <p>No links yet</p>
            <button 
              onClick={() => onAddLink(id)}
              className="empty-add-btn"
            >
              Add your first link
            </button>
          </div>
        ) : (
          <div className="links-list">
            {links.map(link => (
              <Link
                key={link.id}
                id={link.id}
                name={link.name}
                url={link.url}
                onDelete={() => onDeleteLink(id, link.id)}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
