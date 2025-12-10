// UI Management for Ultraviolet Proxy
class UIManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.currentTab = 'bookmarks';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.applyTheme();
        this.setupKeyboardShortcuts();
    }
    
    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('bookmarksBtn').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar').addEventListener('click', () => this.closeSidebar());
        
        // Settings toggle
        document.getElementById('settingsBtn').addEventListener('click', () => this.toggleSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Settings changes
        this.setupSettingsListeners();
        
        // Bookmark actions
        this.setupBookmarkActions();
        
        // Close panels when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Escape key handling
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    setupSettingsListeners() {
        // Privacy & Security
        document.getElementById('blockAds').addEventListener('change', (e) => {
            storage.saveSettings({ blockAds: e.target.checked });
            this.showToast(`Ad blocking ${e.target.checked ? 'enabled' : 'disabled'}`, 'success');
        });
        
        document.getElementById('blockTrackers').addEventListener('change', (e) => {
            storage.saveSettings({ blockTrackers: e.target.checked });
            this.showToast(`Tracker blocking ${e.target.checked ? 'enabled' : 'disabled'}`, 'success');
        });
        
        document.getElementById('enableJavaScript').addEventListener('change', (e) => {
            storage.saveSettings({ enableJavaScript: e.target.checked });
            this.showToast(`JavaScript ${e.target.checked ? 'enabled' : 'disabled'}`, 'success');
        });
        
        // Appearance
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            storage.saveSettings({ theme: e.target.value });
            this.applyTheme();
        });
        
        document.getElementById('homepageSelect').addEventListener('change', (e) => {
            storage.saveSettings({ homepage: e.target.value });
        });
        
        // Proxy Settings
        document.getElementById('transportSelect').addEventListener('change', (e) => {
            proxy.setTransport(e.target.value);
        });
        
        document.getElementById('useHttps').addEventListener('change', (e) => {
            storage.saveSettings({ useHttps: e.target.checked });
            proxy.updateSecurityIndicator();
        });
        
        // Stealth Mode Settings
        document.getElementById('stealthMode').addEventListener('change', (e) => {
            storage.saveSettings({ stealthMode: e.target.checked });
            if (e.target.checked) {
                proxy.enableStealthMode();
            } else {
                proxy.disableStealthMode();
            }
        });
        
        document.getElementById('humanTiming').addEventListener('change', (e) => {
            storage.saveSettings({ humanTiming: e.target.checked });
            proxy.humanDelayEnabled = e.target.checked;
            this.showToast(`Human-like timing ${e.target.checked ? 'enabled' : 'disabled'}`, 'success');
        });
    }
    
    setupBookmarkActions() {
        // Bookmark current page (when user adds via browser interface)
        this.setupBookmarkFromContextMenu();
    }
    
    setupBookmarkFromContextMenu() {
        // Add bookmark functionality for the current page
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.addCurrentPageBookmark();
            }
        });
    }
    
    addCurrentPageBookmark() {
        const currentUrl = proxy.urlInput.value;
        const currentTitle = document.title;
        
        if (currentUrl) {
            storage.addBookmark(currentUrl, currentTitle);
            this.showToast('Page bookmarked!', 'success');
            this.loadBookmarks();
        }
    }
    
    toggleSidebar() {
        if (this.sidebar.classList.contains('open')) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
    
    openSidebar() {
        this.sidebar.classList.add('open');
        this.loadBookmarks();
        this.loadHistory();
    }
    
    closeSidebar() {
        this.sidebar.classList.remove('open');
    }
    
    toggleSettings() {
        if (this.settingsPanel.classList.contains('open')) {
            this.closeSettings();
        } else {
            this.openSettings();
        }
    }
    
    openSettings() {
        this.settingsPanel.classList.add('open');
        this.loadCurrentSettings();
    }
    
    closeSettings() {
        this.settingsPanel.classList.remove('open');
    }
    
    switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}Tab`).classList.add('active');
        
        this.currentTab = tab;
    }
    
    loadBookmarks() {
        const bookmarks = storage.getBookmarks();
        const bookmarkList = document.getElementById('bookmarkList');
        
        if (bookmarks.length === 0) {
            bookmarkList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No bookmarks yet</p>';
            return;
        }
        
        bookmarkList.innerHTML = bookmarks.map(bookmark => `
            <div class="bookmark-item" data-id="${bookmark.id}">
                <img src="${bookmark.favicon}" alt="" class="favicon" onerror="this.style.display='none'">
                <div class="info">
                    <div class="title">${this.escapeHtml(bookmark.title)}</div>
                    <div class="url">${this.escapeHtml(bookmark.url)}</div>
                </div>
                <div class="actions">
                    <button class="action-icon" onclick="uiManager.openBookmark('${bookmark.url}')" title="Open">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="action-icon" onclick="uiManager.removeBookmark('${bookmark.id}')" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add click handlers for bookmark navigation
        document.querySelectorAll('.bookmark-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.actions')) {
                    const bookmark = bookmarks.find(b => b.id === item.dataset.id);
                    if (bookmark) {
                        proxy.navigate(bookmark.url);
                        this.closeSidebar();
                    }
                }
            });
        });
    }
    
    loadHistory() {
        const history = storage.getHistory();
        const historyList = document.getElementById('historyList');
        
        if (history.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No history yet</p>';
            return;
        }
        
        historyList.innerHTML = history.slice(0, 50).map(entry => `
            <div class="history-item" data-url="${entry.url}">
                <img src="${entry.favicon}" alt="" class="favicon" onerror="this.style.display='none'">
                <div class="info">
                    <div class="title">${this.escapeHtml(entry.title)}</div>
                    <div class="url">${this.escapeHtml(entry.url)}</div>
                </div>
                <div class="actions">
                    <button class="action-icon" onclick="uiManager.openHistory('${entry.url}')" title="Open">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add click handlers for history navigation
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.actions')) {
                    proxy.navigate(item.dataset.url);
                    this.closeSidebar();
                }
            });
        });
    }
    
    openBookmark(url) {
        proxy.navigate(url);
        this.closeSidebar();
    }
    
    removeBookmark(id) {
        if (storage.removeBookmark(id)) {
            this.loadBookmarks();
            this.showToast('Bookmark removed', 'success');
        }
    }
    
    openHistory(url) {
        proxy.navigate(url);
        this.closeSidebar();
    }
    
    loadSettings() {
        const settings = storage.getSettings();
        
        // Apply settings to UI
        document.getElementById('themeSelect').value = settings.theme;
        document.getElementById('homepageSelect').value = settings.homepage;
        document.getElementById('blockAds').checked = settings.blockAds;
        document.getElementById('blockTrackers').checked = settings.blockTrackers;
        document.getElementById('enableJavaScript').checked = settings.enableJavaScript;
        document.getElementById('transportSelect').value = settings.transport;
        document.getElementById('useHttps').checked = settings.useHttps;
        
        // Apply stealth mode settings
        document.getElementById('stealthMode').checked = settings.stealthMode !== false; // Default to true
        document.getElementById('humanTiming').checked = settings.humanTiming !== false; // Default to true
        
        // Initialize stealth mode if enabled
        if (settings.stealthMode !== false) {
            proxy.enableStealthMode();
        }
        
        proxy.humanDelayEnabled = settings.humanTiming !== false;
    }
    
    loadCurrentSettings() {
        this.loadSettings();
    }
    
    applyTheme() {
        const settings = storage.getSettings();
        let theme = settings.theme;
        
        // Auto theme detection
        if (theme === 'auto') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (storage.getSettings().theme === 'auto') {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+L or Cmd+L: Focus URL bar
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                document.getElementById('urlInput').focus();
                document.getElementById('urlInput').select();
            }
            
            // Ctrl+T or Cmd+T: New tab (go to home)
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                proxy.loadHomepage();
            }
            
            // Ctrl+R or Cmd+R: Refresh
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                proxy.refresh();
            }
            
            // Ctrl+W or Cmd+W: Close tab (go to home)
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                e.preventDefault();
                proxy.loadHomepage();
            }
            
            // F11: Toggle fullscreen
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
            
            // Escape: Close panels
            if (e.key === 'Escape') {
                this.closeSidebar();
                this.closeSettings();
            }
        });
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    handleOutsideClick(e) {
        // Close sidebar if clicking outside
        if (this.sidebar.classList.contains('open') && 
            !this.sidebar.contains(e.target) && 
            !document.getElementById('bookmarksBtn').contains(e.target)) {
            this.closeSidebar();
        }
        
        // Close settings if clicking outside
        if (this.settingsPanel.classList.contains('open') && 
            !this.settingsPanel.contains(e.target) && 
            !document.getElementById('settingsBtn').contains(e.target)) {
            this.closeSettings();
        }
    }
    
    handleKeydown(e) {
        // Handle escape key for closing panels
        if (e.key === 'Escape') {
            this.closeSidebar();
            this.closeSettings();
        }
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas ${this.getToastIcon(type)}"></i>
                <span>${this.escapeHtml(message)}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }
    
    getToastIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Export/Import functionality
    showExportDialog() {
        const modal = this.createModal('Export Data', `
            <p>Export your bookmarks, history, and settings to a file.</p>
            <div style="margin-top: 1rem;">
                <button onclick="storage.exportData(); uiManager.closeModal();" class="btn-primary">
                    <i class="fas fa-download"></i> Export Data
                </button>
            </div>
        `);
        document.body.appendChild(modal);
    }
    
    showImportDialog() {
        const modal = this.createModal('Import Data', `
            <p>Import data from a previously exported backup file.</p>
            <div style="margin-top: 1rem;">
                <input type="file" id="importFile" accept=".json" style="margin-bottom: 1rem;">
                <button onclick="uiManager.importData();" class="btn-primary">
                    <i class="fas fa-upload"></i> Import Data
                </button>
            </div>
        `);
        document.body.appendChild(modal);
    }
    
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button onclick="uiManager.closeModal()" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        return modal;
    }
    
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
    
    importData() {
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showToast('Please select a file to import', 'error');
            return;
        }
        
        storage.importData(file)
            .then(() => {
                this.showToast('Data imported successfully!', 'success');
                this.closeModal();
                this.loadBookmarks();
                this.loadHistory();
            })
            .catch((error) => {
                this.showToast('Failed to import data: ' + error.message, 'error');
            });
    }
}

// Create global UI manager instance
const uiManager = new UIManager();