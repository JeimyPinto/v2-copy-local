document.addEventListener("DOMContentLoaded", function () {
  //Manejo inicio de sesión
  const loginForm = document.getElementById("loginForm");
  const url = "server_usuario.php";
  const mensajeExito = document.getElementById("mensajeExito");
  const modalExito = document.getElementById("modalExito");

  // Evento para el formulario de inicio de sesión
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(loginForm);
    formData.append("action", "login");
    loginUser(formData);
  });

  // Función para iniciar sesión
  async function loginUser(formData) {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: new URLSearchParams(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0 && data[0].email) {
            showModalExito("Ingresando", () => {
              window.location.href = "index.html";
            });
          } else {
            console.error("Credenciales no válidas");
            showModalExito("Correo electrónico o contraseña incorrectos.");
          }
        });
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      alert("Ocurrió un error al intentar iniciar sesión.");
    }
  }

  // Función para mostrar el modal de éxito (oculta el modal después de 2 segundos)
  function showModalExito(message, callback) {
    mensajeExito.textContent = message;
    modalExito.classList.remove("hidden");
    setTimeout(() => {
      modalExito.classList.add("hidden");
      if (callback) callback();
    }, 2000);
  }
});
