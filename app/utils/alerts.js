import Swal from "sweetalert2";

export const showSwalAndWait = (title, text, icon, wait = 2000) => {
  return new Promise((resolve) => {
    Swal.fire({
      title: title,
      html: text,
      icon: icon,
      timer: wait,
      showConfirmButton: false,
      customClass: {
        popup: "swal-popup",
      },
    }).then(() => {
      resolve();
    });
  });
};

export const showSwal = (titulo, mensaje, icono, target = "") => {
  let options = {
    position: "center",
    icon: icono,
    title: titulo,
    html: mensaje,
    showConfirmButton: true,
    timer: 4500,
  };
  if (target !== "") {
    options.target = document.getElementById(target);
  }
  Swal.fire(options);
};


export const confirmSwal = async (
  titulo,
  mensaje,
  icono,
  confirmButtonText,
  cancelButtonText,
  target
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
      ...(target && { target: document.getElementById(target) }),
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true); // Resolvemos la promesa con true si se confirma
      } else {
        resolve(false); // Resolvemos la promesa con false si se cancela
      }
    });
  });
};

