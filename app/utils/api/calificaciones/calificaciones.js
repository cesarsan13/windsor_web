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

export const getMateriasGrupo = async (token,grupo)=>{
    let url = `${process.env.DOMAIN_API}api/calificaciones/materias`
    const res = await fetch(url,{
        method:"post",
        body:JSON.stringify({
            grupo:grupo
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const resJson = await res.json();
    return resJson.data;
}
export const getCalificaciones = async(token,grupo,materia,bimestre,alumno)=>{
    let url = `${process.env.DOMAIN_API}api/calificaciones`
    const res = await fetch(url,{
        method:"post",
        body:JSON.stringify({
            grupo:grupo,            
            materia:materia,
            bimestre:bimestre,
            alumno:alumno,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const resJson = await res.json();
    return resJson.data;
}