export const procesoCartera = async (token, data) => {
    const res = await fetch(`${process.env.DOMAIN_API}api/cancelacion-recibo`, {
        method: 'POST',
        body: JSON.stringify({
            fecha: data.fecha,
            recibo: data.recibo,
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            xescuela: localStorage.getItem("xescuela"),
          }),
    });
    const resJson = await res.json();
    return resJson;
}