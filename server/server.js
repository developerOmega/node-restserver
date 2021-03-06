const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');

require('./config/config');

// habilitar carpeta public
app.use( express.static(path.resolve(__dirname, '../public')) );

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application /json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, 
    (err, res) => {
        if(err){
            throw new Error(err);
        }
        else {
            console.log(`Base de datos ONLINE`);
        }
    });

app.listen(process.env.PORT, () => {
    console.log("Escuchando en puerto", process.env.PORT);
})
