export const soloEnteros = (event) => {
  const key = event.key;
  const keyCode = event.keyCode;
  if (isControlKey(key)) {
    return;
  }
  // Permitir teclas de retroceso (Backspace) y Enter (Enter)
  if (keyCode === 8) {
    // Backspace
    return;
  } else if (keyCode === 13) {
    // Enter
    event.preventDefault();
    const form = event.target.form;
    const index = Array.prototype.indexOf.call(form, event.target);
    form.elements[index + 1].focus();
  } else if (key < "0" || key > "9") {
    // No es un número
    event.preventDefault();
  }
};
export const soloDecimales = (event) => {
  const key = event.key;
  const keyCode = event.keyCode;
  // Permitir teclas de retroceso (Backspace)
  if (isControlKey(key)) {
    return;
  }
  if (keyCode === 8) {
    // Backspace
    return;
  }
  // Permitir punto decimal (.) con lógica específica
  else if (key === ".") {
    const input = event.target;
    if (
      input.selectionStart === 0 ||
      input.selectionStart === input.value.length
    ) {
      return;
    } else if (input.value.indexOf(".") !== -1) {
      event.preventDefault();
    }
  }
  // Permitir signo negativo (-)
  else if (key === "-") {
    return;
  }
  // Permitir Enter para moverse al siguiente campo del formulario
  else if (keyCode === 13) {
    // Enter
    event.preventDefault();
    const form = event.target.form;
    const index = Array.prototype.indexOf.call(form, event.target);
    form.elements[index + 1].focus();
  }
  // Permitir solo números
  else if (key < "0" || key > "9") {
    event.preventDefault();
  }
};
const isControlKey = (key) => {
  // Permitir teclas de control como retroceso, tabulación, flechas, etc.
  return (
    key === "Backspace" ||
    key === "Tab" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "ArrowUp" ||
    key === "ArrowDown"
  );
};

export const pone_ceros = (number, decimalPlaces = 2, useCommas = true) => {
  // Asegúrate de que el número tenga el número especificado de decimales
  let formattedNumber = parseFloat(number).toFixed(decimalPlaces);

  // Divide el número en parte entera y parte decimal
  let parts = formattedNumber.split(".");
  let integerPart = parts[0];
  let decimalPart = parts[1];

  // Agrega comas como separadores de miles si se especifica
  if (useCommas) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Junta la parte entera y la parte decimal
  return integerPart + "." + decimalPart;
};

export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
