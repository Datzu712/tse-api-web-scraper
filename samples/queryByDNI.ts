import { TseClient } from '@tse/client';

async function start() {
    const client = new TseClient();
    await client.start();
    const person = await client.getPersonByDNI('801330617');
    console.log(person);
    await client.closePage();
    await client.closeBrowser();
}
start();
