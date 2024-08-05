import * as XLSX from "xlsx";
import { formatDate, formatTime } from "./globalfn";

export class ReporteExcel {
  constructor(configuracion) {
    this.configuracion = configuracion;
    this.worksheetData = [];
    this.condition = null; // Inicializa condition como propiedad de la clase
    this.conditionColumn = null; // Inicializa conditionColumn como propiedad de la clase
    this.imprimeEncabezadoPrincipal();
  }
  imprimeEncabezadoPrincipal() {
    const { Encabezado } = this.configuracion;
    const date = new Date();
    const dateStr = formatDate(date);
    const timeStr = formatTime(date);
    Encabezado;
    this.worksheetData.push(
      [Encabezado.Nombre_Aplicacion, "", "", "", `Fecha: ${dateStr}`],
      [Encabezado.Nombre_Reporte, "", "", "", `Hora: ${timeStr}`],
      [`Usuario: ${Encabezado.Nombre_Usuario}`, "", "", "", "Hoja: 1"],
      [Encabezado.Clase, "", Encabezado.Profesor, "", Encabezado.FechaE],
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
      let rowData = this.columnas.map((col) => {
        if (col.dataKey === this.conditionColumn && this.condition) {
          return this.condition(row[col.dataKey]) ? "Si" : "No";
        }
        return row[col.dataKey] || "";
      });
      this.addRow(rowData);
    });
  }
  calculaAnchos() {
    const maxColumnWidths = [];
    this.worksheetData.forEach((row) => {
      row.forEach((cell, index) => {
        const cellLength = cell ? cell.toString().length : 0;
        maxColumnWidths[index] = Math.max(
          maxColumnWidths[index] || 0,
          cellLength
        );
      });
    });
    return maxColumnWidths.map((width) => ({ wch: width }));
  }
  guardaReporte(Nombre) {
    const worksheet = XLSX.utils.aoa_to_sheet(this.worksheetData);
    const workbook = XLSX.utils.book_new();

    worksheet["!cols"] = this.calculaAnchos();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    XLSX.writeFile(workbook, `${Nombre}.xlsx`);
  }
  setCondition(conditionColumn, conditionFunction) {
    this.conditionColumn = conditionColumn;
    this.condition = conditionFunction;
  }
}
