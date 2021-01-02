/*

    Ruta: api/upload/:tipo/:id

*/

const expressFileUpload = require('express-fileupload');

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const { fileUpload } = require('../controllers/uploads.controller');
const { retornaImagen } = require('../controllers/uploads.controller');

const router  = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);

router.get('/:tipo/:foto', retornaImagen );


module.exports = router;