import { useSession } from "next-auth/react";

export const getFormFact = async (token, baja) => {
    let url = "";
    baja
      ? (url = "http://localhost:8000/api/FormFact/baja")
      : (url = "http://localhost:8000/api/FormFact/");
  
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    return resJson.data;
  };
  export const siguiente = async (token) => {
    const res = await fetch(`http://localhost:8000/api/FormFact/siguiente`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    return resJson.data;
  };
  export const guardaFormFact = async (token, data, accion) => {
    let url_api = "";
    if (accion === "Alta") {
      url_api = "http://localhost:8000/api/FormFact/";
      data.baja = "";
    }
    if (accion === "Eliminar" || accion === "Editar") {
      if (accion === "Eliminar") {
        data.baja = "*";
      } else {
        data.baja = "";
      }
      url_api = "http://localhost:8000/api/FormFact/UpdateFormFact/";
    }
  
    const res = await fetch(`${url_api}`, {
      method: "post",
      body: JSON.stringify({
        numero: data.numero,
        nombre: data.nombre,
        longitud: data.longitud,
        baja: data.baja,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
    });
    const resJson = await res.json();
    return resJson;
  };