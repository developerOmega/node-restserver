//===========================
// Puerto
//===========================
process.env.PORT = process.env.PORT || 4000;

//===========================
// Entorno
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
// Vencimiento del token
//===========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = '48h';

//===========================
// seed
//===========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'; 


//===========================
// Base de datos
//===========================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27018/cafe';
}
else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//===========================
// Google client ID
//===========================
process.env.CLIENT_ID  = process.env.CLIENT_ID || '572454142077-vs3asbg9m9pntjv8prpttfd26c3473d9.apps.googleusercontent.com';