import { TseClient } from '../src/client/TseClient';

const DNIs = ['PUT A LIST OF DNI HERE'];

async function start() {
    const client = new TseClient({ headless: false });
    await client.start();

    for (const DNI of DNIs) {
        client.getPersonByDNI(DNI).then(console.log);
    }
}
start();
