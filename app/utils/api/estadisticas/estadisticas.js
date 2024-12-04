import { format_Fecha_String, formatNumber } from "@/app/utils/globalfn";
import { formatDate, formatTime, formatFecha } from "@/app/utils/globalfn";

export const getEstadisticasTotales = async (token) => {
  let url = `${process.env.DOMAIN_API}api/estadisticas-total-home`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson;
};

export const getCumpleañosMes = async (token) => {
  let url = `${process.env.DOMAIN_API}api/students/cumpleanos-mes`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getConsultasInscripcion = async (token) => {
  let url = `${process.env.DOMAIN_API}api/reportes/rep_inscritos`
  const res = await fetch(url, {
      headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
      }
  });
  const resJson = await res.json();
  return resJson;
}

export const getConsultasInsXMes = async (token) => {
  let url = `${process.env.DOMAIN_API}api/reportes/rep_inscritos_mes`
  // console.log(`Data a enviar => `,formData);
  const res = await fetch(url, {
      // method: "POST",
      // body: formData,
      headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
      }
  });
  const resJson = await res.json();
  return resJson;
}


// export const getConsultasInsXMes = (configuracion) => {
//   let total_inscripcion = 0;
//   let alumnos = 0;
//   let si_inscrito = false;
//   // const newPDF = new ReportePDF(configuracion, "Portrait");
//   const { Alumnos } = configuracion;
//   const { Detalles } = configuracion;
//   const { Productos } = configuracion;
//   const { Horarios } = configuracion;
//   // const fecha_ini = format_Fecha_String(configuracion.fecha_ini)
//   // const fecha_fin = format_Fecha_String(configuracion.fecha_fin)   
//   const fecha =  configuracion.Fecha;
//   console.log("Fecha a buscar => ",fecha);
//   // Enca1(newPDF);
//   Alumnos.forEach((alumno) => {
//       let det_inscripcion = 0;
//       let si_suma = false;
//       let fecha_inscripcion = "";
//       const detalleEncontrado = Detalles.filter(detalle =>{
//           const fechaDetalle = new Date(detalle.fecha);
//           const añoDetalle = fechaDetalle.getFullYear();
//           const mesDetalle = fechaDetalle.getMonth() + 1;
//           const fechaBusca = new Date(fecha);
//           const añoB = fechaBusca.getFullYear();
//           const mesB = fechaBusca.getMonth() + 1;
//           // detalle.alumno === alumno.numero &&
//           // detalle.fecha >= fecha_ini &&
//           // detalle.fecha <= fecha_fin
//           console.log("Si busca por fecha")
//           console.log(`Comparando añoDetalle ${añoDetalle} con añoB ${añoB}\nmesDetalle ${mesDetalle} con mesB ${mesB}`);
//           return detalle.alumno === alumno.numero && añoDetalle === añoB && mesDetalle === mesB;
//         }
//       );
//       if (detalleEncontrado) {
//           detalleEncontrado.forEach((detalle) => {
//               const productoEncontrado = Productos.filter(producto =>
//                   producto.ref === 'INS' &&
//                   producto.numero === detalle.articulo
//               );
//               if (productoEncontrado) {
//                   console.log('no entro');
//                   si_inscrito = true;
//                   si_suma = true;
//                   det_inscripcion += detalle.precio_unitario * detalle.cantidad;
//                   total_inscripcion += detalle.precio_unitario * detalle.cantidad;
//               } else { console.log('no entro'); };
//               fecha_inscripcion = detalle.fecha;
//           });
//           if (si_suma) {
//               // const nombre = `${(alumno.a_nombre || '')} ${(alumno.a_paterno || '')} ${(alumno.a_materno || '')}`.substring(0, 50);
//               // newPDF.ImpPosX(alumno.numero.toString() || '', 25, newPDF.tw_ren,0,"R");
//               // newPDF.ImpPosX(nombre.toString(), 30, newPDF.tw_ren,0,"L");
//               // const horarioEncontrado = Horarios.find(
//               //     horario => horario.numero === alumno.horario_1
//               // );
//               // if (horarioEncontrado) {
//               //     newPDF.ImpPosX(horarioEncontrado.horario.toString() || '', 125, newPDF.tw_ren,0,"L");
//               // }
//               // newPDF.ImpPosX(fecha_inscripcion.toString() || '', 160, newPDF.tw_ren,0,"L");
//               // newPDF.ImpPosX(formatNumber(det_inscripcion) || '0.00', 195, newPDF.tw_ren,0,"R");
//               alumnos += 1;
//               // Enca1(newPDF);
//           }
//           det_inscripcion = 0;
//       }
//       // if (newPDF.tw_ren >= newPDF.tw_endRen) {
//       //     newPDF.pageBreak();
//       //     Enca1(newPDF);
//       // }
//   });
//   return {
//     "Total":formatNumber(total_inscripcion),
//     "TotalAlumnos":alumnos.toString() || '0'
//   }
//   // newPDF.nextRow(4);
//   // newPDF.ImpPosX(`Total: ${formatNumber(total_inscripcion)}` || '0.00', 175, newPDF.tw_ren);
//   // newPDF.nextRow(4);
//   // newPDF.ImpPosX(`Total Alumnos: ${alumnos.toString() || '0'}`, 175, newPDF.tw_ren);
//   // const date = new Date();
//   // const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
//   //   .toString()
//   //   .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
//   // const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
//   // const timeStr = formatTime(date).replace(/:/g, "");

//   // newPDF.guardaReporte(`Reporte_Alumnos_Inscritos${dateStr}${timeStr}`);
// };