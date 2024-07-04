import { useSession } from "next-auth/react";

export const getCajeros = async (token, baja) => {
  let url = "";
  baja
    ? (url = "http://localhost:8000/api/Cajero/baja")
    : (url = "http://localhost:8000/api/Cajero/");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const siguiente = async (token) => {
  const res = await fetch(`http://localhost:8000/api/Cajero/siguiente`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const guardaCajero = async (token, data, accion) => {
    let url_api = "";
    if (accion === "Alta") {
      url_api = "http://localhost:8000/api/Cajero/";
      data.baja = "";
    }
    if (accion === "Eliminar" || accion === "Editar") {
      if (accion === "Eliminar") {
        data.baja = "*";
      } else {
        data.baja = "";
      }
      url_api = "http://localhost:8000/api/Cajero/UpdateCajeros/";
    }
  
    const res = await fetch(`${url_api}`, {
      method: "post",
      body: JSON.stringify({
        numero: data.numero,
        nombre: data.nombre,
        direccion: data.direccion,
        colonia: data.colonia,
        estado: data.estado,
        telefono: data.telefono,
        fax: data.fax,
        mail: data.mail,
        baja: data.baja,
        fec_cambio: data.fec_cambio,
        clave_cajero: data.clave_cajero,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
    });
    const resJson = await res.json();
    return resJson;
  };