const note = require('express').Router();
const { v4: uuid} = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require('../helpers/fsutils');

  note.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });
  
  // GET Route for a specific note
  note.get('/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.note_id === noteId);
        return result.length > 0
          ? res.json(result)
          : res.json('No Note with that ID');
      });
  });
  
  // DELETE Route for a specific note
  note.delete('/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all note except the one with the ID provided in the URL
        const result = json.filter((note) => note.note_id !== noteId);

        console.log(result)
        // Save that array to the filesystem
        writeToFile('./db/db.json', result);
  
        // Respond to the DELETE request
        res.json(`Item ${noteId} has been deleted 🗑️`);
      });
  });
  
  // POST Route for a new UX/UI note
  note.post('/', (req, res) => {
    console.log(req.body);
  
    const {  title, task, note } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        task,
        note,
        note_id: uuid(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully 🚀`);
    } else {
      res.error('Error in adding Note');
    }
  });
  
  module.exports = note;