// Manejo del menú lateral
const barraLateral = document.getElementById("sidebar");
const abrirBarraLateral = document.getElementById("openSidebar");
const cerrarBarraLateral = document.getElementById("closeSidebar");

abrirBarraLateral.addEventListener("click", () => {
  console.log("Abrir barra lateral");
  barraLateral.classList.add("active");
});

cerrarBarraLateral.addEventListener("click", () => {
  barraLateral.classList.remove("active");
});

// FUNCIONES CRUD
document.addEventListener("DOMContentLoaded", function () {
  const dataForm = document.getElementById("dataForm");
  const dataList = document.getElementById("dataList");
  const modalExito = document.getElementById("modalExito");
  const mensajeExito = document.getElementById("mensajeExito");
  const modalEliminar = document.getElementById("modalEliminar");
  const btnEliminar = document.getElementById("btnEliminar");
  let currentId = null;

  // Cargar todos los usuarios al inicio
  fetchUsers();

  // Función para mostrar el modal de éxito (oculta el modal después de 3 segundos)
  function showModalExito(message) {
    mensajeExito.textContent = message;
    modalExito.classList.remove("hidden");
    setTimeout(() => modalExito.classList.add("hidden"), 3000);
  }

  // Función para cargar los usuarios
  async function fetchUsers() {
    fetch("server_usuario.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: "action=fetchAll",
    })
      .then((response) => response.json())
      .then((data) => {
        let html = "";
        if (data.length > 0) {
          data.forEach((user) => {
            html += `
                 <div class="p-4 border rounded-lg shadow-md bg-white">
          <h3 class="text-lg font-semibold">${user.nombre}</h3>
          <p class="text-sm">Id: ${user.id}</p>
          <p class="text-sm">${user.email}</p>
          <p class="text-sm">${user.telefono}</p>
          <p class="text-sm truncate">${user.password}</p>
          <div class="mt-4 flex justify-between">
            <button class="btn-edit p-3 bg-indigo-800 rounded-lg text-white" onclick="editUser(${user.id})">Editar</button>
            <button class="btn-delete p-3 bg-red-800 rounded-lg text-white" onclick="confirmDelete(${user.id})">Eliminar</button>
          </div>
        </div>
            `;
          });
        } else {
          html = `
            <div>
        <span>No hay usuarios registrados.</span>
      </div>
          `;
        }
        dataList.innerHTML = html;
      })
      .catch((error) => console.error("Error al cargar usuarios:", error));
  }

  // Función para agregar o actualizar usuario
  dataForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(dataForm);
    const action = currentId ? "update" : "add";
    formData.append("action", action);
    if (currentId) formData.append("id", currentId);

    saveUser(formData);
  });

  // Función para guardar usuario (agregar o actualizar)
  async function saveUser(formData) {
    try {
      const response = await fetch("server_usuario.php", {
        method: "POST",
        body: new URLSearchParams(formData),
      });

      const data = await response.json();
      if (data.success) {
        showModalExito(data.message);
        dataForm.reset();
        currentId = null;
        fetchUsers();
        document.getElementById("modal").classList.add("hidden");
      } else {
        console.log("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error en el guardado:", error);
    }
  }

  // Función para editar usuario
  window.editUser = async function (id) {
    try {
      const response = await fetch("server_usuario.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: `action=fetch&id=${id}`,
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la red");
      }

      const user = await response.json();
      if (user && user.nombre && user.email && user.telefono && user.password) {
        document.getElementById("nombre").value = user.nombre;
        document.getElementById("email").value = user.email;
        document.getElementById("telefono").value = user.telefono;
        document.getElementById("contrasenia").value = user.password;
        currentId = id;

        // Mostrar el modal
        document.getElementById("modal").classList.remove("hidden");
      } else {
        showModalExito(
          "Error al cargar los datos del usuario. Intenta nuevamente."
        );
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      showModalExito(
        "Ocurrió un error al intentar cargar los datos del usuario."
      );
    }
  };
  // Función para cerrar el modal
  document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("modal").classList.add("hidden");
    dataForm.reset();
    currentId = null;
    document.querySelector("#modal h2").textContent = "Crear o Editar";
    document.querySelector("#modal button[type='submit']").textContent =
      "Guardar Usuario";
  });
  // Función para confirmar eliminación de usuario
  window.confirmDelete = function (id) {
    currentId = id;
    modalEliminar.classList.remove("hidden");
  };

  // Eliminar usuario
  btnEliminar.addEventListener("click", function () {
    fetch("server_usuario.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=delete&id=${currentId}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showModalExito(data.message);
          fetchUsers();
          currentId = null;
        }
        modalEliminar.classList.add("hidden");
      })
      .catch((error) => console.error("Error al eliminar usuario:", error));
  });

  // Cerrar modal de eliminación
  document.getElementById("btnCancelar").addEventListener("click", function () {
    modalEliminar.classList.add("hidden");
  });
});
