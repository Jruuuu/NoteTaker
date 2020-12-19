//var db = require("../db/db.json");
const util = require("util");
const path = require("path");
const fs = require("fs");
const uuidv1 = require("uuid/v1");

const readAsync = util.promisify(fs.readFile);
const writeAsync = util.promisify(fs.writeFile);

const getAllTheNotes = () => {
  return readAsync(path.join(__dirname, "../db/db.json"), "utf8").then(notes => {
    return JSON.parse(notes);
  });
};

const addNewNote = (note) => {
  return readAsync(path.join(__dirname, "../db/db.json"), "utf8").then(notes => {
    //modify note
    const newNote = note;
    const noteData = JSON.parse(notes);
    newNote.id = uuidv1();
    noteData.push(newNote);
    //write
    writeAsync(path.join(__dirname, "../db/db.json"), JSON.stringify(noteData));
    return newNote;
  });
};

const removeNote = (id) => {
  return readAsync(path.join(__dirname, "../db/db.json"), "utf8").then(notes => {
    //modify note
    const noteData = JSON.parse(notes);
    const updatedNoteData = noteData.filter((note) => note.id !== id);
    writeAsync(path.join(__dirname, "../db/db.json"), JSON.stringify(updatedNoteData));
    return {
      sucess: true,
      id: id
    };
  });
};

module.exports = function (app) {

  //get the data
  //modifiy the data if necessary
  //rewrite the data if necessary

  app.get("/api/notes", function (req, res) {
    getAllTheNotes().then((notes) => {
      res.json(notes);
    });
  });

  app.post("/api/notes", function (req, res) {
    addNewNote(req.body).then((note) => {
      res.json(note);
    });
  });

  app.delete("/api/notes/:id", function (req, res) {
    removeNote(req.params.id).then((idObj) => {
      res.json(idObj);
    });
  })
};