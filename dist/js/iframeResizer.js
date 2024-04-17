/*!***************************************
 * Level Up iFrame Resizer
 * https//levelupthemes.com
 * Version: v1.0.0
 ****************************************/

(function (iframeResizer) {
  'use strict';

  function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
      const later = () => {
        clearTimeout(timeout);
        func();
      };
      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
    };
  }

  const observe = (selector) => {
    const config = {
      attributes: true,
      attributeOldValue: false,
      characterData: true,
      characterDataOldValue: false,
      childList: true,
      subtree: true
    };
    const observer = new MutationObserver(
      debounce(() => {
        document.querySelectorAll(selector).forEach((iframe) => {
          if (!iframe.dataset.resizeInit) {
            iframe.dataset.resizeInit = "true";
            resizer({ autoResize: true }, iframe);
          }
        });
      }, 50)
    );
    observer.observe(document.body, config);
  };
  const loading = (iframe) => {
    var _a;
    const loaderDiv = document.createElement("div");
    loaderDiv.classList.add("iframeLoading");
    loaderDiv.innerHTML = `<div style="width:24px;margin:20px auto 0"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</style><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/></svg></div>`;
    (_a = iframe.parentNode) == null ? void 0 : _a.insertBefore(loaderDiv, iframe);
    iframe.addEventListener("load", function() {
      doneLoading(loaderDiv);
    });
    return loaderDiv;
  };
  const doneLoading = (loaderDiv) => {
    loaderDiv.style.display = "none";
  };
  const resizer = (options, elem) => {
    const iframe = typeof elem === "string" ? document.querySelector(elem) : elem;
    const loaderDiv = loading(iframe);
    options.onInit = options.onResized = (el) => {
      if (loaderDiv) {
        doneLoading(loaderDiv);
      }
    };
    debugger;
    options.heightCalculationMethod = "taggedElement";
    iframeResizer.iframeResizer(options, iframe);
  };
  const run = () => {
    var _a, _b, _c;
    const script = document.currentScript;
    if ((_a = script == null ? void 0 : script.dataset) == null ? void 0 : _a.iframeSelector) {
      observe(script.dataset.iframeSelector);
    }
    const queue = (_c = (_b = window.levelup) == null ? void 0 : _b.iframe) == null ? void 0 : _c.queue;
    if (!queue) {
      return;
    }
    while (queue.length) {
      const args = queue.shift();
      const [options, iframe] = args;
      resizer(options, iframe);
    }
    window.levelup.iframe = iframeResizer.iframeResizer;
  };
  const init = () => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      run();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        run();
      });
    }
  };
  console.log(`Powered by Level Up iFrame Resizer v1.0.0:`, "https://levelupthemes.com");
  init();

})(iframeResizer);
//# sourceMappingURL=iframeResizer.js.map
