

const {response} = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontend } = require('../helpers/menu-frontend');

const login = async( req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar Email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario valido'
            })
        }

        // Verificar Contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if(!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no valida'
            })
        }

        // Generar un token - JWT
        const token = await generarJWT( usuarioDB.id );
        //console.log(usuarioDB);
        res.json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB.id,
            token,
            menu: getMenuFrontend( usuarioDB.role )
          
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async ( req, res = response ) => {

    const googleToken = req.body.token;
    try {

        const { email, name, picture } =  await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB) {
            // Si no existe el usuario
            console.log('Usuario no encontrado');
            usuario = new Usuario({
                nombre: name, 
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            // existe el usuario
            console.log('Usuario existente');
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en BD
        await usuario.save();
        console.log('Usuario guardado')

        // Generar el TOKEN - JWT 
        console.log('Antes de generar el token, el usuario es: ' + usuario);
        console.log('Antes de generar el token, el usuarioDB es: ' + usuarioDB);
        const token = await generarJWT(usuario.id);
        console.log('Token generado: ' + token);

        res.json({
            ok: true,
            token,
            menu: getMenuFrontend( usuarioDB.role )
        })
        
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        })
    }
    
}

const renewToken = async (req, res = response ) => {
    const uid = req.uid;

    console.log('El uid: ' + uid)
    // Generar el token JWT
    const token  = await generarJWT(uid);

    // Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontend( usuario.role )
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}