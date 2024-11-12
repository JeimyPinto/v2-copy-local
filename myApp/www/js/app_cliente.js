// FUNCIONES CRUD
document.addEventListener("DOMContentLoaded", function () {
  const dataForm = document.getElementById("dataForm");
  const dataList = document.getElementById("dataList");
  const btnEliminar = document.getElementById("btnEliminar");
  const mensajeExito = document.getElementById("mensajeExito");
  const modalEliminar = document.getElementById("modalEliminar");
  const modalExito = document.getElementById("modalExito");
  const url = "server_cliente.php";
  let currentId = null;

  // Cargar todos los usuarios al inicio
  fetchClientes();

  // Función para cargar los clientes
  async function fetchClientes() {
      fetch(url, {
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
                  data.forEach((cliente) => {
                      html += `
                 <div class="p-4 border rounded-lg shadow-md bg-white">
          <h3 class="text-lg font-semibold">${cliente.nombre}</h3>
          <p class="text-sm">ID: ${cliente.id_cliente}</p>
          <p class="text-sm">Correo: ${cliente.email}</p>
          <p class="text-sm">Direccion: ${cliente.direccion}</p>
          <p class="text-sm">Telefono: ${cliente.telefono}</p>
          <div class="mt-4 flex justify-between">
            <button class="btn-edit p-3 bg-indigo-800 rounded-lg text-white" onclick="editCliente(${cliente.id_cliente})">Editar</button>
            <button class="btn-delete p-3 bg-red-800 rounded-lg text-white" onclick="confirmDelete(${cliente.id_cliente})">Eliminar</button>
          </div>
        </div>
            `;
                  });
              } else {
                  html = `
            <div>
        <span>No hay clientes registrados.</span>
      </div>
          `;
              }
              dataList.innerHTML = html;
          })
          .catch((error) => console.error("Error al cargar clientes:", error));
  }
/**
 * Función para obtener los datos de un cliente
 * @param {*} id_cliente 
 * @returns 
 */
  async function fetchCliente(id_cliente) {
      try {
          const response = await fetch(url, {
              method: "POST",
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "application/json",
              },
              body: `action=fetch&id_cliente=${id_cliente}`,
          });

          if (!response.ok) {
              throw new Error("Error en la respuesta de la red");
          }

          const producto = await response.json();
          return producto;
      } catch (error) {
          console.error("Error al cargar cliente:", error);
          return null;
      }
  }

  // Función para agregar o actualizar usuario
  dataForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(dataForm);
      const action = currentId ? "update" : "add";
      formData.append("action", action);
      if (currentId) formData.append("id", currentId);

      saveClientes(formData);
  });

  /**
   * Función para guardar clientes
   * @param {*} formData formulario con los datos del cliente
   */
  async function saveClientes(formData) {
      try {
          const response = await fetch(url, {
              method: "POST",
              body: new URLSearchParams(formData),
          });

          const data = await response.json();
          if (data.success) {
              showModalExito(data.message);
              dataForm.reset();
              currentId = null;
              fetchClientes();
              document.getElementById("modal").classList.add("hidden");
          } else {
              console.log("Error: " + data.message);
          }
      } catch (error) {
          console.error("Error en el guardado:", error);
      }
  }

  /**
    * Función para editar producto
    * @param {number} id 
    */
  window.editCliente = async function (id) {
      const cliente = await fetchCliente(id);

      if (cliente && cliente.email && cliente.nombre && cliente.direccion && cliente.telefono) {
          document.getElementById("nombre").value = cliente.nombre;
          document.getElementById("email").value = cliente.email;
          document.getElementById("direccion").value = cliente.direccion;
          document.getElementById("telefono").value = cliente.telefono;
          currentId = id;

          // Mostrar el modal
          document.getElementById("modal").classList.remove("hidden");
      } else {
          showModalExito("Error al cargar los datos del cliente. Intenta nuevamente.");
      }
  };

  /**
   * Función para cerrar el modal
   */
  document.getElementById("closeModal").addEventListener("click", function () {
      document.getElementById("modal").classList.add("hidden");
      dataForm.reset();
      currentId = null;
      document.querySelector("#modal h2").textContent = "Crear o Editar";
      document.querySelector("#modal button[type='submit']").textContent =
          "Guardar Cliente";
  });

  /**
   * Función para confirmar la eliminación de un producto
   * @param {*} id 
   */
  window.confirmDelete = function (id) {
      currentId = id;
      modalEliminar.classList.remove("hidden");
  };

  /**
   * Función para eliminar un cliente
   */
  btnEliminar.addEventListener("click", function () {
    console.log(currentId);
      const cliente = fetchCliente(currentId);

      if (cliente) {
          const formData = new FormData();
          formData.append("action", "delete");
          formData.append("id", currentId);

          saveClientes(formData);
          modalEliminar.classList.add("hidden");
          showModalExito("Cliente eliminado correctamente.");
      } else {
          showModalExito("Error al eliminar el cliente. Intenta nuevamente.");
      }
  });

  // Cerrar modal de eliminación
  document.getElementById("btnCancelar").addEventListener("click", function () {
      modalEliminar.classList.add("hidden");
  });

  // Función para mostrar el modal de éxito (oculta el modal después de 2 segundos)
  function showModalExito(message) {
      mensajeExito.textContent = message;
      modalExito.classList.remove("hidden");
      setTimeout(() => modalExito.classList.add("hidden"), 2000);
  }
});
