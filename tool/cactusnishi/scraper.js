const fs = require("fs");
const puppeteer = require("puppeteer");

const urlMap = {
  "MS01.htm": "http://www.cactusnishi.com/HPP/CataTop01/MS/MS01.htm",
  "HTX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HTX/HTX01.htm",
  "HSI01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HSI/HSI01.htm",
  "KJX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HJX/KJX01.htm",
  "HO02.htm": "http://www.cactusnishi.com/HPP/CataTop01/HO2/HO02.htm",
  "HOF01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HOF/HOF01.htm",
  "HSS01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HSS/HSS01.htm",
  "HOX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HOX/HOX01.htm",
  "HKF01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HKF/HKF01.htm",
  "HCO01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HCO/HCO01.htm",
  "HCNX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HCNX01/HCNX01.htm",
  "HCR01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HCR/HCR01.htm",
  "HKB01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HKB/HKB01.htm",
  "HKX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HKX/HKX01.htm",
  "NM01.htm": "http://www.cactusnishi.com/HPP/CataTop01/NM/NM01.htm",
  "HMSP01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HMSP/HMSP01.htm",
  "HMX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HMX/HMX01.htm",
  "HPC01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HPC/HPC01.htm",
  "HPX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HPX/HPX01.htm",
  "KX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/KX/KX01.htm",
  "K01.htm": "http://www.cactusnishi.com/HPP/CataTop01/K/K01.htm",
  "HT02.htm": "http://www.cactusnishi.com/HPP/CataTop01/HT2/HT02.htm",
  "HCOX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HCOX/HCOX01.htm",
  "HBE01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HBE/HBE01.htm",
  "HLE01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HLE/HLE01.htm",
  "HLX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HLX/HLX01.htm",
  "HUR01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HUR/HUR01.htm",
  "HS01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HS/HS01.htm",
  "HSX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HSX/HSX01.htm",
  "HL01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HL/HL01.htm",
  "HLAX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HLAX/HLAX01.htm",
  "HRO01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HRO/HRO01.htm",
  "HC01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HC/HC01.htm",
  "HCX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HCX/HCX01.htm",
  "HR01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HR/HR01.htm",
  "HRX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HRX/HRX01.htm",
  "HOG01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HOG/HOG01.htm",
  "HGX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HGX/HGX01.htm",
  "HGF01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HGF/HGF01.htm",
  "HP01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HP/HP01.htm",
  "HPGX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HPGX/HPGX01.htm",
  "HW01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HW/HW01.htm",
  "HWX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HWX/HWX01.htm",
  "MU.htm": "http://www.cactusnishi.com/HPP/CataTop01/MU/MU.htm",
  "HVX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HVX/HVX01.htm",
  "HV01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HV/HV01.htm",
  "HB01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HB/HB01.htm",
  "HBA01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HBA/HBA01.htm",
  "HF01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HF/HF01.htm",
  "HG01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HG/HG01.htm",
  "HGAX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HGAX/HGAX01.htm",
  "HSP01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HSP/HSP01.htm",
  "HSPX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HSPX/HSPX01.htm",
  "HCRX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HCRX/HCRX01.htm",
  "AG01.htm": "http://www.cactusnishi.com/HPP/CataTop01/AG/AG01.htm",
  "GE01.htm": "http://www.cactusnishi.com/HPP/CataTop01/GE/GE01.htm",
  "HKCX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/HKCX/HKCX01.htm",
  "GAX01.htm": "http://www.cactusnishi.com/HPP/CataTop01/GAX/GAX01.htm",
  "BRS.htm": "http://www.cactusnishi.com/HPP/CataTop01/BRS/BRS.htm",
  "MTS.htm": "http://www.cactusnishi.com/HPP/CataTop01/MTS/MTS.htm",
  "YOS.htm": "http://www.cactusnishi.com/HPP/CataTop01/YOS/YOS.htm",
  "SU.htm": "http://www.cactusnishi.com/HPP/CataTop01/SU/SU.htm",
};

const normalize = (val) => {
  if (!val) {
    return null;
  }

  return val.replace(/[\n 　]|('.*')/g, "");
};

const normalizeEn = (val) => {
  if (!val) {
    return null;
  }

  return val.replace(/[\n　]/g, "");
};

const scrape = async (fileName) => {
  const htmlContent = fs.readFileSync(
    __dirname + `/htmldata/${fileName}`,
    "utf8"
  );
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  let allItems = await page.evaluate(() => {
    return [
      ...document.querySelectorAll(
        "body > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody td[valign=top]"
      ),
    ]
      .map((e) => ({
        name: e.querySelector("b") ? e.querySelector("b").innerText : null,
        name_en: e.querySelector("span[lang=EN-US]")
          ? e.querySelector("span[lang=EN-US]").innerText
          : null,
      }))
      .filter((item) => item.name || item.name_en);
  });
  allItems = allItems.map((item) => ({
    name: normalize(item.name),
    name_en: normalize(item.name_en),
    url: urlMap[fileName],
  }));

  await browser.close();

  return allItems;
};

var allData = [];
const files = fs.readdirSync(__dirname + "/htmldata");

(async () => {
  for (const file of files) {
    const data = await scrape(file);
    allData = allData.concat(data);
    console.info(file);
  }
  console.info("finish");
  fs.writeFileSync(__dirname + `/data/data.json`, JSON.stringify(allData));
})();
