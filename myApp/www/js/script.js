document.addEventListener("DOMContentLoaded", function () {
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const modal = document.getElementById("modal");

  const html = `
    <a href="index.html" class="block px-4 py-2 text-gray-800 hover:bg-indigo-600 hover:text-white">Inicio</a>
    <a href="usuario.html" class="block px-4 py-2 text-gray-800 hover:bg-indigo-600 hover:text-white">Usuarios</a>
    <a href="permisos_usuario.html" class="block px-4 py-2 text-gray-800 hover:bg-indigo-600 hover:text-white">Permisos de Usuario</a>
    <a href="producto.html" class="block px-4 py-2 text-gray-800 hover:bg-indigo-600 hover:text-white">Productos</a>
    <a href="clientes.html" class="block px-4 py-2 text-gray-800 hover:bg-indigo-600 hover:text-white">Cliente</a>
    <a href="factura.html" class="block px-4 py-2 text-gray-800 hover:bg-indigo-600 hover:text-white">Factura</a>
    <button id="closeSidebar" class="mt-5 block w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center" aria-label="Cerrar formulario">
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.36 6.64a9 9 0 1 0 0 10.72 9 9 0 0 0 0-10.72zm-1.42 9.42l-1.41 1.41L12 12.41l-4.93 4.93-1.41-1.41L10.59 12 5.66 7.07l1.41-1.41L13.41 12l4.93 4.93 1.41-1.41L14.41 12l4.93-4.93z"/>
      </svg>
      Cerrar
    </button>
  `;

  // Manejo del menú lateral
  const barraLateral = document.getElementById("sidebar");
  const abrirBarraLateral = document.getElementById("openSidebar");

  // Inyectar el contenido del sidebar
  barraLateral.innerHTML = html;

  // Agregar eventos a los botones del sidebar
  const cerrarBarraLateral = document.getElementById("closeSidebar");

  abrirBarraLateral.addEventListener("click", () => {
    barraLateral.classList.add("active");
  });

  cerrarBarraLateral.addEventListener("click", () => {
    barraLateral.classList.remove("active");
  });

  // Manejo del modal
  openModal.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Cerrar el modal al hacer clic fuera de él
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  //Manejo inicio de sesión
  const loginForm = document.getElementById("loginForm");
  const url = "server_usuario.php";

  // Evento para el formulario de inicio de sesión
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(loginForm);
    formData.append("action", "login");
    console.log(formData)
    loginUser(formData);
  });

  // Función para iniciar sesión
  async function loginUser(formData) {
    
    try {
      const response = await fetch(url, {
        method: "POST",
        body: new URLSearchParams(formData),
      });

      const data = await response.json();
      if (data.success) {
         showModalExito(data.message);
         // Redirigir a la página principal o dashboard
         window.location.href = "index.html";
       } else {
         showModalExito(data.message);
       }
    } catch (error) {
       console.error("Error en el inicio de sesión:", error);
       showModalExito("Ocurrió un error al intentar iniciar sesión.");
    }
  }
  // Función para mostrar el modal de éxito (oculta el modal después de 2 segundos)
  function showModalExito(message) {
    const mensajeExito = document.getElementById("mensajeExito");
    const modalExito = document.getElementById("modalExito");
    mensajeExito.textContent = message;
    modalExito.classList.remove("hidden");
    setTimeout(() => modalExito.classList.add("hidden"), 2000);
  }

});