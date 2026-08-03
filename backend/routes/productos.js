const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { upload, cloudinary } = require('../middleware/cloudinaryUpload');

// GET todos los productos
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

// GET uno por ID
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(producto);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// POST crear producto con código automático CP-01, CP-02...
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, categoria, destacado } = req.body;

        if (!req.file) return res.status(400).json({ error: 'La imagen es obligatoria' });

        // Generar código automático
        const ultimo = await Producto.findOne({ codigo: /^CP-/ })
            .sort({ codigo: -1 });

        let numero = 1;
        if (ultimo) {
            const n = parseInt(ultimo.codigo.split('-')[1]);
            numero = n + 1;
        }

        const codigo = `CP-${String(numero).padStart(2, '0')}`;

        const producto = new Producto({
            nombre,
            codigo,
            categoria,
            destacado: destacado === 'true',
            imagenUrl:      req.file.path,
            imagenPublicId: req.file.filename
        });

        await producto.save();
        res.status(201).json(producto);

    } catch (err) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

// PUT editar producto
router.put('/:id', upload.single('imagen'), async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        const { nombre, categoria, destacado, activo } = req.body;
        if (nombre)    producto.nombre    = nombre;
        if (categoria) producto.categoria = categoria;
        if (destacado !== undefined) producto.destacado = destacado === 'true';
        if (activo    !== undefined) producto.activo    = activo    === 'true';

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

// DELETE borrar producto
router.delete('/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        if (producto.imagenPublicId) {
            await cloudinary.uploader.destroy(producto.imagenPublicId);
        }

        res.json({ mensaje: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});
// GET /api/productos/buscar?q=remera
router.get('/buscar', async (req, res) => {
    try {
        const q = req.query.q;
        if (!q || q.length < 2) return res.json([]);

        const productos = await Producto.find({
            activo: true,
            nombre: { $regex: q, $options: 'i' }
        }).limit(6);

        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: 'Error en búsqueda' });
    }
});
module.exports = router;