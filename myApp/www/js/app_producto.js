// FUNCIONES CRUD
document.addEventListener("DOMContentLoaded", function () {
    const dataForm = document.getElementById("dataForm");
    const dataList = document.getElementById("dataList");
    const btnEliminar = document.getElementById("btnEliminar");
    const mensajeExito = document.getElementById("mensajeExito");
    const modalEliminar = document.getElementById("modalEliminar");
    const modalExito = document.getElementById("modalExito");
    let currentId = null;
    const url ="server_producto.php";
    // Cargar todos los usuarios al inicio
    fetchProductos();

    // Función para cargar los productos
    async function fetchProductos() {
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
                    data.forEach((producto) => {
                        html += `
                   <div class="p-4 border rounded-lg shadow-md bg-white">
            <h3 class="text-lg font-semibold">${producto.nombre}</h3>
            <p class="text-sm">ID: ${producto.id_producto}</p>
            <p class="text-sm">Descripcion: ${producto.descripcion}</p>
            <p class="text-sm">Precio: ${producto.precio}</p>
            <p class="text-sm">Stock: ${producto.stock}</p>
            <div class="mt-4 flex justify-between">
              <button class="btn-edit p-3 bg-indigo-800 rounded-lg text-white" onclick="editProducto(${producto.id_producto})">Editar</button>
              <button class="btn-delete p-3 bg-red-800 rounded-lg text-white" onclick="confirmDelete(${producto.id_producto})">Eliminar</button>
            </div>
          </div>
              `;
                    });
                } else {
                    html = `
              <div>
          <span>No hay prodcutos registrados.</span>
        </div>
            `;
                }
                dataList.innerHTML = html;
            })
            .catch((error) => console.error("Error al cargar usuarios:", error));
    }
    /**
 * Función para obtener los datos de un producto
 * @param {number} id_producto 
 * @returns {object} producto
 */
    async function fetchProducto(id_producto) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                },
                body: `action=fetch&id_producto=${id_producto}`,
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta de la red");
            }

            const producto = await response.json();
            return producto;
        } catch (error) {
            console.error("Error al cargar producto:", error);
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

        saveProductos(formData);
    });

    /**
     * Función para guardar los productos
     * @param {*} formData formulario con los datos del producto
     */
    async function saveProductos(formData) {
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
                fetchProductos();
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
    window.editProducto = async function (id) {
        const producto = await fetchProducto(id);

        if (producto && producto.nombre && producto.descripcion && producto.precio && producto.stock) {
            document.getElementById("nombre").value = producto.nombre;
            document.getElementById("descripcion").value = producto.descripcion;
            document.getElementById("precio").value = producto.precio;
            document.getElementById("stock").value = producto.stock;
            currentId = id;

            // Mostrar el modal
            document.getElementById("modal").classList.remove("hidden");
        } else {
            showModalExito("Error al cargar los datos del producto. Intenta nuevamente.");
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
            "Guardar Producto";
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
     * Función para eliminar un producto
     */
    btnEliminar.addEventListener("click", function () {
        const producto = fetchProducto(currentId);

        if (producto) {
            const formData = new FormData();
            formData.append("action", "delete");
            formData.append("id", currentId);

            saveProductos(formData);
            modalEliminar.classList.add("hidden");
            showModalExito("Producto eliminado correctamente.");
        } else {
            showModalExito("Error al eliminar el producto. Intenta nuevamente.");
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
