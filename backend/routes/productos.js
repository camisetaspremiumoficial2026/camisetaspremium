const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { upload, cloudinary } = require('../middleware/cloudinaryUpload');

// GET /api/productos — todos los activos
// GET /api/productos?categoria=adultos — filtrar por categoría
// GET /api/productos?destacado=true — solo los destacados (para el inicio)
router.get('/', async (req, res) => {
    try {
        const filtro = { activo: true };
        if (req.query.categoria) filtro.categoria = req.query.categoria;
        if (req.query.destacado)  filtro.destacado = req.query.destacado === 'true';

        const productos = await Producto.find(filtro).sort({ createdAt: -1 });
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// GET /api/productos/:id — uno por ID
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(producto);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// POST /api/productos — crear con imagen
// Body: multipart/form-data con campo "imagen" (file) + nombre, codigo, categoria
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, codigo, categoria, destacado } = req.body;

        if (!req.file) return res.status(400).json({ error: 'La imagen es obligatoria' });

        const producto = new Producto({
            nombre,
            codigo,
            categoria,
            destacado: destacado === 'true',
            imagenUrl:      req.file.path,        // URL pública de Cloudinary
            imagenPublicId: req.file.filename      // ID para borrar si hace falta
        });

        await producto.save();
        res.status(201).json(producto);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'El código de producto ya existe' });
        }
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

// PUT /api/productos/:id — editar (con o sin nueva imagen)
router.put('/:id', upload.single('imagen'), async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        const { nombre, codigo, categoria, destacado, activo } = req.body;
        if (nombre)    producto.nombre    = nombre;
        if (codigo)    producto.codigo    = codigo;
        if (categoria) producto.categoria = categoria;
        if (destacado !== undefined) producto.destacado = destacado === 'true';
        if (activo    !== undefined) producto.activo    = activo    === 'true';

        // Si viene nueva imagen, borramos la vieja de Cloudinary y guardamos la nueva
        if (req.file) {
            if (producto.imagenPublicId) {
                await cloudinary.uploader.destroy(producto.imagenPublicId);
            }
            producto.imagenUrl      = req.file.path;
            producto.imagenPublicId = req.file.filename;
        }

        await producto.save();
        res.json(producto);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// DELETE /api/productos/:id — borrar producto e imagen
router.delete('/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        // Borrar imagen de Cloudinary
        if (producto.imagenPublicId) {
            await cloudinary.uploader.destroy(producto.imagenPublicId);
        }

        res.json({ mensaje: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
