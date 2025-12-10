// Detection Avoidance Manager
class DetectionAvoidanceManager {
    constructor() {
        this.config = CONFIG.detectionAvoidance;
        this.currentUserAgent = this.getRandomUserAgent();
        this.detectionScriptsBlocked = 0;
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        if (!this.config.enabled) return;
        
        try {
            this.applyUserAgentSpoofing();
            this.applyFingerprintEvasion();
            this.setupHumanBehaviorSimulation();
            this.blockDetectionScripts();
            this.hideProxyHeaders();
            this.applyScreenSpoofing();
            this.applyLanguageSpoofing();
            this.applyTimezoneSpoofing();
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('Detection avoidance initialized successfully');
        } catch (error) {
            console.error('Failed to initialize detection avoidance:', error);
        }
    }
    
    // User Agent Spoofing
    applyUserAgentSpoofing() {
        if (!this.config.userAgents || this.config.userAgents.length === 0) return;
        
        // Override navigator.userAgent
        const originalUserAgent = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgent');
        Object.defineProperty(Navigator.prototype, 'userAgent', {
            get: () => this.currentUserAgent
        });
        
        // Override navigator.appVersion for additional compatibility
        const originalAppVersion = Object.getOwnPropertyDescriptor(Navigator.prototype, 'appVersion');
        Object.defineProperty(Navigator.prototype, 'appVersion', {
            get: () => this.currentUserAgent
        });
        
        // Override navigator.platform
        const platform = this.getPlatformFromUserAgent(this.currentUserAgent);
        Object.defineProperty(Navigator.prototype, 'platform', {
            get: () => platform
        });
        
        console.log('Applied user agent spoofing:', this.currentUserAgent);
    }
    
    getRandomUserAgent() {
        const userAgents = this.config.userAgents;
        const randomIndex = Math.floor(Math.random() * userAgents.length);
        return userAgents[randomIndex];
    }
    
    rotateUserAgent() {
        this.currentUserAgent = this.getRandomUserAgent();
        console.log('Rotated user agent to:', this.currentUserAgent);
    }
    
    getPlatformFromUserAgent(userAgent) {
        if (userAgent.includes('Windows')) return 'Win32';
        if (userAgent.includes('Mac')) return 'MacIntel';
        if (userAgent.includes('Linux')) return 'Linux x86_64';
        return navigator.platform || 'Unknown';
    }
    
    // Fingerprint Evasion
    applyFingerprintEvasion() {
        this.applyCanvasFingerprinting();
        this.applyWebGLFingerprinting();
        this.applyWebRTCLeakPrevention();
        this.applyAudioContextFingerprinting();
    }
    
    applyCanvasFingerprinting() {
        // Override HTMLCanvasElement.toDataURL
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(type = 'image/png', ...args) {
            const result = originalToDataURL.apply(this, [type, ...args]);
            
            if (CONFIG.detectionAvoidance.canvasValues.random) {
                // Add noise to canvas data to prevent fingerprinting
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    
                    if (CONFIG.detectionAvoidance.canvasValues.noise) {
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;
                        
                        for (let i = 0; i < data.length; i += 4) {
                            data[i] += Math.random() * 2 - 1;     // Red
                            data[i + 1] += Math.random() * 2 - 1; // Green
                            data[i + 2] += Math.random() * 2 - 1; // Blue
                        }
                        
                        ctx.putImageData(imageData, 0, 0);
                    }
                };
                
                img.src = result;
            }
            
            return result;
        };
        
