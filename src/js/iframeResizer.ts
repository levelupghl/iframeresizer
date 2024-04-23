import iframeResizer from "./lib/iframeResizerLib"
import { debounce } from "./lib/debounce"

// Wait a max of 5 seconds then hide the loading spinner
const MAX_LOADING_TIME = 5000

export interface CustomWindow extends Window {
  levelup: {
    iframe: any
  }
}
declare let window: CustomWindow

interface ScriptElem extends HTMLScriptElement {
  dataset: {
    iframeSelector: string
  }
}
interface IFrame extends HTMLIFrameElement {
  dataset: {
    resizeInit: string
  }
}

const observe = (selector: string) => {
  const config = {
    attributes: true,
    attributeOldValue: false,
    characterData: true,
    characterDataOldValue: false,
    childList: true,
    subtree: true,
  }
  const observer = new MutationObserver(
    debounce(() => {
      document.querySelectorAll<IFrame>(selector).forEach((iframe) => {
        if (!iframe.dataset.resizeInit) {
          iframe.dataset.resizeInit = "true"
          resizer({ autoResize: true }, iframe)
        }
      })
    }, 50)
  )
  observer.observe(document.body, config)
}

const loading = (iframe: HTMLElement): HTMLElement => {
  const loaderDiv: HTMLDivElement = document.createElement("div")
  loaderDiv.classList.add("iframeLoading")
  loaderDiv.innerHTML = `<div style="width:24px;margin:20px auto 0"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}</style><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/></svg></div>`
  iframe.parentNode?.insertBefore(loaderDiv, iframe)
  iframe.addEventListener("load", function () {
    doneLoading(loaderDiv)
  })
  return loaderDiv
}

const doneLoading = (loaderDiv: HTMLElement) => {
  if (loaderDiv?.style) {
    loaderDiv.style.display = "none"
  }
}

function wrap<T extends any[], R>(
  fn1: (...args: T) => R,
  fn2: (...args: T) => R
) {
  return function (...args: T) {
    if (fn1) {
      fn1(...args)
    }
    return fn2(...args)
  }
}

const showLoading = (options: any, iframe: HTMLIFrameElement) => {
  const loaderDiv = loading(iframe)
  const init = () => {
    doneLoading(loaderDiv)
  }
  options.onInit = wrap(options.onInit, init)
  options.onResized = wrap(options.onResized, init)
  setTimeout(init, MAX_LOADING_TIME)
}

const resizer = (options: any, elem: HTMLIFrameElement | string) => {
  const iframe =
    typeof elem === "string"
      ? (document.querySelector(elem) as HTMLIFrameElement)
      : elem

  // Handle ENP special case
  // Don't show loading spinner and change height calculation method
  if (iframe.src.includes("funnelembed.com")) {
    // Temporary fix until funnelembed.com iframe headers are set to allow postMessage
    iframe.src = iframe.src.replace("funnelembed.com", "embednotionpage.com")
  }
  if (
    iframe.src.includes("embednotionpage.com") ||
    iframe.src.includes("funnelembed.com")
  ) {
    // Override height calculation method
    options.heightCalculationMethod = "taggedElement"
  } else {
    showLoading(options, iframe)
  }

  //
  // Set default options
  //

  // options.bodyPadding = "0 0 50px 0"
  // options.bodyBackground = "red"

  // Disable scrollbars in the iframe
  options.scrolling ??= false

  // Enable anchor links in iframe to trigger scrolling
  options.inPageLinks ??= true

  // Set bodyMargin to fix a bug in iframeResizer.contentWindow.js that
  // causes the top of the iframe to get cut off if bodyMarin is not set
  options.bodyMargin ??= "0"

  // options.log ??= true

  // options.onResized = wrap(options.onResized, ({iframe, height, width, type}) => {
  //   // Adjusting height doesn't work since the iframe will continue to grow each time
  //   // iframe.style.height = `${parseInt(height) + HEIGHT_ADJUST}px`
  // })
  setTimeout(() => {
    iframeResizer(options, iframe)
  }, 100)
}

const run = () => {
  // Check if iframe selector was provided on the script tag and queue is empty
  const script = document.currentScript as ScriptElem
  if (script?.dataset?.iframeSelector) {
    // Observe for any iframes that match the selector
    observe(script.dataset.iframeSelector)
  }

  const queue = window.levelup?.iframe?.queue
  if (!queue) {
    return
  }

  while (queue.length) {
    const args = queue.shift()
    const [options, iframe] = args
    resizer(options, iframe)
  }
  // Now that the queue is cleared, override the global constructor
  window.levelup.iframe = iframeResizer
}

const init = () => {
  // Wait for document to load
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    run()
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      run()
    })
  }
}

console.log(`Powered by __theme_name__ __theme_version__:`, "__theme_website__")

init()
