# rp-thumb-capture
Plugin+browser extension for recording thumbnails in ractive-player.

Currently, this only supports Chrome.

# Usage

1. Enter your development domain in `extension/manifest.json`

1. Install the browser extension in Chrome by going to `chrome://extensions/`, enabling Developer mode, and using "Load unpacked".

1. Load the plugin onto `Player`:
```tsx
import ThumbCapture from "rp-thumb-capture";

const controls = (<>
  {Player.defaultControlsLeft}

  <div className="rp-controls-right">
    <ThumbCapture/>

    {Player.defaultControlsRight}
  </div>
</>);

<Player plugins={[ThumbCapture]} script={script}>
```

1. Click on the plugin icon first.

1. Click on the thumb icon, enter the Chrome extension ID into the textbox.

1. Press "Record". The extension will do its own thing for a few minutes; don't touch anything while this is happening.

1. Save the recorded sheets.
