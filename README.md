# TSE API

This project provides a service to scrape data from the Tribunal Supremo Electoral (TSE) website and a service to query data from the PADRON.txt file.

## Project Structure

- `src/TSE/tse-service.ts`: Service for scraping data from the TSE website with an page pool mechanism.
- `src/TSE/raw-tse.ts`: Script for scraping data from the TSE website using a raw approach.
- `src/padron/padron-service.ts`: Service for querying data from the PADRON.txt file.
- `samples/tse-service.ts`: Sample usage of the TSE service.
- `samples/tse-raw.ts`: Sample usage of the raw TSE script.
- `samples/padron.ts`: Sample usage of the PADRON service.

## Setup

1. Install dependencies:
    ```bash
    npm install
    ```

2. Download the PADRON.txt file from [TSE](https://www.tse.go.cr/descarga_padron.html) and place it in the `datasets` directory.
2.1 You can use this command:
    ```bash
    wget https://www.tse.go.cr/zip/padron/padron_completo.zip
    unzip padron_completo.zip
    mv PADRON.txt datasets/
    rm padron_completo.zip
    ```


## Usage

### TSE Service

The TSE service scrapes data from the TSE website. You can use the sample script to see how it works. (Note: You should change the DNI array in the script, for the rest of scripts you can pass the DNI as an argument)

```bash
ts-node samples/tse-service.ts
```

### Raw TSE Script

The raw TSE script is a simpler approach to scrape data from the TSE website.

```bash
ts-node samples/tse-raw.ts <DNI>
```

### PADRON Service

The PADRON service queries data from the PADRON.txt file. You can use the sample script to see how it works.

```bash
ts-node samples/padron.ts <DNI>
```

## Notes

- Ensure you have Google Chrome installed at `/usr/bin/google-chrome`.
- Adjust the `executablePath` in the Puppeteer launch options if Chrome is installed in a different location.
- The TSE service uses an in-memory cache to store scraped data.
- The PADRON service uses `fgrep` to search for data in the PADRON.txt file.

## License

This project is licensed under the MIT License.