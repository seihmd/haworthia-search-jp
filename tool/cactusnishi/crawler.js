const puppeteer = require('puppeteer');
const fs = require('fs');

const TOP_PAGE = 'http://www.cactusnishi.com/HPP/CataTop01/CataTop01.htm';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(TOP_PAGE);
    const allLinks = await page.evaluate(() => {
        return [...document.querySelectorAll('body > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > div:nth-child(2) > center > table a')]
            .map(e => e.href);
    });

    const linkSet = new Set(allLinks);

    for (const link of linkSet.keys()) {
        console.log(link);
        await page.goto(link);
        const content = await page.content();

        const url = new URL(link);
        const fileName = url.pathname.split('/').reverse()[0];

        fs.writeFileSync(__dirname + `/htmldata/${fileName}`, content);

        await page.waitFor(1000)
        break;
    }

    await browser.close();
})();