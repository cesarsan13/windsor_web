export const getEstadisticasTotales = async (token) => {
  let url = `${process.env.DOMAIN_API}api/estadisticas-total-home`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
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
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getConsultasInscripcion = async (token) => {
  let url = `${process.env.DOMAIN_API}api/reportes/rep_inscritos`
  const res = await fetch(url, {
      headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          xescuela: localStorage.getItem("xescuela"),
      }
  });
  const resJson = await res.json();
  return resJson;
}

export const getConsultasInsXMes = async (token) => {
  let url = `${process.env.DOMAIN_API}api/reportes/rep_inscritos_mes`
  const res = await fetch(url, {
      headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          xescuela: localStorage.getItem("xescuela"),
      }
  });
  const resJson = await res.json();
  return resJson;
}
