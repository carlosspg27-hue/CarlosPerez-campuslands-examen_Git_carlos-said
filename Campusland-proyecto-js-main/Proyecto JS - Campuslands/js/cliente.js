let todosLosEventos = [];
let carrito = JSON.parse(localStorage.getItem('carrito_eventos')) || [];

document.addEventListener('DOMContentLoaded', () => {

    inyectarEstilosCSS();

    inyectarEstructurasModales();

    configurarModalCarrito();

    actualizarInterfazCarrito();

    initSidebarToggle();

    const contenedorEventos = document.getElementById('contenedor-eventos');
    if (contenedorEventos) {
        cargarEventos();
        configurarFiltros();
    }

    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', enviarMensajeContacto);
    }
});

function initSidebarToggle() {
    const navbar = document.querySelector('.navbar');
    const navActions = document.querySelector('.nav-acions');

    if (navbar && !document.querySelector('.sidebar-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.setAttribute('aria-label', 'Abrir menú');
        toggleBtn.innerHTML = '☰';
        toggleBtn.style.display = 'none';

        if (navActions) {
            navbar.insertBefore(toggleBtn, navActions);
        } else {
            navbar.appendChild(toggleBtn);
        }

        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        const sidebar = document.querySelector('.sidebar');

        if (sidebar) {
            const mediaQuery = window.matchMedia('(max-width: 768px)');

            const handleToggleVisibility = (e) => {
                toggleBtn.style.display = e.matches ? 'flex' : 'none';
                if (!e.matches) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('active');
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

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
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
    }
}


function inyectarEstilosCSS() {
    if (document.getElementById('modal-styles-dynamic')) return;

    const style = document.createElement('style');
    style.id = 'modal-styles-dynamic';
    style.innerHTML = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .modal-overlay.modal-active {
            opacity: 1;
            pointer-events: auto;
        }
        .modal-content {
            background: white;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            transition: transform 0.3s ease;
            transform: scale(0.9);
            max-height: 90vh;
            display: flex;
            flex-direction: column;
        }
        .modal-overlay.modal-active .modal-content {
            transform: scale(1);
        }
        #cart-modal .modal-content {
            position: fixed;
            right: -450px;
            top: 0;
            height: 100vh;
            width: 100%;
            max-width: 420px;
            border-radius: 0;
            transition: right 0.3s ease;
            transform: none;
        }
        #cart-modal.modal-active .modal-content {
            right: 0;
        }
    `;
    document.head.appendChild(style);
}


async function cargarEventos() {
    try {
        let eventosData = localStorage.getItem('eventos');

        if (eventosData) {

            todosLosEventos = JSON.parse(eventosData);
            console.log('Eventos cargados desde localStorage');
        } else {
            console.log('No hay datos en localStorage, cargando desde JSON...');
            const respuesta = await fetch('data/cliente.JSON');
            if (!respuesta.ok) {
                throw new Error('No se pudo cargar el archivo JSON de eventos');
            }
            todosLosEventos = await respuesta.json();

            localStorage.setItem('eventos', JSON.stringify(todosLosEventos));
            console.log('Eventos cargados desde JSON y guardados en localStorage');
        }
        if (!Array.isArray(todosLosEventos) || todosLosEventos.length === 0) {
            throw new Error('Los datos de eventos no tienen el formato esperado');
        }

        poblarFiltrosSelectors(todosLosEventos);
        renderizarEventos(todosLosEventos);
    } catch (error) {
        console.error('Error al cargar los eventos:', error);
        const contenedor = document.getElementById('contenedor-eventos');
        if (contenedor) {
            contenedor.innerHTML = `
                <p style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 40px 0;">
                    Error al cargar los eventos. Por favor, recarga la página.
                </p>
            `;
        }
    }
}

function recargarEventos() {
    const eventosData = localStorage.getItem('eventos');
    if (eventosData) {
        todosLosEventos = JSON.parse(eventosData);
        poblarFiltrosSelectors(todosLosEventos);
        renderizarEventos(todosLosEventos);
        console.log('Eventos recargados desde localStorage');
    } else {
        cargarEventos();
    }
}

function poblarFiltrosSelectors(eventos) {
    const citySelect = document.getElementById('city-select');
    const categorySelect = document.getElementById('category-select');
    if (!citySelect || !categorySelect) return;

    citySelect.innerHTML = '<option value="todos">Todas las ciudades</option>';
    categorySelect.innerHTML = '<option value="todos">Todas las categorías</option>';

    const ciudades = [...new Set(eventos.map(e => e.ciudad))];
    const categorias = [...new Set(eventos.map(e => e.categoria))];

    ciudades.forEach(ciudad => {
        const option = document.createElement('option');
        option.value = ciudad.toLowerCase();
        option.textContent = ciudad;
        citySelect.appendChild(option);
    });

    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.toLowerCase();
        option.textContent = categoria;
        categorySelect.appendChild(option);
    });
}

function configurarFiltros() {
    const searchInput = document.getElementById('search-input');
    const citySelect = document.getElementById('city-select');
    const categorySelect = document.getElementById('category-select');

    if (searchInput) searchInput.addEventListener('input', filtrarEventos);
    if (citySelect) citySelect.addEventListener('change', filtrarEventos);
    if (categorySelect) categorySelect.addEventListener('change', filtrarEventos);
}

function filtrarEventos() {
    const searchInput = document.getElementById('search-input');
    const citySelect = document.getElementById('city-select');
    const categorySelect = document.getElementById('category-select');

    const textoBusqueda = searchInput ? searchInput.value.toLowerCase() : '';
    const ciudadSeleccionada = citySelect ? citySelect.value : 'todos';
    const categoriaSeleccionada = categorySelect ? categorySelect.value : 'todos';

    const eventosFiltrados = todosLosEventos.filter(evento => {
        const coincideTexto = evento.titulo.toLowerCase().includes(textoBusqueda);
        const coincideCiudad = ciudadSeleccionada === 'todos' || evento.ciudad.toLowerCase() === ciudadSeleccionada;
        const coincideCategoria = categoriaSeleccionada === 'todos' || evento.categoria.toLowerCase() === categoriaSeleccionada;

        return coincideTexto && coincideCiudad && coincideCategoria;
    });

    renderizarEventos(eventosFiltrados);
}


function renderizarEventos(listaEventos) {
    const contenedor = document.getElementById('contenedor-eventos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (listaEventos.length === 0) {
        contenedor.innerHTML = `<p class="no-results" style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 40px 0;">No se encontraron eventos que coincidan con la búsqueda.</p>`;
        return;
    }

    listaEventos.forEach(evento => {
        const precioFormateado = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(evento.precio);

        const article = document.createElement('article');
        article.classList.add('event-card');

        article.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${evento.imagen}" alt="${evento.titulo}">
                <span class="tag-category tag-left">${evento.categoria}</span>
                <span class="tag-city tag-right">${evento.ciudad}</span>
            </div>
            <div class="card-body">
                <h3>${evento.titulo}</h3>
                <p class="card-date">Fecha: ${evento.fecha} Hora: ${evento.hora}</p>
                <div class="card-footer">
                    <div>
                        <span class="price-label">DESDE</span>
                        <p class="price-value">${precioFormateado}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn-add" onclick="agregarAlCarrito(${evento.id})">Agregar</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(article);
    });
}


