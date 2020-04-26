var jwt = require('jsonwebtoken');

// ======================
// Verificar token
// ======================
let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    
    jwt.verify(token, process.env.SEED, (err, decode) => {
        
        if(err){
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decode.usuario;
        next();

    });

}


// ======================
// Verificar token Admin
// ======================

let verificarTokenAdmin = (req, res, next) => {
    let usuario = req.usuario;

    if(usuario.role != "ADMIN_ROLE"){
        return res.json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        });
    }
    next();
}

// ======================
// Verificar token Img
// ======================

let verificarTokenImg = (req, res, next) => {
    let { token } = req.query
    
    jwt.verify(token, process.env.SEED, (err, decode) => {
        
        if(err){
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decode.usuario;
        next();

    });
}

module.exports = {
    verificarToken,
    verificarTokenAdmin,
    verificarTokenImg
};