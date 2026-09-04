const API_WA = '5493413005198';

document.addEventListener("DOMContentLoaded", async () => {
    // Menú
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

    // Esperar que carguen los productos ANTES de agregar el primer item
    await cargarOpcionesProductos();
    agregarProducto();

    document.getElementById('btnAgregar').addEventListener('click', agregarProducto);
    document.getElementById('pedidoForm').addEventListener('submit', enviarPedido);
});

let productos = [];
let contadorItems = 0;

async function cargarOpcionesProductos() {
    try {
        const res = await fetch(`${API_URL}/api/productos`);
        productos = await res.json();
    } catch (err) {
        console.error('Error cargando productos:', err);
        productos = [];
    }
}

function agregarProducto() {
    contadorItems++;
    const id = contadorItems;
    const lista = document.getElementById('listaProductos');

    const item = document.createElement('div');
    item.className = 'producto-item';
    item.id = `item-${id}`;
    item.innerHTML = `
        <div class="producto-item-header">
            <span class="producto-num">Producto ${id}</span>
            ${id > 1 ? `<button type="button" class="btn-quitar" onclick="quitarProducto(${id})">
                <span class="material-symbols-outlined">delete</span>
            </button>` : ''}
        </div>
        <div class="form-row-2">
            <div class="form-group">
                <label>Producto</label>
                <select class="sel-producto" id="prod-${id}">
                    <option value="">-- Seleccioná --</option>
                    ${productos.map(p => `<option value="${p.nombre} (${p.codigo})">${p.nombre}</option>`).join('')}
                    <option value="Otro">Otro (especificar en comentarios)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Talle</label>
                <select class="sel-talle" id="talle-${id}">
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M" selected>M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="Único">Único</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>Cantidad</label>
            <input type="number" class="inp-cantidad" id="cant-${id}" min="1" value="1" style="max-width:100px">
        </div>
    `;

    lista.appendChild(item);
}

function quitarProducto(id) {
    document.getElementById(`item-${id}`).remove();
}

function enviarPedido(e) {
    e.preventDefault();

    const nombre      = document.getElementById('nombre')?.value;
    const telefono    = document.getElementById('telefono')?.value;
    const ciudad      = document.getElementById('ciudad')?.value || 'No especificada';
    const direccion       = document.getElementById('direccion')?.value || 'No especificado';
    const comentarios = document.getElementById('comentarios')?.value || 'Ninguno';

    if (!nombre || !telefono) return;

    const items = document.querySelectorAll('.producto-item');
    let listaTexto = '';
    let hayProducto = false;

    items.forEach((item, i) => {
        const prod  = item.querySelector('.sel-producto')?.value;
        const talle = item.querySelector('.sel-talle')?.value;
        const cant  = item.querySelector('.inp-cantidad')?.value;
        if (prod) {
            hayProducto = true;
            listaTexto += `\n  ${i+1}. ${prod} | Talle: ${talle} | Cantidad: ${cant}`;
        }
    });

    if (!hayProducto) {
        alert('Seleccioná al menos un producto.');
        return;
    }

    const mensaje =
`🛒 *NUEVO PEDIDO - Camisetas Premium*

👤 Nombre: ${nombre}
📱 Teléfono: ${telefono}
📍 Ciudad: ${ciudad}
🚚 Direccion: ${direccion}

🛍️ *Productos:*${listaTexto}

💬 Comentarios: ${comentarios}`;

    const url = `https://wa.me/${API_WA}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}