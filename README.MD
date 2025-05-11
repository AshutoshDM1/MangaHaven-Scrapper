# MangaScraper

A web scraper for MangaFire built with Node.js, TypeScript, Puppeteer, and Cheerio.

## Features

- Scrapes manga list from MangaFire
- Extracts manga details (title, description, genres)
- Extracts chapter information
- Downloads images for each chapter
- Saves all data in JSON format

## Technologies Used

- TypeScript
- Node.js
- Puppeteer (for handling dynamic JavaScript content)
- Cheerio (for HTML parsing)
- Axios (for HTTP requests)
- fs-extra (for file operations)

## Prerequisites

- Node.js (v14 or higher)
- Yarn or npm

## Installation

1. Clone this repository

   ```
   git clone https://github.com/yourusername/mangascraper.git
   cd mangascraper
   ```

2. Install dependencies
   ```
   yarn install
   ```
   or
   ```
   npm install
   ```

## Usage

1. Build the TypeScript code:

   ```
   yarn build
   ```

   or

   ```
   npm run build
   ```

2. Run the scraper:

   ```
   yarn start
   ```

   or

   ```
   npm start
   ```

3. For development (build and run in one step):
   ```
   yarn dev
   ```
   or
   ```
   npm run dev
   ```

## Output

The scraper will create an `output` directory with:

- `manga_list.json` - List of all scraped manga
- Individual JSON files for each manga with details
- `images` folder containing downloaded cover images and chapter pages

## Customizing

You can modify the scraper behavior by editing the following constants in `src/index.ts`:

- `BASE_URL` - The base URL of MangaFire
- `OUTPUT_DIR` - Where to store output files
- `IMAGES_DIR` - Where to store downloaded images

## Notes

- The scraper is currently set to process only 5 manga titles and download only the first chapter of each, with 3 sample pages, to avoid overwhelming the server. You can adjust these limits in the code.
- Website structures may change over time, so the selectors used in this scraper may need to be updated occasionally.

## Legal Disclaimer

This scraper is provided for educational purposes only. Scraping websites may be against their terms of service. Always check and respect the robots.txt file and terms of service of any website you scrape.

Do not use this scraper for commercial purposes or for mass downloading of copyrighted content. The user is solely responsible for how they use this tool.

## License

This project is licensed under the ISC License - see the LICENSE file for details.