function inyectarEstructurasModales() {
    if (!document.getElementById('cart-modal')) {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'cart-modal';
        modalOverlay.classList.add('modal-overlay');
        modalOverlay.innerHTML = `
            <div class="modal-content" style="font-family: sans-serif;">
                <div class="modal-header" style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <h3 style="margin: 0; font-size: 1.4rem; font-weight: 700; letter-spacing: -0.5px;">Eventify Campus</h3>
                        <span style="font-size: 0.75rem; color: #93c5fd; opacity: 0.9;">Tu carrito de compras</span>
                    </div>
                    <button id="btn-close-cart" style="background: rgba(255,255,255,0.1); border: none; color: white; font-size: 1.4rem; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px; background: #f8fafc; flex: 1; overflow-y: auto;">
                    <div id="cart-items-container"></div>
                </div>
                <div class="modal-footer" style="padding: 20px; background: #ffffff; border-top: 1px solid #e2e8f0;">
                    <div class="cart-total-container" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 1.2rem; font-weight: 700; color: #1e293b;">
                        <span>Total Orden:</span>
                        <span id="cart-total-price" style="color: #1e3a8a;">$ 0</span>
                    </div>
                    <button id="btn-pay-cart" style="width: 100%; background: #1e3a8a; color: white; border: none; padding: 14px; font-size: 1rem; font-weight: 600; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.2);">Pagar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    }

    if (!document.getElementById('notification-modal')) {
        const notifOverlay = document.createElement('div');
        notifOverlay.id = 'notification-modal';
        notifOverlay.classList.add('modal-overlay');
        document.body.appendChild(notifOverlay);
    }
}

function mostrarModalAgregado(evento) {
    const notifOverlay = document.getElementById('notification-modal');
    if (!notifOverlay) return;

    const precioFormateado = new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(evento.precio);

    notifOverlay.innerHTML = `
        <div class="modal-content" style="border-radius: 16px; overflow: hidden; max-width: 450px; width: 90%; font-family: sans-serif; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: white; padding: 18px; text-align: center;">
                <h4 style="margin: 0; font-size: 1.2rem; font-weight: 600;">¡Agregado al Carrito con Éxito!</h4>
                <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #93c5fd;">Se ha generado tu reserva temporal</p>
            </div>
            
            <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
                <div style="display: flex; gap: 14px; align-items: center; background: #f8fafc; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <img src="${evento.imagen}" alt="${evento.titulo}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                    <div style="flex: 1; min-width: 0;">
                        <span style="font-size: 0.7rem; background: #1e3a8a; color: white; padding: 2px 8px; border-radius: 20px; font-weight: bold; text-transform: uppercase;">${evento.categoria}</span>
                        <h4 style="margin: 6px 0 2px 0; font-size: 1.1rem; color: #1e293b; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${evento.titulo}</h4>
                        <p style="margin: 0; font-size: 0.8rem; color: #64748b;">📍 ${evento.ciudad}</p>
                        <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: #64748b;">📅 ${evento.fecha} - ⏰ ${evento.hora}</p>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 4px;">
                    <span style="color: #475569; font-size: 0.95rem;">Valor Entrada:</span>
                    <strong style="color: #1e3a8a; font-size: 1.2rem;">${precioFormateado}</strong>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 8px;">
                    <button id="btn-continue-shopping" style="flex: 1; background: #f1f5f9; color: #334155; border: none; padding: 12px; font-size: 0.9rem; font-weight: 600; border-radius: 8px; cursor: pointer;">Seguir viendo</button>
                    <button id="btn-go-to-cart" style="flex: 1; background: #1e3a8a; color: white; border: none; padding: 12px; font-size: 0.9rem; font-weight: 600; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px rgba(30,58,138,0.15);">Ir al Carrito</button>
                </div>
            </div>
        </div>
    `;

    notifOverlay.classList.add('modal-active');

    document.getElementById('btn-continue-shopping').addEventListener('click', () => {
        notifOverlay.classList.remove('modal-active');
    });

    document.getElementById('btn-go-to-cart').addEventListener('click', () => {
        notifOverlay.classList.remove('modal-active');
        document.getElementById('cart-modal').classList.add('modal-active');
    });
}

function configurarModalCarrito() {
    const btnOpen = document.querySelector('.btn-carrito');
    const btnClose = document.getElementById('btn-close-cart');
    const btnPay = document.getElementById('btn-pay-cart');
    const modal = document.getElementById('cart-modal');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('modal-active');
        });
    }
    if (btnClose && modal) {
        btnClose.addEventListener('click', () => modal.classList.remove('modal-active'));
    }
    if (btnPay) {
        btnPay.addEventListener('click', procesarPago);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('modal-active');
        });
    }
}

function agregarAlCarrito(id) {
    const eventoEncontrado = todosLosEventos.find(e => e.id === id);
    if (!eventoEncontrado) return;

    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad += 1;
    } else {
        carrito.push({
            ...eventoEncontrado,
            cantidad: 1
        });
    }

    localStorage.setItem('carrito_eventos', JSON.stringify(carrito));
    actualizarInterfazCarrito();

    mostrarModalAgregado(eventoEncontrado);
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem('carrito_eventos', JSON.stringify(carrito));
    actualizarInterfazCarrito();
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
    } else {
        localStorage.setItem('carrito_eventos', JSON.stringify(carrito));
        actualizarInterfazCarrito();
    }
}

function actualizarInterfazCarrito() {
    const container = document.getElementById('cart-items-container');
    const totalLabel = document.getElementById('cart-total-price');
    const btnCarritoNav = document.querySelector('.btn-carrito');

    if (!container || !totalLabel) return;

    container.innerHTML = '';
    let totalAcumulado = 0;
    let itemsTotales = 0;

    if (carrito.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 10px; color: #94a3b8;">
                <p style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 600;">Tu carrito está vacío</p>
                <p style="margin: 0; font-size: 0.85rem;">Explora los próximos eventos en nuestra cartelera.</p>
            </div>
        `;
    } else {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalAcumulado += subtotal;
            itemsTotales += item.cantidad;

            const precioFormateado = new Intl.NumberFormat('es-CO', {
                style: 'currency', currency: 'COP', minimumFractionDigits: 0
            }).format(item.precio);

            const itemRow = document.createElement('div');
            itemRow.style.cssText = "display: flex; align-items: center; gap: 12px; background: white; padding: 12px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; position: relative;";

            itemRow.innerHTML = `
                <img src="${item.imagen}" alt="${item.titulo}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1; min-width: 0;">
                    <h4 style="margin: 0 0 4px 0; font-size: 0.9rem; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.titulo}</h4>
                    <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: #1e3a8a; font-weight: 700;">${precioFormateado}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="cambiarCantidad(${item.id}, -1)" style="width: 24px; height: 24px; background: #e2e8f0; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">-</button>
                        <span style="font-size: 0.9rem; font-weight: 600; color: #334155;">${item.cantidad}</span>
                        <button onclick="cambiarCantidad(${item.id}, 1)" style="width: 24px; height: 24px; background: #e2e8f0; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">+</button>
                    </div>
                </div>
                <button onclick="eliminarDelCarrito(${item.id})" style="background: none; border: none; color: #94a3b8; font-size: 1.3rem; cursor: pointer; padding: 4px; position: absolute; top: 8px; right: 8px;">&times;</button>
            `;
            container.appendChild(itemRow);
        });
    }

    totalLabel.textContent = new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(totalAcumulado);

    if (btnCarritoNav) {
        btnCarritoNav.textContent = `Carrito (${itemsTotales})`;
    }
}

