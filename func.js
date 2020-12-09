const hot = async () => {
  await scrollPage()
  await clickElements()
  const articles = selectEls('.List .ContentItem')
  const result = articles.map(item => {
    return {
      title: item.querySelector('.ContentItem-title').innerText,
      content: item.querySelector('.RichContent-inner').innerText
    }
  })
  return result

  function selectEls(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector))
  }

  function clickElements() {
    const contentEls = selectEls('.List .RichContent-inner')
    return new Promise(resolve => {
      contentEls.forEach(el => el.click())
      setTimeout(resolve, 500)
    })
  }

  async function scrollPage() {
    const MAX = 300
    let count = 1
    return new Promise((resolve) => {
      +function loop() {
        window.scrollTo(0, Number.MAX_SAFE_INTEGER)
        setTimeout(() => {
          if (isEnd() || count >= MAX) {
            resolve()
          } else {
            count++
            loop()
          }
        }, 2000)
      }()
    })
    function isEnd() {
      const height = document.documentElement.scrollHeight
      if (!isEnd.height || isEnd.height !== height) {
        isEnd.height = document.documentElement.scrollHeight
        return false
      } else {
        return true
      }
    }
  }
}

const intro = async () => {
  await scrollPage()
  document.querySelector('.Button.TopicAbstract-action.Button--plain').click()
  await sleep()
  // 简介+更多信息
  let intro = document.querySelector('.TopicCommonField-text').innerText + '\n'
  intro += selectEls(".TopicCommonField-text p").map(e => e.innerText).join("\n")
  // 摘录
  const content = selectEls(".AbstractCard-text.AbstractCard-text--expand").map(e => e.innerText).join("\n")
  return { intro, content }

  function selectEls(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector))
  }

  async function scrollPage() {
    return new Promise((resolve) => {
      +function loop() {
        window.scrollTo(0, Number.MAX_SAFE_INTEGER)
        setTimeout(() => {
          if (isEnd()) {
            resolve()
          } else {
            loop()
          }
        }, 2000)
      }()
    })
    function isEnd() {
      const height = document.documentElement.scrollHeight
      if (!isEnd.height || isEnd.height !== height) {
        isEnd.height = document.documentElement.scrollHeight
        return false
      } else {
        return true
      }
    }
  }

  async function sleep() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 800);
    })
  }
}

module.exports.hot = hot
module.exports.topAnswers = hot
module.exports.intro = intro