/*!***************************************
 * Level Up iFrame Resizer
 * https//levelupthemes.com
 * Version: v1.0.13
 ****************************************/

(function () {
  'use strict';

  function getGHLData() {
    const vuex = window.localStorage.getItem("vuex");
    return vuex ? JSON.parse(vuex) : null;
  }
  function receiveMessage(event) {
    var _a, _b, _c;
    const authorized_hosts = [
      "localhost:5173",
      "portal.levelupthemes.com",
      "notion-embed.levelupthemes.com"
    ];
    const url = new URL(event.origin);
    if (!event.isTrusted || !authorized_hosts.includes(url.host) || ((_a = event.data) == null ? void 0 : _a.cmd) !== "getGHLData" || !((_b = event.data) == null ? void 0 : _b.responseId)) {
      return;
    }
    const { cmd, responseId } = event.data;
    const data = getGHLData();
    (_c = event.source) == null ? void 0 : _c.postMessage(
      {
        responseId,
        cmd,
        data
      },
      { targetOrigin: event.origin }
    );
  }
  window.addEventListener("message", receiveMessage);

})();
//# sourceMappingURL=ghlIframeData.js.map
