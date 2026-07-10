
document.addEventListener('DOMContentLoaded', () => {
    cargarEstadisticas();
});


function cargarEstadisticas() {
    try {

        const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
        const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        const categorias = JSON.parse(localStorage.getItem('categorias')) || [];

        const totalVentas = ventas.length;
        const totalEventos = eventos.length;
        const totalCategorias = categorias.length;


        let ingresosTotales = 0;
        ventas.forEach(venta => {
            ingresosTotales += venta.total || 0;
        });


        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth();
        const añoActual = fechaActual.getFullYear();

        const ventasMes = ventas.filter(venta => {
            const fechaVenta = new Date(venta.fecha);
            return fechaVenta.getMonth() === mesActual &&
                fechaVenta.getFullYear() === añoActual;
        });

        const ingresosMes = ventasMes.reduce((total, venta) => total + (venta.total || 0), 0);

        actualizarEstadisticas({
            totalVentas,
            totalEventos,
            totalCategorias,
            ingresosTotales,
            ventasMes: ventasMes.length,
            ingresosMes,
            ultimasVentas: ventas.slice(0, 5)
        });

        renderizarUltimasVentas(ventas.slice(0, 5));

        actualizarSidebar();

    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        mostrarError('Error al cargar los datos del dashboard');
    }
}

function actualizarEstadisticas(stats) {

    const statVentas = document.getElementById('stat-ventas');
    const statEventos = document.getElementById('stat-eventos');
    const statCategorias = document.getElementById('stat-categorias');

    if (statVentas) {
        statVentas.textContent = stats.totalVentas;
        statVentas.title = `Ingresos totales: $${stats.ingresosTotales.toLocaleString()}`;
    }
    if (statEventos) statEventos.textContent = stats.totalEventos;
    if (statCategorias) statCategorias.textContent = stats.totalCategorias;

    const statIngresos = document.getElementById('stat-ingresos');
    const infoMes = document.querySelector('.info-mes');
    if (statIngresos) {
        statIngresos.textContent = `$${stats.ingresosTotales.toLocaleString()}`;
    }
    if (infoMes) {
        infoMes.textContent = `${stats.ventasMes} ventas este mes ($${stats.ingresosMes.toLocaleString()})`;
    }
}

function renderizarUltimasVentas(ventas) {
    const container = document.getElementById('ultimas-ventas-container');
    const tbody = document.getElementById('ultimas-ventas-body');

    if (!container || !tbody) return;

    if (ventas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">
                    No hay ventas registradas aún
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    ventas.forEach(venta => {
        const fecha = new Date(venta.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        html += `
            <tr>
                <td class="fecha-venta">${fechaFormateada}</td>
                <td>
                    <strong>${venta.cliente?.nombre || 'Cliente'}</strong>
                    <br>
                    <small class="email-cliente">${venta.cliente?.email || ''}</small>
                </td>
                <td>${venta.ciudad || 'N/A'}</td>
                <td class="total-venta">$${(venta.total || 0).toLocaleString()}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    const ventasMes = ventas.filter(v => {
        const fechaVenta = new Date(v.fecha);
        const ahora = new Date();
        return fechaVenta.getMonth() === ahora.getMonth() &&
            fechaVenta.getFullYear() === ahora.getFullYear();
    });

    const totalMes = ventasMes.reduce((total, v) => total + (v.total || 0), 0);

    const resumenMes = document.querySelector('.resumen-mes');
    if (resumenMes) {
        resumenMes.innerHTML = `
            <span>🗓️ <strong>${ventasMes.length}</strong> ventas este mes</span>
            <span class="total-mes">Total del mes: $${totalMes.toLocaleString()}</span>
        `;
    }
}

function actualizarSidebar() {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    const badgeVentas = document.querySelector('.badge-ventas');
    if (badgeVentas) {
        badgeVentas.textContent = ventas.length;
    }
}


function mostrarError(mensaje) {
    const container = document.querySelector('.content');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensaje;
        container.prepend(errorDiv);
    }
}