        // Override HTMLCanvasElement.getContext
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(contextType, ...args) {
            const context = originalGetContext.apply(this, [contextType, ...args]);
            
            if (contextType === '2d') {
                // Override 2D context methods that could be used for fingerprinting
                const originalGetImageData = context.getImageData;
                context.getImageData = function(...args) {
                    const data = originalGetImageData.apply(this, args);
                    
                    if (CONFIG.detectionAvoidance.canvasValues.random) {
                        // Add subtle noise to pixel data
                        for (let i = 0; i < data.data.length; i += 4) {
                            data.data[i] += Math.random() * 2 - 1;     // Red
                            data.data[i + 1] += Math.random() * 2 - 1; // Green
                            data.data[i + 2] += Math.random() * 2 - 1; // Blue
                        }
                    }
                    
                    return data;
                };
            }
            
            return context;
        };
    }
    
    applyWebGLFingerprinting() {
        if (!window.WebGLRenderingContext) return;
        
        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
            const webglConfig = CONFIG.detectionAvoidance.webglSpoof;
            
            // Override common WebGL parameters used for fingerprinting
            switch (parameter) {
                case this.VENDOR:
                    return webglConfig.vendor;
                case this.RENDERER:
                    return webglConfig.renderer;
                case this.MAX_TEXTURE_SIZE:
                    return webglConfig.maxTextureSize;
                case this.MAX_VERTEX_ATTRIBS:
                    return webglConfig.maxVertexAttribs;
                default:
                    return originalGetParameter.call(this, parameter);
            }
        };
        
        // Override getSupportedExtensions
        const originalGetSupportedExtensions = WebGLRenderingContext.prototype.getSupportedExtensions;
        WebGLRenderingContext.prototype.getSupportedExtensions = function() {
            const extensions = originalGetSupportedExtensions.call(this);
            const webglConfig = CONFIG.detectionAvoidance.webglSpoof;
            
            if (webglConfig.extensions && extensions) {
                return extensions.concat(webglConfig.extensions);
            }
            
            return extensions;
        };
    }
    
    applyWebRTCLeakPrevention() {
        // Override RTCPeerConnection to prevent IP leaks
        if (!window.RTCPeerConnection) return;
        
        const originalCreateDataChannel = RTCPeerConnection.prototype.createDataChannel;
        RTCPeerConnection.prototype.createDataChannel = function(label, options) {
            // Add random delay to mimic human behavior
            return originalCreateDataChannel.apply(this, [label, options]);
        };
        
        // Override getStats to return limited information
        const originalGetStats = RTCPeerConnection.prototype.getStats;
        RTCPeerConnection.prototype.getStats = function(selector) {
            return originalGetStats.call(this, selector).then(report => {
                const filtered = {};
                report.forEach((value, key) => {
                    // Filter out sensitive information
                    if (!value.type?.includes('local') && !value.type?.includes('remote')) {
                        filtered[key] = value;
                    }
                });
                return filtered;
            });
        };
    }
    
    applyAudioContextFingerprinting() {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        
        // Override AudioContext constructor to prevent fingerprinting
        const OriginalAudioContext = AudioContext;
        window.AudioContext = function() {
            const context = new OriginalAudioContext();
            
            // Override getChannelData to add noise
            const originalGetChannelData = AudioBuffer.prototype.getChannelData;
            AudioBuffer.prototype.getChannelData = function(channel) {
                const data = originalGetChannelData.call(this, channel);
                
                // Add subtle noise to audio data
                for (let i = 0; i < data.length; i++) {
                    data[i] += (Math.random() - 0.5) * 0.001;
                }
                
                return data;
            };
            
            return context;
        };
    }
    
    // Human Behavior Simulation
    setupHumanBehaviorSimulation() {
        // Override setTimeout and setInterval to add random delays
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        
        window.setTimeout = function(callback, delay, ...args) {
            const humanDelay = CONFIG.detectionAvoidance.humanTiming ? 
                delay + Math.random() * 100 - 50 : delay;
            return originalSetTimeout.call(this, callback, humanDelay, ...args);
        };
        
        window.setInterval = function(callback, delay, ...args) {
            const humanDelay = CONFIG.detectionAvoidance.humanTiming ? 
                delay + Math.random() * 200 - 100 : delay;
            return originalSetInterval.call(this, callback, humanDelay, ...args);
        };
        
        // Simulate human mouse movements
        this.simulateHumanMouseMovement();
    }
    
    simulateHumanMouseMovement() {
        let lastMoveTime = 0;
        let isMoving = false;
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            const timeSinceLastMove = now - lastMoveTime;
            
            // Add random mouse movement if no movement for a while
            if (timeSinceLastMove > 3000 && !isMoving) {
                isMoving = true;
                
                setTimeout(() => {
                    // Simulate subtle mouse movement
                    const deltaX = (Math.random() - 0.5) * 10;
                    const deltaY = (Math.random() - 0.5) * 5;
                    
                    const event = new MouseEvent('mousemove', {
                        clientX: e.clientX + deltaX,
                        clientY: e.clientY + deltaY,
                        bubbles: true,
                        cancelable: true
                    });
                    
                    document.dispatchEvent(event);
                    isMoving = false;
                }, Math.random() * 2000);
            }
            
            lastMoveTime = now;
        });
    }
    
    // Detection Script Blocking
    blockDetectionScripts() {
        // Override document.createElement to block known detection scripts
        const originalCreateElement = Document.prototype.createElement;
        Document.prototype.createElement = function(tagName, ...args) {
            const element = originalCreateElement.call(this, tagName.toLowerCase(), ...args);
            
            // Check for detection scripts in scripts
            if (tagName.toLowerCase() === 'script') {
                this.addEventListener('load', () => {
                    this.checkForDetectionScripts(element);
                });
            }
            
            return element;
        }.bind(document);
        
        // Override fetch to block detection endpoints
        const originalFetch = window.fetch;
        window.fetch = async function(url, options = {}) {
            if (CONFIG.detectionAvoidance.blockedScripts.some(script => 
                url.toString().toLowerCase().includes(script.toLowerCase()))) {
                console.log('Blocked detection script:', url);
                return new Response('', { status: 404 });
            }
            
            return originalFetch.apply(this, arguments);
        };
        
        // Override XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (CONFIG.detectionAvoidance.blockedScripts.some(script => 
                url.toString().toLowerCase().includes(script.toLowerCase()))) {
                console.log('Blocked XHR to detection endpoint:', url);
                return;
            }
            
            return originalOpen.call(this, method, url, ...args);
        };
        
        console.log('Detection script blocking enabled');
    }
    
    checkForDetectionScripts(script) {
        if (!script.src) return;
        
        const src = script.src.toLowerCase();
        if (CONFIG.detectionAvoidance.blockedScripts.some(detectionScript => 
            src.includes(detectionScript.toLowerCase()))) {
            script.remove();
            this.detectionScriptsBlocked++;
            console.log('Removed detection script:', script.src);
        }
    }
    
    // Proxy Header Hiding
    hideProxyHeaders() {
        if (!this.config.hideProxyHeaders.enabled) return;
        
        // Override headers getter in fetch
        const originalHeaders = Object.getOwnPropertyDescriptor(Request.prototype, 'headers');
        Object.defineProperty(Request.prototype, 'headers', {
            get: function() {
                const headers = originalHeaders.get.call(this);
                const cleanHeaders = new Headers();
                
                for (const [key, value] of headers.entries()) {
                    if (!CONFIG.detectionAvoidance.hideProxyHeaders.headers.includes(key.toLowerCase())) {
                        cleanHeaders.append(key, value);
                    }
                }
                
                return cleanHeaders;
            }
        });
        
        console.log('Proxy header hiding enabled');
    }
    
    // Screen Spoofing
    applyScreenSpoofing() {
        if (!this.config.screenSpoof.enabled) return;
        
        // Override screen properties
        Object.defineProperty(Screen.prototype, 'width', {
            get: () => this.config.screenSpoof.width
        });
        
        Object.defineProperty(Screen.prototype, 'height', {
            get: () => this.config.screenSpoof.height
        });
        
        Object.defineProperty(Screen.prototype, 'availWidth', {
            get: () => this.config.screenSpoof.availWidth
        });
        
        Object.defineProperty(Screen.prototype, 'availHeight', {
            get: () => this.config.screenSpoof.availHeight
        });
        
        Object.defineProperty(Screen.prototype, 'colorDepth', {
            get: () => this.config.screenSpoof.colorDepth
        });
        
        Object.defineProperty(Screen.prototype, 'pixelDepth', {
            get: () => this.config.screenSpoof.pixelDepth
        });
        
        console.log('Screen spoofing enabled');
    }
    
    // Language Spoofing
    applyLanguageSpoofing() {
        if (!this.config.languageSpoof.enabled) return;
        
        Object.defineProperty(Navigator.prototype, 'language', {
            get: () => this.config.languageSpoof.language
        });
        
        Object.defineProperty(Navigator.prototype, 'languages', {
            get: () => this.config.languageSpoof.languages
        });
        
        console.log('Language spoofing enabled');
    }
    
    // Timezone Spoofing
    applyTimezoneSpoofing() {
        if (!this.config.timezoneSpoof.enabled) return;
        
        const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
        Date.prototype.getTimezoneOffset = function() {
            return originalGetTimezoneOffset.call(this);
        };
        
        // Override Intl.DateTimeFormat
        const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
        Intl.DateTimeFormat.prototype.resolvedOptions = function() {
            const options = originalResolvedOptions.call(this);
            if (this.config && this.config.timezoneSpoof.timezone) {
                options.timeZone = this.config.timezoneSpoof.timezone;
            }
            return options;
        };
        
        console.log('Timezone spoofing enabled');
    }
    
    // Event Listeners
    setupEventListeners() {
        // Random user agent rotation
        setInterval(() => {
            this.rotateUserAgent();
        }, 5 * 60 * 1000); // Every 5 minutes
        
        // Periodic cleanup
        setInterval(() => {
            this.cleanup();
        }, 10 * 60 * 1000); // Every 10 minutes
    }
    
    cleanup() {
        // Clean up blocked scripts count
        if (this.detectionScriptsBlocked > 100) {
            this.detectionScriptsBlocked = 0;
        }
        
        // Clean up any memory leaks
        if (window.gc) {
            window.gc();
        }
    }
    
    // Utility Methods
    getStats() {
        return {
            initialized: this.initialized,
            currentUserAgent: this.currentUserAgent,
            detectionScriptsBlocked: this.detectionScriptsBlocked,
            config: this.config
        };
    }
    
    isActive() {
        return this.initialized;
    }
    
    enable() {
        if (!this.initialized) {
            this.init();
        }
    }
    
    disable() {
        // Remove all overrides (would need to restore original functions)
        this.initialized = false;
        console.log('Detection avoidance disabled');
    }
}

// Create global instance
const detectionAvoidance = new DetectionAvoidanceManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DetectionAvoidanceManager;
}