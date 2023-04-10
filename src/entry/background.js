/* eslint-disable */
console.log('background is working')
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("background.js got a message")
  console.log(request);
  console.log(sender);
  const {val} = request
  sendResponse({res: '接收成功' + val})
})