# rp-thumb-capture
Plugin+browser extension for recording thumbnails in ractive-player.

Currently, this only supports Chrome.

# Usage

1. Install the browser extension in Chrome by going to `chrome://extensions/`, enabling Developer mode, and using "Load unpacked".

2. Load the plugin onto `Player`:
```tsx
import ThumbCapture from "rp-thumb-capture";
/* ... */
<Player plugins={[ThumbCapture]} script={script}>
```

3. Click on the plugin icon first.

4. Click on the thumb icon, enter the Chrome extension ID into the textbox.

5. Press "Record". The extension will do its own thing for a few minutes; don't touch anything while this is happening.

6. Save the recorded sheets.
