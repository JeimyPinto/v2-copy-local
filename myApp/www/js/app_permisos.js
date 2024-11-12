document.addEventListener("DOMContentLoaded", function () {
  const dataForm = document.getElementById("dataForm");
  const dataList = document.getElementById("dataList");
  const btnEliminar = document.getElementById("btnEliminar");
  const mensajeExito = document.getElementById("mensajeExito");
  const modalEliminar = document.getElementById("modalEliminar");
  const modalExito = document.getElementById("modalExito");
  let currentId = null;
  const url = "server_permisos.php";

  // Cargar todos los permisos al inicio
  fetchPermisos();

  // Función para cargar todos los permisos
  async function fetchPermisos() {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: "action=fetchAll",
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la red");
      }

      const data = await response.json();
      let html = "";
      if (data.length > 0) {
        data.forEach((permiso) => {
          html += `
            <div class="p-4 border rounded-lg shadow-md bg-white">
              <h3 class="text-lg font-semibold">${permiso.nombre}</h3>
              <p class="text-sm">ID: ${permiso.id_permiso}</p>
              <p class="text-sm">Permiso: ${permiso.permiso}</p>
              <div class="mt-4 flex justify-between">
                <button class="btn-edit p-3 bg-indigo-800 rounded-lg text-white" onclick="editPermiso(${permiso.id_permiso})">Editar</button>
                <button class="btn-delete p-3 bg-red-800 rounded-lg text-white" onclick="confirmDelete(${permiso.id_permiso})">Eliminar</button>
              </div>
            </div>
          `;
        });
      } else {
        html = `
          <div>
            <span>No hay permisos registrados.</span>
          </div>
        `;
      }
      dataList.innerHTML = html;
    } catch (error) {
      console.error("Error al cargar permisos:", error);
      dataList.innerHTML = "<p>Error al cargar los permisos.</p>";
    }
  }

  // Función para cargar todos los usuarios en el selector
  async function fetchUsuarios() {
    try {
      const response = await fetch("server_permisos.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: "action=fetchAllUsuarios",
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la red");
      }

      const usuarios = await response.json();
      const selectUsuarios = document.getElementById("select_usuarios");
      usuarios.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.id;
        option.textContent = usuario.nombre;
        selectUsuarios.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }

  /**
   * Función para guardar los permisos
   * @param {*} formData formulario con los datos del permiso
   */
  async function savePermisos(formData) {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: new URLSearchParams(formData),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la red");
      }

      const data = await response.json();
      if (data.success) {
        showModalExito(data.message);
        dataForm.reset();
        currentId = null;
        fetchPermisos();
      } else {
        showModalExito(data.message);
      }
    } catch (error) {
      console.error("Error en el guardado:", error);
    }
  }

  /**
   * Función para editar permiso
   * @param {number} id 
   */
  window.editPermiso = async function (id) {
    const permiso = await fetchPermiso(id);

    if (permiso && permiso.id_usuario && permiso.permiso) {
      document.getElementById("select_usuarios").value = permiso.id_usuario;
      document.getElementById("permiso").value = permiso.permiso;
      currentId = id;

      // Mostrar el modal
      document.getElementById("modal").classList.remove("hidden");
    } else {
      showModalExito("Error al cargar los datos del permiso. Intenta nuevamente.");
    }
  };

  /**
   * Función para obtener los datos de un permiso
   * @param {number} id_permiso 
   * @returns {object} permiso
   */
  async function fetchPermiso(id_permiso) {
    try {
      const response = await fetch("server_permisos.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: `action=fetch&id_permiso=${id_permiso}`,
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la red");
      }

      const permiso = await response.json();
      return permiso;
    } catch (error) {
      console.error("Error al cargar permiso:", error);
      return null;
    }
  }

  // Evento para el formulario de guardar permisos
  dataForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(dataForm);
    formData.append("action", currentId ? "update" : "add");
    if (currentId) {
      formData.append("id_permiso", currentId);
    }
    savePermisos(formData);
  });
  // Manejo del modal
  openModal.addEventListener("click", () => {
    fetchUsuarios();
    modal.classList.remove("hidden");
  });
  // Función para mostrar el modal de éxito (oculta el modal después de 2 segundos)
  function showModalExito(message) {
    mensajeExito.textContent = message;
    modalExito.classList.remove("hidden");
    setTimeout(() => {
      modalExito.classList.add("hidden");
    }, 2000);
  }
});