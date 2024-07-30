
export const getReporteCobranzaporAlumno = async (token, fecha_ini, fecha_fin, alumno_ini,
    alumno_fin, cajero_ini, cajero_fin, tomaFechas) => {
        const res = await fetch (`${process.env.DOMAIN_API}api/reportes/rep_femac_11_anexo_3`,{
            method: "post",
            body: JSON.stringify({
                tomafecha: tomaFechas,
                fecha_cobro_ini: fecha_ini,
                fecha_cobro_fin: fecha_fin,
                alumno_ini: alumno_ini,
                alumno_fin: alumno_fin,
                cajero_ini: cajero_ini,
                cajero_fin: cajero_fin
            }),
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
          const resJson = await res.json();
          return resJson.data;
    }