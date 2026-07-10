let todasLasCategorias = [];
const modal = document.getElementById('modal-categoria');
const formCategoria = document.getElementById('form-categoria');

document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    configurarEventListeners();
});

async function cargarCategorias() {
    try {
        let categoriasData = localStorage.getItem('categorias');

        if (categoriasData) {
            todasLasCategorias = JSON.parse(categoriasData);
            console.log('Categorías cargadas desde localStorage');
        } else {
            console.log('No hay datos en localStorage, cargando categorías desde JSON...');

            let response;
            try {
                response = await fetch('../data/categorias.json');
            } catch (e) {
                response = await fetch('data/categorias.json');
            }

            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON de categorías');
            }

            todasLasCategorias = await response.json();

            if (!Array.isArray(todasLasCategorias) || todasLasCategorias.length === 0) {
                throw new Error('Los datos de categorías no tienen el formato esperado');
            }
            localStorage.setItem('categorias', JSON.stringify(todasLasCategorias));
            console.log('Categorías cargadas desde JSON y guardadas en localStorage');
        }

        renderizarCategorias();

    } catch (error) {
        console.error('Error al cargar las categorías:', error);

        cargarCategoriasPorDefecto();
    }
}

function cargarCategoriasPorDefecto() {
    const categoriasPorDefecto = [
        { id: 1, nombre: "Rock", desc: "Eventos de música rock, bandas en vivo y festivales de rock." },
        { id: 2, nombre: "Electrónica", desc: "Música electrónica, DJs, festivales de música electrónica y raves." },
        { id: 3, nombre: "Salsa", desc: "Eventos de salsa, orquestas en vivo y bailes de salsa." },
        { id: 4, nombre: "Pop", desc: "Conciertos de pop, artistas internacionales y nacionales." },
        { id: 5, nombre: "Jazz", desc: "Festivales de jazz, conciertos íntimos y jam sessions." },
        { id: 6, nombre: "Reggae", desc: "Música reggae, bandas de reggae y festivales de cultura jamaicana." },
        { id: 7, nombre: "Folclor", desc: "Eventos de música folclórica colombiana y latinoamericana." },
        { id: 8, nombre: "Clásica", desc: "Conciertos de música clásica, sinfónicas y ópera." }
    ];

    todasLasCategorias = categoriasPorDefecto;
    localStorage.setItem('categorias', JSON.stringify(todasLasCategorias));
    console.log('Categorías por defecto cargadas');
    renderizarCategorias();
}


function configurarEventListeners() {

    const btnNueva = document.getElementById('btn-nueva-categoria');
    if (btnNueva) {
        btnNueva.addEventListener('click', () => {
            document.getElementById('modal-titulo').innerText = "Nueva Categoría";
            formCategoria.reset();
            document.getElementById('cat-id').value = '';
            abrirModal();
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            cerrarModal();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-active')) {
            cerrarModal();
        }
    });

    if (formCategoria) {
        formCategoria.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarCategoria();
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

function guardarCategoria() {
    const id = document.getElementById('cat-id').value;
    const nombre = document.getElementById('cat-nombre').value.trim();
    const desc = document.getElementById('cat-desc').value.trim();

    if (!nombre) {
        alert('El nombre de la categoría es obligatorio');
        return;
    }

    const categoriasExistentes = JSON.parse(localStorage.getItem('categorias')) || [];
    const nombreExistente = categoriasExistentes.find(c =>
        c.nombre.toLowerCase() === nombre.toLowerCase() &&
        (id ? c.id != id : true)
    );

    if (nombreExistente) {
        alert('Ya existe una categoría con este nombre');
        return;
    }

    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    if (id) {
        categorias = categorias.map(c => c.id == id ? { id: Number(id), nombre, desc } : c);
        alert('Categoría actualizada correctamente');
    } else {
        const nuevoId = Date.now();
        categorias.push({ id: nuevoId, nombre, desc });
        alert('Categoría creada correctamente');
    }

    localStorage.setItem('categorias', JSON.stringify(categorias));
    formCategoria.reset();
    document.getElementById('cat-id').value = '';
    cerrarModal();
    renderizarCategorias();
}

function renderizarCategorias() {
    const tablaBody = document.querySelector('#tabla-categorias tbody');
    if (!tablaBody) return;

    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    if (categorias.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 40px; color: #6b7280;">
                    No hay categorías disponibles. ¡Crea tu primera categoría!
                </td>
            </tr>
        `;
        return;
    }

    tablaBody.innerHTML = categorias.map(c => `
        <tr>
            <td><strong>${c.nombre}</strong></td>
            <td>${c.desc || 'Sin descripción'}</td>
            <td>
                <button onclick="editarCategoria(${c.id})" class="btn-edit">Editar</button>
                <button onclick="eliminarCategoria(${c.id})" class="btn-delete">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

window.eliminarCategoria = (id) => {
    const idNum = Number(id);
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const categoriaEnUso = eventos.some(e => e.categoria === idNum || e.categoria === id);

    if (categoriaEnUso) {
        if (!confirm(`Esta categoría está siendo utilizada por uno o más eventos. ¿Seguro que deseas eliminarla? Los eventos que la usan perderán su categoría.`)) {
            return;
        }
    } else {
        if (!confirm('¿Seguro que deseas eliminar esta categoría?')) {
            return;
        }
    }

    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    categorias = categorias.filter(c => Number(c.id) !== idNum);
    localStorage.setItem('categorias', JSON.stringify(categorias));
    renderizarCategorias();
    alert('Categoría eliminada correctamente');
};

window.editarCategoria = (id) => {
    const categorias = JSON.parse(localStorage.getItem('categorias'));
    const cat = categorias.find(c => c.id == id);

    if (!cat) {
        alert('Categoría no encontrada');
        return;
    }

    document.getElementById('cat-id').value = cat.id;
    document.getElementById('cat-nombre').value = cat.nombre;
    document.getElementById('cat-desc').value = cat.desc || '';
    document.getElementById('modal-titulo').innerText = "Editar Categoría";
    abrirModal();
};

function recargarCategorias() {
    const categoriasData = localStorage.getItem('categorias');
    if (categoriasData) {
        todasLasCategorias = JSON.parse(categoriasData);
        renderizarCategorias();
        console.log('Categorías recargadas desde localStorage');
    } else {
        cargarCategorias();
    }
}