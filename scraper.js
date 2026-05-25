const puppeteer = require('puppeteer');
 
async function scrapeWines() {
  console.log('Starting wine scraper...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });
 
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
    console.log('Fetching Toast page...');
    await page.goto('https://order.toasttab.com/order-and-pay/corduroy-inn-lodge-5811-snowshoe-drive/W', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
 
    console.log('Page loaded. Waiting for menu items...');
    await page.waitForSelector('[data-testid="menu-item"]', { timeout: 15000 })
      .catch(() => console.log('Selector not found - dumping page content'));
 
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        bodyText: document.body.innerText.substring(0, 2000),
        html: document.body.innerHTML.substring(0, 5000)
      };
    });
 
    console.log('=== PAGE TITLE ===');
    console.log(pageContent.title);
    console.log('=== PAGE URL ===');
    console.log(pageContent.url);
    console.log('=== PAGE TEXT (first 2000 chars) ===');
    console.log(pageContent.bodyText);
    console.log('=== SUCCESS - Scraper can read the page ===');
 
  } catch (error) {
    console.error('Scraper error:', error.message);
  } finally {
    await browser.close();
  }
}
 
scrapeWines();
