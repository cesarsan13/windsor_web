export const actualizarCartera = async (token) => {
    const res = await fetch(`${process.env.DOMAIN_API}api/cartera/actualizar`, {
        method: 'GET',
        headers: new Headers({
            Authorization: "Bearer " + token,
            xescuela: localStorage.getItem("xescuela"),
        }),
    });
    const resJson = await res.json();
    return resJson;
}

export const procesoCartera = async (token, data) => {
    const res = await fetch(`${process.env.DOMAIN_API}api/cartera/proceso`, {
        method: 'POST',
        body: JSON.stringify({
            // cond_ant: data.cond_ant,
            fecha: data.fecha,
            cond_1: data.cond_1,
            periodo: data.periodo,
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            xescuela: localStorage.getItem("xescuela"),
        }),
    });
    const resJson = await res.json();
    return resJson;
}