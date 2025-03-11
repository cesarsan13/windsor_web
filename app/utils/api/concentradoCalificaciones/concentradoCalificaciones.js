import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReporteExcelCC } from "@/app/utils/api/concentradoCalificaciones/ReportesExcelCC";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {formatDate, formatTime} from "@/app/utils/globalfn"

export const getMateriasPorGrupo = async (token, idHorario) => {
    if(idHorario > 0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/materiasGrupo/${idHorario}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson.data;
    }
};

export const getInfoActividadesXGrupo = async (token, idHorario, idBimestre) => {
    if(idHorario > 0 && idBimestre > 0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/detallesGrupoGeneral/${idHorario}/${idBimestre}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson.data;
    }
};

export const getActividadesXHorarioXAlumnoXMateriaXBimestre = async (token, idHorario, idAlumno, idMateria, idBimestre) => {
    if(idHorario > 0 && idBimestre > 0 && idAlumno > 0 && idMateria >0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/detalles/${idHorario}/${idAlumno}/${idMateria}/${idBimestre}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson.data;
    }
};

export const getMateriasReg = async (token, idHorario) => {
    if(idHorario > 0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/MateriasReg/${idHorario}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson.data;
}
};

export const getActividadesReg = async (token) => {
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/ActividadesReg`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getAlumno = async (token, idHorario) => {
    if(idHorario > 0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/Alumno/${idHorario}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson.data;
    }
};

export const getActividadesDetalles = async (token, idMateria) => {
    if(idMateria > 0){
    let url = `${process.env.DOMAIN_API}api/concentradoCalificaciones/actividadesMateria/${idMateria}`;
    const res = await fetch(url, {
        method: "get",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json",
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson.data;
    }
};

export const ImprimirPDF = (configuracion, resultadoEnc, fecha_hoy) => {
    let posicionX = 23; 
    const incrementoX = 9;
    const orientacion = "Landscape";
    const newPDF = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    const Enca1 = (newPDF) => {
        if (!newPDF.tiene_encabezado) {
          newPDF.imprimeEncabezadoPrincipalHConcentradoCal();
          newPDF.nextRow(12);
          newPDF.ImpPosX('Num.', 14, newPDF.tw_ren);
          resultadoEnc.forEach((desc) => {
              newPDF.ImpPosX(desc.descripcion, posicionX, newPDF.tw_ren, 3);
              posicionX += incrementoX;
          });
          newPDF.nextRow(4);
          newPDF.printLineH();
          newPDF.nextRow(4);
          newPDF.tiene_encabezado = true;
        } else {
          newPDF.nextRow(6);
          newPDF.tiene_encabezado = true;
        }
    };
    Enca1(newPDF);
    body.forEach((arreglo2, index) => {
        let posicionBody = 14;
      arreglo2.forEach((valor, idx) => {
          newPDF.ImpPosX(valor, posicionBody, newPDF.tw_ren, 4);
          posicionBody+= incrementoX;
      })
      Enca1(newPDF);
      if (newPDF.tw_ren >= newPDF.tw_endRenH) {
          newPDF.pageBreakH();
          Enca1(newPDF);
      }
    })
    const dateStr = formatDate(fecha_hoy)
    const timeStr = formatTime(fecha_hoy)
    newPDF.guardaReporte(`ConcentradoCalificaciones_${dateStr.replaceAll("/","")}${timeStr.replaceAll(":","")}`);
  };

  export const ImprimirPDFDetalle = (configuracion, resultadoEnc, fecha_hoy, alumno) => {
    const newPDF = new ReportePDF(configuracion, "Portrait");
    const {body} = configuracion;
    const incrementoX = 27;
    const Enca1 = (doc) => {
        if (!doc.tiene_encabezado) {
            doc.imprimeEncabezadoPrincipalVConcentradoCal();
            doc.nextRow(12);
            doc.ImpPosX("Materias", 14, doc.tw_ren, 10);
            doc.nextRow(4);
            doc.printLineV();
            doc.nextRow(4);
          doc.tiene_encabezado = true;
        } else {
          doc.nextRow(6);
          doc.tiene_encabezado = true;
        }
      };
    Enca1(newPDF);
    
    Object.entries(body).forEach(([materia, mat], index) => {
        newPDF.ImpPosX(materia.toString(),14, newPDF.tw_ren,0);
        let posicionBodyMat = 14;
        let posicionBodyCal = 34;
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
        }
        mat[0].forEach((mat) => {
            newPDF.ImpPosX(mat.descripcion.toString(),posicionBodyMat, newPDF.tw_ren, 10);
            posicionBodyMat+= incrementoX;
        });
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
        }
        mat[1].forEach((mat1) => {
            newPDF.ImpPosX(mat1.toString(),posicionBodyCal, newPDF.tw_ren,0, "R");
            posicionBodyCal+= incrementoX;
        });
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
        }
    });
      const dateStr = formatDate(fecha_hoy)
      const timeStr = formatTime(fecha_hoy)
      newPDF.guardaReporte(`ConcentradoCalificaciones_${alumno}_${dateStr.replaceAll("/","")}${timeStr.replaceAll(":","")}`);
  };

  export const ImprimirExcel = (configuracion) => {
    const newExcel = new ReporteExcel(configuracion);
    const { columns } = configuracion;
    const { body } = configuracion;
    const { nombre } = configuracion;
    newExcel.setColumnas(columns);
    newExcel.addData(body);
    newExcel.guardaReporte(nombre);
  };

  export const ImprimirExcelCC = (configuracion) => {
    const newExcel = new ReporteExcelCC(configuracion);
    const { body } = configuracion;
    const { nombre } = configuracion;
    newExcel.addData(body);
    newExcel.guardaReporte(nombre);
  };

