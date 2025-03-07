export const getSubMenusApi = async (token, baja) => {
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

export const saveSubMenuApi = async (token, data) => {
  data.baja = "n";
  const res = await fetch(`${process.env.DOMAIN_API}api/sub-menus`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson;
};

export const updateSubMenuApi = async (token, data, action) => {
  action === "Editar" ? (data.baja = "n") : (data.baja = "*");
  const res = await fetch(`${process.env.DOMAIN_API}api/sub-menus/update`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson;
};
