import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { isValidUrl, getFaviconUrl } from '../utils/favicon';
import './AddLinkModal.css';

export default function AddLinkModal({ isOpen, onClose, onSave, categoryName }) {
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleUrlChange = (value) => {
    setLinkUrl(value);
    setError('');
    
    // Add https:// if missing
    let url = value.trim();
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    if (url && isValidUrl(url)) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!linkName.trim()) {
      setError('Please enter a link name');
      return;
    }
    
    if (!linkUrl.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    // Add https:// if missing
    let url = linkUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }
    
    onSave({
      name: linkName.trim(),
      url: url
    });
    
    handleClose();
  };

  const handleClose = () => {
    setLinkName('');
    setLinkUrl('');
    setError('');
    setPreviewUrl('');
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
                <h2>Add Link</h2>
                <p className="modal-subtitle">to "{categoryName}"</p>
              </div>
              <button onClick={handleClose} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="link-name">
                  <LinkIcon size={16} />
                  Link Name
                </label>
                <input
                  id="link-name"
                  type="text"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="e.g., GitHub, Twitter, My Portfolio"
                  maxLength={50}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="link-url">
                  <ExternalLink size={16} />
                  URL
                </label>
                <input
                  id="link-url"
                  type="text"
                  value={linkUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="e.g., github.com or https://github.com"
                />
                {previewUrl && (
                  <div className="url-preview">
                    <img 
                      src={getFaviconUrl(previewUrl)} 
                      alt="Favicon preview"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <span>{previewUrl}</span>
                  </div>
                )}
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
                  Add Link
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
