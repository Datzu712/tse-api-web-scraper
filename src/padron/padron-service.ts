/**
 * To run this scrip you need to download the PADRON.txt (full version) from https://www.tse.go.cr/descarga_padron.html
 * Direct link: https://www.tse.go.cr/zip/padron/padron_completo.zip
 */

import InMemoryCache from '../utils/cache-service';
import { execPromise } from '../utils/exec-promise';

export interface PadronPersona {
    cedula: string;
    codelec: string;
    relleno: string;
    fecha_caducacion: string;
    junta: string;
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
}

export class PadronService {
    constructor(
        private PADRON_PATH: string,
        private cache = new InMemoryCache(),
    ) {}

    async getPersonaByDni(dni: string): Promise<PadronPersona | null> {
        const cacheKey = `padron:persona:${dni}`;
        const cachedData = this.cache.get(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const command = `fgrep -m 1 -s "${dni}" ${this.PADRON_PATH}`;

        try {
            const { stdout, stderr } = await execPromise(command);
            if (stderr) {
                throw new Error(stderr);
            }
            if (stdout) {
                const data = stdout.trim();
                const mappedData = PadronService.mapData(data);
                this.cache.set(cacheKey, JSON.stringify(mappedData)); // No expiration
                return mappedData;
            } else {
                return null;
            }
        } catch (error) {
            if (error.code === 1) {
                return null;
            } else {
                throw error;
            }
        }
    }

    private static mapData(data: string) {
        const fields = data.split(',');
        return {
            cedula: fields[0].trim(),
            codelec: fields[1].trim(),
            relleno: fields[2].trim(),
            fecha_caducacion: fields[3].trim(),
            junta: fields[4].trim(),
            nombre: fields[5].trim(),
            primer_apellido: fields[6].trim(),
            segundo_apellido: fields[7].trim(),
        };
    }
}
