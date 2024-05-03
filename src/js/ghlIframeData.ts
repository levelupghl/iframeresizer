function getGHLData() {
  const vuex = window.localStorage.getItem("vuex")
  return vuex ? JSON.parse(vuex) : null
}

function receiveMessage(event: MessageEvent) {
  const authorized_hosts = ["localhost:5173", "portal.levelupthemes.com"]
  const url = new URL(event.origin)
  // debugger
  // Ignore messages not for us
  if (
    !event.isTrusted ||
    !authorized_hosts.includes(url.host) ||
    event.data?.cmd !== "getGHLData" ||
    !event.data?.responseId
  ) {
    return
  }
  const { cmd, responseId } = event.data
  const data = getGHLData()
  event.source?.postMessage(
    {
      responseId,
      cmd,
      data,
    },
    { targetOrigin: event.origin }
  )
}

window.addEventListener("message", receiveMessage)
