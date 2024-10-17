export const getClasesBuscaCat = async (token, grupo) => {
    let url = `${process.env.DOMAIN_API}api/proceso/busca-cat`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            grupo: grupo
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};
import { useSession } from "next-auth/react";

export const getClases = async (token, baja) => {
    let url = "";
    baja
      ? (url = `${process.env.DOMAIN_API}api/clase/baja`)
      : (url = `${process.env.DOMAIN_API}api/clase/`);
  
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    return resJson.data;
  };

  export const guardaClase = async (token, data, accion) => {
    let url_api = "";
    if (accion === "Alta") {
      url_api = `${process.env.DOMAIN_API}api/clase/`;
      data.baja = "";
    }
    if (accion === "Eliminar" || accion === "Editar") {
      if (accion === "Eliminar") {
        data.baja = "*";
      } else {
        data.baja = "";
      }
      url_api = `${process.env.DOMAIN_API}api/clase/updateClase/`;
    }
  
    const res = await fetch(`${url_api}`, {
      method: "post",
      body: JSON.stringify({
        materia: data.materia,
        grupo: data.grupo,
        profesor: data.profesor,
        lunes: data.lunes,
        martes: data.martes,
        miercoles: data.miercoles,
        jueves: data.jueves,
        viernes: data.viernes,
        sabado: data.sabado,
        domingo: data.domingo,
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