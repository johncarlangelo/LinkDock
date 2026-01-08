import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderPlus } from 'lucide-react';
import './AddCategoryModal.css';

export default function AddCategoryModal({ isOpen, onClose, onSave }) {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      setError('Please enter a category name');
      return;
    }
    
    onSave(categoryName.trim());
    handleClose();
  };

  const handleClose = () => {
    setCategoryName('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Create Category</h2>
                <p className="modal-subtitle">Organize your links</p>
              </div>
              <button onClick={handleClose} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="category-name">
                  <FolderPlus size={16} />
                  Category Name
                </label>
                <input
                  id="category-name"
                  type="text"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., Social Media, Work, Personal"
                  maxLength={50}
                  autoFocus
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={handleClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  Create Category
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
