const formulario = document.querySelector("#form");

window.addEventListener("DOMContentLoaded", () => {
    const usuarioAdmin = {
        correo: "admin@mail.com",
        contrasena: "1234"
    };
    localStorage.setItem("usuario", JSON.stringify(usuarioAdmin));
    console.log("Usuario de prueba inyectado en localStorage.");
});

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const correoInput = document.querySelector("#correo").value;
    const contrasenaInput = document.querySelector("#contrasena").value;

    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

    if (usuarioGuardado &&
        correoInput === usuarioGuardado.correo &&
        contrasenaInput === usuarioGuardado.contrasena) {

        alert("¡Acceso concedido!");
        window.location.href = "dasboard.html";
    } else {
        alert("Correo o contraseña incorrectos.");
    }
});