function procesarPago() {
    if (carrito.length === 0) {
        alert("El carrito está vacío, añade eventos primero.");
        return;
    }

    let totalCompra = 0;
    carrito.forEach(item => {
        totalCompra += item.precio * item.cantidad;
    });

    const cliente = {
        nombre: prompt("Ingresa tu nombre completo:", "Cliente Ejemplo"),
        email: prompt("Ingresa tu correo electrónico:", "cliente@email.com"),
        telefono: prompt("Ingresa tu número de teléfono:", "3000000000")
    };

    if (!cliente.nombre || !cliente.email || !cliente.telefono) {
        alert("Debes completar todos los datos para realizar la compra.");
        return;
    }

    const venta = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        cliente: cliente,
        ciudad: carrito[0]?.ciudad || "No especificada",
        total: totalCompra,
        detalles: carrito.map(item => ({
            id: item.id,
            nombre: item.titulo,
            precio: item.precio,
            cantidad: item.cantidad,
            subtotal: item.precio * item.cantidad,
            categoria: item.categoria,
            ciudad: item.ciudad,
            fechaEvento: item.fecha,
            horaEvento: item.hora,
            imagen: item.imagen
        })),
        estado: "Completada"
    };

    let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    ventas.push(venta);
    localStorage.setItem('ventas', JSON.stringify(ventas));
    alert(`✅ ¡Compra exitosa, ${cliente.nombre}!\n\n` +
        `Total pagado: $${totalCompra.toLocaleString()}\n` +
        `Productos: ${carrito.length} item(s)\n` +
        `Se ha enviado un comprobante a ${cliente.email}\n\n` +
        `¡Gracias por tu compra en Eventify Campus! 🎵`);

    carrito = [];
    localStorage.removeItem('carrito_eventos');
    actualizarInterfazCarrito();
    document.getElementById('cart-modal').classList.remove('modal-active');
}

function verDetalle(id) {
    console.log(`Abriendo detalles del evento con ID: ${id}`);
}

function enviarMensajeContacto(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    alert(`¡Gracias por tu mensaje, ${nombre}! Te responderemos pronto a ${email}.`);
    event.target.reset();
}
