import { resolve } from 'path'
import { PAGE_URI } from './constants.js'
import { promises as fs } from 'fs'
import { chromium } from 'playwright'
import { selector } from './utils.js'
;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(PAGE_URI)
  const [date, readingOfToday, gospelOfTheDay] = await Promise.all([
    page.textContent('#dataFilter-text'),
    {
      title: await page.textContent(selector(3, 1)),
      book: await page.textContent(selector(3, 2)),
      content: await page.textContent(selector(3, 3))
    },
    {
      title: await page.textContent(selector(4, 1)),
      book: await page.textContent(selector(4, 2)),
      content: await page.textContent(selector(4, 3))
    }
  ])

  await browser.close()

  await fs.writeFile(
    resolve('daily.json'),
    JSON.stringify({ date, readingOfToday, gospelOfTheDay })
  )
})()
