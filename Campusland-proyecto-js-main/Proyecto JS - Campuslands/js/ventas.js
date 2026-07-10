document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
    configurarEventListeners();
});

function configurarEventListeners() {
    const btnCerrar = document.getElementById('btn-cerrar-detalle');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            document.getElementById('modal-detalle-venta').classList.remove('is-active');
        });
    }

    const modal = document.getElementById('modal-detalle-venta');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('is-active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            modal.classList.remove('is-active');
        }
    });
}

function obtenerVentas() {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];

    return ventas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

function cargarVentas() {
    const tbody = document.getElementById('body-ventas');
    const ventas = obtenerVentas();

    tbody.innerHTML = '';

    if (ventas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #6b7280;">
                    No hay ventas registradas. ¡Realiza tu primera venta!
                </td>
            </tr>
        `;
        return;
    }

    ventas.forEach(venta => {
        const tr = document.createElement('tr');
        const fechaFormateada = new Date(venta.fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        tr.innerHTML = `
            <td>${fechaFormateada}</td>
            <td><strong>${venta.cliente.nombre}</strong><br><small>${venta.cliente.email}</small></td>
            <td>${venta.ciudad}</td>
            <td><strong>$${venta.total.toLocaleString()}</strong></td>
            <td>
                <button onclick="verDetalle(${venta.id})" class="btn-ver-detalle">Ver Detalle</button>
                <button onclick="eliminarVenta(${venta.id})" class="btn-eliminar-venta">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function verDetalle(id) {
    const ventas = obtenerVentas();
    const venta = ventas.find(v => v.id === id);
    const modal = document.getElementById('modal-detalle-venta');
    const contenido = document.getElementById('contenido-detalle');

    if (!venta) {
        alert('Venta no encontrada');
        return;
    }

    const fechaFormateada = new Date(venta.fecha).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let detallesHTML = venta.detalles.map(item => `
        <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${item.imagen || 'https://via.placeholder.com/40'}" alt="${item.nombre}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                <div>
                    <strong>${item.nombre}</strong>
                    <br>
                    <small style="color: #64748b;">${item.categoria} • ${item.ciudad}</small>
                </div>
            </div>
            <div style="text-align: right;">
                <div>${item.cantidad} x $${item.precio.toLocaleString()}</div>
                <strong>$${item.subtotal.toLocaleString()}</strong>
            </div>
        </li>
    `).join('');

    contenido.innerHTML = `
        <div style="padding: 10px 0;">
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1e3a8a; margin-bottom: 10px;">Información del Cliente</h3>
                <p><strong>Nombre:</strong> ${venta.cliente.nombre}</p>
                <p><strong>Email:</strong> ${venta.cliente.email}</p>
                <p><strong>Teléfono:</strong> ${venta.cliente.telefono || 'No especificado'}</p>
                <p><strong>Ciudad:</strong> ${venta.ciudad}</p>
                <p><strong>Fecha de compra:</strong> ${fechaFormateada}</p>
                <p><strong>Estado:</strong> <span style="color: #22c55e; font-weight: 600;">${venta.estado || 'Completada'}</span></p>
            </div>

            <h3 style="color: #1e3a8a; margin-bottom: 10px;">Detalle de Productos</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${detallesHTML}
            </ul>

            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #e2e8f0; text-align: right;">
                <h3 style="color: #1e3a8a;">Total: <span style="font-size: 1.5rem;">$${venta.total.toLocaleString()}</span></h3>
            </div>
        </div>
    `;
    modal.classList.add('is-active');
}

function eliminarVenta(id) {
    if (confirm('¿Seguro que deseas eliminar esta venta? Esta acción no se puede deshacer.')) {
        let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
        ventas = ventas.filter(v => v.id !== id);
        localStorage.setItem('ventas', JSON.stringify(ventas));
        cargarVentas();
        alert('Venta eliminada correctamente');
    }
}

function recargarVentas() {
    cargarVentas();
    console.log('Ventas recargadas');
}