import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs-extra";
import * as path from "path";
import puppeteer, { Browser } from "puppeteer";
import { Page } from "puppeteer";

// Interfaces for manga data
interface Manga {
  title: string;
  url: string;
  coverImage?: string;
  description?: string;
  genres?: string[];
  chapters?: Chapter[];
}

interface Chapter {
  title: string;
  number: number;
  url: string;
  pages?: string[];
}

// Base URL for MangaFire
// const BASE_URL = "https://mangaplus.shueisha.co.jp/titles/100020";
const BASE_URL =
  "https://mangadex.org/chapter/dbf58054-135f-4a03-820e-0a2c96f982c8/1";
const OUTPUT_DIR = path.join(__dirname, "..", "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");

// Ensure output directories exist
fs.ensureDirSync(OUTPUT_DIR);
fs.ensureDirSync(IMAGES_DIR);

/**
 * Function to create a safe folder name from a URL
 */
function createSafeFolderName(url: string): string {
  // Extract domain and path from URL
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const pathSegments = urlObj.pathname.split("/").filter(Boolean);

  // Create folder name
  return `${domain}_${pathSegments.join("_")}`;
}

/**
 * Function to sanitize a string for use as a folder name
 */
function sanitizeFolderName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim();
}

/**
 * Main function to run the scraper
 */
