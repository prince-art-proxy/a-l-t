# Ultraviolet Proxy - Enhanced Browser Interface

A modern, styled implementation of the Ultraviolet proxy system with enhanced browser functionality, bookmarks, history, and privacy features.

![Ultraviolet Proxy](https://img.shields.io/badge/Ultraviolet-Proxy-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-AGPL--3.0-red?style=for-the-badge)

## 🚀 Features

### Core Functionality
- **Advanced Proxy System**: Uses Ultraviolet's sophisticated proxy technology for secure browsing
- **Multiple Transport Methods**: Support for EpoxyTransport, CurlTransport, and Bare-Client
- **Censorship Bypass**: Designed for evading internet censorship and accessing blocked content
- **Sandboxed Browsing**: Secure, isolated browsing environment

### Enhanced Browser Interface
- **Modern UI**: Clean, responsive design with dark/light theme support
- **URL Navigation**: Full-featured address bar with security indicators
- **Navigation Controls**: Back, forward, refresh, and home buttons
- **Search Integration**: Built-in search engine support (Google, Bing, DuckDuckGo, Yahoo)
- **Quick Access**: Pre-configured popular websites for instant access

### Privacy & Security
- **Ad Blocking**: Built-in advertisement blocking
- **Tracker Protection**: Advanced tracking script blocking
- **HTTPS Enforcement**: Automatic HTTPS upgrade for secure connections
- **Content Filtering**: Configurable content filtering options
- **Privacy-Focused**: No data collection, local storage only

### Advanced Stealth Features (Anti-Detection)
- **User Agent Rotation**: Automatically rotates between different browser user agents
- **Human-like Timing**: Simulates human behavior with random delays
- **Fingerprint Evasion**: Blocks canvas, WebGL, and audio fingerprinting attempts
- **Detection Script Blocking**: Actively blocks known bot detection scripts
- **now.gg Protection**: Specifically designed to avoid detection by cloud gaming platforms
- **Browser Simulation**: Simulates natural typing, clicking, and mouse movements
- **Proxy Header Hiding**: Removes common proxy identification headers
- **Screen/Language Spoofing**: Matches your actual browser environment

### User Experience
- **Bookmarks System**: Save and organize favorite websites
- **Browsing History**: Track and manage visited pages
- **Recent Visits**: Quick access to recently viewed sites
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Responsive Design**: Optimized for desktop and mobile devices
- **Offline Support**: Service worker for offline functionality

### Advanced Features
- **Export/Import**: Backup and restore bookmarks, history, and settings
- **Theme Customization**: Light, dark, and auto theme detection
- **Settings Panel**: Comprehensive configuration options
- **Performance Monitoring**: Built-in performance tracking
- **Error Handling**: Robust error handling and recovery

## 🛠️ Installation

### Prerequisites
- Node.js 16+ (for development server)
- Modern web browser with JavaScript enabled
- Web server (Apache, Nginx, or built-in server)

### Quick Setup

1. **Clone or Download the Files**
   ```bash
   # If using Git
   git clone https://github.com/titaniumnetwork-dev/Ultraviolet.git
   cd Ultraviolet
   
   # Or download and extract the files
   ```

2. **Start a Web Server**
   
   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```
   
   **Option D: Using Live Server (VS Code)**
   - Install the "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:8000`
   - For HTTPS testing, use a local HTTPS server or deploy to a domain with SSL

### Production Deployment

#### Using Ultraviolet-App Bundle
1. Follow the [official deployment guide](https://github.com/titaniumnetwork-dev/Ultraviolet-App/wiki)
2. Replace the default frontend with the files from this project
3. Ensure proper SSL certificate for production use

#### Manual Deployment
1. Upload all files to your web server
2. Ensure the server supports:
   - HTTPS (required for service workers)
   - Proper MIME types for CSS and JavaScript
   - Compression (optional but recommended)

## 🔧 Configuration

### Proxy Settings
The proxy supports multiple transport methods configured in `scripts/config.js`:

```javascript
proxy: {
    transport: 'epoxy', // 'epoxy', 'curl', 'bare'
    forceHttps: true,
    blockAds: true,
    blockTrackers: true
}
```

### Transport Methods
- **EpoxyTransport**: Modern, efficient transport method
- **CurlTransport**: Alternative transport with good compatibility
- **Bare-Client**: Legacy transport (unencrypted)

### Customization Options

#### Theme Configuration
```javascript
ui: {
    theme: 'auto', // 'light', 'dark', 'auto'
    homepage: 'uv' // 'uv', 'blank', 'google'
}
```

#### Search Engine Settings
```javascript
searchEngines: {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q='
}
```

## 🎮 Usage

### Basic Navigation
1. **Enter URL**: Type a URL in the address bar and press Enter
2. **Search**: Enter search terms to use the default search engine
3. **Quick Access**: Click on popular website icons for instant access
4. **Navigation**: Use back/forward buttons or keyboard shortcuts

### Keyboard Shortcuts
- `Ctrl+L` or `Cmd+L`: Focus address bar
- `Ctrl+T` or `Cmd+T`: New tab (go to home)
- `Ctrl+R` or `Cmd+R`: Refresh page
- `Ctrl+W` or `Cmd+W`: Close tab (go to home)
- `Ctrl+D` or `Cmd+D`: Add bookmark
- `F11`: Toggle fullscreen
- `Escape`: Close panels/settings

### Managing Bookmarks
1. Navigate to a webpage
2. Press `Ctrl+D` to bookmark the page
3. Use the bookmarks button to view and manage bookmarks
4. Click bookmark icons to navigate to saved sites

### Settings Configuration
1. Click the settings icon (⚙️) in the header
2. Configure privacy settings (ad blocking, tracker blocking)
3. Choose theme and appearance options
4. Select proxy transport method
5. Set homepage preference

## 🔒 Privacy & Security

### Data Protection
- **Local Storage Only**: All data stored locally in browser
- **No Tracking**: No analytics or tracking scripts
- **No Data Collection**: User data never leaves the device
- **Open Source**: Transparent code for security auditing

### Security Features
- **Content Security Policy**: Built-in CSP headers
- **HTTPS Enforcement**: Automatic HTTPS upgrades
- **Ad Blocking**: Built-in advertisement filtering
- **Tracker Protection**: Advanced tracking script blocking
- **Sandboxed Browsing**: Isolated browsing environment

### Privacy Recommendations
1. Use in incognito/private browsing mode for temporary sessions
2. Regularly clear browsing history and data
3. Use VPN services for additional privacy
4. Keep the browser and proxy updated

## 🛡️ Troubleshooting

### Common Issues

#### "This site can't be reached"
- Check internet connection
- Verify URL is correct
- Try different transport method in settings
- Clear browser cache and cookies

#### Service Worker Issues
- Ensure HTTPS is enabled (required for service workers)
- Clear browser cache and reload
- Check browser console for errors

#### Performance Issues
- Disable heavy ad-blocking rules if needed
- Clear browser cache regularly
- Check available system memory

#### Mobile Issues
- Use Chrome or Firefox on mobile for best compatibility
- Enable desktop site mode for full functionality
- Check mobile data vs WiFi connectivity

### Browser Compatibility
- **Recommended**: Chrome 88+, Firefox 85+, Safari 14+
- **Minimum**: Any modern browser with ES6 support
- **Not Supported**: Internet Explorer

### Debug Mode
Enable debug logging in `scripts/config.js`:
```javascript
debug: {
    enabled: true,
    logLevel: 'debug'
}
```

## 📁 Project Structure

```
ultraviolet/
├── index.html              # Main application file
├── sw.js                   # Service worker
├── styles/
│   └── main.css           # Main stylesheet
├── scripts/
│   ├── config.js          # Configuration settings
│   ├── storage.js         # Local storage management
│   ├── proxy.js           # Proxy functionality
│   ├── ui.js              # User interface management
│   └── app.js             # Main application logic
└── README.md              # This file
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use consistent indentation (4 spaces)
- Follow existing naming conventions
- Add comments for complex functionality
- Test on multiple browsers

### Adding Features
- New transport methods
- Additional privacy features
- UI improvements
- Performance optimizations

## 📄 License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Titanium Network](https://github.com/titaniumnetwork-dev) - Original Ultraviolet project
- [Ultraviolet Contributors](https://github.com/titaniumnetwork-dev/Ultraviolet/graphs/contributors)
- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Fonts](https://fonts.google.com/) - Inter font family

## 🛡️ Stealth Mode

For detailed information about using the advanced anti-detection features, especially for platforms like now.gg, see the [Stealth Deployment Guide](STEALTH_GUIDE.md).

### Quick Stealth Setup
1. Enable "Stealth Mode (Anti-Detection)" in Settings → Privacy & Security
2. Enable "Human-like timing" for natural behavior simulation
3. Navigate to your target site and let the proxy handle detection avoidance

## 📞 Support

### Getting Help
- Check the [troubleshooting section](#-troubleshooting)
- Review browser console for error messages
- Ensure all files are properly served over HTTPS
- Verify proxy endpoints are accessible

### Reporting Issues
1. Check existing issues first
2. Provide detailed error information
3. Include browser version and operating system
4. Describe steps to reproduce the issue

### Feature Requests
- Suggest new features via GitHub issues
- Provide use cases and benefits
- Consider implementation complexity

---

**⚠️ Important Notice**: This proxy is designed for educational and privacy purposes. Users are responsible for complying with applicable laws and terms of service when using this software.

**🔗 Related Projects**:
- [Ultraviolet Core](https://github.com/titaniumnetwork-dev/Ultraviolet)
- [Ultraviolet-App](https://github.com/titaniumnetwork-dev/Ultraviolet-App)
- [Scramjet](https://github.com/MercuryWorkshop/scramjet) (Successor project)