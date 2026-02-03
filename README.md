# LG Display Pages

Hosted web pages for LG BIC (Business Innovation Center) display demos. This repository contains HTML/React applications designed to be displayed on LG commercial displays via the Web URL Launcher feature.

## Live Site

All pages are hosted via GitHub Pages at: `https://haydenth.github.io/display-pages/`

## Projects

### Test Pages
- **[screen-test](./screen-test/)** - Animated test pattern with live clock and system info

### Restaurant Menus
- Coming soon...

### Interactive Dashboards
- Coming soon...

## Usage with LG Connected Care API

Each page can be launched on LG displays using the SuperSign device control API:

```bash
PUT /businesses/{business_id}/workspaces/{workspace_id}/devices/{device_id}/control
```

```json
{
  "name": "control_device",
  "data": [
    {"cmd": "set_input", "value": "Web Url Launcher"},
    {"cmd": "set_play_via_url", "value": "{\"enabled\":true,\"url\":\"https://haydenth.github.io/display-pages/screen-test/\"}"}
  ]
}
```

## Development

Each project is a standalone web page that can run independently. Pages are designed for:
- **Portrait orientation**: 1080x1920 (common for retail displays)
- **Landscape orientation**: 1920x1080 (common for conference rooms)
- **Self-contained**: All dependencies loaded via CDN (no build step required)

## Adding New Pages

1. Create a new folder: `mkdir my-new-page`
2. Add `index.html` with your content
3. Commit and push
4. Access at: `https://haydenth.github.io/display-pages/my-new-page/`

## Technologies

- React 18+ (loaded via CDN)
- Pure HTML/CSS/JavaScript (no build tools needed)
- Responsive design for various display sizes
