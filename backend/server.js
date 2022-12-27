const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const { stringify } = require('querystring');

const app = express();
const port = 5003;

app.use(fileUpload());
app.use(express.json());

app.use('/public', express.static(`${__dirname}/../frontend/public`));
app.use('/images', express.static(`${__dirname}/../backend/data/imgs`));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.get('/imageList', (req, res) => {
    const imgPath = __dirname + '/data/imgs/';
    const imageList = [];

    fs.readdir(imgPath, (err, files) => {
        if (err) { console.log(err); }
        else {
            
            files.forEach(file => {
                const newFile = {
                    "name": `${file}`
                }
                imageList.push(newFile);
            })
            res.status(200).send(imageList);
        }
    })
})

app.delete('/imageList/:name', (req, res) => {
    const something = JSON.stringify(req.params.name);

    /* console.log(something); */


    const imagesPath = __dirname + '/data/imgs/';
    
    fs.readdir(imagesPath, (err, files) => {
        /* console.log(JSON.stringify(files)); */

        if(err) { console.log(err); }
        else {
            const reqFile = files.filter(file => JSON.stringify(file) === something);

            console.log(reqFile);

            const deleteFilePath = __dirname + '/data/imgs/' + reqFile;

            fs.rm(deleteFilePath, { recursive:true }, (err) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log("File deleted!");
            });
        }
    })
    res.redirect('/');
})

app.post('/uploadImage', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log(req.files);

    let avatarPic = req.files.avatarPic;
    let uploadPath = __dirname + '/data/imgs/' + avatarPic.name;
    //req.files moving to the preset uploadPath
    avatarPic.mv(uploadPath, (err) => {
        console.log("Error type: ", err);
    });
    res.redirect('/');
})

app.all('*', (req, res) => {
    res.status(404).json('NOT FOUND!');
});

app.listen(port, () => {
    console.log(`Server is on http://127.0.0.1:${port}`);
})

