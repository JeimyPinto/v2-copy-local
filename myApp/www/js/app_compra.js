document.addEventListener("DOMContentLoaded", function () {
    const clienteSelect = document.getElementById("cliente");
    const productoSelect = document.getElementById("producto");
    const cantidadInput = document.getElementById("cantidad");
    const agregarProductoBtn = document.getElementById("agregarProducto");
    const listaProductosDiv = document.getElementById("listaProductos");
    const finalizarCompraBtn = document.getElementById("finalizarCompra");
    const dataForm = document.getElementById("compraForm");
    const urlCliente = "server_cliente.php";
    const urlProducto = "server_producto.php";
    const urlFactura = "server_facturas.php";
    const urlDetalleFactura = "server_detalle_factura.php";
    let productosSeleccionados = [];

    // Función para cargar clientes
    async function fetchClientes() {
        try {
            const response = await fetch(urlCliente, {
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
            clientes.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.id_cliente;
                option.textContent = cliente.nombre;
                clienteSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        }
    }

    // Función para cargar productos
    async function fetchProductos() {
        try {
            const response = await fetch(urlProducto, {
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

            const productos = await response.json();
            productos.forEach(producto => {
                const option = document.createElement("option");
                option.value = producto.id_producto;
                option.textContent = producto.nombre;
                productoSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    // Función para agregar producto a la lista
    async function agregarProducto() {
        const idProducto = productoSelect.value;
        try {
            const response = await fetch(urlProducto, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                },
                body: `action=fetch&id_producto=` + idProducto,
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta de la red");
            }
            const producto = await response.json();
            const stock = producto.stock;

            if (cantidadInput.value > stock) {
                showModalExito("No hay suficiente stock. Tenemos " + stock + " unidades disponibles.");
                return;
            }
        } catch (error) {
            console.error("Error al cargar producto:", error);
        }
        const nombreProducto = productoSelect.options[productoSelect.selectedIndex].text;
        const cantidad = cantidadInput.value;

        if (idProducto && cantidad > 0) {
            productosSeleccionados.push({ idProducto, nombreProducto, cantidad });
            productoSelect.value = "";
            cantidadInput.value = "";
            mostrarProductos();
        } else {
            alert("Seleccione un producto y una cantidad válida.");
        }
    }

    // Función para mostrar productos en la lista
    function mostrarProductos() {
        listaProductosDiv.innerHTML = "";
        productosSeleccionados.forEach((producto, index) => {
            const div = document.createElement("div");
            div.className = "p-4 border rounded-lg shadow-md bg-white mb-2";
            div.innerHTML = `
        <p class="text-lg font-semibold">${producto.nombreProducto}</p>
        <p class="text-sm">Cantidad: ${producto.cantidad}</p>
        <button class="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700" onclick="eliminarProducto(${index})">Eliminar</button>
      `;
            listaProductosDiv.appendChild(div);
        });
    }

    // Función para eliminar producto de la lista
    window.eliminarProducto = function (index) {
        productosSeleccionados.splice(index, 1);
        mostrarProductos();
    };

    // Función para finalizar la compra
    async function finalizarCompra() {
        const idCliente = clienteSelect.value;
        // Validar que haya un cliente seleccionado y al menos un producto
        if (!idCliente || productosSeleccionados.length === 0) {
            showModalExito("Seleccione un cliente y agregue al menos un producto.");
            return;
        }
        saveFactura(idCliente);

    }

    // Función para guardar la factura
    async function saveFactura(idCliente) {
        try {
            const response = await fetch(urlFactura, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                },
                body: `action=add&id_cliente=${idCliente}&id_usuario=1&total=0`,
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta de la red");
            }
            // Obtener la respuesta JSON
            const data = await response.json();
            if (data.success) {
                const id_factura = data.id_factura;
                saveDetalleFactura(id_factura);
            } else {
                console.error("Error al obtener el id de la factura:", data.message);
            }
        } catch (error) {
            console.error("Error al guardar factura:", error);
        }
    }

    // Función para guardar el detalle de la factura
    async function saveDetalleFactura(idFactura) {
        for (const producto of productosSeleccionados) {
            try {
                const response = await fetch(urlDetalleFactura, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Accept: "application/json",
                    },
                    body: `action=add&id_factura=${idFactura}&id_producto=${producto.idProducto}&cantidad=${producto.cantidad}`,
                });
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la red");
                }
                const data = await response.json();
                console.log(data);
                if (data.success) {
                    const id_detalle_factura = data.id_detalle_factura;
                    console.log("Detalle de factura guardado con éxito:", id_detalle_factura);
                }
            } catch (error) {
                console.log("Error al guardar detalle de factura:", error);
            }
        }
        showModalExito("Compra realizada con éxito.");
        dataForm.reset();
        clienteSelect.value = "";
        productosSeleccionados = [];
        mostrarProductos();

    }

    // Cargar clientes y productos al cargar la página
    fetchClientes();
    fetchProductos();

    // Agregar eventos a los botones
    agregarProductoBtn.addEventListener("click", agregarProducto);
    finalizarCompraBtn.addEventListener("click", finalizarCompra);
    // Función para mostrar el modal de éxito (oculta el modal después de 3 segundos)
    function showModalExito(message) {
        mensajeExito.textContent = message;
        modalExito.classList.remove("hidden");
        setTimeout(() => modalExito.classList.add("hidden"), 3000);
    }
});