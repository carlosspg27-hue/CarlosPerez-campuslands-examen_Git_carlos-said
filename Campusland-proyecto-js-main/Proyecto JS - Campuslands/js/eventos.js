const formEvento = document.getElementById('eventos-form');
const bodyEventos = document.getElementById('body-eventos');
const modalEvento = document.getElementById('eventos-modal');
const btnNuevoEvento = document.getElementById('btn-nuevo-evento');
const btnCancelar = document.getElementById('eventos-btn-cancelar');

document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatosIniciales();
    renderizarEventos();
    cargarCategoriasEnSelect();
    cargarCiudadesEnSelect();
    console.log('✅ Eventos.js inicializado correctamente');
});

async function cargarDatosIniciales() {
    // Cargar eventos si no existen
    if (!localStorage.getItem('eventos')) {
        try {
            const response = await fetch('../data/cliente.JSON');
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('eventos', JSON.stringify(data));
                console.log('✅ Eventos cargados desde JSON');
            } else {
                throw new Error('No se pudo cargar el archivo');
            }
        } catch (error) {
            console.error('❌ Error al cargar eventos:', error);
            // Crear eventos de ejemplo
            const eventosEjemplo = [
                {
                    id: 1,
                    titulo: "Rock al Parque",
                    categoria: "Rock",
                    precio: 85000,
                    fecha: "2026-08-14",
                    hora: "18:00",
                    ciudad: "Bogotá",
                    imagen: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
                    desc: "Festival de rock en Bogotá"
                }
            ];
            localStorage.setItem('eventos', JSON.stringify(eventosEjemplo));
        }
    }

    // Si no hay ciudades, crear las por defecto
    if (!localStorage.getItem('ciudades')) {
        const ciudadesPorDefecto = [
            { id: 1, codigo: 'BOG', nombre: 'Bogotá' },
            { id: 2, codigo: 'MED', nombre: 'Medellín' },
            { id: 3, codigo: 'BAR', nombre: 'Barranquilla' },
            { id: 4, codigo: 'BUC', nombre: 'Bucaramanga' }
        ];
        localStorage.setItem('ciudades', JSON.stringify(ciudadesPorDefecto));
        console.log('✅ Ciudades por defecto creadas');
    }

    // Si no hay categorías, crear las por defecto
    if (!localStorage.getItem('categorias')) {
        const categoriasPorDefecto = [
            { id: 1, nombre: "Rock", desc: "Eventos de música rock" },
            { id: 2, nombre: "Electrónica", desc: "Música electrónica" },
            { id: 3, nombre: "Salsa", desc: "Eventos de salsa" },
            { id: 4, nombre: "Pop", desc: "Conciertos de pop" },
            { id: 5, nombre: "Jazz", desc: "Festivales de jazz" },
            { id: 6, nombre: "Reggae", desc: "Música reggae" },
            { id: 7, nombre: "Folclor", desc: "Música folclórica" },
            { id: 8, nombre: "Clásica", desc: "Conciertos de música clásica" }
        ];
        localStorage.setItem('categorias', JSON.stringify(categoriasPorDefecto));
        console.log('✅ Categorías por defecto creadas');
    }
}
if (btnNuevoEvento) {
    btnNuevoEvento.addEventListener('click', () => {
        document.getElementById('eventos-modal-titulo').innerText = "Nuevo Evento";
        formEvento.reset();
        document.getElementById('eventos-id').value = "";
        cargarCiudadesEnSelect();
        cargarCategoriasEnSelect();
        modalEvento.classList.add('is-active');
        console.log('✅ Modal abierto');
    });
}

// Botón Cancelar
if (btnCancelar) {
    btnCancelar.addEventListener('click', () => {
        modalEvento.classList.remove('is-active');
        console.log('✅ Modal cerrado');
    });
}

// Clic fuera del modal para cerrar
window.addEventListener('click', (event) => {
    if (event.target === modalEvento) {
        modalEvento.classList.remove('is-active');
    }
});

if (formEvento) {
    formEvento.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('✅ Formulario enviado');
        
        try {
            let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
            const id = document.getElementById('eventos-id').value;
            
            // Obtener valores del formulario
            const titulo = document.getElementById('eventos-nombre').value.trim();
            const categoria = document.getElementById('eventos-categoria').value;
            const ciudad = document.getElementById('eventos-ciudad').value;
            const precio = Number(document.getElementById('eventos-precio').value);
            const fecha = document.getElementById('eventos-fecha').value;
            const hora = document.getElementById('eventos-hora').value;
            const imagen = document.getElementById('eventos-img').value.trim();
            const desc = document.getElementById('eventos-desc').value.trim();
            
            // VALIDACIONES
            if (!titulo) {
                alert('⚠️ El nombre del evento es obligatorio');
                document.getElementById('eventos-nombre').focus();
                return;
            }
            
            if (!categoria) {
                alert('⚠️ Selecciona una categoría');
                document.getElementById('eventos-categoria').focus();
                return;
            }
            
            if (!ciudad) {
                alert('⚠️ Selecciona una ciudad');
                document.getElementById('eventos-ciudad').focus();
                return;
            }
            
            if (!precio || precio <= 0) {
                alert('⚠️ Ingresa un precio válido');
                document.getElementById('eventos-precio').focus();
                return;
            }
            
            if (!fecha) {
                alert('⚠️ Selecciona una fecha');
                document.getElementById('eventos-fecha').focus();
                return;
            }
            
            if (!imagen) {
                alert('⚠️ Ingresa una URL de imagen');
                document.getElementById('eventos-img').focus();
                return;
            }
            
            // Crear objeto del evento
            const nuevoEvento = {
                id: id ? Number(id) : Date.now(),
                titulo: titulo,
                categoria: categoria,
                ciudad: ciudad,
                precio: precio,
                fecha: fecha,
                hora: hora || '20:00',
                imagen: imagen,
                desc: desc || 'Sin descripción'
            };
            
            console.log('📝 Evento a guardar:', nuevoEvento);
            
            // Guardar en localStorage
            if (id) {
                // EDITAR
                eventos = eventos.map(ev => ev.id === Number(id) ? nuevoEvento : ev);
                alert('✅ Evento actualizado correctamente');
            } else {
                // CREAR
                eventos.push(nuevoEvento);
                alert('✅ Evento creado correctamente');
            }
            
            localStorage.setItem('eventos', JSON.stringify(eventos));
            console.log('✅ Eventos guardados:', eventos);
            
            // Cerrar modal y actualizar tabla
            modalEvento.classList.remove('is-active');
            renderizarEventos();
            formEvento.reset();
            
        } catch (error) {
            console.error('❌ Error al guardar evento:', error);
            alert('❌ Error al guardar el evento. Revisa la consola para más detalles.');
        }
    });
}

