export const truncateTable = async (token, table) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/global`, {
    method: "DELETE",
    body: JSON.stringify({ table: table }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson;
};

export const inactiveActiveBaja = async (token, table) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/global/baja`, {
    method: "POST",
    body: JSON.stringify({ table: table }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson;
};
