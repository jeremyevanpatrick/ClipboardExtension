# On-Screen Clipboard

A browser extension that adds a persistent, multi-item clipboard to Chrome and Brave. Click the toolbar icon to open it, type or paste anything into a slot, and copy it back to your clipboard with one click.

![Manifest Version](https://img.shields.io/badge/manifest-v3-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Why

The system clipboard holds one thing at a time. This extension lets you pin frequently used snippets — code, URLs, boilerplate text, whatever — and copy any of them instantly without having to hunt them down again.

## Privacy

This clipboard extension stores data locally in your browser without injecting HTML into every page you visit, preventing websites from accessing your saved text through their JavaScript code.

- **No content scripts** — nothing is ever injected into any web page
- **No background service worker** — no persistent process running in the background
- **Storage stays in the browser** — all data lives in `chrome.storage.local`, which is only accessible to the extension itself

## Installation

This extension is not published to the Chrome Web Store. Install it manually in developer mode.

1. Download the latest zip from [Releases](../../releases) and unzip it
2. Open `brave://extensions` or `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the unzipped folder

To update, download the new zip, replace the folder contents, and click the **↺** reload button on the extensions page.

## Usage

| Action | How |
|---|---|
| Open / close | Click the toolbar icon |
| Add an item | Click **+ New Item** |
| Type or paste | Click into any text field |
| Copy to clipboard | Click the copy icon — flashes green on success |
| Delete an item | Clear the text field, then click the × button |

Items and their text are saved automatically and persist across browser sessions.

## License

MIT
