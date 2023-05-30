import { resolve } from 'path'
import { promises as fs } from 'fs'
import { selector } from './utils.js'
import { chromium } from 'playwright'

const { PAGE_URI } = process.env

async function pageTextContext(n) {
  return {
    title: (await page.textContent(selector(n, 1))).trim(),
    book: (await page.textContent(selector(n, 2))).trim(),
    content: (await page.textContent(selector(n, 3))).trim()
  }
}

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(PAGE_URI)

  const [date, readingOfToday, gospelOfTheDay] = await Promise.all([
    page.textContent('#dataFilter-text'),
    pageTextContext(3),
    pageTextContext(4)
  ])

  await browser.close()

  await fs.writeFile(
    resolve('word.json'),
    JSON.stringify({ date, readingOfToday, gospelOfTheDay })
  )
})()
