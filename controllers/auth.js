const { response, json } = require("express");
const Usuario = require('../models/usuario');

const bcryptjs = require('bcryptjs');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req, res = response)=>{

    const { correo, password } = req.body;

    try {

        //verificar emil existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / Pass no son correctos -mail'
            });
        }

        //usuario esta activo en BD
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario / Pass no son correctos -estado:false '
            });
        }


        //verificar Pass
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg:'Usuario / Pass no son correctos - pass'
            });
        }


        //generar JWT
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        rep.status(500).json({
            msg:"Algo salio mal..."
        })
    }

}


const googleSignin = async (req, res= response) =>{
    
    const { id_token } = req.body;

    try {
        
        const {correo, nombre, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if( !usuario ){

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //si el usuario en BD
        if( !usuario.estado ){
            return res.status(401).json({
                msg:'Usuario Bloqueado'
            });
        }
        //Generar JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        
        res.status(400).json({
            msg:'Token de Google no valido'
        })

    }


}

module.exports = {
    login,
    googleSignin
}  