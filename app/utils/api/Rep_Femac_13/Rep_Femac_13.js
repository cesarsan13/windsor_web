import { ReporteExcel } from "../../ReportesExcel";
import { formatDate, formatTime, formatFecha, format_Fecha_String } from "../../globalfn";


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
    const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newExcel.guardaReporte(`${nombre}${dateStr}${timeStr}`);
  }

