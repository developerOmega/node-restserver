const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ========================================
// Obtener todos los productos
// ========================================
app.get('/productos', verificarToken, (req, res) => {
    //trae todos los prosuctos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Producto.find({disponible: true})
            .skip(desde)
            .limit(hasta)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec((err, productos) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Producto.count({disponible: true}, (err, productoCount) => {
                    return res.json({
                        ok: true,
                        productos,
                        count: productoCount
                    })
                })
            });
})


// ========================================
// Obtener producto por ID
// ========================================
app.get('/productos/:id', verificarToken,(req, res) => {
    //populate: usuario categoria
    //paginado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if(!producto){
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'El producto no fue encontrado'
                    }
                });
            }

            return res.json({
                ok: true,
                producto
            })
        });
})

// ========================================
// Buscar productos
// ========================================
app.get('/productos/buscar/:termino', verificarToken,(req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                productos
            })
        })
        

});


// ========================================
// Crear producto
// ========================================
app.post('/productos', verificarToken,(req, res) => {
    //grabar  el usuario
    //grabar  la categoria
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario
    });

    producto.save((err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: "La informacion ingresada no es valida"
                }
            })
        }
    
        return res.json({
            ok: true,
            producto: productoDB
        });
    
    });

    
})



// ========================================
// Actualizar un producto
// ========================================
app.put('/productos/:id', verificarToken, (req, res) => {
    //grabar  el usuario
    //grabar  la categoria
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, producto) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto
        });
    });
})


// ========================================
// Borrar un producto
// ========================================
app.delete('/productos/:id', verificarToken,(req, res) => {
    //propiedad disponible pasara a false
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true, runValidators: true},(err, producto) => {
        if(err){
            return res.status(500).json({
                ok: false, 
                err
            })
        }

        if(!producto){
            return res.status(404).json({
                ok: false, 
                err: {
                    message: "No se encontro el producto"
                }
            })
        }

        return res.json({
            ok: true, 
            producto
        })
    })
})

module.exports = app;