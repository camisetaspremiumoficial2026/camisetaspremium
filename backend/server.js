require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');

const productosRouter = require('./routes/productos');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: ['https://camisetaspremium.onrender.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/productos', productosRouter);

// Health check — Render lo usa para saber si el server está vivo
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Conexión a MongoDB y arranque del servidor
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB conectado');
        app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
    })
    .catch(err => {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1);
    });