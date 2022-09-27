import { Page } from 'puppeteer';
import { QueryScraper } from './QueryScraper';

import type { Person } from './structures/Person';
import type { TseClient } from './TseClient';

export class QueryCreator {
    constructor(private client: TseClient) {}

    /**
     * Create a consult in TSE to query by [ID number](https://servicioselectorales.tse.go.cr/chc/consulta_cedula.aspx)
     * @param { string } dni - ID number of the person to query
     */
    public async queryByDNI(page: Page, dni: string): Promise<Person | null> {
        await page.waitForSelector('input[name=txtcedula]');

        await page.type('input[name=txtcedula]', dni);

        await page.click('#btnConsultaCedula');
        //await page.waitForSelector('#UpdatePanel4');
        //await
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

        return QueryScraper.getPersonBasicDetails(page);
    }
}
