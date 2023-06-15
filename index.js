const express = require("express");
const fs = require("fs");
const path = require("path");
const { saveBookmark } = require("./utils");
const app = express();
const PORT = 9898;
const home = process.cwd();

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("db/thumbnails"));

const pre_requisite_dir_paths = ["db", "db/thumbnails"];
const pre_requisite_db_file_paths = ["generic.json", "github.json", "dribble.json"];

for (let pre_path of pre_requisite_dir_paths) {
  if (!fs.existsSync(pre_path)) {
    fs.mkdirSync(pre_path, { recursive: true });
    console.log(`Directory created: ${pre_path}`);
  }
}

for (let pre_path of pre_requisite_db_file_paths) {
  const db_file_path = path.join(home, "db", pre_path);
  if (!fs.existsSync(db_file_path)) {
    const content = JSON.stringify({
      bookmarks: [],
    });
    fs.writeFileSync(db_file_path, content);
    console.log(`File created: ${db_file_path}`);
  }
}

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/get_bookmarks", (req, res) => {
  let db_content = {};

  for (let db_file of pre_requisite_db_file_paths) {
    const db_file_path = path.join(home, 'db', db_file);
    let fileContent = fs.readFileSync(db_file_path, "utf-8");
    fileContent = JSON.parse(fileContent);
    db_content = {
      ...db_content,
      [db_file]: fileContent,
    };
  }

  res.json(db_content);
});

app.post("/save_bookmark", async (req, res) => {
  const { url, title } = req.body;
  let response = {
    success: false,
    error: null,
  };

  if (!url) {
    const error = "Please provide a URL";
    response = {
      ...response,
      error: error,
    };
  }

  if (!title) {
    const error = "Please provide a title";
    response = {
      ...response,
      error: error,
    };
  }

  if (response.error) {
    console.log(response.error);
  }

  if (url && title) {
    const newBookmark = await saveBookmark(req.body);
    if (newBookmark) {
      response = { ...response, ...newBookmark, success: true };
    }
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
