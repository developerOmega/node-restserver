const express = require('express');
const fs = require('fs');
const path = require('path');
const {verificarTokenImg} = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificarTokenImg,(req, res) => {

    let {tipo, img} = req.params;

    // let pathImg = `./uploads/${tipo}/${img}`;
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    console.log(pathUrl);

    if(fs.existsSync(pathUrl)){
        res.sendFile(pathUrl);
    }
    else{
        let noImagePath = path.resolve(__dirname, '../assets/original.jpg');
        res.sendFile(noImagePath);
    }

  

} );

module.exports = app;