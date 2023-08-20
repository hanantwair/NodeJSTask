const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

app.use(fileUpload());
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect('mongodb://127.0.0.1/NodeJS', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err));

const filesSchema = new mongoose.Schema({
    fileName: {
        type: String,
        unique: true
    },
    fileSize: Number,
    fileType: String
});

const File = mongoose.model('File', filesSchema);

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.post('/api/upload', (req, res) => {
    if (req.files.file) {

        let file = req.files.file;

        file.mv('./uploads/' + file.name, async (err) => {
            if (err) throw err;
            else {
                const fileObj = new File({
                    fileName: file.name,
                    fileType: file.mimetype,
                    fileSize: file.size,
                });
                try {
                    const result = await fileObj.save();
                    res.send('File Uploaded!!');
                }
                catch (err) {
                    console.log(err.message);
                }
            }
        });

    }
});

app.get('/api/files/:filename', async (req, res) => {
    const fileName = req.params.filename;
    const file = await File
        .find({ fileName: fileName });
    if (file && file.length) {
        res.render('pages/img', {
            fileName
        });
    } else {
        res.status(404).send("This file doesn't exist!!");
    }
});

app.get('/api/file/:filename', async (req, res) => {
    const fileName = req.params.filename;
    try {
        res.status(200).sendFile(__dirname + `/uploads/${fileName}`);
    } catch (err) {
        res.status(404).send("This file doesn't exist!!");
    }
});

app.post('/api/files/delete/:filename', async (req, res) => {
    const fileName = req.params.filename;
    const file = await File
        .findOneAndRemove({ fileName: fileName });
    if (file) {
        let filePath = __dirname + `/uploads/${fileName}`;
        fs.unlinkSync(filePath);
        res.status(200).send('File was deleted successfully!!');
    } else {
        res.status(404).send("This file doesn't exist!!");
    }
});

app.get('/api/allFiles', async (req, res) => {
    try {
        const files = await File
            .find()
            .select({ fileName: 1, _id: 0 });
        res.render('pages/allFiles', {
            files
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error | ' + err.message });
    }
});

const port = 3500 || process.env.PORT;
app.listen(port, () => console.log(`Listening on ${port}...`));