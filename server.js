const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");
const { v4: uuidv4 } = require("uuid");
const readFile = util.promisify(fs.readFile);
const PORT = process.env.PORT || 3002;
const app = express();
const writeFile = util.promisify(fs.writeFile);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/api/notes", (req, res) => {
  // fetch notes from db
  try {
    readFile("db/db.json", "utf-8").then((notes) => {
      var parsedNotes = JSON.parse(notes);
      res.json(parsedNotes);
    });
  } catch (err) {
    res.json(err).status(500);
  }
});
app.post("/api/notes", (req, res) => {
  try {
    readFile("db/db.json", "utf-8").then((notes) => {
      var parsedNotes = JSON.parse(notes);
      var noteObject = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4(),
      };
      var newNoteArray = [...parsedNotes, noteObject];
      writeFile("db/db.json", JSON.stringify(newNoteArray)).then(() => {
        res.json({ msg: "Done" });
      });
    });
  } catch (err) {
    res.json(err).status(500);
  }
});
app.delete("/api/notes/:id", (req, res) => {
  console.log(req.params.id);
  try {
    readFile("db/db.json", "utf-8").then((notes) => {
      var parsedNotes = JSON.parse(notes);
      var filteredArray = parsedNotes.filter(
        (notes) => notes.id !== req.params.id
      );
      writeFile("db/db.json", JSON.stringify(filteredArray)).then(() => {
        res.json({ msg: "Done" });
      });
      console.log(filteredArray);
    });
  } catch (err) {
    res.json(err).status(500);
  }
});

app.listen(PORT, () => {
  console.log("LISTENING" + PORT);
});
