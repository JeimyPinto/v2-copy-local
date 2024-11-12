document.addEventListener("DOMContentLoaded", function () {
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const modal = document.getElementById("modal");

  openModal.addEventListener("click", () => {
    modal.classList.remove("hidden");    
    document.getElementById('dataForm').reset();  // Limpiar formulario
    document.getElementById('id').value = ''; // Limpiar ID para nuevo registro
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
});
