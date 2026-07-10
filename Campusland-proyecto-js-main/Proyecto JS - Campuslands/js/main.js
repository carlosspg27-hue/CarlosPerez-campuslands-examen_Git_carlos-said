document.addEventListener('DOMContentLoaded', () => {
    fetch('../components/menu_sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el sidebar');
            }
            return response.text();
        })
        .then(data => {
            const container = document.getElementById('sidebar-container');
            if (container) {
                container.innerHTML = data;
                initSidebarToggle();
            }
        })
        .catch(error => {
            console.warn('Error al cargar sidebar:', error);
            createFallbackSidebar();
        });

    initSidebarToggle();
});

function initSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    if (document.querySelector('.sidebar-toggle')) return;

    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.setAttribute('aria-label', 'Abrir menú');
    toggleBtn.innerHTML = '☰';
    toggleBtn.style.display = 'none';

    const navActions = document.querySelector('.nav-acions');
    if (navActions) {
        navbar.insertBefore(toggleBtn, navActions);
    } else {
        navbar.appendChild(toggleBtn);
    }

    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleToggleVisibility = (e) => {
        toggleBtn.style.display = e.matches ? 'flex' : 'none';
        if (!e.matches) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    mediaQuery.addEventListener('change', handleToggleVisibility);
    handleToggleVisibility(mediaQuery);

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    document.addEventListener('DOMContentLoaded', () => {
        fetch('../components/menu_sidebar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('sidebar-container').innerHTML = data;
            });
    });
    
    sidebar.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

function createFallbackSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    container.innerHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>Eventify Campus</h2>
                <p>Gestión de eventos</p>
            </div>
            <nav class="sidebar-menu">
                <a href="../pages/dasboard.html">Dashboard</a>
                <a href="../pages/eventos.html">Eventos</a>
                <a href="../pages/categorias.html">Categorías</a>
                <a href="../pages/ventas.html">Ventas</a>
                <a href="../index.html">Salir</a>
            </nav>
        </aside>
    `;

    initSidebarToggle();
}