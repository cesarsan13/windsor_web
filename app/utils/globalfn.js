import { confirmSwal, showSwal } from "@/app/utils/alerts";
import { useEffect } from "react";

export const useEscapeWarningModal = (openModal, showModal) => {
  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.key === "Escape" && openModal) {
        event.preventDefault();
        showModal(false);
        const confirmed = await confirmSwal(
          "¿Seguro que quieres cerrar?",
          "Si cierras perderás los cambios no guardados.",
          "warning",
          "Sí, cerrar",
          "Cancelar"
        );
        if (!confirmed) {
          showModal(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openModal, showModal]);
};

export const validateBeforeSave = (inputName, modalId) => {
  const input = document.querySelector(`input[name='${inputName}']`);
  if (input && input.value.trim() === "") {
    showSwal("Error", "Complete todos los campos requeridos", "error", modalId);
    return false;
  }
  return true;
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const openFileSelector = () => {
  if (inputfileref.current) {
    inputfileref.current.click(); // Simula el clic en el input
  }
};

export const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(selectedFile);
      setcondicion(true);
      setCapturedImage(reader.result); // La imagen en formato Base64
    };
    reader.readAsDataURL(selectedFile); // Convierte el archivo a Base64
  }
};

export const handleBlur = (evt, datatype) => {
  if (evt.target.value === "") return;
  datatype === "int"
    ? setAlumno((alumno) => ({
        ...alumno,
        [evt.target.name]: pone_ceros(evt.target.value, 0, true),
      }))
    : setAlumno((alumno) => ({
        ...alumno,
        [evt.target.name]: pone_ceros(evt.target.value, 2, true),
      }));
};

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
    event.preventDefault();
    const form = event.target.form;

    if (form) {
      const elements = Array.from(form.elements);
      const index = elements.indexOf(event.target);

      if (index > -1 && index + 1 < elements.length) {
        elements[index + 1].focus();
      }
    }
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

export const formatNumberDecimalOne = (num) => {
  if (num === null || num === undefined) return "";
  const numStr = typeof num === "string" ? num : num.toString();
  const floatNum = parseFloat(numStr.replace(/,/g, "").replace(/[^\d.-]/g, ""));
  if (isNaN(floatNum)) return "";
  return floatNum.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
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

export const snToBool = (string) => {
  if (string == "Si" || string == true) {
    return true;
  } else {
    return false;
  }
};
export const validarRFC = (rfc) => {
  const regexRFC =
    /^([A-ZÑ&]{3,4})\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z\d]{2}\d$/;

  if (rfc.match(regexRFC)) {
    return true;
  } else {
    return false;
  }
};

export const globalVariables = {
  grupo: null,
  vg_caso_evaluar: null,
  vg_actividad: null,
  vg_area: null,
};
export const setGlobalVariable = (key, value) => {
  globalVariables[key] = value;
  localStorage.setItem(key, JSON.stringify(value));
};
export const loadGlobalVariables = () => {
  Object.keys(globalVariables).forEach((key) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
      globalVariables[key] = JSON.parse(savedValue);
    }
  });
};

//Es de Concentrado Calificaciones
export const RegresaCalificacionRedondeo = (twxCalifica, txwRedondea0) => {
  // Inicializar la variable de retorno
  let resultado = 0;

  // Redondear a 2 decimales
  twxCalifica = Math.round(twxCalifica * 100) / 100;

  if (txwRedondea0 === "S") {
    // Condicionales de redondeo exacto
    if (twxCalifica > 9.49) {
      twxCalifica = 10;
    } else if (twxCalifica > 8.99 && twxCalifica < 9.5) {
      twxCalifica = 9;
    } else if (twxCalifica > 8.49 && twxCalifica < 9) {
      twxCalifica = 9;
    } else if (twxCalifica > 7.99 && twxCalifica < 8.5) {
      twxCalifica = 8;
    } else if (twxCalifica > 7.49 && twxCalifica < 8) {
      twxCalifica = 8;
    } else if (twxCalifica > 6.99 && twxCalifica < 7.5) {
      twxCalifica = 7;
    } else if (twxCalifica > 6.49 && twxCalifica < 7) {
      twxCalifica = 7;
    } else if (twxCalifica > 5.99 && twxCalifica < 6.5) {
      twxCalifica = 6;
    } else if (twxCalifica < 6) {
      twxCalifica = 5;
    }
    resultado = twxCalifica;
  } else {
    const txwMult = twxCalifica * 10;
    const txwStrin = txwMult.toString();
    const posPunto = txwStrin.indexOf(".");
    let txwEnt;
    if (posPunto > -1) {
      txwEnt = parseInt(txwStrin.substring(0, posPunto), 10);
    } else {
      txwEnt = parseInt(txwStrin, 10);
    }
    resultado = txwEnt / 10;
  }
  return resultado;
};

export const obtenerFechaYHoraActual = () => {
  const date = new Date();
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const año = date.getFullYear();
  const hor = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const seg = String(date.getSeconds()).padStart(2, "0");
  const fecha = `${dia}${mes}${año}`;
  const hora = `${hor}${min}${seg}`;
  return { fecha, hora };
};

export const aDec = (value) => {
  return isNaN(value) ? 0 : Number(value);
};

export const permissionsComponents = (
  es_admin,
  permissions,
  id_usuario,
  id_punto_menu
) => {
  const permisos = es_admin
    ? {
        id_punto_menu: id_punto_menu,
        id_usuario: id_usuario,
        altas: true,
        bajas: true,
        cambios: true,
        impresion: true,
      }
    : permissions.find(
        (per) =>
          per.id_punto_menu === id_punto_menu && per.id_usuario === id_usuario
      );
  return permisos;
};

export const PoneCeros = (importe, longitud) => {
  const trabajoString = String(importe).trim();
  const cerosFaltantes = longitud - trabajoString.length;
  return "0".repeat(cerosFaltantes) + trabajoString;
};

export const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const validateString = (MAX_LENGTHS, key, str) => {
  if (typeof str === "string") {
    const maxLength = MAX_LENGTHS[key] || str.length;
    return str.slice(0, maxLength);
  }
  return str;
};

//Formateo para las fechas en los excel (OBLIGATORIO)
export const fechaFormatExcel = (fechaS) => {
  const date = new Date((fechaS - 25567 - 1) * 86400 * 1000);

  // Formatear la fecha en dd/mm/yyyy
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses comienzan desde 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const CerrarModal = async (accion) => {
  if (accion) {
    if (accion === "Alta" || accion === "Editar") {
      const confirmed = await confirmSwal(
        "Salir",
        "Cambios sin guardar. Si sales, perderás la información.",
        "warning",
        "Aceptar",
        "Cancelar",
        "my_modal_3"
      );
      if (confirmed) document.getElementById("my_modal_3").close();
    } else {
      document.getElementById("my_modal_3").close();
    }
  }
  return;
};
