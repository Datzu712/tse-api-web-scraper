import { QueryScraper } from './QueryScraper';

import type { Person } from './structures/Person';
import type { TseClient } from './TseClient';

export class QueryCreator {
    constructor(private client: TseClient) {}

    /**
     * Create a consult in TSE to query by [ID number](https://servicioselectorales.tse.go.cr/chc/consulta_cedula.aspx)
     * @param { string } dni - ID number of the person to query
     */
    public async queryByDNI(dni: string): Promise<Person> {
        const page = await this.client.openPage('https://servicioselectorales.tse.go.cr/chc/consulta_cedula.aspx');

        await page.waitForSelector('input[name=txtcedula]');

        await page.type('input[name=txtcedula]', dni);

        await page.click('#btnConsultaCedula');
        await page.waitForSelector('#UpdatePanel4');

        return QueryScraper.getPersonBasicDetails(page);
    }
}
