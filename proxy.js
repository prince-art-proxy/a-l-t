// Ultraviolet Proxy Management
class UltravioletProxy {
    constructor() {
        this.currentTransport = storage.getSettings().transport || 'epoxy';
        this.frame = document.getElementById('browserFrame');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.urlInput = document.getElementById('urlInput');
        
        this.history = [];
        this.historyIndex = -1;
        
        // Detection avoidance
        this.requestCount = 0;
        this.lastRequestTime = 0;
        this.humanDelayEnabled = true;
        this.stealthModeEnabled = true;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateSecurityIndicator();
        
        // Load homepage
        this.loadHomepage();
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('homeBtn').addEventListener('click', () => this.loadHomepage());
        document.getElementById('backBtn').addEventListener('click', () => this.goBack());
        document.getElementById('forwardBtn').addEventListener('click', () => this.goForward());
        document.getElementById('refreshBtn').addEventListener('click', () => this.refresh());
        
        // URL input
        this.urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.navigate(this.urlInput.value);
            }
        });
        
        document.getElementById('goBtn').addEventListener('click', () => {
            this.navigate(this.urlInput.value);
        });
        
        // Frame events
        this.frame.addEventListener('load', () => this.onFrameLoad());
        this.frame.addEventListener('error', () => this.onFrameError());
        
        // Home search
        document.getElementById('homeSearchInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.navigate(e.target.value);
            }
        });
        
        document.getElementById('homeSearchBtn').addEventListener('click', () => {
            const query = document.getElementById('homeSearchInput').value;
            this.navigate(query);
        });
        
        // Quick links
        document.querySelectorAll('.quick-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.dataset.url;
                this.navigate(url);
            });
        });
    }
    
    async navigate(input) {
        if (!input) return;
        
        let url = input.trim();
        
        // Apply human-like delays for stealth
        await this.applyHumanTiming();
        
        // Check if input is a URL or search query
        if (!this.isValidUrl(url)) {
            // Treat as search query
            const settings = storage.getSettings();
            url = CONFIG.searchEngines[settings.searchEngine] + encodeURIComponent(url);
        } else {
            // Normalize URL
            url = this.normalizeUrl(url);
        }
        
        // Force HTTPS if enabled
        const settings = storage.getSettings();
        if (settings.useHttps && url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
        }
        
        // Apply stealth navigation
        url = await this.applyStealthNavigation(url);
        
        // Show loading with random delay
        await this.showLoadingWithDelay();
        
        try {
            // Apply ad/tracker blocking
            if (settings.blockAds || settings.blockTrackers) {
                url = await this.applyFilters(url);
            }
            
            // Create proxied URL with stealth
            const proxiedUrl = this.createProxiedUrl(url);
            
            // Update URL input with delay
            await this.updateUrlInput(this.urlInput, url);
            
            // Navigate with timing variations
            await this.navigateWithStealth(proxiedUrl);
            
            // Update history with stealth
            this.addToHistoryWithStealth(url);
            
        } catch (error) {
            console.error('Navigation error:', error);
            this.showError('Failed to load page');
        }
    }
    
    createProxiedUrl(url) {
        const transport = CONFIG.proxy.endpoints[this.currentTransport];
        if (!transport) {
            throw new Error(`Invalid transport method: ${this.currentTransport}`);
        }
        
        // Create proxied URL based on transport method
        switch (this.currentTransport) {
            case 'epoxy':
                return `${transport.url}?url=${encodeURIComponent(url)}`;
            
            case 'curl':
                return `${transport.url}?q=${encodeURIComponent(url)}`;
            
            case 'bare':
                return `${transport.url}v1/?url=${encodeURIComponent(url)}`;
            
            default:
                throw new Error(`Unsupported transport: ${this.currentTransport}`);
        }
    }
    
    async applyFilters(url) {
        const settings = storage.getSettings();
        let filteredUrl = url;
        
        // Check for ads
        if (settings.blockAds && CONFIG.proxy.adPatterns.some(pattern => url.includes(pattern))) {
            throw new Error('This page contains ads and has been blocked');
        }
        
        // Check for trackers
        if (settings.blockTrackers && CONFIG.proxy.trackerPatterns.some(pattern => url.includes(pattern))) {
            throw new Error('This page contains tracking scripts and has been blocked');
        }
        
        return filteredUrl;
    }
    
    onFrameLoad() {
        this.hideLoading();
        
        try {
            const currentUrl = this.frame.contentWindow.location.href;
            const title = this.frame.contentDocument.title;
            
            // Update history entry
            this.updateHistoryEntry(currentUrl, title);
            
            // Add to recent visits
            storage.addToRecent(currentUrl, title, this.getFaviconUrl(currentUrl));
            
            // Update UI
            this.updateSecurityIndicator();
            this.updateNavigationButtons();
            
        } catch (error) {
            // Cross-origin access denied, which is expected
            console.log('Cross-origin access denied (expected behavior)');
        }
    }
    
    onFrameError() {
        this.hideLoading();
        this.showError('Failed to load page');
    }
    
    showLoading() {
        this.loadingOverlay.style.display = 'flex';
    }
    
    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }
    
    showError(message) {
        // Create error page
        const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background: #f8f9fa;
                        color: #212529;
                    }
                    .error-container {
                        text-align: center;
                        max-width: 500px;
                        padding: 2rem;
                    }
                    .error-icon {
                        font-size: 4rem;
                        color: #dc3545;
                        margin-bottom: 1rem;
                    }
                    .error-title {
                        font-size: 1.5rem;
                        margin-bottom: 1rem;
                        color: #212529;
                    }
                    .error-message {
                        color: #6c757d;
                        margin-bottom: 2rem;
                    }
                    .retry-btn {
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-size: 1rem;
                    }
                    .retry-btn:hover {
                        background: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <h1 class="error-title">Page Load Error</h1>
                    <p class="error-message">${message}</p>
                    <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
                </div>
            </body>
            </html>
        `;
        
        this.frame.srcdoc = errorHtml;
    }
    
    loadHomepage() {
        const settings = storage.getSettings();
        
        // Hide browser frame, show home page
        document.querySelector('.browser-container').style.display = 'none';
        document.getElementById('homePage').classList.add('active');
        
        // Update URL input
        this.urlInput.value = '';
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Load recent visits
        this.loadRecentVisits();
    }
    
    loadRecentVisits() {
        const recent = storage.getRecent();
        const recentList = document.getElementById('recentList');
        
        if (recent.length === 0) {
            recentList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No recent visits</p>';
            return;
        }
        
        recentList.innerHTML = recent.map(item => `
            <div class="recent-item" onclick="proxy.navigate('${item.url}')">
                <img src="${item.favicon}" alt="" class="favicon" onerror="this.style.display='none'">
                <div class="info">
                    <div class="title">${this.escapeHtml(item.title)}</div>
                    <div class="url">${this.escapeHtml(item.url)}</div>
                </div>
            </div>
        `).join('');
    }
    
    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const url = this.history[this.historyIndex];
            this.frame.src = this.createProxiedUrl(url);
        }
    }
    
    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const url = this.history[this.historyIndex];
            this.frame.src = this.createProxiedUrl(url);
        }
    }
    
    refresh() {
        if (this.frame.src) {
            this.frame.src = this.frame.src;
        }
    }
    
    addToHistory(url) {
        // Remove any forward history
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new entry
        this.history.push(url);
        this.historyIndex = this.history.length - 1;
        
        // Limit history length
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }
    
    updateHistoryEntry(url, title) {
        // Update the most recent history entry
        if (this.history.length > 0 && this.history[this.historyIndex] === url) {
            // This would be handled by the storage system
            console.log('Updated history for:', url);
        }
    }
    
    updateNavigationButtons() {
        document.getElementById('backBtn').disabled = this.historyIndex <= 0;
        document.getElementById('forwardBtn').disabled = this.historyIndex >= this.history.length - 1;
    }
    
    updateSecurityIndicator() {
        const icon = document.getElementById('securityIcon');
        const settings = storage.getSettings();
        
        if (settings.useHttps) {
            icon.className = 'fas fa-lock';
            icon.style.color = '#28a745';
        } else {
            icon.className = 'fas fa-unlock';
            icon.style.color = '#ffc107';
        }
    }
    
    // Utility methods
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    }
    
    normalizeUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        return url;
    }
    
    getFaviconUrl(url) {
        try {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
        } catch {
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRjRGNUY2Ii8+CjxwYXRoIGQ9Ik04IDJMMTAgNkg2VjJaIiBmaWxsPSIjOTlBM0FGIi8+Cjwvc3ZnPgo=';
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Transport switching
    setTransport(transport) {
        if (CONFIG.proxy.endpoints[transport]) {
            this.currentTransport = transport;
            storage.saveSettings({ transport });
            
            // Show notification
            this.showToast(`Switched to ${CONFIG.proxy.endpoints[transport].name}`, 'success');
        }
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
    
    // Stealth and Detection Avoidance Methods
    async applyHumanTiming() {
        if (!this.humanDelayEnabled || !CONFIG.detectionAvoidance.humanTiming) return;
        
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const minDelay = CONFIG.detectionAvoidance.humanTiming.minDelay || 100;
        const maxDelay = CONFIG.detectionAvoidance.humanTiming.maxDelay || 3000;
        
        // Add random delay between requests
        if (timeSinceLastRequest < minDelay) {
            const delay = Math.random() * (maxDelay - minDelay) + minDelay;
            await this.delay(delay);
        }
        
        this.lastRequestTime = Date.now();
        this.requestCount++;
    }
    
    async applyStealthNavigation(url) {
        // Add common query parameters to look more natural
        if (!url.includes('?') && Math.random() < 0.3) {
            const params = [
                'utm_source=browser',
                'ref=direct',
                'fbclid=random',
                'gclid=random'
            ];
            const randomParam = params[Math.floor(Math.random() * params.length)];
            url += `?${randomParam}`;
        }
        
        // Add common headers simulation by modifying user agent occasionally
        if (this.requestCount % 10 === 0 && detectionAvoidance.isActive()) {
            detectionAvoidance.rotateUserAgent();
        }
        
        return url;
    }
    
    async showLoadingWithDelay() {
        const delay = CONFIG.detectionAvoidance.humanTiming?.pageLoadDelay || [1000, 5000];
        const randomDelay = Array.isArray(delay) ? 
            Math.random() * (delay[1] - delay[0]) + delay[0] : delay;
        
        this.showLoading();
        
        // Small delay before hiding loading
        await this.delay(randomDelay * 0.1);
    }
    
    async updateUrlInput(input, url) {
        // Simulate typing
        input.value = '';
        const chars = url.split('');
        
        for (let i = 0; i < chars.length; i++) {
            input.value += chars[i];
            
            // Random typing delay
            if (Math.random() < 0.1) {
                const typingDelay = CONFIG.detectionAvoidance.humanTiming?.typingDelay || [50, 200];
                const delay = Array.isArray(typingDelay) ? 
                    Math.random() * (typingDelay[1] - typingDelay[0]) + typingDelay[0] : typingDelay;
                await this.delay(delay);
            }
        }
    }
    
    async navigateWithStealth(url) {
        // Add random delay before navigation
        const clickDelay = CONFIG.detectionAvoidance.humanTiming?.clickDelay || [100, 500];
        const delay = Array.isArray(clickDelay) ? 
            Math.random() * (clickDelay[1] - clickDelay[0]) + clickDelay[0] : clickDelay;
        
        await this.delay(delay);
        
        // Navigate with iframe
        this.frame.src = url;
        
        // Simulate some activity after navigation
        setTimeout(() => {
            this.simulateUserActivity();
        }, Math.random() * 2000 + 1000);
    }
    
    addToHistoryWithStealth(url) {
        // Add history with slight delay
        setTimeout(() => {
            this.addToHistory(url);
        }, Math.random() * 500 + 100);
    }
    
    simulateUserActivity() {
        if (!this.stealthModeEnabled) return;
        
        // Simulate mouse movements
        const simulateMouseMove = () => {
            if (Math.random() < 0.3) { // 30% chance
                const event = new MouseEvent('mousemove', {
                    clientX: Math.random() * window.innerWidth,
                    clientY: Math.random() * window.innerHeight,
                    bubbles: true
                });
                document.dispatchEvent(event);
            }
        };
        
        // Simulate scroll
        const simulateScroll = () => {
            if (Math.random() < 0.2) { // 20% chance
                const deltaY = (Math.random() - 0.5) * 100;
                const event = new WheelEvent('wheel', {
                    deltaY: deltaY,
                    bubbles: true
                });
                window.dispatchEvent(event);
            }
        };
        
        // Simulate keypress (rare)
        const simulateKeypress = () => {
            if (Math.random() < 0.05) { // 5% chance
                const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'];
                const key = keys[Math.floor(Math.random() * keys.length)];
                const event = new KeyboardEvent('keydown', {
                    key: key,
                    bubbles: true
                });
                document.dispatchEvent(event);
            }
        };
        
        // Schedule random activities
        setTimeout(simulateMouseMove, Math.random() * 3000);
        setTimeout(simulateScroll, Math.random() * 5000);
        setTimeout(simulateKeypress, Math.random() * 10000);
    }
    
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Enhanced proxy URL creation with stealth
    createProxiedUrl(url) {
        const transport = CONFIG.proxy.endpoints[this.currentTransport];
        if (!transport) {
            throw new Error(`Invalid transport method: ${this.currentTransport}`);
        }
        
        // Add stealth parameters
        let proxiedUrl;
        switch (this.currentTransport) {
            case 'epoxy':
                proxiedUrl = `${transport.url}?url=${encodeURIComponent(url)}`;
                break;
            case 'curl':
                proxiedUrl = `${transport.url}?q=${encodeURIComponent(url)}`;
                break;
            case 'bare':
                proxiedUrl = `${transport.url}v1/?url=${encodeURIComponent(url)}`;
                break;
            default:
                throw new Error(`Unsupported transport: ${this.currentTransport}`);
        }
        
        // Add stealth parameters occasionally
        if (Math.random() < 0.2) {
            const stealthParams = [
                'mode=native',
                'cookies=true',
                'css=true',
                'js=true'
            ];
            proxiedUrl += `&${stealthParams[Math.floor(Math.random() * stealthParams.length)]}`;
        }
        
        return proxiedUrl;
    }
    
    // Enhanced filter application with stealth
    async applyFilters(url) {
        const settings = storage.getSettings();
        let filteredUrl = url;
        
        // Check for ads with stealth
        if (settings.blockAds && CONFIG.proxy.adPatterns.some(pattern => url.includes(pattern))) {
            // Log blocking quietly
            if (CONFIG.debug.enabled) {
                console.log('Blocked ad URL:', url);
            }
            throw new Error('This page contains ads and has been blocked');
        }
        
        // Check for trackers with stealth
        if (settings.blockTrackers && CONFIG.proxy.trackerPatterns.some(pattern => url.includes(pattern))) {
            // Log blocking quietly
            if (CONFIG.debug.enabled) {
                console.log('Blocked tracker URL:', url);
            }
            throw new Error('This page contains tracking scripts and has been blocked');
        }
        
        // Check for detection scripts
        if (CONFIG.detectionAvoidance.blockedScripts && 
            CONFIG.detectionAvoidance.blockedScripts.some(script => url.includes(script))) {
            if (CONFIG.debug.enabled) {
                console.log('Blocked detection script:', url);
            }
            throw new Error('This page contains detection scripts and has been blocked');
        }
        
        return filteredUrl;
    }
    
    // Get stealth statistics
    getStealthStats() {
        return {
            requestCount: this.requestCount,
            lastRequestTime: this.lastRequestTime,
            humanDelayEnabled: this.humanDelayEnabled,
            stealthModeEnabled: this.stealthModeEnabled,
            detectionAvoidanceActive: detectionAvoidance.isActive(),
            detectionScriptsBlocked: detectionAvoidance.getStats().detectionScriptsBlocked || 0
        };
    }
    
    // Enable/disable stealth features
    enableStealthMode() {
        this.stealthModeEnabled = true;
        this.humanDelayEnabled = true;
        
        if (detectionAvoidance && detectionAvoidance.enable) {
            detectionAvoidance.enable();
        }
        
        this.showToast('Stealth mode enabled', 'success');
    }
    
    disableStealthMode() {
        this.stealthModeEnabled = false;
        this.humanDelayEnabled = false;
        
        this.showToast('Stealth mode disabled', 'warning');
    }
}

// Create global proxy instance
const proxy = new UltravioletProxy();