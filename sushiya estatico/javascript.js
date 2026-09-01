const btn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-list');
const links = document.querySelectorAll('.nav-list a');

if (btn && menu) {
    btn.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        btn.setAttribute('aria-expanded', isOpen);
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
}

const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}
