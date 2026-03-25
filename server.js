const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public')); // serve frontend

// DB
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tiger123",
    database: "portfolio"
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// GET DATA
app.get('/getData', (req, res) => {
    db.query("SELECT * FROM contacts", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// INSERT
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;
    db.query(
        "INSERT INTO contacts (name,email,message) VALUES (?,?,?)",
        [name, email, message],
        () => res.send("Saved")
    );
});

// DELETE
app.delete('/delete/:id', (req, res) => {
    db.query("DELETE FROM contacts WHERE id=?", [req.params.id], () => {
        res.send("Deleted");
    });
});

// UPDATE
app.put('/update/:id', (req, res) => {
    const { name, email, message } = req.body;

    db.query(
        "UPDATE contacts SET name=?, email=?, message=? WHERE id=?",
        [name, email, message, req.params.id],
        () => res.send("Updated")
    );
});

app.listen(3000, () => console.log("Server running"));