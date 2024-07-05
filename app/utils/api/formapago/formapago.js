export const getFormasPago = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/tipo_cobro/baja`)
    : (url = `${process.env.DOMAIN_API}api/tipo_cobro/`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
