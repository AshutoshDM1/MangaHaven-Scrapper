import * as fs from "fs-extra";
import * as path from "path";
import puppeteer from "puppeteer";
import { downloadImages } from "../utils/downloadImages";
import { createCustomFolderName } from "../utils/createFolder";
import { RequestHandler } from "express";
const BASE_URL =
  "https://mangadex.org/chapter/04842f6a-ec15-46c6-bddb-73a0ece5b15e/1";
const OUTPUT_DIR = path.join(__dirname, "..", "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");

// Ensure output directories exist
fs.ensureDirSync(OUTPUT_DIR);
fs.ensureDirSync(IMAGES_DIR);

// Main Function
const main: RequestHandler<{}, {}, { URL: string }, {}> = async (req, res) => {
  const { URL } = req.body;
  console.log("\n=== Starting manga chapter image scraper... ===\n");
  console.log(
    "📝 This Code is written by @AshutoshDM1 on Date-12/05/2025 mayAfter long time it dont work"
  );

  try {
    // Launch browser in headless mode
    const browser = await puppeteer.launch({
      headless: true, // Set to false to see the browser UI
      defaultViewport: null,
    });

    const page = await browser.newPage();

    // Set a user agent to avoid being detected as a bot
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    // Navigate to the manga chapter page on mangadex
    console.log(`🌐 Navigating to ${URL || BASE_URL}...`);
    await page.goto(URL || BASE_URL, { waitUntil: "networkidle2" });

    // Create the custom folder to save the images
    console.log("📁 Creating Folder.....");
    const mangaFolderName = await createCustomFolderName(page, "manga");

    const mangaFolderPath = path.join(IMAGES_DIR, mangaFolderName);
    fs.ensureDirSync(mangaFolderPath);
    console.log(`✅ Created folder: ${mangaFolderPath}`);

    // Wait to ensure page is fully loaded
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      console.log("🔍 First opening the menu");
      // Query for an element handle.
      await page.locator('div ::-p-text("Menu")').click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.locator('button ::-p-text("Single Page")').click();
      console.log("👆 Clicked on single page");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.locator('button ::-p-text("Double Page")').click();
      console.log("👆 Clicked on double page");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.locator("div").scroll({
        scrollTop: 100,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log("❌ Cant find the menu button or the buttons");
    }

    // Extract total chapter pages
    console.log("📄 Extracting total chapter pages");

    const customFolderName = await createCustomFolderName(
      page,
      mangaFolderName
    );

    const customFolderPath = path.join(IMAGES_DIR, customFolderName);
    fs.ensureDirSync(customFolderPath);

    const totalChapterPages = await page.evaluate(() => {
      const pageElements = document.querySelector(".reader--meta.page");
      if (pageElements) {
        const chapterPages = pageElements.textContent?.split("/")[1];
        return chapterPages;
      }
      return "did not find page elements";
    });

    console.log(`📊 Total chapter pages: ${totalChapterPages}`);

    // Download images
    await downloadImages(page, browser, customFolderPath);

    // Close the browser
    await browser.close();
    console.log("🔒 Browser closed.");
    console.log("\n✨ Scraping completed successfully! ✨\n");
  } catch (error) {
    console.error("❌ Error in scraper:", error);
  }
};

export default main;
