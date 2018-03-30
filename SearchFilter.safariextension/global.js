// Get settings
const settingsKeys = ['blockKeywords', 'blockDomains', 'showRemovalNotice']
let settings = {}
settingsKeys.forEach(key => {
  settings[key] = safari.extension.settings[key]
})

// Set event handler
safari.application.addEventListener('message', handleMessage, false)
safari.extension.settings.addEventListener('change', settingsChanged, false)

// Handle message from injected script
function handleMessage(msg) {
  const { name } = msg
  switch (name) {
    case 'RequestForSettings':
      handleRequestForSettings(msg)
      break
  }
}

function handleRequestForSettings(msg) {
  msg.target.page.dispatchMessage('UpdateSettings', settings)
}

// Update setting values immediately
function settingsChanged(event) {
  settings[event.key] = event.newValue
  safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('UpdateSettings', settings)
}
