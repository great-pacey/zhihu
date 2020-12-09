const puppeteer = require('puppeteer')
const fs = require("fs")
const chalk = require('chalk')
const config = require("./config.js")
const innerFunc = require("./func.js")
const log = console.log

let { url, id } = config
id = id || /\d+/g.exec(url)[0]

const urls = {
  intro: `https://www.zhihu.com/topic/${id}/intro`,
  hot: `https://www.zhihu.com/topic/${id}/hot`,
  topAnswers: `https://www.zhihu.com/topic/${id}/top-answers`,
}

const unanswered = `https://www.zhihu.com/topic/${id}/unanswered`

class Spider {
  constructor() {
    this.run()
  }

  async run() {
    this.browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null })
    try {
      const data = Object.create(null)
      for (const key of Object.keys(urls)) {
        data[key] = await this.crawSimple(key)
      }
      await this.outputFile(data)
    } catch (error) {
      log(chalk.red(error))
    } finally {
      this.browser.close()
      process.exit(0)
    }
  }

  async crawSimple(model) {
    const page = await this.browser.newPage()
    log(chalk.yellow(`正在打开${model}网页...`))
    page.on('load', () => log(chalk.green(`${model}页面初始加载完成`)))
    await page.goto(urls[model])
    log(chalk.yellow('等待加载更多页面资源...'))
    const pageData = await page.evaluate(innerFunc[model])
    log(chalk.green(`${model}页面内容已经抓取成功`))
    return pageData
  }

  async outputFile(data) {
    return new Promise(resolve => {
      const ws = fs.createWriteStream('data.json')
      ws.on("finish", () => {
        log("文件生成成功")
        resolve()
      })
      ws.on("data", () => {
        log("生成文件中")
      })
      ws.write(JSON.stringify(data, null, 2))
      ws.end()
    })
  }
}

new Spider()
