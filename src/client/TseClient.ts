import { type Browser, launch } from 'puppeteer';
import { QueryCreator } from './QueryCreator';
import { Person } from './structures/Person';

export interface TseClientOptions {
    headless?: boolean;
}

export class TseClient {
    private browser!: Browser;
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
        this.browser = await launch({ headless: this.config?.headless, ignoreDefaultArgs: ['--disable-extensions'] });
    }

    public async close(): Promise<void> {
        await this.browser.close();
    }

    /**
     * Get a person by ID number.
     * @param { string } dni - ID number of the person to query in TSE
     *
     * @publicApi
     */
    public async getPersonByDNI(dni: string): Promise<Person | null> {
        if (dni.length !== 9) throw new Error('The ID number must be 9 digits long');
        const page = await this.browser.newPage();
        await page.goto('https://servicioselectorales.tse.go.cr/chc/consulta_cedula.aspx', {
            waitUntil: 'networkidle2',
        });

        const data = await this.queryCreator.queryByDNI(page, dni);
        await page.close();

        return data;
    }
}
