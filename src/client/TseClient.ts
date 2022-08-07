import { type Browser, type Page, launch } from 'puppeteer';
import { QueryCreator } from './QueryCreator';
import { Person } from './structures/Person';

export interface TseClientOptions {
    headless?: boolean;
}

export class TseClient {
    private browser!: Browser;
    private page!: Page;
    private queryCreator: QueryCreator;

    constructor(private config?: TseClientOptions) {
        this.queryCreator = new QueryCreator(this);
    }

    /**
     * Starts the browser and creates a browser instance.
     *
     * @publicApi
     */
    public async start() {
        this.browser = await launch({ headless: this.config?.headless });
    }

    public async openPage(url: string): Promise<Page> {
        this.page = await this.browser.newPage();
        await this.page.goto(url, { waitUntil: 'networkidle2' });

        return this.page;
    }

    public async closePage(): Promise<void> {
        await this.page.close();
    }

    public async closeBrowser(): Promise<void> {
        await this.browser.close();
    }

    /**
     * Get a person by ID number.
     * @param { string } dni - ID number of the person to query in TSE
     *
     * @publicApi
     */
    public getPersonByDNI(dni: string): Promise<Person> {
        return this.queryCreator.queryByDNI(dni);
    }
}
