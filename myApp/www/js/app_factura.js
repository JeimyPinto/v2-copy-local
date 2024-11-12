// FUNCIONES CRUD
document.addEventListener("DOMContentLoaded", function () {
    const dataForm = document.getElementById("dataForm");
    const dataList = document.getElementById("dataList");
    const btnEliminar = document.getElementById("btnEliminar");
    const mensajeExito = document.getElementById("mensajeExito");
    const modalEliminar = document.getElementById("modalEliminar");
    const modalExito = document.getElementById("modalExito");
    let currentId = null;
    const url = "server_facturas.php";
    const url_usuario = "server_usuario.php";
    const url_cliente = "server_cliente.php";

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
            <h3 class="text-lg font-semibold">${factura.fecha}</h3>
           <p class="text-sm">ID: ${factura.id_factura}</p>
           <p class="text-sm">Cliente: ${factura.nombre}</p>
              <p class="text-sm">Usuario: ${factura.usuario_nombre}</p>
              <p class="text-sm">Total: ${factura.total}</p>
            <div class="mt-4 flex justify-between">
              <button class="btn-edit p-3 bg-indigo-800 rounded-lg text-white" onclick="editFactura(${factura.id_factura})">Editar</button>
              <button class="btn-delete p-3 bg-red-800 rounded-lg text-white" onclick="confirmDelete(${factura.id_factura})">Eliminar</button>
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
            clientes.forEach(cliente => {
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
      * Función para editar factura
      * @param {number} id 
      */
    window.editFactura = async function (id) {
        const factura = await fetchFactura(id);

        if (factura && factura.id_usuario && factura.id_cliente) {
            document.getElementById("select_clientes").value = factura.id_cliente;
            document.getElementById("select_usuarios").value = factura.id_usuario;
            currentId = id;

            // Mostrar el modal
            document.getElementById("modal").classList.remove("hidden");
        } else {
            showModalExito("Error al cargar los datos de la factura. Intenta nuevamente.");
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

    /**
     * Función para eliminar una factura
     */
    btnEliminar.addEventListener("click", function () {
        const factura = fetchFactura(currentId);

        if (factura) {
            const formData = new FormData();
            formData.append("action", "delete");
            formData.append("id", currentId);
            saveFacturas(formData);
            modalEliminar.classList.add("hidden");
            showModalExito("Factura eliminada correctamente.");
        } else {
            showModalExito("Error al eliminar la factura. Intenta nuevamente.");
        }
    });
    // Manejo del modal
    openModal.addEventListener("click", () => {
        fetchUsuarios();
        modal.classList.remove("hidden");
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
