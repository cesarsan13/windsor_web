import * as ExcelJS from "exceljs";
import {
  formatTime,
  format_Fecha_String,
} from "@/app/utils/globalfn";

export class ReporteExcelCC {
  constructor(configuracion) {
    this.configuracion = configuracion;
    this.worksheetData = [];
    this.condition = null;
    this.conditionColumn = null;
    this.data = [];
    this.columns = [];
    this.imprimeEncabezadoPrincipal();
  }

  imprimeEncabezadoPrincipal() {
    const { Encabezado } = this.configuracion;

    const date = new Date();
    const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const dateStr = format_Fecha_String(todayDate);
    const timeStr = formatTime(date);

    this.worksheetData.push(
      ["", Encabezado.Nombre_Aplicacion, "", "", "", `Fecha: ${dateStr}`],
      ["", Encabezado.Nombre_Reporte, "", "", "", `Hora: ${timeStr}`],
      ["", `Usuario: ${Encabezado.Nombre_Usuario}`, "", "", "", "Hoja: 1"],
      ["", Encabezado.Clase, "", Encabezado.Profesor, "", Encabezado.FechaE],
      []
    );
  }

  addRow(rowData) {
    this.worksheetData.push(rowData);
  }

  addRows(rowsData) {
    this.worksheetData = this.worksheetData.concat(rowsData);
  }

  addData(data) {
    Object.keys(data).forEach((materia) => {
      this.addRow([materia]);
      const [headers, calificaciones] = data[materia];
      const headerRow = headers.map((item) => item.descripcion || "");
      this.addRow(headerRow);
      let provisionalcal = [];
      calificaciones.forEach((calificacion) => {
        provisionalcal.push(calificacion);
      });
      this.addRow(provisionalcal);
      this.addRow([]);
    });
  }

  calculaAnchos() {
    const maxColumnWidths = [];
    this.worksheetData.forEach((row, rowIndex) => {
      row.forEach((cell, index) => {
        const cellLength = cell != null ? cell.toString().length : 0;
        maxColumnWidths[index] = Math.max(
          maxColumnWidths[index] || 0,
          cellLength
        );
      });
    });
    return maxColumnWidths.map((width) => ({ width }));
  }

  async guardaReporte(Nombre) {
    const ImagenL = "resources/Logo_Interaccion.png";
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte");

    const columnWidths = this.calculaAnchos();
    worksheet.columns = columnWidths;

    if (ImagenL) {
      const response = await fetch(ImagenL);
      const imageData = await response.blob();
      const reader = new FileReader();
      reader.readAsArrayBuffer(imageData);
      await new Promise((resolve) => {
        reader.onloadend = () => {
          const buffer = new Uint8Array(reader.result);
          const imageId = workbook.addImage({
            buffer,
            extension: ImagenL.split(".").pop(),
          });
          worksheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 210, height: 120 },
          });
          resolve();
        };
      });
    }

    // Agregar los datos al worksheet
    this.worksheetData.forEach((row) => {
      worksheet.addRow(row);
    });

    worksheet.getColumn(1).width = 25;

    // Generar el archivo Excel y ofrecerlo para descarga
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${Nombre}.xlsx`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  setCondition(conditionColumn, conditionFunction) {
    this.conditionColumn = conditionColumn;
    this.condition = conditionFunction;
  }

  saltarFila() {
    const emptyRow = new Array(this.columns.length).fill("");
    this.addData(emptyRow);
  }
}
