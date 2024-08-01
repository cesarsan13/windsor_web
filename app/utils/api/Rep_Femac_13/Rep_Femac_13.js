import { ReporteExcel } from "../../ReportesExcel";


export const getRepASem = async (token, horario, orden) => {
  horario = (horario === undefined || Object.keys(horario).length === 0) ? '' : horario;
    const res = await fetch (`${process.env.DOMAIN_API}api/reportes/rep_femac_13`,{
      method: "post",
      body: JSON.stringify({
        horario: horario,
        orden: orden,
      }),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    const resJson = await res.json();
    return resJson.data;
}

export const ImprimirExcel = (configuracion)=>{
    const newExcel = new ReporteExcel(configuracion)
    const {columns} = configuracion
    const {body} = configuracion
    const {nombre}=configuracion
    newExcel.setColumnas(columns);
    newExcel.addData(body);
    newExcel.guardaReporte(nombre);
  }

