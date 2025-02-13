import { type Browser, launch, Page } from 'puppeteer';
import { Person } from '../entities/person';
import InMemoryCache from '../utils/cache-service';

const TSE_URL = 'https://servicioselectorales.tse.go.cr/chc/consulta_cedula.aspx';

// This was a copy pase (with some changes) from an nestjs service of one of my projects so probably you will need to adapt it to your needs, but it should work fine.
// This class works as multi scrapper service for the Tribunal Supremo Electoral
export class TribunalSupremoElectoralService {
    // winston/useful-logger/whatever
    private logger = (message: string) => console.log(`[TSE Service] ${message}`);

    private browser: Browser;
    // Pool of pages to be used for scraping
    private pagePool: Page[] = [];
    private readonly poolSize = 5;
    // Queue of waiting requests for pages.
    private waitingQueue: ((page: Page) => void)[] = [];

    constructor(private cache = new InMemoryCache()) {}

    async onModuleInit() {
        await this.initBrowser();
        await this.initPagePool();
    }

    async onModuleDestroy() {
        await this.closeBrowser();
    }

    private async initBrowser() {
        this.browser = await launch({
            headless: false,
            defaultViewport: null,
            executablePath: '/usr/bin/google-chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    }

    private async initPagePool() {
        for (let i = 0; i < this.poolSize; i++) {
            const page = await this.browser.newPage();
            this.pagePool.push(page);
        }
    }

    /**
     * Retrieves a page from the pool if available, otherwise returns a promise that resolves
     * when a page becomes available.
     *
     * @returns {Promise<Page> | Page} A Page object if available, otherwise a promise that resolves with a Page object.
     */
    private getPageFromPool(): Promise<Page> | Page {
        if (this.pagePool.length > 0) {
            return this.pagePool.pop() as Page;
        } else {
            return new Promise((resolve) => {
                this.waitingQueue.push(resolve);
            });
        }
    }

    /**
     * Returns a page to the pool or resolves the next promise in the waiting queue.
     *
     * @param page - The page to be returned to the pool.
     * @returns A promise that resolves when the page is returned to the pool or assigned to a waiting request.
     */
    private returnPageToPool(page: Page) {
        if (this.waitingQueue.length > 0) {
            const resolve = this.waitingQueue.shift();
            if (resolve) {
                resolve(page);
            }
        } else {
            this.logger('Returning page to the pool.');
            this.pagePool.push(page);
        }
        this.logger(`Current pool size: ${this.pagePool.length}`);
        this.logger(`Current waiting queue size: ${this.waitingQueue.length}`);

        // Log RAM usage
        const memoryUsage = process.memoryUsage();
        const ramUsageInMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        this.logger(`RAM usage: ${ramUsageInMB} MB`);
    }

    public async getPersonById(dni: string): Promise<Person | null> {
        const cacheKey = `tse:person:${dni}`;
        const cachedData = this.cache.get(cacheKey);

        if (cachedData) {
            this.logger(`Cache hit for DNI: ${dni}`);
            return JSON.parse(cachedData);
        }

        const page = await this.getPageFromPool();
        try {
            this.logger(`Scraping data for DNI: ${dni}`);
            await page.goto(TSE_URL, {
                waitUntil: 'networkidle2',
            });

            const person = await this.scrapeData(page, dni);

            if (person) {
                this.logger(`Scraped data for DNI: ${dni}, caching result.`);
                this.cache.set(cacheKey, JSON.stringify(person));
            } else {
                this.logger(`No data found for DNI: ${dni}`);
            }

            await page.goto('about:blank');

            return person;
        } catch (error) {
            this.logger('Error scraping data:');
            throw error;
        } finally {
            this.returnPageToPool(page);
        }
    }

    private async scrapeData(page: Page, dni: string): Promise<Person | null> {
        await page.waitForSelector('input[name=txtcedula]');

        await page.type('input[name=txtcedula]', dni);

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
        if (!response) return null;

        const data = await page.evaluate(() => {
            const getElementText = (id: string) => document.getElementById(id)?.innerText || '';

            return {
                fullName: getElementText('lblnombrecompleto'),
                dni: getElementText('lblcedula'),
                dateOfBirth: getElementText('lblfechaNacimiento'),
                nationality: getElementText('lblnacionalidad'),
                age: getElementText('lbledad'),
                isMarginal: getElementText('lblLeyendaMarginal') as 'SI' | 'NO',
                fatherName: getElementText('lblnombrepadre'),
                fatherDni: getElementText('lblid_padre'),
                motherName: getElementText('lblnombremadre'),
                motherDni: getElementText('lblid_madre'),
                alias: getElementText('lblconocidocomo'),
            };
        });

        return new Person(data);
    }

    private async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}
