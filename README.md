# AirPod Podcast Player

A lightweight, iOS-optimized podcast player designed for AirPods. Play podcasts directly in Safari with full AirPod control integration.

🎧 **[Live Demo](https://kristoffernolgren.github.io/airpod-podcast-player)**

## Features

- **AirPod Integration** - Play/pause, skip forward/back with AirPod controls
- **RSS Feed Support** - Add any podcast by RSS URL
- **iOS Optimized** - Works in Safari, even with locked screen
- **Single File** - No build process, no dependencies

## Usage

Visit the [live site](https://kristoffernolgren.github.io/airpod-podcast-player) on your iOS device with Safari.

## How It Works

- Uses HTML5 Audio API and MediaSession API for AirPod controls
- Plays silent audio in background to maintain session when locked
- Fetches RSS feeds via CORS proxies
- Single HTML file with embedded CSS/JS

## Deployment

This site is hosted on GitHub Pages. To deploy changes:

```bash
# Edit site/index.html
git add .
git commit -m "Update podcast player"
git push
```

GitHub Pages automatically rebuilds in 1-2 minutes.

## Local Development

```bash
# Clone the repo
git clone https://github.com/kristoffernolgren/airpod-podcast-player.git

# Open in browser
open site/index.html
```

## License

MIT
