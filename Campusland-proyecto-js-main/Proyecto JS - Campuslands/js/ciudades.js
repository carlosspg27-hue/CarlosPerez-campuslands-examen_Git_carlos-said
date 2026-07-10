// ciudades.js - Gestion de Ciudades

let todasLasCiudades = [];
const modal = document.getElementById('modal-ciudad');
const formCiudad = document.getElementById('form-ciudad');
const bodyCiudades = document.getElementById('body-ciudades');

// CIUDADES POR DEFECTO (para inicializar)
const CIUDADES_POR_DEFECTO = [
    { id: 1, codigo: 'BOG', nombre: 'Bogota' },
    { id: 2, codigo: 'MED', nombre: 'Medellin' },
    { id: 3, codigo: 'BAR', nombre: 'Barranquilla' },
    { id: 4, codigo: 'BUC', nombre: 'Bucaramanga' }
];

document.addEventListener('DOMContentLoaded', () => {
    cargarCiudades();
    configurarEventListeners();
});

function configurarEventListeners() {
    // Boton Nueva Ciudad
    const btnNueva = document.getElementById('btn-nueva-ciudad');
    if (btnNueva) {
        btnNueva.addEventListener('click', () => {
            document.getElementById('modal-titulo-ciudad').innerText = 'Nueva Ciudad';
            formCiudad.reset();
            document.getElementById('ciudad-id').value = '';
            abrirModal();
        });
    }

    // Boton Cancelar
    const btnCancelar = document.getElementById('ciudad-btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cerrarModal);
    }

    // Clic fuera del modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            cerrarModal();
        }
    });

    // Tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-active')) {
            cerrarModal();
        }
    });

    // Envio del formulario
    if (formCiudad) {
        formCiudad.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarCiudad();
        });
    }
}

function abrirModal() {
    modal.classList.add('is-active');
    modal.style.display = 'flex';
}

function cerrarModal() {
    modal.classList.remove('is-active');
    modal.style.display = 'none';
}

function cargarCiudades() {
    try {
        let ciudadesData = localStorage.getItem('ciudades');

        if (ciudadesData) {
            // Cargar desde localStorage
            todasLasCiudades = JSON.parse(ciudadesData);
            console.log('Ciudades cargadas desde localStorage');
        } else {
            // Cargar ciudades por defecto
            console.log('No hay ciudades en localStorage, cargando por defecto...');
            todasLasCiudades = CIUDADES_POR_DEFECTO;
            localStorage.setItem('ciudades', JSON.stringify(todasLasCiudades));
            console.log('Ciudades por defecto guardadas en localStorage');
        }

        renderizarCiudades();

    } catch (error) {
        console.error('Error al cargar ciudades:', error);
        // Si hay error, usar ciudades por defecto
        todasLasCiudades = CIUDADES_POR_DEFECTO;
        localStorage.setItem('ciudades', JSON.stringify(todasLasCiudades));
        renderizarCiudades();
    }
}

