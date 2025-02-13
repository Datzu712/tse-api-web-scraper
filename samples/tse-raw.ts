import { launch, type Page } from 'puppeteer';
import { Person } from '../src/entities/person';

const TARGET_DNI = process.argv[2];

async function scrapeData(page: Page) {
    const data = await page.evaluate(() => {
        return {
            fullName: document.getElementById('lblnombrecompleto')?.innerText as string,
            dni: document.getElementById('lblcedula')?.innerText as string,
            dateOfBirth: document.getElementById('lblfechaNacimiento')?.innerText as string,
            nationality: document.getElementById('lblnacionalidad')?.innerText as string,
            age: document.getElementById('lbledad')?.innerText as string,
            isMarginal: document.getElementById('lblLeyendaMarginal')?.innerText as 'SI' | 'NO',
            fatherName: document.getElementById('lblnombrepadre')?.innerText as string,
            fatherDni: document.getElementById('lblid_padre')?.innerText,
            motherName: document.getElementById('lblnombremadre')?.innerText as string,
            motherDni: document.getElementById('lblid_madre')?.innerText,
            alias: document.getElementById('lblconocidocomo')?.innerText,
        };
    });
    return new Person(data);
}

async function main() {
    console.time('Execution Time');
    const initialMemoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Initial Memory Usage: ${initialMemoryUsage.toFixed(2)} MB`);

    const browser = await launch({
        headless: true,
        defaultViewport: null,
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://servicioselectorales.tse.go.cr/chc/consulta_cedula.aspx', {
        waitUntil: 'networkidle2',
    });

    await page.waitForSelector('input[name=txtcedula]');

    await page.type('input[name=txtcedula]', TARGET_DNI);
    await page.click('#btnConsultaCedula');

    const response = await Promise.race([
        (async () => {
            await page.waitForSelector('#UpdatePanel4', { visible: true });
            // found
            return true;
        })(),
        (async () => {
            await page.waitForSelector('#lblmensaje1', { visible: false });
            // not found
            return false;
        })(),
    ]);
    if (!response) {
        console.log('Person not found :(');
        console.timeEnd('Execution Time');
        const finalMemoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`Final Memory Usage: ${finalMemoryUsage.toFixed(2)} MB`);
        return;
    }

    const data = await scrapeData(page);
    console.log(data);

    await browser.close();

    console.timeEnd('Execution Time');
    const finalMemoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Final Memory Usage: ${finalMemoryUsage.toFixed(2)} MB`);
}
main();
