import type { Page } from 'puppeteer';
import { Person } from './structures/Person';

export enum QueryContext {
    DNI,
    nameAndSurname,
}

export class QueryScraper {
    /**
     * Get the basic data of person in the TSE query.
     * @param { page } page - Page object of the TSE website
     */
    static async getPersonBasicDetails(page: Page): Promise<Person> {
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
}
