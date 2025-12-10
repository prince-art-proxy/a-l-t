// Ultraviolet Proxy Configuration
const CONFIG = {
    // Proxy Settings
    proxy: {
        // Default transport method
        transport: 'epoxy', // 'epoxy', 'curl', 'bare'
        
        // Transport endpoints
        endpoints: {
            epoxy: {
                url: '/uv/',
                name: 'EpoxyTransport'
            },
            curl: {
                url: '/uv/curl/',
                name: 'CurlTransport'
            },
            bare: {
                url: '/uv/bare/',
                name: 'Bare-Client'
            }
        },
        
        // Force HTTPS
        forceHttps: true,
        
        // Block ads and trackers
        blockAds: true,
        blockTrackers: true,
        
        // Enable JavaScript
        enableJavaScript: true
    },
    
    // UI Settings
    ui: {
        theme: 'auto', // 'light', 'dark', 'auto'
        homepage: 'uv', // 'uv', 'blank', 'google'
        
        // Animation settings
        animations: {
            enabled: true,
            duration: 200
        }
    },
    
    // Search Engines
    searchEngines: {
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        duckduckgo: 'https://duckduckgo.com/?q=',
        yahoo: 'https://search.yahoo.com/search?p='
    },
    
    // Default search engine
    defaultSearchEngine: 'google',
    
    // Quick access sites
    quickAccessSites: [
        {
            name: 'Google',
            url: 'https://www.google.com',
            icon: 'fab fa-google',
            favicon: 'https://www.google.com/favicon.ico'
        },
        {
            name: 'Wikipedia',
            url: 'https://www.wikipedia.org',
            icon: 'fab fa-wikipedia-w',
            favicon: 'https://www.wikipedia.org/favicon.ico'
        },
        {
            name: 'GitHub',
            url: 'https://github.com',
            icon: 'fab fa-github',
            favicon: 'https://github.com/favicon.ico'
        },
        {
            name: 'YouTube',
            url: 'https://www.youtube.com',
            icon: 'fab fa-youtube',
            favicon: 'https://www.youtube.com/favicon.ico'
        },
        {
            name: 'Twitter',
            url: 'https://twitter.com',
            icon: 'fab fa-twitter',
            favicon: 'https://twitter.com/favicon.ico'
        },
        {
            name: 'Reddit',
            url: 'https://www.reddit.com',
            icon: 'fab fa-reddit',
            favicon: 'https://www.reddit.com/favicon.ico'
        }
    ],
    
    // Ad blocking patterns
    adPatterns: [
        // Google AdSense
        'googlesyndication.com',
        'googleadservices.com',
        'doubleclick.net',
        'googletagservices.com',
        
        // Facebook
        'facebook.com/tr',
        
        // Common ad networks
        'adsystem.amazon.com',
        'ads.pubmatic.com',
        'criteo.com',
        'outbrain.com',
        'taboola.com',
        
        // Generic ad patterns
        '/ads/',
        '/ad.',
        '-ad.',
        'banner',
        'sponsor'
    ],
    
    // Tracking patterns
    trackerPatterns: [
        // Google Analytics
        'googletagmanager.com',
        'google-analytics.com',
        'analytics.google.com',
        
        // Facebook
        'connect.facebook.net',
        'facebook.com/tr',
        
        // Hotjar
        'static.hotjar.com',
        
        // Mixpanel
        'cdn.mxpnl.com',
        
        // Generic tracking
        '/analytics/',
        '/track/',
        'tracking',
        'pixel'
    ],
    
    // Security settings
    security: {
        // Content Security Policy
        csp: {
            enabled: true,
            directives: {
                'default-src': ["'self'"],
                'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                'font-src': ["'self'", "https://fonts.gstatic.com"],
                'img-src': ["'self'", "data:", "https:"],
                'connect-src': ["'self'", "https:", "wss:"],
                'frame-src': ["'self'", "https:"]
            }
        },
        
        // HTTPS enforcement
        enforceHttps: true,
        
        // Mixed content blocking
        blockMixedContent: true
    },
    
    // Performance settings
    performance: {
        // Cache settings
        cache: {
            enabled: true,
            ttl: 300000, // 5 minutes
            maxSize: 50 // MB
        },
        
        // Compression
        compression: {
            enabled: true,
            algorithms: ['gzip', 'deflate', 'br']
        }
    },
    
    // Detection avoidance settings
    detectionAvoidance: {
        enabled: true,
        
        // Common detection scripts to block
        blockedScripts: [
            'botdetect',
            'cloudflare',
            'perimeterx',
            'akamai',
            'recaptcha',
            'hcaptcha',
            'analytics',
            'fingerprint',
            'detect',
            'proxy',
            'nowgg',
            'bot',
            'selenium',
            'puppeteer',
            'phantom'
        ],
        
        // User agent strings for rotation
        userAgents: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        ],
        
        // Timing delays to simulate human behavior
        humanTiming: {
            minDelay: 100,
            maxDelay: 3000,
            typingDelay: [50, 200],
            clickDelay: [100, 500],
            scrollDelay: [50, 300],
            pageLoadDelay: [1000, 5000]
        },
        
        // Canvas fingerprinting values to override
        canvasValues: {
            width: 300,
            height: 150,
            random: true,
            noise: true
        },
        
        // WebGL fingerprinting spoofing
        webglSpoof: {
            vendor: 'Google Inc. (Intel)',
            renderer: 'ANGLE (Intel, Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0, D3D11)',
            maxTextureSize: 16384,
            maxVertexAttribs: 16,
            antialias: true,
            extensions: [
                'WEBKIT_WEBGL_depth_texture',
                'WEBKIT_WEBGL_compressed_texture_s3tc',
                'WEBKIT_WEBGL_compressed_texture_etc',
                'WEBKIT_WEBGL_compressed_texture_astc'
            ]
        },
        
        // Timezone spoofing
        timezoneSpoof: {
            enabled: true,
            offset: null,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        
        // Screen fingerprinting
        screenSpoof: {
            enabled: true,
            width: window.screen.width,
            height: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth
        },
        
        // Language spoofing
        languageSpoof: {
            enabled: true,
            language: navigator.language,
            languages: navigator.languages || [navigator.language]
        },
        
        // Remove common proxy indicators
        hideProxyHeaders: {
            enabled: true,
            headers: [
                'x-forwarded-for',
                'x-forwarded-proto',
                'x-real-ip',
                'x-proxy-authorization',
                'via',
                'proxy-authorization'
            ]
        }
    },
    
    // Development settings
    debug: {
        enabled: false,
        logLevel: 'info',
        showDevTools: false
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}