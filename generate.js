// npx http-server
// node generate.js

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");

function readCSV(filePath){

    return new Promise((resolve,reject)=>{

        const results=[];

        fs.createReadStream(filePath)

            .pipe(csv())

            .on("data",(row)=>{

                results.push({

                    company: row.Company,

                    previous: Number(row.Previous),

                    current: Number(row.Current),

                    traffic: Number(row.Traffic),

                    coupon: row.Coupon

                });

            })

            .on("end",()=>{

                resolve(results);

            })

            .on("error",reject);

    });

}

(async () => {

    const browser = await puppeteer.launch({
        headless: "new"
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: 1600,
        height: 1300,
        deviceScaleFactor: 2
    });

    const companies = await readCSV(
        "data/Success_Report_Data.csv"
    );

    console.log(companies);
    console.log(companies);    
    await page.goto("http://127.0.0.1:8080");
    for (const company of companies) {

        await page.evaluate((company) => {

            window.renderReport(company);

        }, company);

        await page.screenshot({

            path: `output/${company.company}.png`,

            fullPage: true

        });

        console.log(`Generated: ${company.company}`);

    }

    console.log("Screenshot Saved");

    await browser.close();

    await browser.close();

})();