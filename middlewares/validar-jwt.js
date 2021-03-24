const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req=request, res = response, next)=> {

    //leer header de postman
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'No hay Token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        //leer usuario que corresponde uid
        const usuario = await Usuario.findById( uid );

        if(!usuario){
            return res.status(401).json({
                msg:'Token no valido -usuario no existe en BD'
            });

        }


        //verificar estado del usuario uid estado en true
        if( !usuario.estado ){
            return res.status(401).json({
                msg:'Token no valido -usuario estado : false'
            });
        }
        

        req.usuario = usuario;
        next();
    } catch (error) {

        res.status(401).json({
            msg:'Token no valido'
        })
        
    }

    

}


module.exports = {

    validarJWT
}