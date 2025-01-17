import { useSession } from "next-auth/react";

export const getFormFact = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/FormFact/baja`)
    : (url = `${process.env.DOMAIN_API}api/FormFact/`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const siguiente = async (token) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/FormFact/siguiente`, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const guardaFormFact = async (token, data, accion) => {
  let url_api = "";
  if (accion === "Alta") {
    url_api = `${process.env.DOMAIN_API}api/FormFact/`;
    data.baja = "";
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
    } else {
      data.baja = "";
    }
    url_api = `${process.env.DOMAIN_API}api/FormFact/UpdateFormFact/`;
  }

  const res = await fetch(`${url_api}`, {
    method: "post",
    body: JSON.stringify({
      numero_forma: data.numero_forma,
      nombre_forma: data.nombre_forma,
      longitud: data.longitud,
      baja: data.baja,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson;
};

export const getFacturasFormato = async (token, id) => {
  let url = "";
  url = `${process.env.DOMAIN_API}api/facturasformato/${id}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const storeBatchFormFact = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/FormFact/batch`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getPropertyData = (filtro) => {
  let campo = {};
  switch (filtro) {
    case "Facturas":
      campo = {
        0: ".. No Opera",
        1: "Razon Social",
        2: "Direccion",
        3: "Colonia",
        4: "Estado",
        5: "CP",
        6: "Ciudad",
        7: "Detalle Descripción",
        8: "Detalle Importe",
        9: "Sub Total",
        10: "I.V.A.",
        11: "Total General",
        12: "Numero Factura",
        13: "Fecha Factura",
        14: "Importe en Letras",
        15: "Dia Facturación",
        16: "Mes Alfabetico",
        17: "Año Facturación",
        18: "Mes Facturación Numero",
        19: "Articulo",
        20: "Detalle Producto",
        21: "R.F.C.",
        22: "Num Alumno Detalle",
        23: "Tipo Pago 1",
        24: "Referencia 1",
        25: "Tipo Pago 2",
        26: "Referencia 2",
        27: "Numero de Recibos",
      };
      break;
    case "Recibo":
      campo = {
        0: ".. No Opera",
        1: "Numero Recibo",
        2: "Fecha Emision",
        3: "Numero Alumno",
        4: "Nombre Alumno",
        5: "Horario1",
        6: "Horario2",
        7: "Horario3",
        8: "Horario4",
        9: "Año Nacimiento",
        10: "Producto Descripción",
        11: "Producto Número",
        12: "Producto Importe",
        13: "Total con I.V.A.",
        14: "Nombre Cajero",
        15: "Importe en Letra",
        16: "Producto Cantidad",
        17: "Producto Precio Base",
        18: "Producto Precio Neto",
        19: "Producto Descuento",
        20: "Dia Facturación",
        21: "Mes Alfabetico",
        22: "Año Facturación",
        23: "Mes Facturación Numero",
        24: "Cancha 1",
        25: "Cancha 2",
        26: "Cancha 3",
        27: "Cancha 4",
        28: "Fecha Nacimiento",
        29: "Producto Referencia",
        30: "Comentario 1",
        31: "Comentario 2",
        32: "Comentario 3",
        33: "Comentario adicional",
        34: "Referencia Pago",
        35: "Quien Pago",
        36: "Forma de Pago 1",
        37: "Forma de Pago 2",
        38: "Detalle Numero Alumno",
        39: "Detalle Nombre Alumno",
      };
      break;
    case "Credencial":
      campo = {
        0: ".. No Opera",
        1: "Numero Alumno",
        2: "Horario1",
        3: "Horario2",
        4: "Horario3",
        5: "Horario4",
        6: "Ciclo",
        7: "Direccion",
        8: "Colonia",
        9: "Telefono",
        10: "CP",
        11: "Nombre",
        12: "Fecha de Nacimiento",
        13: "Cancha1",
        14: "Cancha2",
        15: "Cancha3",
        16: "Cancha4",
        17: "Fotografia",
      };
      break;
    default:
      break;
  }

  const formato = {
    0: "..No opera",
    1: "#,###",
    2: "#,###.#0",
    3: "$####",
    4: "$#,###",
    5: "$#,###.#0",
    6: "######",
    7: "###.0000",
    8: "### %",
    9: "#####",
    10: "###.00%",
    11: "#,###.000 ",
  };
  const fuente = {
    1: "Arial",
    2: "Arial Narrow",
    3: "Times",
    4: "Times New Roman",
    5: "Helvética",
    6: "Courier",
    7: "Courier New",
    8: "Verdana",
    9: "Candara",
    10: "Ginebra",
    11: "Calibri",
    12: "Optima",
    13: "Cambria",
    14: "Garamond",
    15: "Perpetua",
    16: "Monaco",
    17: "Didot",
    18: "Brush Script",
    19: "Lucida Bright",
    20: "Copperplate",
  };
  const area = {
    0: "..No opera",
    1: "Encabezado",
    2: "Detalle",
    3: "Totales",
  };

  return {
    campo: campo,
    fuente: fuente,
    formato: formato,
    area: area,
  };
};

export const updateFormat = async (token, data) => {
  let url_api = "";
  url_api = `${process.env.DOMAIN_API}api/facturasformato/update`;
  data.baja = "";
  try {
    const res = await fetch(`${url_api}`, {
      method: "post",
      body: JSON.stringify({ datos: data }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        xescuela: localStorage.getItem("xescuela"),
      }),
    });
    const resJson = await res.json();
    return resJson;
  } catch (error) { }
};
