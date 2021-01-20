/// <reference types="chrome"/>
import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";

import {requestFullScreen, exitFullScreen, isFullScreen} from "./polyfills";

import {Utils, usePlayer} from "ractive-player";
const {waitFor} = Utils.misc;
const sleep = Utils.misc.wait;

type Change = [HTMLElement, string, string];

interface ApiDefinition {
  type: "apiDefinition";
  methodNames: string[];
}

interface ApiReturn {
  type: "apiReturn";
  callId: number;
  value: unknown;
}

interface Api {
  captureTab: () => {};
}

type Message = ApiDefinition | ApiReturn;

const THUMB_OPTIONS = {
  cols: 5,
  rows: 5,
  height: 100,
  width: 160,
  frequency: 4
};

const css = `#rp-thumb-capture {
  position: relative;
}

#rp-thumbs-dialog {
  background-color: #2A2A2A;
  border-radius: 2px 2px 0 0;
  box-shadow: 2px -2px 2px 2px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  color: #FFF !important;
  font-family: "Roboto Slab", sans-serif;
  line-height: 1.5;
  
  position: absolute;
  bottom: 42px;
  right: 0;
  
  padding: .5em;
}

#rp-thumbs-dialog > label {
  display: block;
}

#rp-thumbs-dialog > input {
  font-family: monospace;
}

#rp-thumbs-dialog > button {
    background-color: #A52117;
    border: 0 none transparent;
    box-sizing: border-box;
    color: #FFF;
    display: block;
    font-family: "Roboto Slab", sans-serif;
    font-size: 1em;
    margin-top: .5em;
    padding: .25em;
}

#rp-thumb-sheets > a {
  display: block;
}`;

export default function ThumbCapture() {
  const player = usePlayer();
  const [paneOpen, setPaneOpen] = useState(false);
  const [sheets, setSheets] = useState<string[]>([]);
  const extensionId = useRef<string>();

  /* CSS */
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.textContent = css;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const recordThumbs = useCallback(async () => {
    const wasFullScreen = isFullScreen();

    const api = await wrapPortMaster(chrome.runtime.connect(extensionId.current)) as Api;

    const {frequency} = THUMB_OPTIONS;

    const thumbs = [];

    requestFullScreen();
    await waitFor(() => isFullScreen());
    const oldState = hideUI();

    await sleep(6000);

    const {playback} = player;
    for (let t = 0; t <= playback.duration; t += frequency * 1000) {
      playback.seek(t);

      await sleep(100);

      thumbs.push(await api.captureTab());
    }

    if (!wasFullScreen) exitFullScreen();
    restoreUI(oldState);

    const sheets = await processThumbs(thumbs);

    setSheets(sheets);
  }, []);

  const togglePane = useCallback(() => {
    setPaneOpen(_ => !_);
  }, []);

  const dialogStyle: React.CSSProperties = {
    display: paneOpen ? "block" : "none"
  };

  return (
    <div id="rp-thumb-capture">
      <div id="rp-thumbs-dialog" style={dialogStyle}>
        <label>Extension ID</label>
        <input
          id="rp-thumbs-ext-id" type="text"
          onBlur={player.resumeKeyCapture} onFocus={player.suspendKeyCapture}
          onChange={e => extensionId.current = e.currentTarget.value}
        />
        <button onClick={recordThumbs}>Record</button>
        <div id="rp-thumb-sheets">
          {sheets.map((sheet, i) => (
            <a key={i} href={sheet} download={`${i}.png`}>Sheet {i}</a>
          ))}
        </div>
      </div>
      <svg onClick={togglePane} height="36" width="36" viewBox="0 0 100 100">
        <path d="M 10 70 a 1,1 0 0,1 80,0 z" fill="#FFC0CB" stroke="#FFF" strokeWidth="7"/>
        <path d="M 35 66.5 a 1,1 0 0,1 30,0 z" fill="#FFE0EB" stroke="none"/>
      </svg>
    </div>
  );
}

function wrapPortMaster(port: chrome.runtime.Port) {
  let callCounter = 0;
  const returnPromises = {};

  return new Promise((resolve) => {
    port.onMessage.addListener((msg: Message) => {
      switch (msg.type) {
      // receive callable API methods
      case "apiDefinition":
        const api = {};
          
        msg.methodNames.forEach(name => {
          api[name] = (...args: unknown[]) => {
            const callId = callCounter++;
            port.postMessage({type: "apiCall", callId, methodName: name, arguments: args});
            return new Promise((resolve) => {
              returnPromises[callId] = resolve;
            });
          };
        });

        Object.freeze(api);

        // return API
        resolve(api);
        break;

        // receive returned value from child
      case "apiReturn":
        const {callId} = msg;
        returnPromises[callId](msg.value);
        delete returnPromises[callId];
        break;
      }
    });

    port.postMessage({type: "establish"});
  });
}

function hideUI(): Change[] {
  const changes = [
    [document.querySelector(".rp-controls"), "display", "none"],
    [document.querySelector(".rp-canvas"), "cursor", "none"],
    [document.body, "cursor", "none"]
  ] as [HTMLElement, string, string][];

  for (let i = 0; i < changes.length; ++i) {
    const [elt, prop, val] = changes[i];

    changes[i][2] = elt.style[prop];

    elt.style[prop] = val;
  }

  return changes;
}

function restoreUI(oldState: Change[]) {
  for (const [elt, prop, val] of oldState) {
    elt.style[prop] = val;
  }
}

async function processThumbs(thumbs: string[]) {
  const {rows, cols, height, width} = THUMB_OPTIONS,
        count = rows * cols;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", (width * cols).toString());
  canvas.setAttribute("height", (height * rows).toString());

  const ctx = canvas.getContext("2d");
  const sheets = [];

  for (let sheetNum = 0, len = Math.ceil(thumbs.length / count); sheetNum < len; ++sheetNum) {
    ctx.clearRect(0, 0, width * cols, height * rows);

    const sheetImgs = await Promise.all(
      thumbs
      .slice(sheetNum * count, (sheetNum + 1) * count)
      .map(dataURI => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = document.createElement("img");
          img.onload = () => resolve(img);
          img.src = dataURI;
        });
      })
    );

    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        const index = i * cols + j;

        if (index >= sheetImgs.length) break;
        ctx.drawImage(sheetImgs[index], j * width, i * height, width, height);
      }
    }

    sheets.push(canvas.toDataURL("image/png"));
  }

  return sheets;
}
