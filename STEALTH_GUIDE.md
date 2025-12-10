# Stealth Deployment Guide

## Enhanced Ultraviolet Proxy with Anti-Detection

This enhanced version includes advanced stealth features to avoid detection by platforms like now.gg and other anti-bot systems.

## 🚀 Quick Start

### 1. Start the Server

```bash
# Using Python (Recommended for development)
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

### 2. Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

### 3. Enable Stealth Mode

1. Click the settings icon (⚙️) in the header
2. Go to "Privacy & Security" section
3. Enable "Stealth Mode (Anti-Detection)"
4. Enable "Human-like timing"
5. Save settings

## 🛡️ Stealth Features

### Core Anti-Detection
- **User Agent Rotation**: Automatically rotates between different browser user agents
- **Human-like Timing**: Adds random delays to mimic human behavior
- **Fingerprint Evasion**: Blocks canvas, WebGL, and audio fingerprinting
- **Proxy Header Hiding**: Removes common proxy identification headers
- **Detection Script Blocking**: Actively blocks known bot detection scripts

### Browser Simulation
- **Natural Navigation**: Simulates typing, clicking, and mouse movements
- **Timing Variations**: Random delays between requests
- **Screen/Language Spoofing**: Matches your actual browser environment
- **Request Pattern Variation**: Adds common parameters to look natural

### Detection Avoidance
- **Bot Detection Blocking**: Blocks Cloudflare, reCAPTCHA, and similar services
- **Analytics Evasion**: Prevents tracking and analytics scripts
- **Canvas Fingerprinting**: Adds noise to canvas rendering
- **WebRTC Protection**: Prevents IP leakage through WebRTC

## 🎯 now.gg Specific Features

### Built-in Protection
The proxy includes specific protection against now.gg detection:

```javascript
// Detection scripts specifically blocked for now.gg
blockedScripts: [
    'nowgg',        // Now.gg specific detection
    'botdetect',    // Generic bot detection
    'cloudflare',   // Cloudflare protection
    'recaptcha',    // Google reCAPTCHA
    'hcaptcha',     // hCaptcha
    'analytics',    // Analytics tracking
    'fingerprint',  // Fingerprinting scripts
    // ... and more
]
```

### How to Use with now.gg

1. **Enable Full Stealth Mode**:
   - Go to Settings → Privacy & Security
   - Enable "Stealth Mode (Anti-Detection)"
   - Enable "Human-like timing"
   - Enable "Block tracking scripts"

2. **Navigate to now.gg**:
   - Enter `https://now.gg` in the URL bar
   - Wait for the page to load naturally
   - The proxy will automatically apply stealth features

3. **Stay Stealthy**:
   - Don't click too quickly
   - Let pages load naturally
   - Avoid rapid navigation
   - Use the proxy's built-in timing delays

## ⚙️ Advanced Configuration

### Custom User Agents
You can add custom user agents in `scripts/config.js`:

```javascript
detectionAvoidance: {
    userAgents: [
        // Add your custom user agents here
        'Your Custom User Agent String'
    ]
}
```

### Custom Detection Scripts
Add specific scripts to block:

```javascript
detectionAvoidance: {
    blockedScripts: [
        'your-specific-detection-script',
        // ... other scripts
    ]
}
```

### Timing Adjustments
Fine-tune human-like timing:

```javascript
detectionAvoidance: {
    humanTiming: {
        minDelay: 100,        // Minimum delay between actions
        maxDelay: 3000,       // Maximum delay between actions
        typingDelay: [50, 200], // Typing delay range
        clickDelay: [100, 500], // Click delay range
        pageLoadDelay: [1000, 5000] // Page load delay range
    }
}
```

## 🔧 Troubleshooting

### If now.gg Still Detects You

1. **Clear Browser Cache**:
   - Clear all browser data
   - Restart the browser
   - Try again

2. **Change User Agent**:
   - The proxy automatically rotates user agents
   - You can manually refresh to get a new one

3. **Adjust Timing**:
   - Disable "Human-like timing" temporarily
   - Re-enable it after a few minutes

4. **Use Different Transport**:
   - Try switching between EpoxyTransport, CurlTransport, and Bare-Client
   - Some work better than others for specific sites

### Performance Tips

1. **Disable Heavy Features**:
   - Turn off ad blocking if it's slow
   - Disable some stealth features if needed

2. **Use Appropriate Transport**:
   - EpoxyTransport: Best for most sites
   - CurlTransport: Good alternative
   - Bare-Client: Fastest but less stealthy

3. **Monitor Usage**:
   - Check stealth statistics in browser console
   - Watch for blocked detection scripts

## 📊 Monitoring Stealth Status

### View Stealth Statistics
Open browser console and run:
```javascript
proxy.getStealthStats()
```

This shows:
- Request count
- Detection scripts blocked
- Current stealth mode status
- Human timing enabled status

### Debug Mode
Enable debug logging in `scripts/config.js`:
```javascript
debug: {
    enabled: true,
    logLevel: 'debug'
}
```

## 🔒 Security Notes

### Privacy Protection
- All stealth features work locally
- No data is sent to external servers
- Detection scripts are blocked, not bypassed
- Your browsing remains private

### Legal Considerations
- Use responsibly and legally
- Respect website terms of service
- This tool is for educational/privacy purposes
- Users are responsible for compliance with applicable laws

## 🚀 Production Deployment

### HTTPS Requirement
For production deployment, ensure:
- Valid SSL certificate
- HTTPS-only deployment
- Proper proxy configuration
- Firewall rules configured

### Server Configuration
```bash
# Example nginx configuration
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private-key.pem;
    
    location / {
        root /path/to/ultraviolet-files;
        try_files $uri $uri/ /index.html;
    }
}
```

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all files are properly served
3. Ensure HTTPS is enabled for production
4. Test with different transport methods
5. Monitor stealth statistics

---

**⚠️ Important**: This enhanced proxy is designed for privacy and educational purposes. Use responsibly and in accordance with applicable laws and terms of service.