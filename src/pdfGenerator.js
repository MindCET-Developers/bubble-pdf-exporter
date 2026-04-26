const puppeteer = require('puppeteer');

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
  }
  return browserInstance;
}

function buildHeaderTemplate() {
  return '<span></span>';
}

function buildFooterTemplate() {
  return '<span></span>';
}

async function generatePDF(html, options = {}) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const baseMargin = options.margin || '15mm';

    const pdfOptions = {
      format: options.page_size || 'A4',
      landscape: options.orientation === 'landscape',
      printBackground: true,
      margin: {
        top: baseMargin,
        bottom: baseMargin,
        left: baseMargin,
        right: baseMargin,
      },
    };

    const buffer = await page.pdf(pdfOptions);
    return buffer;
  } finally {
    await page.close();
  }
}

async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

module.exports = { generatePDF, closeBrowser };
