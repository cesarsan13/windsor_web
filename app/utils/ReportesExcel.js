import * as XLSX from "xlsx";
import { formatDate, formatTime } from "./globalfn";

export class ReporteExcel {
  constructor(configuracion) {
    this.configuracion = configuracion;
    this.worksheetData = [];
    this.imprimeEncabezadoPrincipal();
  }
  imprimeEncabezadoPrincipal() {
    const { Encabezado } = this.configuracion;
    const date = new Date();
    const dateStr = formatDate(date);
    const timeStr = formatTime(date);

    this.worksheetData.push(
      [Encabezado.Nombre_Aplicacion, "", "", "", `Fecha: ${dateStr}`],
      [Encabezado.Nombre_Reporte, "", "", "", `Hora: ${timeStr}`],
      [`Usuario: ${Encabezado.Nombre_Usuario}`, "", "", "", "Hoja: 1"],
      []
    );
  }
  addRow(rowData) {
    this.worksheetData.push(rowData);
  }
  addRows(rowsData) {
    this.worksheetData = this.worksheetData.concat(rowsData);
  }
  setColumnas(columnas) {
    this.columnas = columnas;
    const headerRow = columnas.map((col) => col.header);
    this.addRow(headerRow);
  }
  addData(data) {
    data.forEach((row) => {
      let rowData = this.columnas.map((col) => row[col.dataKey] || "");
      this.addRow(rowData);
    });
  }
  guardaReporte(Nombre) {
    const worksheet = XLSX.utils.aoa_to_sheet(this.worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    XLSX.writeFile(workbook, `${Nombre}.xlsx`);
  }
}
