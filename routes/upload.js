var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var usuario = require('../models/usuario');
var medico = require('../models/medico');
var hospital = require('../models/hospital');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    // tipos de coleccion

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no valida' }

        });
    }

    if (!req.file) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }

        });
    }

    // Obtener Nombre del archivo

    var archivo = req.file.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // solo estas extenciones aceptamos

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'las extensiones validas son' + extensionesValidas.join(',') }

        });
    }
    //Nombre de archivo personalizado

    var nombreArchivo = ` ${ id }- ${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal al path

    var path = `./uploads/${tipo }/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res, status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });

        }

        subirPorTipo(tipo, id, nombreArchivo, res);


    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });

            }

            // si existe, elimina la imagen anterior
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioActualizado
                });

            })

        });

    }

    if (tipo === 'medicos') {

        medico.findById(id, (err, medico) => {

            if (!medico) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });

            }

            // si existe, elimina la imagen anterior
            var pathViejo = './uploads/medicos/' + medico.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {



                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizado',
                    usuario: usuarioActualizado
                });

            })

        });


    }

    if (tipo === 'hospitales') {

        hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });

            }

            // si existe, elimina la imagen anterior
            var pathViejo = './uploads/hospitales/' + hospital.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizado',
                    usuario: usuarioActualizado
                });

            })

        });
    }
}

module.exports = app;