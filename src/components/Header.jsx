import { Upload, Download, Share2, Palette, Settings } from 'lucide-react';
import './Header.css';

export default function Header({ 
  username, 
  onExport, 
  onImport, 
  onShare, 
  onThemeClick,
  isViewingShared,
  sharedUsername,
  onReturnToOwn
}) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="logo">LinkDock</h1>
          {isViewingShared ? (
            <div className="shared-banner">
              <span>Viewing {sharedUsername}'s LinkDock</span>
              <button onClick={onReturnToOwn} className="return-btn">
                Return to yours
              </button>
            </div>
          ) : (
            <p className="welcome">Welcome back, {username}</p>
          )}
        </div>

        {!isViewingShared && (
          <div className="header-actions">
            <button onClick={onThemeClick} className="icon-btn" title="Themes">
              <Palette size={20} />
            </button>

            <button onClick={onShare} className="icon-btn" title="Share">
              <Share2 size={20} />
            </button>

            <button onClick={onExport} className="icon-btn" title="Export">
              <Download size={20} />
            </button>

            <label className="icon-btn" title="Import">
              <Upload size={20} />
              <input
                type="file"
                accept=".json"
                onChange={onImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        )}
      </div>
    </header>
  );
}
