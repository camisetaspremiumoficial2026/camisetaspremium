const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// GET todos los productos
router.get('/', async (req, res) => {
    try {
        const filtro = { activo: true };
        if (req.query.categoria) filtro.categoria = req.query.categoria;
        if (req.query.destacado)  filtro.destacado = req.query.destacado == true;

        const productos = await Producto.find(filtro).sort({ createdAt: -1 });
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: 'Por ahora no hay producto' });
    }
});

// GET buscar
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
        res.status(500).json({ error: 'Disculpe las molestias' });
    }
});

module.exports = router;