import { ReporteExcel } from "@/app/utils/ReportesExcel";
import {  formatTime, format_Fecha_String } from "@/app/utils/globalfn";

export const getRepASem = async (token, horario, orden) => {
  horario = (horario === undefined || Object.keys(horario).length === 0) ? '' : horario;
    const res = await fetch (`${process.env.DOMAIN_API}api/reportes/rep_femac_13`,{
      method: "post",
      body: JSON.stringify({
        horario: horario,
        orden: orden,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        xescuela: localStorage.getItem("xescuela"),
        "Content-Type": "application/json",
      }),
    });
    const resJson = await res.json();
    return resJson.data;
}

export const ImprimirExcel = (configuracion)=>{
    const newExcel = new ReporteExcel(configuracion)
    const {columns} = configuracion
    const {body} = configuracion
    const {nombre}=configuracion

    const cambios = body.map(item => ({
      ...item,
      Año_Nac_1: item.Año_Nac_1 === "" ? "" : item.Año_Nac_1.substring(0, 4),
      Mes_Nac_1: item.Mes_Nac_1 === "" ? "" : item.Mes_Nac_1.substring(5, 7),
    }))

    newExcel.setColumnas(columns);
    newExcel.addData(cambios);
    const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newExcel.guardaReporte(`${nombre}_${dateStr}_${timeStr}`);
  }

