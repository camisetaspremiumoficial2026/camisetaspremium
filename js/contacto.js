// js/script.js

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.getElementById("navLinks");
    const navToggle = document.querySelector(".nav-toggle");
    const navClose = document.querySelector(".nav-close");

    // Abrir el menú hamburguesa
    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.add("nav-menu_visible");
        });
    }

    // Cerrar el menú con el botón de la equis (X)
    if (navClose && navLinks) {
        navClose.addEventListener("click", () => {
            navLinks.classList.remove("nav-menu_visible");
        });
    }

    // Opcional: Cerrar el menú automáticamente si se hace clic en cualquier enlace
    const links = document.querySelectorAll(".nav-links a");
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("nav-menu_visible");
        });
    });
});
