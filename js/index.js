document.addEventListener("DOMContentLoaded", () => {
    const sideMenu   = document.getElementById("sideMenu");
    const overlay    = document.getElementById("menuOverlay");
    const btnTop     = document.getElementById("navToggleTop");
    const btnPanel   = document.getElementById("navToggle");

    function abrirMenu() {
        sideMenu.classList.add("open");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function cerrarMenu() {
        sideMenu.classList.remove("open");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (btnTop)   btnTop.addEventListener("click", abrirMenu);
    if (btnPanel) btnPanel.addEventListener("click", cerrarMenu);
    if (overlay)  overlay.addEventListener("click", cerrarMenu);

    document.querySelectorAll(".side-menu-links a").forEach(link => {
        link.addEventListener("click", cerrarMenu);
    });
});