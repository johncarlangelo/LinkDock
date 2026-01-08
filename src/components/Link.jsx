import { ExternalLink, X } from 'lucide-react';
import { getFaviconUrl } from '../utils/favicon';
import './Link.css';

export default function Link({ id, name, url, onDelete }) {
  const faviconUrl = getFaviconUrl(url);

  const handleClick = (e) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="link-item">
      <a 
        href={url}
        onClick={handleClick}
        className="link-content"
        title={url}
      >
        <img 
          src={faviconUrl}
          alt={`${name} icon`}
          className="link-favicon"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>';
          }}
        />
        <span className="link-name">{name}</span>
        <ExternalLink size={14} className="external-icon" />
      </a>
      <button 
        onClick={() => onDelete(id)} 
        className="delete-link-btn"
        title="Delete link"
      >
        <X size={14} />
      </button>
    </div>
  );
}
