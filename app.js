// Main Application Script for Ultraviolet Proxy
class UltravioletApp {
    constructor() {
        this.version = '2.0.0';
        this.initialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize core components
            await this.initializeComponents();
            
            // Setup service worker
            await this.setupServiceWorker();
            
            // Load saved state
            await this.loadSavedState();
            
            // Setup event listeners
            this.setupGlobalEventListeners();
            
            // Handle URL parameters
            this.handleUrlParameters();
            
            // Initialize complete
            this.onInitializationComplete();
            
        } catch (error) {
            console.error('Failed to initialize Ultraviolet:', error);
            this.showError('Failed to initialize application');
        }
    }
    
    showLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="logo">
                    <i class="fas fa-shield-alt"></i>
                    <h1>Ultraviolet Proxy</h1>
                </div>
                <div class="spinner"></div>
                <p>Initializing secure proxy...</p>
            </div>
        `;
        
        // Add loading screen styles
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .loading-content {
                text-align: center;
            }
            .loading-content .logo {
                margin-bottom: 2rem;
            }
            .loading-content .logo i {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .loading-content h1 {
                font-size: 2rem;
                margin-bottom: 1rem;
            }
            .loading-content .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 2rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loadingScreen);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    }
    
    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    async initializeComponents() {
        // Check for required dependencies
        this.checkDependencies();
        
        // Initialize storage (already done in storage.js)
        console.log('Storage initialized');
        
        // Check proxy configuration
        this.validateProxyConfig();
        
        // Setup error handling
        this.setupErrorHandling();
        
        // Initialize theme
        uiManager.applyTheme();
        
        // Setup offline detection
        this.setupOfflineDetection();
        
        // Initialize performance monitoring
        this.setupPerformanceMonitoring();
    }
    
    checkDependencies() {
        // Check for required APIs
        if (!window.localStorage) {
            throw new Error('localStorage is not available');
        }
        
        if (!window.fetch) {
            throw new Error('Fetch API is not available');
        }
        
        // Check for service worker support
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker not supported');
        }
        
        // Check for required permissions
        if ('permissions' in navigator) {
            navigator.permissions.query({name: 'notifications'}).then(result => {
                console.log('Notification permission:', result.state);
            });
        }
    }
    
    validateProxyConfig() {
        const transport = storage.getSettings().transport;
        if (!CONFIG.proxy.endpoints[transport]) {
            console.warn(`Invalid transport: ${transport}, falling back to epoxy`);
            storage.saveSettings({ transport: 'epoxy' });
        }
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Register service worker for caching and offline functionality
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.warn('Service Worker registration failed:', error);
                });
        }
    }
    
    async loadSavedState() {
        try {
            // Load user preferences
            const settings = storage.getSettings();
            
            // Apply saved theme
            if (settings.theme) {
                document.getElementById('themeSelect').value = settings.theme;
            }
            
            // Apply homepage preference
            if (settings.homepage) {
                document.getElementById('homepageSelect').value = settings.homepage;
            }
            
            // Apply other settings
            document.getElementById('blockAds').checked = settings.blockAds;
            document.getElementById('blockTrackers').checked = settings.blockTrackers;
            document.getElementById('enableJavaScript').checked = settings.enableJavaScript;
            document.getElementById('transportSelect').value = settings.transport;
            document.getElementById('useHttps').checked = settings.useHttps;
            
        } catch (error) {
            console.error('Failed to load saved state:', error);
        }
    }
    
    setupGlobalEventListeners() {
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.onTabVisible();
            } else {
                this.onTabHidden();
            }
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.onOnline();
        });
        
        window.addEventListener('offline', () => {
            this.onOffline();
        });
        
        // Handle beforeunload
        window.addEventListener('beforeunload', (e) => {
            this.onBeforeUnload(e);
        });
        
        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.onWindowResize();
        }, 250));
        
        // Handle unhandled errors
        window.addEventListener('error', (e) => {
            this.handleError(e.error);
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason);
        });
    }
    
    handleUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Handle direct URL navigation
        if (urlParams.has('url')) {
            const targetUrl = urlParams.get('url');
            setTimeout(() => {
                proxy.navigate(targetUrl);
            }, 1000);
        }
        
        // Handle search queries
        if (urlParams.has('q')) {
            const query = urlParams.get('q');
            setTimeout(() => {
                proxy.navigate(query);
            }, 1000);
        }
        
        // Handle theme parameter
        if (urlParams.has('theme')) {
            const theme = urlParams.get('theme');
            if (['light', 'dark', 'auto'].includes(theme)) {
                storage.saveSettings({ theme });
                uiManager.applyTheme();
            }
        }
    }
    
    onInitializationComplete() {
        this.initialized = true;
        
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Show welcome message
        setTimeout(() => {
            uiManager.showToast(`Welcome to Ultraviolet Proxy v${this.version}`, 'success');
        }, 1000);
        
        // Load initial content
        const settings = storage.getSettings();
        if (settings.homepage === 'blank') {
            // Stay on blank page
        } else {
            proxy.loadHomepage();
        }
        
        // Setup periodic cleanup
        this.setupPeriodicCleanup();
        
        console.log(`Ultraviolet Proxy v${this.version} initialized successfully`);
    }
    
    setupErrorHandling() {
        // Global error handler
        this.originalErrorHandler = window.onerror;
        window.onerror = (message, source, lineno, colno, error) => {
            this.logError('Global Error', { message, source, lineno, colno, error });
            if (this.originalErrorHandler) {
                return this.originalErrorHandler(message, source, lineno, colno, error);
            }
            return false;
        };
    }
    
    setupOfflineDetection() {
        // Update UI based on online status
        if (!navigator.onLine) {
            this.onOffline();
        }
    }
    
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        });
    }
    
    setupPeriodicCleanup() {
        // Perform cleanup every 5 minutes
        setInterval(() => {
            storage.cleanup();
        }, 5 * 60 * 1000);
    }
    
    // Event handlers
    onTabVisible() {
        // Resume any paused operations
        console.log('Tab became visible');
    }
    
    onTabHidden() {
        // Pause any resource-intensive operations
        console.log('Tab became hidden');
    }
    
    onOnline() {
        uiManager.showToast('Connection restored', 'success');
        document.body.classList.remove('offline');
    }
    
    onOffline() {
        uiManager.showToast('You are offline', 'warning');
        document.body.classList.add('offline');
    }
    
    onBeforeUnload(e) {
        // Save any pending data
        this.savePendingData();
        
        // Optional: warn about unsaved changes
        // e.preventDefault();
        // e.returnValue = '';
    }
    
    onWindowResize() {
        // Handle responsive layout changes
        this.handleResponsiveLayout();
    }
    
    handleResponsiveLayout() {
        const isMobile = window.innerWidth <= 768;
        const sidebar = document.getElementById('sidebar');
        const settingsPanel = document.getElementById('settingsPanel');
        
        if (isMobile) {
            // Adjust for mobile layout
            sidebar.style.width = '100%';
            settingsPanel.style.width = '100%';
        } else {
            // Reset to desktop layout
            sidebar.style.width = '';
            settingsPanel.style.width = '';
        }
    }
    
    savePendingData() {
        // Save any pending changes to storage
        try {
            // Force save any pending data
            const data = {
                lastActivity: Date.now(),
                version: this.version
            };
            localStorage.setItem('uv_app_state', JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save pending data:', error);
        }
    }
    
    handleError(error) {
        console.error('Application error:', error);
        this.logError('Application Error', { error: error.message, stack: error.stack });
        
        // Show user-friendly error message
        uiManager.showToast('An error occurred. Please refresh the page.', 'error');
    }
    
    logError(type, details) {
        const errorLog = {
            type,
            details,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store error log (could be sent to analytics in production)
        const logs = JSON.parse(localStorage.getItem('uv_error_logs') || '[]');
        logs.push(errorLog);
        
        // Limit log size
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('uv_error_logs', JSON.stringify(logs));
    }
    
    showError(message) {
        const errorContainer = document.createElement('div');
        errorContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #dc3545;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
        `;
        
        errorContainer.innerHTML = `
            <div style="text-align: center; max-width: 500px; padding: 2rem;">
                <h1>Initialization Error</h1>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: white;
                    color: #dc3545;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                    margin-top: 1rem;
                ">Reload Page</button>
            </div>
        `;
        
        document.body.appendChild(errorContainer);
    }
    
    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Public API methods
    getVersion() {
        return this.version;
    }
    
    isInitialized() {
        return this.initialized;
    }
    
    // Debug methods
    getDebugInfo() {
        return {
            version: this.version,
            initialized: this.initialized,
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            storage: {
                localStorage: !!window.localStorage,
                sessionStorage: !!window.sessionStorage,
                indexedDB: !!window.indexedDB
            },
            features: {
                serviceWorker: 'serviceWorker' in navigator,
                webGL: !!window.WebGLRenderingContext,
                webAssembly: typeof WebAssembly === 'object',
                fetch: !!window.fetch
            }
        };
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.uvApp = new UltravioletApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltravioletApp;
}