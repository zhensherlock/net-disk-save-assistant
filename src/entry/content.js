const command = {}

chrome.runtime.onMessage.addListener(function(request) {
  if (command[request.func]) {
    command[request.func](request.data)
  }
})