export const getEstadisticasTotales = async (token) => {
  let url = `${process.env.DOMAIN_API}api/estadisticas-total-home`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson;
};

export const getCumpleañosMes = async (token) => {
  let url = `${process.env.DOMAIN_API}api/students/cumpleanos-mes`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
