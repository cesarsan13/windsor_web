export const getProcesoCalificaciones = async (token, data) => {
    let url = `${process.env.DOMAIN_API}api/proceso/calificaciones-get`
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            alumno: data.alumno,
            grupo: data.grupo,
            bimestre: data.bimestre,
            cb_actividad: data.cb_actividad,
            actividad: data.actividad,
            unidad: data.evaluacion,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const resJson = await res.json();
    return resJson;
};