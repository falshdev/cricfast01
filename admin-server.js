const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve Flutter web files
app.use(express.static(path.join(__dirname, "web")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "index.html"));
});

// Data folder
const DATA_DIR = path.join(__dirname, "assets", "data");

if (!fs.existsSync(DATA_DIR)) {
  console.error("Data directory not found:", DATA_DIR);
  process.exit(1);
}

// Save API
app.post("/api/save", (req, res) => {
  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).send("Invalid request");
  }

  const filePath = path.join(DATA_DIR, type + ".json");

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Write error:", err);
      return res.status(500).send("Failed to write file");
    }

    console.log("Updated " + type + ".json");
    res.json({ status: "success" });
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
