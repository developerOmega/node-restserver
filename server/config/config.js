//===========================
// Puerto
//===========================
process.env.PORT = process.env.PORT || 4000;

//===========================
// Entorno
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
// Base de datos
//===========================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27018/cafe';
}
else{
    urlDB = 'mongodb+srv://developer:5VL8b8lEOv8zpeid@cluster0-e9ykm.mongodb.net/cafe';
}

process.env.URLDB = urlDB;