async function main() {
  console.log("Starting manga chapter image scraper...");

  try {
    // Create a folder for this manga chapter based on the URL
    const mangaFolderName = createSafeFolderName(BASE_URL);
    const mangaFolderPath = path.join(IMAGES_DIR, mangaFolderName);
    fs.ensureDirSync(mangaFolderPath);

    console.log(`Created folder: ${mangaFolderPath}`);

    // Launch browser with visible UI to see what's happening
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();

    // Set a user agent to avoid being detected as a bot
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    console.log(`Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });

    // Wait to ensure page is fully loaded
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Set authentication token in localStorage
    console.log("Setting authentication token in localStorage...");
    await page.evaluate(() => {
      localStorage.setItem(
        "oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable",
        JSON.stringify({
          id_token:
            "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHSHg0Qmk2THhvdVRGLWZuQmg0WXhMbUtUbGZzT2tmTm9fQ05yT1pMZHNrIn0.eyJleHAiOjE3NDY5ODY5OTksImlhdCI6MTc0Njk4NjA5OSwiYXV0aF90aW1lIjoxNzQ2OTg2MDQ3LCJqdGkiOiJjNGFmYjk3OS02MjdiLTRmMWMtODE4Ny0zZjk0M2RmYzNmZDUiLCJpc3MiOiJodHRwczovL2F1dGgubWFuZ2FkZXgub3JnL3JlYWxtcy9tYW5nYWRleCIsImF1ZCI6Im1hbmdhZGV4LWZyb250ZW5kLXN0YWJsZSIsInN1YiI6ImIyODMzMmFiLWFmNzctNDdlNy04OTc2LTFlZGUyNmE1ODMwMCIsInR5cCI6IklEIiwiYXpwIjoibWFuZ2FkZXgtZnJvbnRlbmQtc3RhYmxlIiwic2Vzc2lvbl9zdGF0ZSI6IjM2ZTJkMDVlLWY4NWUtNDVjMy1hZWIwLTljNjJlOTAwNTYxMCIsImF0X2hhc2giOiJZMF81dHNkbmVtRFZMbWRyU2JBY3BRIiwic2lkIjoiMzZlMmQwNWUtZjg1ZS00NWMzLWFlYjAtOWM2MmU5MDA1NjEwIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInJvbGVzIjpbIlJPTEVfVVNFUiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLW1hbmdhZGV4Il0sImdyb3VwcyI6WyJHUk9VUF9VU0VSIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImRvd25sb2RlbWFzdGVyMSIsImVtYWlsIjoiZG93bmxvZGVtYXN0ZXIxQGdtYWlsLmNvbSJ9.BEyH39_V16V-mQHOMauha5Pw3uLYfJd2aacfWn_LG3y3qRPVGhpmj7z9UYBg-5scOTzyK2S5CgEBPboGlQjtGFEEIPLwqEgnPK9aOjE_v2_6Q3AhXFkOleAF3LrhkBSKfZA5euqW_S18UrrwfNEv2v9OtyHZn97NkokxKG_Sy3o0MyjrTmnJxR42Oxk6JnwSIos1dAMpfuFN-aNUpUDqlTGYH05BHEi2z1DPIICKXeBaX7vr5cICdvzHfL-V7_i4ifQ9RsASVuYfIYq0E0rl1E8GKZzomjnT8to3317BKUr-wrM3IWb-xI-qwBgDWUZ_dc--axO-_gzg01e6F1GBpQ",
          session_state: "36e2d05e-f85e-45c3-aeb0-9c62e9005610",
          access_token:
            "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHSHg0Qmk2THhvdVRGLWZuQmg0WXhMbUtUbGZzT2tmTm9fQ05yT1pMZHNrIn0.eyJleHAiOjE3NDY5ODY5OTksImlhdCI6MTc0Njk4NjA5OSwiYXV0aF90aW1lIjoxNzQ2OTg2MDQ3LCJqdGkiOiI0NzU3ZGM2ZC0yNWEwLTQzMWQtOTNiYy0xNTJhMzg5NGEwMjkiLCJpc3MiOiJodHRwczovL2F1dGgubWFuZ2FkZXgub3JnL3JlYWxtcy9tYW5nYWRleCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJiMjgzMzJhYi1hZjc3LTQ3ZTctODk3Ni0xZWRlMjZhNTgzMDAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJtYW5nYWRleC1mcm9udGVuZC1zdGFibGUiLCJzZXNzaW9uX3N0YXRlIjoiMzZlMmQwNWUtZjg1ZS00NWMzLWFlYjAtOWM2MmU5MDA1NjEwIiwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGdyb3VwcyBlbWFpbCBwcm9maWxlIiwic2lkIjoiMzZlMmQwNWUtZjg1ZS00NWMzLWFlYjAtOWM2MmU5MDA1NjEwIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInJvbGVzIjpbIlJPTEVfVVNFUiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLW1hbmdhZGV4Il0sImdyb3VwcyI6WyJHUk9VUF9VU0VSIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImRvd25sb2RlbWFzdGVyMSIsImVtYWlsIjoiZG93bmxvZGVtYXN0ZXIxQGdtYWlsLmNvbSJ9.yDhas1a3RJX61IOxdrHRvlWrMsQuck8KZjPOcrSRHif_9e05LLScd-_vDwDk4y6etNyR6EJ1IWsHXe-gsiJ9203lHwSjPQpGxqA2Z5tgIX_h5LpPSrwX5QgNjZ-b0UH0vs5ZuhLnf9oY-k89bMZ0-3JA6bBeC7YNEjupESShrMZ-0njosrVCzpTetXzy_aFaFULYsFrmwQFqBxftcIc6IN4KM_18AWDIr0cMxzpKjQazwjtE34p1fT9Rr7sXgwre6ccM9rduS0raRE6Sg015WwJn8RNrzOktJ0MjK7ZOPzbuXnFcynoXUiAau7Nr6E4fBB_B6BBl9c-9yAU-IcS3Fg",
          refresh_token:
            "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5NTIxYTI5NC01YTRmLTQwNTgtYTdhNC1jZjI2YzU2NDhkMzIifQ.eyJleHAiOjE3NTQ3NjIwNDcsImlhdCI6MTc0Njk4NjA5OSwianRpIjoiMTVlYzBlODAtOTcwZS00OTBjLWIyNjYtZjk4ZmE4YWYzMjIwIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLm1hbmdhZGV4Lm9yZy9yZWFsbXMvbWFuZ2FkZXgiLCJhdWQiOiJodHRwczovL2F1dGgubWFuZ2FkZXgub3JnL3JlYWxtcy9tYW5nYWRleCIsInN1YiI6ImIyODMzMmFiLWFmNzctNDdlNy04OTc2LTFlZGUyNmE1ODMwMCIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJtYW5nYWRleC1mcm9udGVuZC1zdGFibGUiLCJzZXNzaW9uX3N0YXRlIjoiMzZlMmQwNWUtZjg1ZS00NWMzLWFlYjAtOWM2MmU5MDA1NjEwIiwic2NvcGUiOiJvcGVuaWQgZ3JvdXBzIGVtYWlsIHByb2ZpbGUiLCJzaWQiOiIzNmUyZDA1ZS1mODVlLTQ1YzMtYWViMC05YzYyZTkwMDU2MTAifQ.Hoxa4QuAiQSrwbZmLZi3u-XQMXFeG9SDLGM2m6pui1A",
          token_type: "Bearer",
          scope: "openid groups email profile",
          profile: {
            exp: 1746986999,
            iat: 1746986099,
            iss: "https://auth.mangadex.org/realms/mangadex",
            aud: "mangadex-frontend-stable",
            sub: "b28332ab-af77-47e7-8976-1ede26a58300",
            typ: "ID",
            session_state: "36e2d05e-f85e-45c3-aeb0-9c62e9005610",
            sid: "36e2d05e-f85e-45c3-aeb0-9c62e9005610",
            email_verified: true,
            roles: [
              "ROLE_USER",
              "offline_access",
              "uma_authorization",
              "default-roles-mangadex",
            ],
            groups: ["GROUP_USER"],
            preferred_username: "downlodemaster1",
            email: "downlodemaster1@gmail.com",
          },
          expires_at: 1746986999,
        })
      );
      console.log("Authentication token set successfully");
    });

    // Reload the page to apply authentication
    console.log("Reloading page to apply authentication...");
    await page.reload({ waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Click on the Long Strip button to load all images
    try {
      // Try multiple selector strategies to find the Long Strip button
      console.log("first opening the menu");
      const openbtn = [".reader--menu.pinned.header-hidden"];

      for (const selector of openbtn) {
        const buttonExists = await page.$(selector);
        if (buttonExists) {
          console.log(`Button found: ${selector}`);
          // Add 'open' class to the menu element
          await page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (element) {
              element.classList.add("open");
              console.log("Added open class to menu element");
            }
          }, selector);
        }
      }

      console.log("Clicking on Long Strip button to load all images...");
      const longStripSelectors = [
        ".rounded.custom-opacity.relative.md-btn.flex.items-center.px-3.overflow-hidden.accent.px-4",
      ];

      let clicked = false;

      for (const selector of longStripSelectors) {
        try {
          // Wait for the element to be visible and clickable
          await page
            .waitForSelector(selector, { visible: true, timeout: 500 })
            .catch(() => console.log(`Selector not found: ${selector}`));

          // Try to click using evaluate for more reliable clicking
          const clickResult = await page.evaluate((sel) => {
            const button = document.querySelector(sel);
            if (button && button instanceof HTMLElement) {
              console.log("button.innerText", button.innerText);
              button.click();
              return true;
            }
            return false;
          }, selector);

          if (clickResult) {
            console.log(
              `Successfully clicked button with selector: ${selector}`
            );
            // Wait a moment and click again to ensure it's toggled correctly
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await page.evaluate((sel) => {
              const button = document.querySelector(sel);
              if (button && button instanceof HTMLElement) {
                button.click();
              }
            }, selector);
            clicked = true;
            break;
          }
        } catch (err) {
          console.log(`Failed to click selector ${selector}:`, err);
        }
      }

    //   if (!clicked) {
    //     console.log(
    //       "Could not find or click Long Strip button, trying JavaScript approach"
    //     );
    //     // Try to find and click by text content
    //     try {
    //       await page.evaluate(() => {
    //         const buttons = Array.from(document.querySelectorAll("button"));
    //         const longStripButton = buttons.find(
    //           (button) =>
    //             button.textContent && button.textContent.includes("Long Strip")
    //         );
    //         if (longStripButton) {
    //           longStripButton.click();
    //           setTimeout(() => longStripButton.click(), 1000);
    //           return true;
    //         }
    //         return false;
    //       });
    //     } catch (err) {
    //       console.error("JavaScript approach also failed:", err);
    //       console.log("Continuing without Long Strip mode");
    //     }
    //   }

      // Wait for images to load after clicking the button
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error("Could not find or click Long Strip button:", error);
      console.log("Continuing with default reader mode");
    }

    console.log("extracting total chapter pages");

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

    console.log(`Total chapter pages: ${totalChapterPages}`);

    // Create the custom folder

    // Download images
    // await downloadImages(page, browser, customFolderPath);

    // Close the browser
    await browser.close();
    console.log("Browser closed.");
    console.log("Scraping completed!");
  } catch (error) {
    console.error("Error in scraper:", error);
  }
}

/**
 * Auto-scrolls the page to ensure all lazy-loaded images are loaded
 */
async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const scrollInterval = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        // Show progress while scrolling
        console.log(`Scrolled ${totalHeight}px out of ${scrollHeight}px...`);

        if (totalHeight >= scrollHeight) {
          clearInterval(scrollInterval);
          resolve();
        }
      }, 100);
    });
  });
}

async function downloadImages(
  page: Page,
  browser: Browser,
  customFolderPath: string
): Promise<void> {
  // Extract all image URLs from the chapter page
  console.log("Extracting chapter image URLs...");

  const imageUrls = await page.evaluate(() => {
    const images: any[] = [];

    // Try different selectors that might contain manga images
    const selectors = [
      ".img.ls.limit-width",
      ".md--page.ls.limit-width.mx-auto",
      ".md-page.ls.limit-width.mx-auto",
      ".img.ls.limit-width[alt]",
      ".mx-auto.h-full.md--page.flex img",
      // Add more specific selectors for Long Strip view
      "div[data-mode='long_strip'] img",
      ".md--reader-container img",
      ".md--reader img",
      ".pswp__img",
      // Generic fallbacks
      "img.manga-page",
      "img[alt*='page']",
      "img[alt*='Page']",
      "img.ls",
    ];

    // Try each selector
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach((img) => {
          // Try to get image URL from different attributes
          const src =
            (img as HTMLImageElement).src ||
            img.getAttribute("data-src") ||
            img.getAttribute("data-original") ||
            img.getAttribute("data-srcset") ||
            img.getAttribute("data-lazysrc");

          if (src && !src.includes("data:image") && !images.includes(src)) {
            images.push(src);
          }
        });

        if (images.length > 0) {
          console.log(
            `Found ${images.length} images using selector: ${selector}`
          );
        }
      }
    }

    // If no images found using selectors or too few images, try to find all images
    if (images.length < 2) {
      // Get all images on the page
      const allImages = document.querySelectorAll("img");
      allImages.forEach((img) => {
        const src = (img as HTMLImageElement).src;
        // Only include image URLs that look like manga pages (typically larger images)
        // and exclude logos, icons, etc.
        if (
          src &&
          !src.includes("data:image") &&
          !src.includes("logo") &&
          !src.includes("icon") &&
          !images.includes(src)
        ) {
          // Get image dimensions if possible
          const width = (img as HTMLImageElement).width;
          const height = (img as HTMLImageElement).height;

          // Only include images that are likely to be manga pages
          // (typically larger than icons/buttons)
          if (width > 200 || height > 200) {
            images.push(src);
          }
        }
      });
    }

    return images;
  });

  // Log all found image URLs
  console.log("Found chapter images:");
  imageUrls.forEach((url, index) => {
    console.log(`Image ${index + 1}: ${url}`);
  });

  console.log(`Total images found: ${imageUrls.length}`);

  // Download images directly from puppeteer
  console.log("Starting to download images...");

  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i];
    const imageFileName = `page_${String(i + 1).padStart(3, "0")}.jpg`;
    const imagePath = path.join(customFolderPath, imageFileName);

    console.log(
      `Downloading image ${i + 1}/${imageUrls.length}: ${imageFileName}`
    );

    try {
      // For blob URLs, we need to use Page.goto and take a screenshot
      if (imageUrl.startsWith("blob:")) {
        // Create a new page for this image
        const imagePage = await browser.newPage();

        // Set viewport to a reasonable size that will capture the full image
        await imagePage.setViewport({ width: 1200, height: 1600 });

        // Navigate to the blob URL
        await imagePage.goto(imageUrl, { waitUntil: "networkidle2" });

        // Wait a bit to ensure the image is fully loaded
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Take a screenshot of the image and save it
        const element = await imagePage.$("img");
        if (element) {
          await element.screenshot({ path: imagePath });
        } else {
          // If no img element found, take screenshot of the whole page
          await imagePage.screenshot({ path: imagePath });
        }

        // Close the image page
        await imagePage.close();

        console.log(`Successfully downloaded: ${imageFileName}`);
      } else {
        // For normal URLs, use a direct fetch approach
        const viewSource = await page.goto(imageUrl);
        if (viewSource) {
          const buffer = await viewSource.buffer();
          fs.writeFileSync(imagePath, buffer);
          console.log(`Successfully downloaded: ${imageFileName}`);
        }
      }
    } catch (error) {
      console.error(`Failed to download image ${i + 1}:`, error);
    }

    // Add a small delay between downloads to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`All images downloaded to: ${customFolderPath}`);
}

async function createCustomFolderName(
  page: Page,
  mangaFolderName: string
): Promise<string> {
  // Extract manga title and chapter info
  console.log("Extracting manga title and chapter info...");
  const mangaInfo = await page.evaluate(() => {
    const titleElement = document.querySelector(".reader--header-manga");
    const chapterElement = document.querySelector(".reader--header-title");

    return {
      title: titleElement ? titleElement.textContent?.trim() : "",
      chapter: chapterElement ? chapterElement.textContent?.trim() : "",
    };
  });

  // Log the extracted info for debugging
  console.log(
    `Extracted title: "${mangaInfo.title}", chapter: "${mangaInfo.chapter}"`
  );

  // Create a better folder name using manga title and chapter
  let customFolderName = mangaFolderName;
  if (mangaInfo.title && mangaInfo.chapter) {
    customFolderName = sanitizeFolderName(
      `${mangaInfo.title} | Chapter- ${mangaInfo.chapter}`
    );
    console.log(`Using custom folder name: ${customFolderName}`);
  } else {
    // More descriptive error message with potential selector issues
    console.log(
      "Could not extract manga title and chapter info. Selectors '.reader-header-manga' or '.reader-header-title' may not match elements on the page. Using URL-based folder name instead."
    );
  }
  return customFolderName;
}

// Run the scraper
main().catch(console.error);
