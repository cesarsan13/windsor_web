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

// Función para agregar ceros a la izquierda hasta alcanzar una longitud específica
export const poneCeros = (importe, longitud) => {
  console.log(importe)
  console.log(longitud)
  let twTrabajoString = importe.toString(); // Convierte el importe a string
  twTrabajoString = twTrabajoString.trim(); // Elimina espacios en blanco al inicio y final
  const twLen = twTrabajoString.length;

  if (twLen >= longitud) {
    return twTrabajoString; // Si ya tiene la longitud deseada, devuelve el importe sin cambios
  }

  let poneCeros = '';
  for (let i = 0; i < longitud - twLen; i++) {
    poneCeros += '0'; // Agrega ceros a la izquierda hasta alcanzar la longitud deseada
  }
  poneCeros += twTrabajoString; // Agrega el importe al final de los ceros

  return poneCeros;
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
