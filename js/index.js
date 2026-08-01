const API_URL = 'https://camisetaspremium-api.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
    const sideMenu = document.getElementById("sideMenu");
    const overlay  = document.getElementById("menuOverlay");
    const btnTop   = document.getElementById("navToggleTop");
    const btnPanel = document.getElementById("navToggle");

    const abrirMenu  = () => { sideMenu.classList.add("open");    overlay.classList.add("active");    document.body.style.overflow = "hidden"; };
    const cerrarMenu = () => { sideMenu.classList.remove("open"); overlay.classList.remove("active"); document.body.style.overflow = ""; };

    if (btnTop)   btnTop.addEventListener("click", abrirMenu);
    if (btnPanel) btnPanel.addEventListener("click", cerrarMenu);
    if (overlay)  overlay.addEventListener("click", cerrarMenu);
    document.querySelectorAll(".side-menu-links a").forEach(l => l.addEventListener("click", cerrarMenu));

    cargarDestacados();
});

async function cargarDestacados() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#555;">Cargando productos...</div>`;

    try {
        const res = await fetch(`${API_URL}/api/productos?destacado=true`);
        const productos = await res.json();

        if (productos.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#555;">No hay productos destacados.</div>`;
            return;
        }

        grid.innerHTML = productos.map(p => `
            <div class="product-card">
                <div class="product-image-wrapper">
                    <span class="tag-new">NUEVO</span>
                    <span class="material-symbols-outlined heart-icon">favorite_border</span>
                    <img src="${p.imagenUrl}" alt="${p.nombre}" loading="lazy">
                </div>
                <div class="product-details">
                    <h3>${p.nombre}</h3>
                    <p class="code">Código: ${p.codigo}</p>
                    <a href="https://wa.me/549XXXX?text=Hola!%20Quiero%20consultar%20por%20${encodeURIComponent(p.nombre)}%20(${p.codigo})" class="btn-whatsapp">Consultar por WhatsApp</a>
                </div>
            </div>
        `).join('');

    } catch (err) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#c0392b;">Error al cargar productos.</div>`;
    }
}