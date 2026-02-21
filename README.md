# AirPod Podcast Player

A lightweight, iOS-optimized podcast player designed for AirPods users. Play your favorite podcasts directly in Safari with full AirPod control integration.

## Live Demo

🎧 [Try it now](https://kristoffernolgren.github.io/airpod-podcast-player)

## Features

- **AirPod Integration**: Full support for play/pause, next/previous track controls
- **RSS Feed Support**: Add any podcast by RSS feed URL
- **iOS Optimized**: Designed specifically for Safari on iOS
- **Offline-Ready**: Minimal dependencies, fast loading
- **Single-Page App**: No build process required, just one HTML file

## Quick Start

### For Users

Visit the [live demo](https://kristoffernolgren.github.io/airpod-podcast-player) in Safari on your iOS device.

### For Developers

1. Clone this repository:
   ```bash
   git clone https://github.com/kristoffernolgren/airpod-podcast-player.git
   cd airpod-podcast-player
   ```

2. Open `site/index.html` in your browser to test locally

3. Deploy using the CLI tool (see below)

## Deployment CLI Tool

This project includes `airpod-podcast-deployer`, a CLI tool for easy deployment to GitHub Pages.

### Installation

```bash
npm install -g airpod-podcast-deployer
```

### Usage

**First-time setup:**
```bash
cd airpod-podcast-player
airpod-deploy init
```

**Deploy updates:**
```bash
airpod-deploy deploy
```

**Check deployment status:**
```bash
airpod-deploy status
```

**Open live site:**
```bash
airpod-deploy open
```

See the [CLI README](cli/README.md) for detailed documentation.

## Project Structure

```
airpod-podcast-player/
├── site/
│   └── index.html          # The podcast player application
├── cli/                    # Deployment CLI tool
│   ├── package.json
│   ├── bin/
│   │   └── airpod-deploy.js
│   └── lib/
│       ├── deploy.js
│       ├── init.js
│       ├── config.js
│       └── auth.js
└── README.md
```

## Technology Stack

- Vanilla JavaScript (no frameworks)
- HTML5 Audio API
- MediaSession API (for AirPod controls)
- RSS feed parsing
- GitHub Pages hosting

## Development

To modify the podcast player:

1. Edit `site/index.html`
2. Test locally by opening in Safari
3. Deploy with `airpod-deploy deploy`

No build process or dependencies required for the main application.

## Browser Compatibility

- **Recommended**: Safari on iOS 14+
- **Supported**: Chrome, Firefox, Edge (desktop)
- **Limited**: Older browsers without MediaSession API support

## License

MIT

## Contributing

Contributions welcome. Please open an issue or pull request.
