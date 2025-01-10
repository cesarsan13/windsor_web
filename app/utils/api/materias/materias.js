export const getMateriaBuscar = async (token, numero) => {
    let url = `${process.env.DOMAIN_API}api/proceso/materia-buscar`
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            numero: numero
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson;
};

export const getMateriaEvaluacion = async (token, numero) => {
    let url = `${process.env.DOMAIN_API}api/proceso/materia-evaluacion`
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            numero: numero
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson;
};