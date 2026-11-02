document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

async function cargarProductos() {
    const grid = document.querySelector('.productos');
    if (!grid) return;

    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#555;">Cargando productos...</div>`;

    try {
        const res = await fetch(`${API_URL}/api/productos?categoria=ninos`);
        const productos = await res.json();

        if (productos.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#555;">No hay productos disponibles.</div>`;
            return;
        }

        grid.innerHTML = productos.map(p => `
            <div class="card">
                <img src="${p.imagenUrl}" alt="${p.nombre}" loading="lazy">
                <h3>${p.nombre}</h3>
                <p>Código: ${p.codigo}</p>
                <p class="precio">$${p.precio?.toLocaleString('es-AR') ?? 'Consultar'}</p>
                <a href="https://wa.me/543413005198?text=Hola!%20Quiero%20consultar%20por%20${encodeURIComponent(p.nombre)}%20(${p.codigo})" class="btn">Consultar por WhatsApp</a>
            </div>
        `).join('');

    } catch (err) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#c0392b;">Error al cargar productos.</div>`;
    }
}