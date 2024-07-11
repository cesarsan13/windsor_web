export const getHorarios = async (token,baja) => {
    let url = ""
    baja ? (url=`${process.env.DOMAIN_API}api/horarios/baja`)
    : (url=`${process.env.DOMAIN_API}api/horarios`)
    const res = await fetch(url,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    })
    const resJson = await res.json();
    return resJson.data;
}
export const getUltimoHorario = async (token) =>{
    let url = `${process.env.DOMAIN_API}api/horarios/ultimo`
    const res = await fetch(url,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    })
    const resJson = await res.json();
    return resJson.data;
}
export const guardarHorario = async (token,data,accion) => {
    let url = ""
    let met = ""
    if (accion==='Alta'){
        url=`${process.env.DOMAIN_API}api/horarios/post`
        data.baja = ""
        met = "post"
    }
    if (accion==='Eliminar' || accion=="Editar"){
        if (accion==='Eliminar'){
            data.baja="*"
        }else{
            data.baja=""    
        }
        url = `${process.env.DOMAIN_API}api/horarios/update`
        met = "put"
    }    
    const res = await fetch(`${url}`,{
        method:met,
        body: JSON.stringify({
            numero:data.numero,
            cancha:data.cancha,
            dia:data.dia,
            horario:data.horario,
            max_niños:data.max_niños,
            sexo:data.sexo,
            edad_ini:data.edad_ini,
            edad_fin:data.edad_fin,
            baja:data.baja
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          })
    })
    const resJson = await res.json();
    return resJson;
}