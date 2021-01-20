/*!
 * MIT License
 *
 * Copyright (c) Yuri Sulyma
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("ractive-player"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "ractive-player"], factory);
	else if(typeof exports === 'object')
		exports["RPThumbCapture"] = factory(require("react"), require("ractive-player"));
	else
		root["RPThumbCapture"] = factory(root["React"], root["RactivePlayer"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE_react__, __WEBPACK_EXTERNAL_MODULE_ractive_player__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/polyfills.ts":
/*!**************************!*\
  !*** ./src/polyfills.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fullscreenEnabled": () => /* binding */ fullscreenEnabled,
/* harmony export */   "requestFullScreen": () => /* binding */ requestFullScreen,
/* harmony export */   "exitFullScreen": () => /* binding */ exitFullScreen,
/* harmony export */   "isFullScreen": () => /* binding */ isFullScreen,
/* harmony export */   "onFullScreenChange": () => /* binding */ onFullScreenChange
/* harmony export */ });
const id = (_) => _;
const fullscreenEnabled = ["fullscreenEnabled", "webkitFullscreenEnabled", "mozFullScreenEnabled", "msFullscreenEnabled"]
    .map(_ => document[_])
    .concat(false)
    .find(_ => _ !== undefined);
const requestFullScreen = ["requestFullscreen", "webkitRequestFullscreen", "mozRequestFullScreen", "msRequestFullscreen"]
    .map(_ => document.body[_])
    .concat(() => { })
    .find(id)
    .bind(document.body);
const exitFullScreen = ["exitFullscreen", "webkitExitFullscreen", "mozCancelFullScreen", "msExitFullscreen"]
    .map(_ => document[_])
    .concat(async () => { })
    .find(id)
    .bind(document);
const isFullScreen = () => ["fullscreen", "webkitIsFullScreen", "mozFullScreen"]
    .map(_ => document[_])
    .find(_ => _ !== undefined);
function onFullScreenChange(callback) {
    for (const event of ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"])
        document.addEventListener(event, callback);
}


/***/ }),

/***/ "./src/thumb-capture.tsx":
/*!*******************************!*\
  !*** ./src/thumb-capture.tsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ ThumbCapture
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfills */ "./src/polyfills.ts");
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ractive-player */ "ractive-player");
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ractive_player__WEBPACK_IMPORTED_MODULE_2__);