function renderizarEventos() {
    if (!bodyEventos) return;
    
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    console.log('📋 Renderizando eventos:', eventos.length);
    
    if (eventos.length === 0) {
        bodyEventos.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #6b7280;">
                    No hay eventos registrados. ¡Crea tu primer evento!
                </td>
            </tr>
        `;
        return;
    }

    bodyEventos.innerHTML = eventos.map(e => `
        <tr>
            <td><img src="${e.imagen}" width="50" style="border-radius:4px; object-fit:cover; height:50px;"></td>
            <td><strong>${e.titulo}</strong></td>
            <td>${e.categoria}</td>
            <td>${e.ciudad}</td>
            <td>$${e.precio ? e.precio.toLocaleString() : '0'}</td>
            <td>
                <button onclick="editarEvento(${e.id})" class="btn-edit">✏️ Editar</button>
                <button onclick="eliminarEvento(${e.id})" class="btn-delete">🗑️ Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function cargarCategoriasEnSelect() {
    const selectCat = document.getElementById('eventos-categoria');
    if (!selectCat) return;
    
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const valorActual = selectCat.value;
    
    selectCat.innerHTML = '<option value="">Seleccione una categoría</option>';
    
    if (categorias.length === 0) {
        selectCat.innerHTML += '<option value="" disabled>⚠️ No hay categorías</option>';
        return;
    }
    
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.nombre;
        option.textContent = cat.nombre;
        selectCat.appendChild(option);
    });
    
    if (valorActual && categorias.some(c => c.nombre === valorActual)) {
        selectCat.value = valorActual;
    }
}

function cargarCiudadesEnSelect(ciudadSeleccionada = null) {
    const selectCiudad = document.getElementById('eventos-ciudad');
    if (!selectCiudad) return;
    
    const ciudades = JSON.parse(localStorage.getItem('ciudades')) || [];
    const valorActual = selectCiudad.value;
    
    selectCiudad.innerHTML = '<option value="">Seleccione una ciudad</option>';
    
    if (ciudades.length === 0) {
        selectCiudad.innerHTML += '<option value="" disabled>⚠️ No hay ciudades registradas</option>';
        return;
    }
    
    ciudades.forEach(ciudad => {
        const option = document.createElement('option');
        option.value = ciudad.nombre;
        option.textContent = ciudad.nombre;
        selectCiudad.appendChild(option);
    });
    
    // Restaurar valor seleccionado
    if (ciudadSeleccionada) {
        selectCiudad.value = ciudadSeleccionada;
    } else if (valorActual && ciudades.some(c => c.nombre === valorActual)) {
        selectCiudad.value = valorActual;
    }
}

window.eliminarEvento = (id) => {
    if (confirm('¿Eliminar este evento?')) {
        let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        eventos = eventos.filter(e => Number(e.id) !== Number(id));
        localStorage.setItem('eventos', JSON.stringify(eventos));
        renderizarEventos();
        alert('✅ Evento eliminado');
    }
};

window.editarEvento = (id) => {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const ev = eventos.find(e => Number(e.id) === Number(id));
    
    if (ev) {
        document.getElementById('eventos-id').value = ev.id;
        document.getElementById('eventos-nombre').value = ev.titulo;
        document.getElementById('eventos-categoria').value = ev.categoria;
        document.getElementById('eventos-precio').value = ev.precio;
        document.getElementById('eventos-fecha').value = ev.fecha;
        document.getElementById('eventos-hora').value = ev.hora || '20:00';
        document.getElementById('eventos-img').value = ev.imagen;
        document.getElementById('eventos-desc').value = ev.desc || '';
        
        cargarCiudadesEnSelect(ev.ciudad);
        cargarCategoriasEnSelect();
        
        document.getElementById('eventos-modal-titulo').innerText = "Editar Evento";
        modalEvento.classList.add('is-active');
    }
};

window.cargarCiudadesEnSelect = cargarCiudadesEnSelect;
window.cargarCategoriasEnSelect = cargarCategoriasEnSelect;

console.log('✅ eventos.js cargado correctamente');