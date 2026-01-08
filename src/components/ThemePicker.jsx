import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, Trash2, Edit2 } from 'lucide-react';
import { defaultThemes, applyTheme } from '../utils/theme';
import './ThemePicker.css';

export default function ThemePicker({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onThemeChange,
  customThemes,
  onSaveCustomTheme,
  onDeleteCustomTheme
}) {
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [editingThemeKey, setEditingThemeKey] = useState(null);
  const [customName, setCustomName] = useState('');
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f3f4f6',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    hover: '#f9fafb',
  });
  const [previewTheme, setPreviewTheme] = useState(null);

  // Apply live preview when colors change
  useEffect(() => {
    if ((isCreatingCustom || isEditingCustom) && previewTheme) {
      applyTheme(previewTheme);
    }
  }, [customColors, isCreatingCustom, isEditingCustom, previewTheme]);

  // Update preview theme when colors change
  useEffect(() => {
    if (isCreatingCustom || isEditingCustom) {
      setPreviewTheme({
        name: customName || 'Preview',
        colors: customColors
      });
    }
  }, [customColors, customName, isCreatingCustom, isEditingCustom]);

  // Restore original theme when closing without saving
  useEffect(() => {
    if (!isCreatingCustom && !isEditingCustom && !isOpen) {
      setPreviewTheme(null);
    }
  }, [isCreatingCustom, isEditingCustom, isOpen]);

  const handleSaveCustom = () => {
    if (customName.trim()) {
      if (isEditingCustom && editingThemeKey) {
        // Delete old theme and save with new name
        onDeleteCustomTheme(editingThemeKey);
      }
      onSaveCustomTheme(customName, customColors);
      setIsCreatingCustom(false);
      setIsEditingCustom(false);
      setEditingThemeKey(null);
      setCustomName('');
      setPreviewTheme(null);
      // Reset to default colors
      setCustomColors({
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: '#ffffff',
        surface: '#f3f4f6',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        hover: '#f9fafb',
      });
    }
  };

  const handleEditTheme = (themeKey, theme) => {
    setIsEditingCustom(true);
    setEditingThemeKey(themeKey);
    setCustomName(theme.name);
    setCustomColors(theme.colors);
    setIsCreatingCustom(false);
  };

  const handleCancelEdit = () => {
    setIsCreatingCustom(false);
    setIsEditingCustom(false);
    setEditingThemeKey(null);
    setCustomName('');
    setPreviewTheme(null);
    // Restore current theme
    applyTheme(currentTheme);
    // Reset colors
    setCustomColors({
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#ffffff',
      surface: '#f3f4f6',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      hover: '#f9fafb',
    });
  };

  const allThemes = {
    ...defaultThemes,
    ...customThemes
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="theme-picker-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="theme-picker-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="theme-picker-header">
              <h2>Themes</h2>
              <button onClick={onClose} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="theme-picker-content">
              {/* Default Themes */}
              <section>
                <h3>Default Themes</h3>
                <div className="theme-list">
                  {Object.entries(defaultThemes).map(([key, theme]) => (
                    <button
                      key={key}
                      className={`theme-card ${currentTheme.name === theme.name ? 'active' : ''}`}
                      onClick={() => onThemeChange(theme)}
                    >
                      <div className="theme-preview">
                        {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                          <div key={i} style={{ background: color }} />
                        ))}
                      </div>
                      <span>{theme.name}</span>
                      {currentTheme.name === theme.name && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Custom Themes */}
              {Object.keys(customThemes).length > 0 && (
                <section>
                  <h3>Custom Themes</h3>
                  <div className="theme-list">
                    {Object.entries(customThemes).map(([key, theme]) => (
                      <div key={key} className="custom-theme-item">
                        <button
                          className={`theme-card ${currentTheme.name === theme.name ? 'active' : ''}`}
                          onClick={() => onThemeChange(theme)}
                        >
                          <div className="theme-preview">
                            {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                              <div key={i} style={{ background: color }} />
                            ))}
                          </div>
                          <span>{theme.name}</span>
                          {currentTheme.name === theme.name && <Check size={16} />}
                        </button>
                        <div className="theme-actions">
                          <button
                            className="edit-theme-btn"
                            onClick={() => handleEditTheme(key, theme)}
                            title="Edit theme"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="delete-theme-btn"
                            onClick={() => onDeleteCustomTheme(key)}
                            title="Delete theme"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Create Custom Theme */}
              {!isCreatingCustom && !isEditingCustom ? (
                <button
                  className="create-theme-btn"
                  onClick={() => setIsCreatingCustom(true)}
                >
                  <Plus size={20} />
                  Create Custom Theme
                </button>
              ) : (
                <section className="create-custom-section">
                  <div className="section-header">
                    <h3>{isEditingCustom ? 'Edit Custom Theme' : 'Create Custom Theme'}</h3>
                    <span className="preview-badge">Live Preview Active</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Theme name..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="theme-name-input"
                  />
                  
                  <div className="color-inputs">
                    {Object.entries(customColors).map(([key, value]) => (
                      <div key={key} className="color-input-group">
                        <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <div className="color-input-wrapper">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => setCustomColors({
                              ...customColors,
                              [key]: e.target.value
                            })}
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => setCustomColors({
                              ...customColors,
                              [key]: e.target.value
                            })}
                            className="hex-input"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="custom-theme-actions">
                    <button onClick={handleCancelEdit}>
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveCustom}
                      disabled={!customName.trim()}
                      className="save-btn"
                    >
                      {isEditingCustom ? 'Update Theme' : 'Save Theme'}
                    </button>
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