const { waitFor } = ractive_player__WEBPACK_IMPORTED_MODULE_2__.Utils.misc;
const sleep = ractive_player__WEBPACK_IMPORTED_MODULE_2__.Utils.misc.wait;
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
function ThumbCapture() {
    const player = (0,ractive_player__WEBPACK_IMPORTED_MODULE_2__.usePlayer)();
    const [paneOpen, setPaneOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [sheets, setSheets] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const extensionId = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.textContent = css;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    const recordThumbs = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
        const wasFullScreen = (0,_polyfills__WEBPACK_IMPORTED_MODULE_1__.isFullScreen)();
        const api = await wrapPortMaster(chrome.runtime.connect(extensionId.current));
        const { frequency } = THUMB_OPTIONS;
        const thumbs = [];
        (0,_polyfills__WEBPACK_IMPORTED_MODULE_1__.requestFullScreen)();
        await waitFor(() => (0,_polyfills__WEBPACK_IMPORTED_MODULE_1__.isFullScreen)());
        const oldState = hideUI();
        await sleep(6000);
        const { playback } = player;
        for (let t = 0; t <= playback.duration; t += frequency * 1000) {
            playback.seek(t);
            await sleep(100);
            thumbs.push(await api.captureTab());
        }
        if (!wasFullScreen)
            (0,_polyfills__WEBPACK_IMPORTED_MODULE_1__.exitFullScreen)();
        restoreUI(oldState);
        const sheets = await processThumbs(thumbs);
        setSheets(sheets);
    }, []);
    const togglePane = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        setPaneOpen(_ => !_);
    }, []);
    const dialogStyle = {
        display: paneOpen ? "block" : "none"
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { id: "rp-thumb-capture" },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { id: "rp-thumbs-dialog", style: dialogStyle },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", null, "Extension ID"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", { id: "rp-thumbs-ext-id", type: "text", onBlur: player.resumeKeyCapture, onFocus: player.suspendKeyCapture, onChange: e => extensionId.current = e.currentTarget.value }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { onClick: recordThumbs }, "Record"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { id: "rp-thumb-sheets" }, sheets.map((sheet, i) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { key: i, href: sheet, download: `${i}.png` },
                "Sheet ",
                i))))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", { onClick: togglePane, height: "36", width: "36", viewBox: "0 0 100 100" },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M 10 70 a 1,1 0 0,1 80,0 z", fill: "#FFC0CB", stroke: "#FFF", strokeWidth: "7" }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M 35 66.5 a 1,1 0 0,1 30,0 z", fill: "#FFE0EB", stroke: "none" }))));
}
function wrapPortMaster(port) {
    let callCounter = 0;
    const returnPromises = {};
    return new Promise((resolve) => {
        port.onMessage.addListener((msg) => {
            switch (msg.type) {
                case "apiDefinition":
                    const api = {};
                    msg.methodNames.forEach(name => {
                        api[name] = (...args) => {
                            const callId = callCounter++;
                            port.postMessage({ type: "apiCall", callId, methodName: name, arguments: args });
                            return new Promise((resolve) => {
                                returnPromises[callId] = resolve;
                            });
                        };
                    });
                    Object.freeze(api);
                    resolve(api);
                    break;
                case "apiReturn":
                    const { callId } = msg;
                    returnPromises[callId](msg.value);
                    delete returnPromises[callId];
                    break;
            }
        });
        port.postMessage({ type: "establish" });
    });
}
function hideUI() {
    const changes = [
        [document.querySelector(".rp-controls"), "display", "none"],
        [document.querySelector(".rp-canvas"), "cursor", "none"],
        [document.body, "cursor", "none"]
    ];
    for (let i = 0; i < changes.length; ++i) {
        const [elt, prop, val] = changes[i];
        changes[i][2] = elt.style[prop];
        elt.style[prop] = val;
    }
    return changes;
}
function restoreUI(oldState) {
    for (const [elt, prop, val] of oldState) {
        elt.style[prop] = val;
    }
}
async function processThumbs(thumbs) {
    const { rows, cols, height, width } = THUMB_OPTIONS, count = rows * cols;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", (width * cols).toString());
    canvas.setAttribute("height", (height * rows).toString());
    const ctx = canvas.getContext("2d");
    const sheets = [];
    for (let sheetNum = 0, len = Math.ceil(thumbs.length / count); sheetNum < len; ++sheetNum) {
        ctx.clearRect(0, 0, width * cols, height * rows);
        const sheetImgs = await Promise.all(thumbs
            .slice(sheetNum * count, (sheetNum + 1) * count)
            .map(dataURI => {
            return new Promise((resolve) => {
                const img = document.createElement("img");
                img.onload = () => resolve(img);
                img.src = dataURI;
            });
        }));
        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < cols; ++j) {
                const index = i * cols + j;
                if (index >= sheetImgs.length)
                    break;
                ctx.drawImage(sheetImgs[index], j * width, i * height, width, height);
            }
        }
        sheets.push(canvas.toDataURL("image/png"));
    }
    return sheets;
}


/***/ }),

/***/ "ractive-player":
/*!*************************************************************************************************************************!*\
  !*** external {"commonjs":"ractive-player","commonjs2":"ractive-player","amd":"ractive-player","root":"RactivePlayer"} ***!
  \*************************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_ractive_player__;

/***/ }),

/***/ "react":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"} ***!
  \**************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_react__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/thumb-capture.tsx");
/******/ })()
.default;
});