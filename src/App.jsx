import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import UsernamePrompt from './components/UsernamePrompt';
import Header from './components/Header';
import ThemePicker from './components/ThemePicker';
import Category from './components/Category';
import GridLayout from './components/GridLayout';
import SortableCategory from './components/SortableCategory';
import AddCategoryModal from './components/AddCategoryModal';
import AddLinkModal from './components/AddLinkModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultThemes, applyTheme, createCustomTheme } from './utils/theme';
import { exportCatalogue, importCatalogue, mergeData, detectDuplicates } from './utils/export';
import { generateShareLink, getSharedCatalogueFromUrl } from './utils/share';
import { Plus } from 'lucide-react';
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

  // Modal state
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

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

  // Category management
  const handleAddCategory = (name) => {
    const newCategory = {
      id: Date.now().toString(),
      name,
      links: [],
      order: categories.length,
      createdAt: new Date().toISOString()
    };
    setCategories([...categories, newCategory]);
  };

  const handleRenameCategory = (id, newName) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name: newName } : cat
    ));
  };

  const handleReorderCategories = (newCategories) => {
    setCategories(newCategories);
  };

  const handleDeleteCategory = (id, categoryName) => {
    // Show toast with confirmation buttons
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <strong>Delete "{categoryName}"?</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9em', opacity: 0.8 }}>
            This will delete the category and all its links.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            style={{
              padding: '6px 16px',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9em',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setCategories(categories.filter(cat => cat.id !== id));
              toast.dismiss(t.id);
              toast.success(`Deleted "${categoryName}"`);
            }}
            style={{
              padding: '6px 16px',
              border: 'none',
              background: '#ef4444',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9em',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      style: {
        minWidth: '320px',
      },
    });
  };

  // Link management
  const handleAddLink = (categoryId, linkData) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          links: [...(cat.links || []), {
            id: Date.now().toString(),
            ...linkData,
            createdAt: new Date().toISOString()
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

  const handleOpenAddLinkModal = (categoryId) => {
    setActiveCategoryId(categoryId);
    setIsAddLinkModalOpen(true);
  };

  const handleSaveLink = (linkData) => {
    if (activeCategoryId) {
      handleAddLink(activeCategoryId, linkData);
    }
  };

  // Show username prompt if no username is set
  if (!username) {
    return <UsernamePrompt onUsernameSet={handleUsernameSet} />;
  }

  const displayCategories = isViewingShared ? sharedData?.categories || [] : categories;
  const displayUsername = isViewingShared ? sharedData?.username : username;
  const activeCategory = categories.find(cat => cat.id === activeCategoryId);

  return (
    <div className="app">
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: 'white',
            },
          },
        }}
      />
      
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
        {!isViewingShared && (
          <div className="add-category-section">
            <button 
              className="add-category-btn"
              onClick={() => setIsAddCategoryModalOpen(true)}
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>
        )}

        <div className="categories-grid">
          {displayCategories.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚀</div>
              <h2>Welcome to LinkDock!</h2>
              <p>Start by creating your first category</p>
              {!isViewingShared && (
                <button 
                  className="empty-add-btn"
                  onClick={() => setIsAddCategoryModalOpen(true)}
                >
                  <Plus size={20} />
                  Create Category
                </button>
              )}
            </div>
          ) : (
            <GridLayout 
              categories={displayCategories} 
              onReorder={handleReorderCategories}
              onRename={handleRenameCategory}
              onDelete={handleDeleteCategory}
              onAddLink={handleOpenAddLinkModal}
              onDeleteLink={handleDeleteLink}
            >
              {displayCategories.map((category) => (
                <SortableCategory key={category.id} id={category.id}>
                  {({ dragHandleProps }) => (
                    <Category
                      id={category.id}
                      name={category.name}
                      links={category.links || []}
                      onRename={handleRenameCategory}
                      onDelete={handleDeleteCategory}
                      onAddLink={handleOpenAddLinkModal}
                      onDeleteLink={handleDeleteLink}
                      dragHandleProps={dragHandleProps}
                    />
                  )}
                </SortableCategory>
              ))}
            </GridLayout>
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

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSave={handleAddCategory}
      />

      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => {
          setIsAddLinkModalOpen(false);
          setActiveCategoryId(null);
        }}
        onSave={handleSaveLink}
        categoryName={activeCategory?.name || ''}
      />
    </div>
  );
}

export default App;
