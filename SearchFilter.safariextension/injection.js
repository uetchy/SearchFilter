let blockKeywords = []
let blockDomains = []
let showRemovalNotice = true
let count = 0

function createBanner(content) {
  var bannerElement = document.createElement('div')
  bannerElement.className = 'g'
  bannerElement.style = 'color: gray'
  bannerElement.innerHTML = content
  return bannerElement
}

function handleMatchedElement(element, matched) {
  count += 1
  if (showRemovalNotice) {
    const banner = createBanner(
      'This page has been removed because of the matched keyword ' + matched
    )
    element.parentNode.replaceChild(banner, element)
  } else {
    element.remove()
  }
}

function filter() {
  Array.from(document.querySelectorAll('.g'), element => {
    const titleElement = element.querySelector('h3 > a')
    if (!titleElement) {
      return
    }

    const url = titleElement.href
    for (domain of blockDomains) {
      if (url.indexOf(domain) > -1) {
        return handleMatchedElement(element, domain)
      }
    }
    const title = titleElement.innerHTML
    const summary = element.querySelector('.st') ? element.querySelector('.st').innerText : ''
    const title_summary = title + summary
    for (keyword of blockKeywords) {
      if (title_summary.indexOf(keyword) > -1) {
        return handleMatchedElement(element, keyword)
      }
    }
  })
}

function postprocess() {
  if (count > 0) {
    const resultStats = document.querySelector('#resultStats')
    resultStats.innerHTML += 'without ' + count + ' removed results'
  }
}

function onSettingsReceived() {
  filter()
  postprocess()
}

function stringToArray(str) {
  return str ? str.split(',').map(s => s.replace(/^\s+|\s+$/, '')) : []
}

function handleUpdateSettings(msg) {
  blockKeywords = stringToArray(msg.message['blockKeywords'])
  blockDomains = stringToArray(msg.message['blockDomains'])
  showRemovalNotice = msg.message['showRemovalNotice']
  onSettingsReceived()
}

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

if (window.top === window) {
  document.addEventListener('DOMContentLoaded', () => setup())
}
