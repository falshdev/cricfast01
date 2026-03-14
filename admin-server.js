const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve Flutter web
app.use(express.static(path.join(__dirname, 'web')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

const DATA_DIR = path.join(__dirname, 'assets', 'data');

if (!fs.existsSync(DATA_DIR)) {
    console.error('Error: Data directory not found at', DATA_DIR);
    process.exit(1);
}

app.post('/api/save', (req, res) => {
    const { type, data } = req.body;

    if (!type || !data) {
        return res.status(400).send('Invalid request');
    }

    const filePath = path.join(DATA_DIR, ${type}.json);

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Write error:', err);
            return res.status(500).send('Failed to write file');
        }

        console.log(Updated ${type}.json);
        res.send({ status: 'success' });
    });
});

app.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});
