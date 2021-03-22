const { response, request } = require('express');
const becryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');




const usuariosGet = async(req = request, res = response)=> {

    const{ limite=5, desde=0 } = req.query;
    const query = {estado: true};

    const [total, usuarios] =await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(Number(desde)).limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async (req, res = response)=> {

    const {id} = req.params;
    const { _id, password, google, correo, ...resto } = req.body;


    if(password){
        //encripta la contraseña
        const salt = becryptjs.genSaltSync(10);
        resto.password = becryptjs.hashSync( password, salt );

    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}


const usuarioPost = async (req, res = response)=> {

    const {nombre, correo, password, rol} = req.body;
    const usuario = Usuario( {nombre, correo, password, rol} );

    //verificar si correo existe


    //Encriptar pass
    const salt = becryptjs.genSaltSync(10);
    usuario.password = becryptjs.hashSync( password, salt );


    //guardar en DB
    await usuario.save();

    res.json({
        usuario
    })
}

const usuarioPatch = (req, res = response)=> {
    res.json({
        msg: 'patch API - Controlador'
    })
}

const usuariosDelete = async (req, res = response)=> {
    const { id } = req.params;

    //borrar fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id)

    //"borrar" cambiando estado de usuario
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario);
}




module.exports = {

    usuariosGet,
    usuariosPut,
    usuarioPost,
    usuarioPatch,
    usuariosDelete
    
}