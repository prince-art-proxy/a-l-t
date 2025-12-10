// Storage Management for Ultraviolet Proxy
class StorageManager {
    constructor() {
        this.keys = {
            bookmarks: 'uv_bookmarks',
            history: 'uv_history',
            settings: 'uv_settings',
            recent: 'uv_recent',
            downloads: 'uv_downloads'
        };
        
        this.maxItems = {
            history: 100,
            recent: 10,
            bookmarks: 200
        };
        
        this.init();
    }
    
    init() {
        // Initialize storage if not exists
        Object.values(this.keys).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            }
        });
    }
    
    // Generic storage methods
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error reading from storage (${key}):`, error);
            return [];
        }
    }
    
    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error writing to storage (${key}):`, error);
            return false;
        }
    }
    
    // Bookmark Management
    getBookmarks() {
        return this.get(this.keys.bookmarks);
    }
    
    addBookmark(url, title, favicon = null) {
        const bookmarks = this.getBookmarks();
        const bookmark = {
            id: this.generateId(),
            url: this.normalizeUrl(url),
            title: title || this.getDomainFromUrl(url),
            favicon: favicon || this.getFaviconUrl(url),
            dateAdded: Date.now()
        };
        
        // Check if bookmark already exists
        const existingIndex = bookmarks.findIndex(b => b.url === bookmark.url);
        if (existingIndex !== -1) {
            bookmarks[existingIndex] = { ...bookmarks[existingIndex], ...bookmark };
        } else {
            bookmarks.unshift(bookmark);
            
            // Limit bookmark count
            if (bookmarks.length > this.maxItems.bookmarks) {
                bookmarks.splice(this.maxItems.bookmarks);
            }
        }
        
        this.set(this.keys.bookmarks, bookmarks);
        return bookmark;
    }
    
    removeBookmark(id) {
        const bookmarks = this.getBookmarks();
        const index = bookmarks.findIndex(b => b.id === id);
        if (index !== -1) {
            bookmarks.splice(index, 1);
            this.set(this.keys.bookmarks, bookmarks);
            return true;
        }
        return false;
    }
    
    isBookmarked(url) {
        const bookmarks = this.getBookmarks();
        return bookmarks.some(b => b.url === this.normalizeUrl(url));
    }
    
    // History Management
    getHistory() {
        return this.get(this.keys.history);
    }
    
    addToHistory(url, title, favicon = null) {
        const history = this.getHistory();
        const entry = {
            id: this.generateId(),
            url: this.normalizeUrl(url),
            title: title || this.getDomainFromUrl(url),
            favicon: favicon || this.getFaviconUrl(url),
            timestamp: Date.now(),
            visitCount: 1
        };
        
        // Check if URL already exists in history
        const existingIndex = history.findIndex(h => h.url === entry.url);
        if (existingIndex !== -1) {
            entry.visitCount = history[existingIndex].visitCount + 1;
            entry.id = history[existingIndex].id;
            history[existingIndex] = entry;
        } else {
            history.unshift(entry);
        }
        
        // Limit history entries
        if (history.length > this.maxItems.history) {
            history.splice(this.maxItems.history);
        }
        
        this.set(this.keys.history, history);
        return entry;
    }
    
    clearHistory() {
        this.set(this.keys.history, []);
    }
    
    // Recent Visits
    getRecent() {
        return this.get(this.keys.recent);
    }
    
    addToRecent(url, title, favicon = null) {
        const recent = this.getRecent();
        const entry = {
            url: this.normalizeUrl(url),
            title: title || this.getDomainFromUrl(url),
            favicon: favicon || this.getFaviconUrl(url),
            timestamp: Date.now()
        };
        
        // Remove if already exists
        const existingIndex = recent.findIndex(r => r.url === entry.url);
        if (existingIndex !== -1) {
            recent.splice(existingIndex, 1);
        }
        
        // Add to beginning
        recent.unshift(entry);
        
        // Limit recent entries
        if (recent.length > this.maxItems.recent) {
            recent.splice(this.maxItems.recent);
        }
        
        this.set(this.keys.recent, recent);
        return entry;
    }
    
    clearRecent() {
        this.set(this.keys.recent, []);
    }
    
    // Settings Management
    getSettings() {
        const defaultSettings = {
            theme: 'auto',
            homepage: 'uv',
            blockAds: true,
            blockTrackers: true,
            enableJavaScript: true,
            transport: 'epoxy',
            useHttps: true,
            searchEngine: 'google',
            stealthMode: true,
            humanTiming: true
        };
        
        const stored = this.get(this.keys.settings);
        return { ...defaultSettings, ...stored };
    }
    
    saveSettings(settings) {
        const current = this.getSettings();
        const updated = { ...current, ...settings };
        this.set(this.keys.settings, updated);
        return updated;
    }
    
    // Downloads Management
    getDownloads() {
        return this.get(this.keys.downloads);
    }
    
    addDownload(download) {
        const downloads = this.getDownloads();
        const entry = {
            id: this.generateId(),
            ...download,
            timestamp: Date.now(),
            status: 'pending'
        };
        
        downloads.unshift(entry);
        this.set(this.keys.downloads, downloads);
        return entry;
    }
    
    updateDownload(id, updates) {
        const downloads = this.getDownloads();
        const index = downloads.findIndex(d => d.id === id);
        if (index !== -1) {
            downloads[index] = { ...downloads[index], ...updates };
            this.set(this.keys.downloads, downloads);
            return downloads[index];
        }
        return null;
    }
    
    // Utility Methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    normalizeUrl(url) {
        if (!url) return '';
        
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // Remove trailing slash
        url = url.replace(/\/$/, '');
        
        return url;
    }
    
    getDomainFromUrl(url) {
        try {
            const urlObj = new URL(this.normalizeUrl(url));
            return urlObj.hostname;
        } catch {
            return url;
        }
    }
    
    getFaviconUrl(url) {
        try {
            const urlObj = new URL(this.normalizeUrl(url));
            return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
        } catch {
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRjRGNUY2Ii8+CjxwYXRoIGQ9Ik04IDJMMTAgNkg2VjJaIiBmaWxsPSIjOTlBM0FGIi8+Cjwvc3ZnPgo=';
        }
    }
    
    // Export/Import functionality
    exportData() {
        const data = {
            bookmarks: this.getBookmarks(),
            history: this.getHistory(),
            settings: this.getSettings(),
            recent: this.getRecent(),
            downloads: this.getDownloads(),
            exportDate: Date.now(),
            version: '2.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ultraviolet-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.bookmarks) this.set(this.keys.bookmarks, data.bookmarks);
                    if (data.history) this.set(this.keys.history, data.history);
                    if (data.settings) this.set(this.keys.settings, data.settings);
                    if (data.recent) this.set(this.keys.recent, data.recent);
                    if (data.downloads) this.set(this.keys.downloads, data.downloads);
                    
                    resolve(data);
                } catch (error) {
                    reject(new Error('Invalid backup file format'));
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
    
    // Cleanup old data
    cleanup() {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        
        // Clean old history
        const history = this.getHistory();
        const cleanedHistory = history.filter(entry => entry.timestamp > thirtyDaysAgo);
        this.set(this.keys.history, cleanedHistory);
        
        // Clean old downloads
        const downloads = this.getDownloads();
        const cleanedDownloads = downloads.filter(download => download.timestamp > thirtyDaysAgo);
        this.set(this.keys.downloads, cleanedDownloads);
    }
}

// Create global instance
const storage = new StorageManager();

// Auto cleanup on initialization
storage.cleanup();