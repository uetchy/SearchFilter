let blockKeywords = []
let blockDomains = []
let showRemovalNotice = true

function createBanner(content) {
  var bannerElement = document.createElement('div')
  bannerElement.className = 'g'
  bannerElement.style = 'color: gray'
  bannerElement.innerHTML = content
  return bannerElement
}

function handleMatchedElement(element, matched) {
  if (showRemovalNotice) {
    const banner = createBanner(
      'This item has been removed because of the matched keyword ' + matched
    )
    element.parentNode.replaceChild(banner, element)
  } else {
    element.remove()
  }
}

function filter() {
  Array.from(document.querySelectorAll('.g'), element => {
    const titleElement = element.querySelector('h3 > a')
    const url = titleElement.href
    for (domain of blockDomains) {
      if (url.indexOf(domain) > -1) {
        return handleMatchedElement(element, domain)
      }
    }
    const title = titleElement.innerHTML
    const summary = element.querySelector('.st').innerText
    const title_summary = title + summary
    for (keyword of blockKeywords) {
      if (title_summary.indexOf(keyword) > -1) {
        return handleMatchedElement(element, keyword)
      }
    }
  })
}

function handleUpdateSettings(msg) {
  blockKeywords = msg.message['blockKeywords']
    ? msg.message['blockKeywords'].split(',').map(s => s.replace(/^\s+|\s+$/, ''))
    : []
  blockDomains = msg.message['blockDomains']
    ? msg.message['blockDomains'].split(',').map(s => s.replace(/^\s+|\s+$/, ''))
    : []
  showRemovalNotice = msg.message['showRemovalNotice']
  document.addEventListener('DOMContentLoaded', () => filter())
}

// Get selected text and return to global script
function handleMessage(msg) {
  const name = msg.name
  switch (name) {
    case 'UpdateSettings':
      handleUpdateSettings(msg)
      break
  }
}

function setup() {
  safari.self.addEventListener('message', handleMessage, false)

  safari.self.tab.dispatchMessage('RequestForSettings')
}

setup()
