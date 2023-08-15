const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect('mongodb://127.0.0.1/NodeJS', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err));

const filesSchema = new mongoose.Schema({
    fileName: String,
    fileSize: Number,
    fileType: String
});

const File = mongoose.model('File', filesSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/upload', (req, res) => {
    if (req.files) {
        let file = req.files.file;
        let fileName = file.name;
        let fileSize = file.size;
        let fileType = file.mimetype;

        if (validateFile(file)) {
            file.mv('./uploads/' + fileName, async (err) => {
                if (err) throw err;
                else {
                    const file = new File({
                        fileName: fileName,
                        fileType: fileType,
                        fileSize: fileSize,
                    });
                    try {
                        const result = await file.save();
                        console.log(result);
                        res.send('File Uploaded!!');
                    }
                    catch (ex) {
                        console.log(ex.message);
                    }
                }
            });
        }
    }
    else {
        res.send('No files!');
    }
});

app.get('/api/files/:filename', async (req, res) => {
    const fileName = req.params.filename;
    const file = await File
        .find({ fileName: fileName });
    if (file && file.length) {
        res.status(200).sendFile(__dirname + `/uploads/${fileName}`);
    } else {
        res.status(404).send("This file doesn't exist!!");
    }
});

app.delete('/api/files/delete/:filename', async (req, res) => {
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

const fileExtension = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg", "image/apng", "image/avif"];

function validateFile(file) {
    if (fileExtension.includes(file.mimetype)) {
        if (file.size >= 8661 && file.size <= 113906) {
            return true;
        }
        console.log('file size must be between 8661 and 113906');
        return false;
    }
    console.log('file type must be one of [jpeg, gif, png, ...]');
    return false;
}

const port = 3500 || process.env.PORT;
app.listen(port, () => console.log(`Listening on ${port}...`));