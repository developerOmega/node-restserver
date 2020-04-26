const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }) );


app.put('/upload/:tipo/:id', (req, res) => {
    let { tipo, id } = req.params;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    messaje: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok:false,
            err: {
                message: "Los tipos  permitidos son " + tiposValidos.join(', ')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1];

    // Extenciones permitiadas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extencionesValidas.indexOf( extencion ) <  0){
        return res.status(400).json({
            ok:false,
            err: {
                message: "Las extenciones  permitidas son " + extencionesValidas.join(', ')
            },
            ext: extencion
        })
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extencion }`;

    
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
          return res.status(500).json({
              ok: false,
              err
        });
          
        // Aqui, imagen cargando
        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }
        else {
            // productoImg(res)
            imagenProducto(id, res, nombreArchivo);
        }
    });


});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {

        if(err){
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false, 
                err
            });
        }

        if( !usuarioDB ){
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false, 
                err: {
                    message: "El usuario no existe"
                }
            });
        }

        // let pathUrl = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        // if( fs.existsSync(pathUrl) ){
        //     fs.unlinkSync(pathUrl);
        // }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuario) => {
            return res.json({
                ok: true,
                usuario,
                img: nombreArchivo
            })
        });



    });

}

//crear campo img de la coleccion productos
function productoImg(res){
    Producto.update({}, { img: '' }, { multi: true }, function (err, img) {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        } 

        return res.json({
            ok: true,
            message: `El campo img se ha creado en la coleccion de productos`
        });
    });
}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, producto) => {
        if(err){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!producto){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no fue encontrado'
                }
            })
        }

        borraArchivo(producto.img , 'productos');

        producto.img = nombreArchivo;
        producto.save((err) => {
            return res.json({
                ok: true,
                producto,
                img: nombreArchivo
            })    
        });

    });
}

function borraArchivo(nombreImg = 'no-hay-nombre', tipo){
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
    if( fs.existsSync(pathUrl) ){
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;
