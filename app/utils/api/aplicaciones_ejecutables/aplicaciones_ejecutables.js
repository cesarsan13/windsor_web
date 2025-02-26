export const getAplicaciones = async (getToken, bajas) => {
    let url = "";
    bajas
        ? (url = `${process.env.DOMAIN_API}api/ejecutable/indexBaja`)
        : (url = `${process.env.DOMAIN_API}api/ejecutable/index`);

    const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${getToken}`,
          xescuela: localStorage.getItem("xescuela"),
        },
      });
    const resJson = await res.json();
    return resJson.data;
};

export const siguiente = async (token) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/ejecutable/ultimo`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        xescuela: localStorage.getItem("xescuela"),
      },
    }
  );
  const resJson = await res.json();
  return resJson.data;
};

export const guardaEjecutables = async (token, data, accion) => {
    let url_api = "";
    if (accion === "Alta") {
      url_api = `${process.env.DOMAIN_API}api/ejecutable/alta`;
      data.baja = "";
    }
    if (accion === "Eliminar" || accion === "Editar") {
      if (accion === "Eliminar") {
        data.baja = "*";
      } else {
        data.baja = "";
      }
      url_api = `${process.env.DOMAIN_API}api/ejecutable/update`;
    }
  
    const res = await fetch(`${url_api}`, {
      method: "post",
      body: JSON.stringify({
        numero: data.numero,
        descripcion: data.descripcion,
        ruta_archivo: data.ruta_archivo,
        icono: data.icono,
        baja: data.baja,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        xescuela: localStorage.getItem("xescuela"),
      }),
    });
    const resJson = await res.json();
    return resJson;
  };

