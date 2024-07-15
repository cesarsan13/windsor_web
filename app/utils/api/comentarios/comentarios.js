import { useSession } from "next-auth/react";

export const getComentarios = async (token, baja) => {
  let url = "";
  baja
    ? (url = "http://localhost:8000/api/comentarios/baja")
    : (url = "http://localhost:8000/api/comentarios");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const siguiente = async (token) => {
  const res = await fetch(`http://localhost:8000/api/comentarios/siguiente`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const guardaComentarios = async (token, data, accion) => {
    let url_api = "";
    if (accion === "Alta") {
      url_api = "http://localhost:8000/api/comentarios";
      data.baja = "";
    }
    if (accion === "Eliminar" || accion === "Editar") {
      if (accion === "Eliminar") {
        data.baja = "*";
      } else {
        data.baja = "";
      }
      url_api = "http://localhost:8000/api/comentarios/update";
    }
  
    const res = await fetch(`${url_api}`, {
      method: "post",
      body: JSON.stringify({
        id: data.id,
        comentario_1: data.comentario_1,
        comentario_2: data.comentario_2,
        comentario_3: data.comentario_3,
        generales: data.generales,
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