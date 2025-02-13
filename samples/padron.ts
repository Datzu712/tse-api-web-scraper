import { PadronService } from '../src/padron/padron-service';

async function main() {
    const padron = new PadronService('datasets/PADRON.txt');
    const person = await padron.getPersonaByDni(process.argv[2]);
    console.log(person);
}
main();
