export const soloEnteros = (event) => {
  const key = event.key;
  const keyCode = event.keyCode;
  if (isControlKey(key)) {
    return;
  }
  if (key === "Enter") {
    return;
  }
  if (keyCode === 8) {
    return;
  } else if (keyCode === 13) {
    event.preventDefault();
    const form = event.target.form;
    const index = Array.prototype.indexOf.call(form, event.target);
    form.elements[index + 1].focus();
  } else if (key < "0" || key > "9") {
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

export const poneCeros = (importe = 0, longitud = 0) => {
  let twTrabajoString = importe.toString();
  twTrabajoString = twTrabajoString.trim();
  const twLen = twTrabajoString.length;
  if (twLen >= longitud) {
    return twTrabajoString;
  }
  let poneCeros = "";
  for (let i = 0; i < longitud - twLen; i++) {
    poneCeros += "0";
  }
  poneCeros += twTrabajoString;
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

export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export function format_Fecha_String(date) {
  if (date === "" || date === null || !date || date === " ") return "";
  const [year, month, day] = date.split(/[-\/]/);
  if (!day || !month || !year) return "";
  const fechaObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  if (isNaN(fechaObj.getTime())) return "";
  const formattedYear = fechaObj.getFullYear();
  const formattedMonth = String(fechaObj.getMonth() + 1).padStart(2, "0");
  const formattedDay = String(fechaObj.getDate()).padStart(2, "0");
  return `${formattedYear}/${formattedMonth}/${formattedDay}`;
}
export function Fecha_de_Ctod(date, diasmas) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  diasmas = Number(diasmas);
  date.setDate(date.getDate() + diasmas);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export const calculaDigitoBvba = (twInfo) => {
  const allTrim = (str) => str.trim();
  const val = (str) => parseInt(str, 10);
  let txwCar = "";
  let camMul = 2;
  twInfo = allTrim(twInfo);
  let txwLen = twInfo.length;
  let txwRes;
  let txwDiez;
  for (let twCount = txwLen - 1; twCount >= 0; twCount--) {
    txwRes = val(twInfo[twCount]) * camMul;
    if (txwRes >= 10) {
      txwDiez = txwRes.toString();
      txwDiez = allTrim(txwDiez);
      txwRes = val(txwDiez[0]) + val(txwDiez[1]);
    }
    txwCar = allTrim(txwCar) + txwRes.toString();
    txwCar = allTrim(txwCar);
    camMul = camMul === 1 ? 2 : 1;
  }
  txwLen = txwCar.length;
  txwRes = 0;
  for (let twCount = 0; twCount < txwLen; twCount++) {
    txwRes += val(txwCar[twCount]);
  }
  txwCar = txwRes.toString();
  txwCar = allTrim(txwCar);
  txwRes = parseInt(txwCar[txwCar.length - 1], 10);
  if (txwRes === 0) {
    return 0;
  } else {
    return 10 - txwRes;
  }
};

export const formatNumber = (num) => {
  if (!num) return "";
  const numStr = typeof num === "string" ? num : num.toString();
  const floatNum = parseFloat(numStr.replace(/,/g, "").replace(/[^\d.-]/g, ""));
  if (isNaN(floatNum)) return "";
  return floatNum.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const Elimina_Comas = (data) => {
  const convertir = (value) => {
    let valueConvertido = value;
    if (
      typeof valueConvertido === "string" &&
      valueConvertido.match(/^\d{1,3}(,\d{3})*(\.\d+)?$/)
    ) {
      valueConvertido = parseFloat(valueConvertido.replace(/,/g, ""));
    }

    return valueConvertido;
  };

  if (Array.isArray(data)) {
    return data.map(convertir);
  } else {
    return convertir(data);
  }
};

export const formatFecha = (fecha) => {
  if (!fecha) return ""; // Manejo en caso de que la fecha sea nula
  const fechaFormateada = String(fecha).replace(/\//g, "-");

  // Verifica si ya está en formato AAAA-MM-DD y no es otra estructura (ejemplo con "T" de ISO)
  const esISO = /^\d{4}-\d{2}-\d{2}T/.test(fechaFormateada);

  // Si tiene una "T", significa que es formato ISO y solo necesitas las primeras 10 posiciones.
  if (esISO) {
    return fechaFormateada.substring(0, 10); // Extrae solo AAAA-MM-DD
  }

  return fechaFormateada; // Retorna la fecha convertida
};

export const Fecha_AMD = (Tw_Fecha) => {
  return (
    Tw_Fecha.Year &
    "/" &
    Format(Tw_Fecha.Month, "0#") &
    "/" &
    Format(Tw_Fecha.Day, "0#")
  );
};

export const snToBool = (string) =>{
  console.log("Valor SN => ",string);
  if(string == "Si" || string == true){
    return true;
  }else{
    return false;
  }
}
