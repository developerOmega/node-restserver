const express = require('express');

let { verificarToken, verificarTokenAdmin } = require('../middlewares/autenticacion');

const app = express();

let Categoria = require('../models/categoria');

// ========================================
// Mostrar todas las actegorias
// ========================================

app.get('/categoria', [verificarToken], (req, res) => {
    Categoria.find({})
        .sort('nombre') // Ordenar por tipo de dato
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                categorias
            });
            
        });
});

// ========================================
// Mostrar todas las actegoria por ID
// ========================================

app.get('/categoria/:id', [verificarToken], (req, res) => {
    let id = req.params.id;

    Categoria.findById(id).exec((err, categoria) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria
        });
    });
});


// ========================================
// Crear categorias
// ========================================

app.post('/categoria/', [verificarToken], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario
    });

    categoria.save((err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok:true,
            categoria: categoriaDB
        })
    });
});


// ========================================
// Actualizar categoria
// ========================================

app.put('/categoria/:id', [verificarToken], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true} , (err, categoria) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            categoria
        });
    });

});


// ========================================
// Elimiar categorias
// ========================================

app.delete('/categoria/:id', [verificarToken, verificarTokenAdmin], (req, res) => {
    //Solo un administrador puede elimiar categorias
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDelete) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDelete

        });
    });
});




module.exports = app;