function renderizarCiudades() {
    if (!bodyCiudades) return;

    const ciudades = JSON.parse(localStorage.getItem('ciudades')) || [];

    if (ciudades.length === 0) {
        bodyCiudades.innerHTML = `
            <tr>
                <td colspan="3" class="empty-message">
                    No hay ciudades registradas. Agrega tu primera ciudad!
                </td>
            </tr>
        `;
        return;
    }

    bodyCiudades.innerHTML = ciudades.map(c => `
        <tr>
            <td><strong>${c.codigo}</strong></td>
            <td>${c.nombre}</td>
            <td>
                <button onclick="editarCiudad(${c.id})">Editar</button>
                <button onclick="eliminarCiudad(${c.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function guardarCiudad() {
    const id = document.getElementById('ciudad-id').value;
    const codigo = document.getElementById('ciudad-codigo').value.trim().toUpperCase();
    const nombre = document.getElementById('ciudad-nombre').value.trim();

    // VALIDACIONES
    if (!codigo) {
        alert('El codigo es obligatorio');
        document.getElementById('ciudad-codigo').focus();
        return;
    }

    if (codigo.length !== 3) {
        alert('El codigo debe tener exactamente 3 caracteres');
        document.getElementById('ciudad-codigo').focus();
        return;
    }

    if (!nombre) {
        alert('El nombre es obligatorio');
        document.getElementById('ciudad-nombre').focus();
        return;
    }

    // Verificar que no exista otra ciudad con el mismo codigo
    let ciudades = JSON.parse(localStorage.getItem('ciudades')) || [];
    const codigoExistente = ciudades.find(c =>
        c.codigo.toLowerCase() === codigo.toLowerCase() &&
        (id ? c.id != id : true)
    );

    if (codigoExistente) {
        alert('Ya existe una ciudad con el codigo "' + codigo + '"');
        document.getElementById('ciudad-codigo').focus();
        return;
    }

    // Verificar que no exista otra ciudad con el mismo nombre
    const nombreExistente = ciudades.find(c =>
        c.nombre.toLowerCase() === nombre.toLowerCase() &&
        (id ? c.id != id : true)
    );

    if (nombreExistente) {
        alert('Ya existe una ciudad con el nombre "' + nombre + '"');
        document.getElementById('ciudad-nombre').focus();
        return;
    }

    // GUARDAR
    if (id) {
        // EDITAR
        ciudades = ciudades.map(c => 
            c.id == id ? { id: Number(id), codigo, nombre } : c
        );
        alert('Ciudad actualizada correctamente');
    } else {
        // CREAR
        const nuevoId = Date.now();
        ciudades.push({ id: nuevoId, codigo, nombre });
        alert('Ciudad "' + nombre + '" creada correctamente');
    }

    localStorage.setItem('ciudades', JSON.stringify(ciudades));
    formCiudad.reset();
    document.getElementById('ciudad-id').value = '';
    cerrarModal();
    renderizarCiudades();

    // Actualizar el select de ciudades en eventos si esta abierto
    actualizarSelectCiudades();
}

window.editarCiudad = (id) => {
    const ciudades = JSON.parse(localStorage.getItem('ciudades')) || [];
    const ciudad = ciudades.find(c => c.id == id);

    if (!ciudad) {
        alert('Ciudad no encontrada');
        return;
    }

    document.getElementById('ciudad-id').value = ciudad.id;
    document.getElementById('ciudad-codigo').value = ciudad.codigo;
    document.getElementById('ciudad-nombre').value = ciudad.nombre;
    document.getElementById('modal-titulo-ciudad').innerText = 'Editar Ciudad';
    abrirModal();
};

window.eliminarCiudad = (id) => {
    const idNum = Number(id);
    const ciudades = JSON.parse(localStorage.getItem('ciudades')) || [];
    const ciudad = ciudades.find(c => c.id === idNum);

    if (!ciudad) {
        alert('Ciudad no encontrada');
        return;
    }

    // Verificar si la ciudad esta siendo usada por algun evento
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const ciudadEnUso = eventos.some(e => 
        e.ciudad.toLowerCase() === ciudad.nombre.toLowerCase() ||
        e.ciudad === ciudad.codigo
    );

    let mensaje = 'Seguro que deseas eliminar la ciudad "' + ciudad.nombre + '"?';
    if (ciudadEnUso) {
        mensaje = 'La ciudad "' + ciudad.nombre + '" esta siendo utilizada por uno o mas eventos.\n\nEliminar de todas formas? Los eventos perderan su ciudad.';
    }

    if (!confirm(mensaje)) return;

    // Eliminar
    let nuevasCiudades = ciudades.filter(c => c.id !== idNum);
    localStorage.setItem('ciudades', JSON.stringify(nuevasCiudades));

    // Si la ciudad estaba en uso, actualizar los eventos
    if (ciudadEnUso) {
        const eventosActualizados = eventos.map(e => {
            if (e.ciudad.toLowerCase() === ciudad.nombre.toLowerCase() || 
                e.ciudad === ciudad.codigo) {
                return { ...e, ciudad: 'Sin ciudad' };
            }
            return e;
        });
        localStorage.setItem('eventos', JSON.stringify(eventosActualizados));
        alert('Los eventos que usaban "' + ciudad.nombre + '" ahora tienen "Sin ciudad"');
    }

    renderizarCiudades();
    actualizarSelectCiudades();
    alert('Ciudad "' + ciudad.nombre + '" eliminada correctamente');
};

function actualizarSelectCiudades() {
    const selectCiudad = document.getElementById('eventos-ciudad');
    if (!selectCiudad) return;

    const ciudades = JSON.parse(localStorage.getItem('ciudades')) || [];
    const valorActual = selectCiudad.value;

    selectCiudad.innerHTML = '';
    
    if (ciudades.length === 0) {
        selectCiudad.innerHTML = '<option value="">No hay ciudades registradas</option>';
        return;
    }

    ciudades.forEach(ciudad => {
        const option = document.createElement('option');
        option.value = ciudad.nombre;
        option.textContent = ciudad.nombre;
        selectCiudad.appendChild(option);
    });

    // Restaurar el valor seleccionado si aun existe
    if (valorActual && ciudades.some(c => c.nombre === valorActual)) {
        selectCiudad.value = valorActual;
    }
}

function obtenerCiudades() {
    return JSON.parse(localStorage.getItem('ciudades')) || [];
}

// Exponer la funcion globalmente para que otros scripts la usen
window.obtenerCiudades = obtenerCiudades;
window.actualizarSelectCiudades = actualizarSelectCiudades;

console.log('Modulo de Ciudades cargado correctamente');