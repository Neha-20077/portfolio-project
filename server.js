const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Detect if running on Render
const isRender = process.env.RENDER === "true";

// DATABASE CONNECTION (only for local)
let db;

if (!isRender) {
    db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "tiger123",
        database: "portfolio"
    });

    db.connect((err) => {
        if (err) throw err;
        console.log("Connected to MySQL");
    });
} else {
    console.log("Running on Render (No MySQL)");
}

// ---------------- ROUTES ----------------

// SUBMIT FORM
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;

    if (isRender) {
        return res.send("Demo mode: Data not saved (No DB)");
    }

    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

    db.query(sql, [name, email, message], (err) => {
        if (err) throw err;
        res.send("Message Saved!");
    });
});

// GET DATA
app.get('/getData', (req, res) => {
    if (isRender) {
        return res.json([]); // empty list for demo
    }

    db.query("SELECT * FROM contacts", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// DELETE
app.delete('/delete/:id', (req, res) => {
    if (isRender) {
        return res.send("Demo mode: Delete disabled");
    }

    const id = req.params.id;

    db.query("DELETE FROM contacts WHERE id=?", [id], (err) => {
        if (err) throw err;
        res.send("Deleted!");
    });
});

// UPDATE
app.put('/update/:id', (req, res) => {
    if (isRender) {
        return res.send("Demo mode: Update disabled");
    }

    const id = req.params.id;
    const { name, email, message } = req.body;

    const sql = "UPDATE contacts SET name=?, email=?, message=? WHERE id=?";

    db.query(sql, [name, email, message, id], (err) => {
        if (err) throw err;
        res.send("Updated!");
    });
});

// SERVER PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});