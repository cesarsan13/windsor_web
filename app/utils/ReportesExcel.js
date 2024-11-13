// import * as XLSX from "xlsx";
// import {
//   formatDate,
//   formatTime,
//   formatFecha,
//   format_Fecha_String,
// } from "./globalfn";

// export class ReporteExcel {
//   constructor(configuracion) {
//     this.configuracion = configuracion;
//     this.worksheetData = [];
//     this.condition = null; // Inicializa condition como propiedad de la clase
//     this.conditionColumn = null; // Inicializa conditionColumn como propiedad de la clase
//     this.data = [];
//     this.columns = [];
//     this.imprimeEncabezadoPrincipal();
//   }
//   imprimeEncabezadoPrincipal() {
//     const { Encabezado } = this.configuracion;
//     const date = new Date();
//     const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
//       .toString()
//       .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
//     const dateStr = format_Fecha_String(todayDate);
//     const timeStr = formatTime(date);
//     Encabezado;
//     this.worksheetData.push(
//       [Encabezado.Nombre_Aplicacion, "", "", "", `Fecha: ${dateStr}`],
//       [Encabezado.Nombre_Reporte, "", "", "", `Hora: ${timeStr}`],
//       [`Usuario: ${Encabezado.Nombre_Usuario}`, "", "", "", "Hoja: 1"],
//       [Encabezado.Clase, "", Encabezado.Profesor, "", Encabezado.FechaE],
//       []
//     );
//   }
//   addRow(rowData) {
//     this.worksheetData.push(rowData);
//   }
//   addRows(rowsData) {
//     this.worksheetData = this.worksheetData.concat(rowsData);
//   }
//   setColumnas(columnas) {
//     this.columns = columnas;
//     const headerRow = columnas.map((col) => col.header);
//     this.addRow(headerRow);
//   }
//   addData(data) {
//     data.forEach((row) => {
//       // const rowData = this.columns.map((col) => row[col.dataKey] || "");
//       // this.addRow(rowData);
//       let rowData = this.columns.map((col) => {
//         if (col.dataKey === this.conditionColumn && this.condition) {
//           return this.condition(row[col.dataKey]) ? "Si" : "No";
//         }
//         return row[col.dataKey] || "";
//       });
//       this.addRow(rowData);
//     });
//   }
//   calculaAnchos() {
//     const maxColumnWidths = [];
//     this.worksheetData.forEach((row) => {
//       row.forEach((cell, index) => {
//         const cellLength = cell ? cell.toString().length : 0;
//         maxColumnWidths[index] = Math.max(
//           maxColumnWidths[index] || 0,
//           cellLength
//         );
//       });
//     });
//     return maxColumnWidths.map((width) => ({ wch: width }));
//   }
//   guardaReporte(Nombre) {
//     const worksheet = XLSX.utils.aoa_to_sheet(this.worksheetData);
//     const workbook = XLSX.utils.book_new();

//     worksheet["!cols"] = this.calculaAnchos();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
//     XLSX.writeFile(workbook, `${Nombre}.xlsx`);
//   }
//   setCondition(conditionColumn, conditionFunction) {
//     this.conditionColumn = conditionColumn;
//     this.condition = conditionFunction;
//   }
//   // setColumnas(columns) {
//   //   this.columns = columns;
//   // }
//   // addData(row) {
//   //   this.data.push(row);
//   // }
//   saltarFila() {
//     const emptyRow = new Array(this.columns.length).fill("");
//     this.addData(emptyRow);
//   }
// }
import * as ExcelJS from "exceljs";
import {
  formatDate,
  formatTime,
  formatFecha,
  format_Fecha_String,
} from "./globalfn";

export class ReporteExcel {
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

  setColumnas(columnas) {
    this.columns = columnas;
    const headerRow = columnas.map((col) => col.header);
    this.addRow(headerRow);
  }

  addData(data) {
    data.forEach((row) => {
      let rowData = this.columns.map((col) => {
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
