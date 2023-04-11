export const initial_data = {
  status: 'close',
  second: 5
}

export const getCurrentTabId = () => {
  return new Promise((resolve) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      resolve(tabs.length ? tabs[0].id: null)
    })
  })
}

export const sendMessageToContentScript = async (message) => {
  const tabId = await getCurrentTabId()
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      resolve(response)
    })
  })
}

export const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export const injectJavascript = ({ root, src }) => {
  const script = document.createElement('script')
  script.src = src
  script.onload = function() {
    console.log('script injected')
    this.remove()
  }
  root.appendChild(script)
}

export const injectStyle = ({ root, id, src }) => {
  const style = document.createElement('link')
  style.href = src
  style.id = id
  style.setAttribute('rel', 'stylesheet')
  root.appendChild(style)
}

export const runScript = (code, cb) => {
  chrome.devtools.inspectedWindow.eval(code, cb || ((result, isException) => {
    if (isException) {
      console.log('the script does not work')
    }
  }))
}