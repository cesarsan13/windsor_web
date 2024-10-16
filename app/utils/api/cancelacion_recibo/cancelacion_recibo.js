export const procesoCartera = async (token, data) => {
    const res = await fetch(`${process.env.DOMAIN_API}api/cancelacion-recibo`, {
        method: 'POST',
        body: JSON.stringify({
            fecha: data.fecha,
            recibo: data.recibo,
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }),
    });
    const resJson = await res.json();
    return resJson;
}