const bookmarkContainer = document.querySelector(".bookmarks_container");
const bookmarkTemplate = document.querySelector(".bookmark_template");
const headingTemplate = document.querySelector(".heading_template");
const resultsTemplate = document.querySelector(".results_template");

get_bookmarks();

async function get_bookmarks() {
  try {
    let res = await fetch("/get_bookmarks");
    res = await res.json();
    // res = JSON.parse(res);
    console.log(res, "res");
    renderBookmarks(res);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function save_bookmarks() {
  try {
    const payload = {
      url,
      title,
    };
    const response = await fetch("/save_bookmark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function renderBookmarks(bookmarkFiles) {
  for (let bookmarkFile in bookmarkFiles) {
    const bookmarks = bookmarkFiles[bookmarkFile].bookmarks;

    if (bookmarks.length > 0) {
      const headingClone = headingTemplate.content.cloneNode(true);
      const headingName = bookmarkFile.split(".")[0];
      headingClone.querySelector(".bookmark_heading").textContent = headingName;
      bookmarkContainer.appendChild(headingClone);
    }

    const bookmarResultClone = resultsTemplate.content
      .querySelector(".bookmark_results")
      .cloneNode(true);

    for (let bookmark of bookmarks) {
      const bookmarkClone = bookmarkTemplate.content
        .querySelector(".bookmark")
        .cloneNode(true);
      const bookmarkTitle = bookmarkClone.querySelector(".title");
      const bookmarkThumbnail = bookmarkClone.querySelector(".title > img");
      const bookmarkTitleText = bookmarkClone.querySelector(
        ".title > .title_text"
      );
      const bookmarkTitleHeading = bookmarkClone.querySelector(
        ".title > .title_heading"
      );

      bookmarkTitleHeading.textContent = bookmark.title;
      bookmarkTitleText.textContent = bookmark.url;
      bookmarkTitle.setAttribute("href", bookmark.url);
      bookmarkThumbnail.src = bookmark.thumbnailURL;
      bookmarResultClone.appendChild(bookmarkClone);
    }

    bookmarkContainer.appendChild(bookmarResultClone);
  }
}

async function handleSearch(event) {
  event.preventDefault();
  console.log("Event", event.target.name);
}
