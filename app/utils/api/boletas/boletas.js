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

export const getEvaluacionMateria = async (token, data, materia, grupo_nombre) => {
    // console.log('evaluacion', materia, grupo_nombre);
    let url = `${process.env.DOMAIN_API}api/proceso/boleta-evaluacion`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            grupo: grupo_nombre,
            bimestre: data.bimestre,
            alumno: data.alumno,
            materia: materia,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getAreas = async (token, data, materia) => {
    // console.log('areas', materia);
    let url = `${process.env.DOMAIN_API}api/proceso/boleta-areas`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            materia: materia,
            grupo: data.grupo_nombre,
            bimestre: data.bimestre,
            alumno: data.alumno,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getAreasOtros = async (token, data, materia) => {
    // console.log('area otros', materia);
    let url = `${process.env.DOMAIN_API}api/proceso/bleta-areas-otroso`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            materia: materia,
            grupo: data.grupo_nombre,
            bimestre: data.bimestre,
            alumno: data.alumno,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getDatosPorGrupo = async (token, grupo, grupo_nombre, ordenAlfabetico) => {
    let url = `${process.env.DOMAIN_API}api/proceso/datos-por-grupo`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            grupo: grupo,
            grupo_nombre: grupo_nombre,
            orden_alfabetico: ordenAlfabetico
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

