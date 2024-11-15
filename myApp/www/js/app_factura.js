// FUNCIONES CRUD
document.addEventListener("DOMContentLoaded", function () {
  const dataForm = document.getElementById("dataForm");
  const dataList = document.getElementById("dataList");
  const btnEliminar = document.getElementById("btnEliminar");
  const mensajeExito = document.getElementById("mensajeExito");
  const modalEliminar = document.getElementById("modalEliminar");
  const modalExito = document.getElementById("modalExito");
  const modalDetalle = document.getElementById("modalDetalle");
  const closeModalDetalle = document.getElementById("closeModalDetaller");
  let currentId = null;
  const url = "server_facturas.php";
  const url_cliente = "server_cliente.php";
  const url_detalle = "server_detalle_factura.php";

  // Cargar todos los usuarios al inicio
  fetchFacturas();
  fetchClientes();

  //Función para cargar las facturas
  async function fetchFacturas() {
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
          data.forEach((factura) => {
            html += `
                   <div class="p-4 border rounded-lg shadow-md bg-white">
            <h3 class="text-lg font-semibold">${factura.id_factura}</h3>
           <p class="text-sm">Fecha: ${factura.fecha}</p>
           <p class="text-sm">Cliente: ${factura.nombre}</p>
              <p class="text-sm">Usuario: ${factura.usuario_nombre}</p>
              <p class="text-sm">Total: ${factura.total}</p>
            <div class="mt-4 flex justify-between">
              <button class="btn-edit p-3 bg-indigo-800 rounded-lg text-white" onclick="verDetalleFactura(${factura.id_factura})">Ver Detalle</button>
            </div>
          </div>
              `;
          });
        } else {
          html = `
              <div>
          <span>No hay facturas registrados.</span>
        </div>
            `;
        }
        dataList.innerHTML = html;
      })
      .catch((error) => console.error("Error al cargar usuarios:", error));
  }

  //Función para cargar los clientes
  async function fetchClientes() {
    try {
      const response = await fetch(url_cliente, {
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

      const clientes = await response.json();
      const selectclientes = document.getElementById("select_clientes");
      clientes.forEach((cliente) => {
        const option = document.createElement("option");
        option.value = cliente.id_cliente;
        option.textContent = cliente.nombre;
        selectclientes.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  }

  /**
   * Función para obtener los datos de una factura
   * @param {number} id_factura
   * @returns {object} factura
   */
  async function fetchFactura(id_factura) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: `action=fetch&id_factura=${id_factura}`,
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la red");
      }

      const factura = await response.json();
      return factura;
    } catch (error) {
      console.error("Error al cargar factura:", error);
      return null;
    }
  }

  // Función para agregar o actualizar factura
  dataForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(dataForm);
    const action = currentId ? "update" : "add";
    formData.append("action", action);
    if (currentId) formData.append("id", currentId);

    saveFacturas(formData);
  });

  /**
   * Función para guardar las facturas
   * @param {*} formData formulario con los datos de la factura
   */
  async function saveFacturas(formData) {
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
        fetchFacturas();
        document.getElementById("modal").classList.add("hidden");
      } else {
        console.log("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error en el guardado:", error);
    }
  }

  /**
   * Función para ver en detalle lo comprado en la factura
   * @param {number} id
   */
  window.verDetalleFactura = async function (id) {
    try {
      const response = await fetch(url_detalle, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: `action=fetchByFactura&id_factura=${id}`,
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la red");
      }

      const data = await response.json();
      console.log("Detalles de factura fetched:", data);
      let html = `
        <div class="p-4 border rounded-lg shadow-md bg-white">
          <h3 class="text-lg font-semibold">Factura ID: ${id}</h3>
          <p class="text-sm">Fecha: ${data[0].fecha}</p>
          <p class="text-sm">Cliente: ${data[0].nombre_cliente}</p>
          <p class="text-sm">Usuario: ${data[0].nombre_usuario}</p>
          <p class="text-sm text-indigo-400">Total: ${data[0].total}</p>
          <h4 class="text-lg font-semibold mt-4">Detalles de Productos</h4>
          <ul class="list-disc pl-5">
      `;
      data.forEach((detalle) => {
        html += `
          <li>
            <strong class="text-sm">Producto: ${detalle.nombre_producto}</strong>
            <p class="text-sm text-sky-500">Cantidad: ${detalle.cantidad}</p>
            <p class="text-sm text-green-500">Precio Unitario: ${detalle.precio_unitario}</p>
            <p class="text-sm text-indigo-400">Subtotal: ${detalle.subtotal}</p>
          </li>
        `;
      });
      html += `
          </ul>
          <button id="closeModalDetalle" class="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cerrar</button>
        </div>
      `;
      modalDetalle.innerHTML = html;
      modalDetalle.classList.remove("hidden");

      // Agregar evento para cerrar el modal
      document
        .getElementById("closeModalDetalle")
        .addEventListener("click", () => {
          modalDetalle.classList.add("hidden");
        });
    } catch (error) {
      console.error("Error al cargar detalles de la factura:", error);
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
      "Guardar Factura";
  });

  /**
   * Función para confirmar la eliminación de una factura
   * @param {*} id
   */
  window.confirmDelete = function (id) {
    currentId = id;
    modalEliminar.classList.remove("hidden");
  };

  // Eliminar usuario
  btnEliminar.addEventListener("click", async function () {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=delete&id=${currentId}`,
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la red");
      }

      const data = await response.json();
      if (data.success) {
        showModalExito(data.message);
        fetchUsers();
        currentId = null;
      } else {
        showModalExito(data.message);
      }
      modalEliminar.classList.add("hidden");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
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
