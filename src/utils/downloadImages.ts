import { Page } from "puppeteer";
import { Browser } from "puppeteer";
import fs from "fs";
import path from "path";

export async function downloadImages(
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
