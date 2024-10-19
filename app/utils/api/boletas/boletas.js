export const getBoletas3 = async (token, grupo) => {
    let url = `${process.env.DOMAIN_API}api/proceso/boleta-get`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            grupo: grupo
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getActividadMateria = async (token, numero) => {
    let url = `${process.env.DOMAIN_API}api/proceso/materia-actividad`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            numero: numero
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getEvaluacionMateria = async (token, data) => {
    let url = `${process.env.DOMAIN_API}api/proceso/boleta-evaluacion`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            numero: data.numero,
            grupo: data.grupo_nombre,
            bimestre: data.bimestre,
            alumno: data.alumno,
            materia: data.materia,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};