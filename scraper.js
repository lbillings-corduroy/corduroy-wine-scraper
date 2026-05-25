const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
 
puppeteer.use(StealthPlugin());
 
async function scrapeWines() {
  console.log('Starting wine scraper with stealth mode...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled'
    ]
  });
 
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });
 
    console.log('Fetching Toast page with stealth mode...');
    await page.goto('https://order.toasttab.com/order-and-pay/corduroy-inn-lodge-5811-snowshoe-drive/W', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
 
    // Wait longer for Cloudflare to clear
    console.log('Waiting for Cloudflare to clear...');
    await new Promise(resolve => setTimeout(resolve, 8000));
 
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        bodyText: document.body.innerText.substring(0, 3000),
        hasCloudflare: document.body.innerText.includes('security verification') || 
                       document.body.innerText.includes('Cloudflare')
      };
    });
 
    console.log('=== PAGE TITLE ===');
    console.log(pageContent.title);
    console.log('=== CLOUDFLARE DETECTED ===');
    console.log(pageContent.hasCloudflare);
    console.log('=== PAGE TEXT ===');
    console.log(pageContent.bodyText);
 
    if (pageContent.hasCloudflare) {
      console.log('=== CLOUDFLARE STILL BLOCKING - need different approach ===');
    } else {
      console.log('=== SUCCESS - Got past Cloudflare, reading menu data ===');
    }
 
  } catch (error) {
    console.error('Scraper error:', error.message);
  } finally {
    await browser.close();
  }
}
 
scrapeWines();
