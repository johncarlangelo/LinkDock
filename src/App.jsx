import { useState, useEffect } from 'react';
import UsernamePrompt from './components/UsernamePrompt';
import Header from './components/Header';
import ThemePicker from './components/ThemePicker';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultThemes, applyTheme, createCustomTheme } from './utils/theme';
import { exportCatalogue, importCatalogue, mergeData, detectDuplicates } from './utils/export';
import { generateShareLink, getSharedCatalogueFromUrl } from './utils/share';
import './styles/globals.css';
import './App.css';

function App() {
  // User data
  const [username, setUsername] = useLocalStorage('linkdock-username', null);
  
  // Categories and links
  const [categories, setCategories] = useLocalStorage('linkdock-categories', []);
  
  // Theme management
  const [currentTheme, setCurrentTheme] = useLocalStorage('linkdock-current-theme', defaultThemes.light);
  const [customThemes, setCustomThemes] = useLocalStorage('linkdock-custom-themes', {});
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  
  // Sharing state
  const [isViewingShared, setIsViewingShared] = useState(false);
  const [sharedData, setSharedData] = useState(null);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Check for shared catalogue in URL
  useEffect(() => {
    const shared = getSharedCatalogueFromUrl();
    if (shared) {
      setIsViewingShared(true);
      setSharedData(shared);
    }
  }, []);

  // Handlers
  const handleUsernameSet = (name) => {
    setUsername(name);
  };

  const handleExport = () => {
    const data = {
      username,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    exportCatalogue(data, username);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await importCatalogue(file);
      
      if (categories.length > 0) {
        const { duplicates, newCategories } = detectDuplicates(categories, data.categories);
        
        if (duplicates.length > 0) {
          const choice = window.confirm(
            `Found ${duplicates.length} duplicate categories. Click OK to merge, Cancel to replace all.`
          );
          const strategy = choice ? 'merge' : 'replace';
          const merged = mergeData(categories, data.categories, strategy);
          setCategories(merged);
        } else {
          setCategories([...categories, ...newCategories]);
        }
      } else {
        setCategories(data.categories);
      }

      alert('Import successful!');
    } catch (error) {
      alert('Failed to import: ' + error.message);
    }

    e.target.value = '';
  };

  const handleShare = () => {
    const data = {
      username,
      categories,
      sharedDate: new Date().toISOString()
    };
    
    const link = generateShareLink(data);
    if (link) {
      navigator.clipboard.writeText(link);
      alert('Share link copied to clipboard!');
    }
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  const handleSaveCustomTheme = (name, colors) => {
    const theme = createCustomTheme(name, colors);
    const newCustomThemes = {
      ...customThemes,
      [name.toLowerCase().replace(/\s+/g, '-')]: theme
    };
    setCustomThemes(newCustomThemes);
    setCurrentTheme(theme);
  };

  const handleDeleteCustomTheme = (themeKey) => {
    const newCustomThemes = { ...customThemes };
    delete newCustomThemes[themeKey];
    setCustomThemes(newCustomThemes);
    
    if (currentTheme.name === customThemes[themeKey].name) {
      setCurrentTheme(defaultThemes.light);
    }
  };

  const handleReturnToOwn = () => {
    setIsViewingShared(false);
    setSharedData(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Show username prompt if no username is set
  if (!username) {
    return <UsernamePrompt onUsernameSet={handleUsernameSet} />;
  }

  const displayCategories = isViewingShared ? sharedData?.categories || [] : categories;
  const displayUsername = isViewingShared ? sharedData?.username : username;

  return (
    <div className="app">
      <Header
        username={displayUsername}
        onExport={handleExport}
        onImport={handleImport}
        onShare={handleShare}
        onThemeClick={() => setIsThemePickerOpen(true)}
        isViewingShared={isViewingShared}
        sharedUsername={sharedData?.username}
        onReturnToOwn={handleReturnToOwn}
      />

      <main className="main-content">
        <div className="categories-grid">
          {displayCategories.length === 0 ? (
            <div className="empty-state">
              <h2>No categories yet</h2>
              <p>Start by adding your first category</p>
            </div>
          ) : (
            <div className="temp-grid">
              {displayCategories.map((category) => (
                <div key={category.id} className="temp-category">
                  <h3>{category.name}</h3>
                  <div className="temp-links">
                    {category.links?.map((link, i) => (
                      <div key={i}>{link.name}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <ThemePicker
        isOpen={isThemePickerOpen}
        onClose={() => setIsThemePickerOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        customThemes={customThemes}
        onSaveCustomTheme={handleSaveCustomTheme}
        onDeleteCustomTheme={handleDeleteCustomTheme}
      />
    </div>
  );
}

export default App;
