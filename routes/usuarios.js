const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const { usuariosGet, 
        usuariosPut, 
        usuarioPost, 
        usuariosDelete, 
        usuarioPatch } = require('../controllers/usuarios');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');




const router = Router();



router.get('/', usuariosGet );

router.put('/:id',[
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom( esRolValido ),
        validarCampos
], usuariosPut);
                //check ->de express validator para validar entradas
router.post('/',[
        check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
        check('password', 'El Password debe ser mayor a 6 caracteres').isLength({ min: 6}),
        check('correo').custom(emailExiste),
        //check('rol', 'No es un rol Valido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('rol').custom( esRolValido ),
        validarCampos
],usuarioPost);

//6056e12443e6317623ca27a5
router.delete('/:id',[
        validarJWT,
        //esAdminRole,
        tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
        check('id', 'No es un ID valido').isMongoId(),
        validarCampos

], usuariosDelete);

router.patch('/', usuarioPatch);






module.exports = router;