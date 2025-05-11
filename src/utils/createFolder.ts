import { Page } from "puppeteer";

export async function createCustomFolderName(
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

  function sanitizeFolderName(name: string): string {
    return name.replace(/[\\/:*?"<>|]/g, "_").trim();
  }