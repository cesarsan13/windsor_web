export const getMenus = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/accesos-menu/baja`)
    : (url = `${process.env.DOMAIN_API}api/accesos-menu/get`);
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const siguiente = async (token) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/accesos-menu/siguiente`,
    {
      headers: new Headers({
        Authorization: "Bearer " + token,
        xescuela: localStorage.getItem("xescuela"),
      }),
    }
  );
  const resJson = await res.json();
  return resJson.data;
};

export const guardaMenu = async (token, accion, data) => {
  if (!data.numero) {
    throw new Error("Número no definido");
  }
  console.info(data);
  let url = "";
  let method = "";
  if (accion === "Alta") {
    url = `${process.env.DOMAIN_API}api/accesos-menu/save`;
    method = "POST";
    data.baja = "";
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
    } else {
      data.baja = "";
    }
    url = `${process.env.DOMAIN_API}api/accesos-menu/update`;
    method = "PUT";
  }
  const res = await fetch(`${url}`, {
    method: method,
    body: JSON.stringify({
      numero: data.numero,
      ruta: data.ruta,
      descripcion: data.descripcion,
      icono: data.icono,
      menu: data.menu,
      baja: data.baja,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson;
};
