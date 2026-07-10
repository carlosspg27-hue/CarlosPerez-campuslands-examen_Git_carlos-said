# Conciertos Conectados - Plataforma Web de Venta de Entradas 🎟️
## 📝 Descripción del Proyecto

**Conciertos Conectados** es una solución web integral y modular diseñada específicamente para resolver el desafío comercial de la compañía organizadora de eventos del mismo nombre, la cual requería expandir su alcance de mercado y facilitar a sus usuarios la adquisición de entradas de forma ágil, intuitiva y centralizada. La plataforma elimina las barreras de acceso tradicionales, ofreciendo un entorno digital unificado que se divide en dos frentes de interacción completamente optimizados:

### 1. Front de Administración (Acceso Restringido)
Diseñado como el centro operativo y de control del negocio para el personal autorizado. Cuenta con un sistema de **Login** seguro que restringe el acceso mediante correo electrónico y contraseña, configurado por defecto con las credenciales `admin@mail.com` y `123456`. Una vez superada la autenticación, el administrador ingresa a un **Dashboard** principal que dispone de un menú de navegación fluido para conmutar entre tres submódulos críticos de gestión:
* **Módulo de Categorías:** Una sección dedicada a organizar los tipos de eventos. Permite listar las categorías registradas, editarlas, eliminarlas y añadir nuevas clasificaciones mediante un formulario modal interactivo que recopila el nombre y la descripción.
* **Módulo de Eventos:** El eje operativo de la aplicación. Otorga un control total (CRUD) sobre el catálogo de conciertos. El administrador puede crear, actualizar y dar de baja eventos detallando su código identificador, nombre, categoría correspondiente, precio de la entrada, fecha, hora, una breve descripción y una URL de imagen referencial, restringiendo la ubicación a las ciudades de Barranquilla, Bogotá, Bucaramanga y Medellín.
* **Módulo de Ventas:** Un panel de auditoría financiera que lista los pedidos procesados por la plataforma. Para facilitar el análisis, las ventas se ordenan cronológicamente desde la más reciente hasta la más antigua, exponiendo de forma clara la ciudad, los datos de identificación del cliente, el total de la compra y una opción para desglosar los detalles completos de cada pedido individual.

### 2. Front de Eventos y Clientes (Acceso Público)
Orientado a maximizar la conversión y brindar una experiencia de usuario (UX) fluida y satisfactoria en el proceso de compra. Se compone de tres vistas interconectadas:
* **Vista Principal de Clientes:** Funciona como la vitrina comercial pública de la empresa. Muestra de forma atractiva las tarjetas de los eventos disponibles (con su respectiva imagen, nombre, fecha, hora, precio) e integra botones de acción inmediata para añadir al carrito. Para agilizar la navegación, incorpora un buscador por palabras clave en el nombre del producto y filtros dinámicos por ciudad y categorías.
* **Vista de Detalle del Producto:** Una ficha técnica ampliada donde el cliente puede visualizar la imagen en alta definición del evento, su descripción detallada, fecha, hora y precio exacto, acompañada de enlaces de retorno a la tienda y de agregación al carrito.
* **Carrito de Compras (Modal Interactivo):** Un espacio flotante donde el usuario visualiza la miniatura, el nombre y el precio de las entradas seleccionadas, junto con el cálculo automatizado del valor total de la transacción. Al presionar el botón de compra, se despliega un formulario de Checkout que recopila información sensible de facturación (número de identificación, nombre completo, dirección, teléfono y correo electrónico), capturando en segundo plano la fecha exacta del pedido para alimentar en tiempo real el módulo administrativo de ventas.

### Arquitectura Técnica y Requerimientos de Software
Para garantizar ligereza, velocidad y portabilidad, la aplicación se construye bajo el stack de desarrollo web nativo frontend (**HTML5, CSS3 y JavaScript Moderno ES6+**), prescindiendo de frameworks pesados. Su estructura se modulariza a través del estándar de **Web Components**, encapsulando la lógica y estilos de la interfaz de usuario. No requiere bases de datos externas en su fase inicial, ya que delega la persistencia del estado, la configuración del catálogo y el histórico transaccional a la API de **localStorage**. Adicionalmente, el sistema integra una capa activa de accesibilidad y usabilidad que emite alertas visuales y mensajes emergentes de confirmación o error ante cada interacción crítica realizada por el usuario.

---

## 👥 Equipo de Desarrollo

Este proyecto ha sido estructurado, diseñado y desarrollado por el siguiente equipo técnico:
* **Exneider Nava**
* **Carlos Said Pérez Gutiérrez**
* **Keiler Sebastián Serrano**

  imagenes del prototipo de interfaz de administrador (Nota: Este es solo el prototipo de guia, no es la visualización final)
  <img width="1037" height="582" alt="image" src="https://github.com/user-attachments/assets/f6114a69-21f4-42c6-9f77-af330398b797" />
  <img width="1037" height="836" alt="image" src="https://github.com/user-attachments/assets/6fcefb00-9cb2-4350-bc47-127d3cc5e0dd" />
  imagenes del prototipo de interfaz del cliente (Nota: Este es solo el prototipo de guia, no es la visualización final)
<img width="1600" height="711" alt="image" src="https://github.com/user-attachments/assets/b30bc768-7576-44f5-aa71-8863c442db75" />
<img width="1600" height="711" alt="image" src="https://github.com/user-attachments/assets/bf1ad702-71aa-4a33-a346-7c20594e507c" />
<img width="1600" height="711" alt="image" src="https://github.com/user-attachments/assets/d57ff6f4-d84f-485e-97a7-5435757d7311" />




ESTA HERRAMIENTA FUE UTILIZADA PARA LA GUIA DEL DESARROLLO DEL PROYECTO (JIRA).



<img width="1914" height="904" alt="image" src="https://github.com/user-attachments/assets/5422038b-4f18-463f-a267-6af665521f38" />
