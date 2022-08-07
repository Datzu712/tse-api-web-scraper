import { TseClient } from '../src/client/TseClient';

async function start() {
    const client = new TseClient();
    await client.start();

    const person = await client.getPersonByDNI('');

    console.log(person);
    await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 2000)));
}
start();
