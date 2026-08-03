const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    codigo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ['adultos', 'ninos', 'otros']
    },
    imagenUrl: {
        type: String,
        required: true
    },
    imagenPublicId: {
        type: String  // Para poder borrar la imagen de Cloudinary si hace falta
    },
    destacado: {
        type: Boolean,
        default: false
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
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

module.exports = mongoose.model('Producto', productoSchema);
