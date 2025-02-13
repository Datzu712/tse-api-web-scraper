import { TribunalSupremoElectoralService } from '../src/TSE/tse-service';

// put the DNIs you want to search here
const targetDnis = [] as string[];

async function main() {
    const tseService = new TribunalSupremoElectoralService();
    await tseService.onModuleInit();

    const promises = [] as Promise<void>[];
    for (const dni of targetDnis) {
        promises.push(
            tseService.getPersonById(dni).then((person) => {
                if (!person) {
                    console.log(`No data found for DNI: ${dni}`);
                    return;
                }
                console.log(person);
            }),
        );
    }

    await Promise.all(promises);
    await tseService.onModuleDestroy();
}
main();
