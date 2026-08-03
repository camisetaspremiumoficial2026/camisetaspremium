const API_URL = 'https://camisetaspremium-api.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
    // ── Menú ──────────────────────────────
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

    // ── Buscador ──────────────────────────
    const lupaBtn = document.querySelector('.nav-icons span');
    if (lupaBtn) lupaBtn.addEventListener("click", abrirBuscador);

    iniciarBuscador();
});

function iniciarBuscador() {
    // Crear el HTML del buscador
    const searchBar = document.createElement('div');
    searchBar.className = 'search-bar';
    searchBar.id = 'searchBar';
    searchBar.innerHTML = `
        <div class="search-input-wrapper">
            <input type="text" class="search-input" id="searchInput" placeholder="Buscar productos...">
            <button class="search-close" id="searchClose">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="search-results" id="searchResults" style="display:none"></div>
    `;
    document.body.appendChild(searchBar);

    document.getElementById('searchClose').addEventListener('click', cerrarBuscador);

    searchBar.addEventListener('click', (e) => {
        if (e.target === searchBar) cerrarBuscador();
    });

    let timeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(timeout);
        const q = e.target.value.trim();
        if (q.length < 2) {
            document.getElementById('searchResults').style.display = 'none';
            return;
        }
        timeout = setTimeout(() => buscar(q), 300);
    });
}

function abrirBuscador() {
    document.getElementById('searchBar').classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('searchInput').focus(), 100);
}

function cerrarBuscador() {
    document.getElementById('searchBar').classList.remove('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').style.display = 'none';
    document.body.style.overflow = '';
}

async function buscar(q) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `<div class="search-no-results">Buscando...</div>`;

    try {
        const res = await fetch(`${API_URL}/api/productos/buscar?q=${encodeURIComponent(q)}`);
        const productos = await res.json();

        if (productos.length === 0) {
            resultsDiv.innerHTML = `<div class="search-no-results">No se encontraron productos</div>`;
            return;
        }

        resultsDiv.innerHTML = productos.map(p => `
            <a href="/htmls/${p.categoria === 'adultos' ? 'adultos' : p.categoria === 'ninos' ? 'niños' : 'otros'}.html" 
               class="search-result-item">
                <img src="${p.imagenUrl}" alt="${p.nombre}">
                <div class="info">
                    <h4>${p.nombre}</h4>
                    <p>$${p.precio?.toLocaleString('es-AR') ?? 'Consultar'} · ${p.codigo}</p>
                </div>
            </a>
        `).join('');

    } catch (err) {
        resultsDiv.innerHTML = `<div class="search-no-results">Error al buscar</div>`;
    }
}