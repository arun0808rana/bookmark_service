const low = require("lowdb");
const storage = require("lowdb/file-async");
const path = require("path");
const home = process.cwd();
const { v4: uuidv4 } = require("uuid");
const puppeteer = require("puppeteer");

async function saveBookmark(payload) {
  const { url } = payload;
  let db;
  const domainName = getDomainName(url);
  // console.log(domainName, 'Domain');
  const payloadID = uuidv4();

  generateThumbnail(url, `${payloadID}.webp`);

  switch (domainName) {
    case "github.com":
      db = low(path.join(home, "db", "github.json"), { storage });
      break;
    case "dribbble.com":
      db = low(path.join(home, "db", "dribble.json"), { storage });
      break;
    default:
      db = low(path.join(home, "db", "generic.json"), { storage });
      break;
  }

  await db("bookmarks").push({
    id: payloadID,
    thumbnailURL: `${payloadID}.webp`,
    ...payload,
  });

  const newBookmark = db("bookmarks").find({ id: payloadID });

  // console.log("newBookmark :>> ", newBookmark);
  return newBookmark;
}

function getDomainName(urlString) {
  const url = require("url");
  try {
    const parsedUrl = new url.URL(urlString);
    return parsedUrl.hostname;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}

async function generateThumbnail(url, filename) {
  const outputPath = path.join(home, "db", "thumbnails", filename);
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "chromium-browser",
  });
  const page = await browser.newPage();

  // Adjust the viewport to desired thumbnail dimensions
  page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 0.5 });

  await page.goto(url);

  // Capture screenshot and save as PNG image
  await page.screenshot({ path: outputPath });

  await browser.close();
}

function getBookmarks() {}

module.exports = {
  saveBookmark,
  getBookmarks,
};
