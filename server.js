const fs = require("fs");
const path = require("path");
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const index = path.join(__dirname, "/public");

let noteDb = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());



app.get("/notes", function(req, res) {
    res.sendFile(path.join(index, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    
    res.json(noteDb[Number(req.params.id)]);
});


app.get("*", function(req, res) {
  res.sendFile(path.join(index, "index.html"));
});

app.post("/api/notes", function(req, res) {
    
    let newNote = req.body;
    let noteId = (noteDb.length).toString();
    newNote.id = noteId;
    noteDb.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(noteDb));
    console.log(newNote);
    res.json(noteDb);
})

app.delete("/api/notes/:id", function(req, res) {
    
    let noteId = req.params.id;
    let newId = 0;
    console.log(`Note ${noteId} Deleted`);
    noteDb = noteDb.filter(thisNote => {
        return thisNote.id != noteId;
    }) 
    
    for (thisNote of noteDb) {
        thisNote.id = newId.toString();
        newId++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(noteDb));
    res.json(noteDb);
})

app.listen(PORT, function() {
    console.log(`🌍 Now listening on PORT ${PORT}`);
})