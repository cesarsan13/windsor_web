export const getSubMenus = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/sub-menus/baja`)
    : (url = `${process.env.DOMAIN_API}api/sub-menus`);
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const guardaSubMenu = async (token, data) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/sub-menus`, {
    method: "POST",
    body: JSON.stringify({
      id_acceso: data.numero,
      descripcion: data.sub_menu,
      baja: "n",
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

export const updateSubMenu = async (token, data, action) => {
  console.log(data);
  action === "Editar" ? (data.baja = "n") : (data.baja = "*");
  const res = await fetch(`${process.env.DOMAIN_API}api/sub-menus/update`, {
    method: "POST",
    body: JSON.stringify({
      id_acceso: data.numero,
      descripcion: data.sub_menu,
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
