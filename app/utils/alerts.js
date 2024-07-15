import Swal from "sweetalert2";

export const showSwal = (titulo, mensaje, icono) => {
  Swal.fire({
    position: "center",
    icon: icono,
    title: titulo,
    text: mensaje,
    showConfirmButton: true,
    timer: 1500,
  });
};

export const confirmSwal = async (
  titulo,
  mensaje,
  icono,
  confirmButtonText,
  cancelButtonText
) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: icono,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true); // Resolvemos la promesa con true si se confirma
      } else {
        resolve(false); // Resolvemos la promesa con false si se cancela
      }
    });
  });
};
