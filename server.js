const express = require('express');
const app = express();
const fs = require('fs');
const { urlencoded } = require('body-parser');

const tasks = [];

// Middleware
app.use(urlencoded({ extended: false }));

app.use(express.static("./public"));

app.get('/getAll', (req, res) => {
    res.json(tasks);
})

app.post('/takenote', (req, res) => {
    const { notes } = req.body;
    console.log(notes);
    tasks.push({ notes, status:false, id: tasks.length + 1 })
    res.end('DONE');
})

app.delete('/deletenote/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(task => {
        return task.id === id;
    })
    tasks.splice(index, 1);
    res.json({ success: true });
})

app.patch('/updatenote/:id', (req, res) => {
    const id = Number(req.params.id);
    const updatedNote = req.body.notes;
    const index = tasks.findIndex(task => {
        return task.id === id;
    });

    tasks[index].notes = updatedNote;
    res.end('DONE');

})

app.patch('/updatestatus/:id', (req, res) => {
    const id = Number(req.params.id);
    const updatedstatus = req.body.status;
    const index = tasks.findIndex(task => {
        return task.id === id;
    });

    tasks[index].status = updatedstatus;
    res.end('DONE');

})

app.listen(8000, () => {
    console.log('Magic Note Server Started ');
})