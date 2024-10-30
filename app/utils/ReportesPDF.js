import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  format_Fecha_String,
  formatDate,
  formatTime,
} from "@/app/utils/globalfn";

export class ReportePDF {
  //constructor del nuevo reporte, acepta un JSON de configuracion
  //tw_ren = al valor de la cordenada Y ese aumenta para pasar de renglon
  //tw_endRen = al valor limite de la hoja en alto
  //tiene_encabezado = indica si la pagina ya se imprimio el encabezado del reporte
  //doc = instancia de jsPDF

  constructor(configuracion, orientacion) {
    this.configuracion = configuracion;
    this.tw_ren = 0;
    this.tw_endRen = 280;
    this.tw_endRenH = 200;
    this.tiene_encabezado = false;
    this.doc = new jsPDF(orientacion);
  }

  //Imprime un texto, recibe como parametro el texto, la cordenada x y la cordenada y
  ImpPosX(texto, x, y, maxLength = 0, aln = "L") {
    var textoC = texto.substring(0, maxLength);
    let alinear = "";
    switch (aln) {
      case "L":
        alinear = "left";
        break;
      case "C":
        alinear = "center";
        break;
      case "R":
        alinear = "right";
        break;
      case "J":
        alinear = "justify";
        break;
      default:
        alinear = "L";
        break;
    }
    if (texto.length >= maxLength && maxLength > 0) {
      this.doc.text(textoC, x, y, { align: alinear });
    } else {
      this.doc.text(texto, x, y, { align: alinear });
    }
  }

  //Obtiene el numero de paginas
  getNumberPages() {
    return this.doc.internal.getNumberOfPages();
  }
  //Establece el tamaño de la fuente
  setFontSize(fontSize) {
    this.doc.setFontSize(fontSize);
  }
  //Aumenta el valor en la variable tw_ren(y) para escribir un nuevo renglon
  nextRow(value) {
    this.tw_ren += value;
  }
  //Establece un valor especifico a tw_ren(y)
  setTw_Ren(value) {
    this.tw_ren = value;
  }
  //Imprime una linea en el valor que se encuentre Tw_Ren
  printLineV() {
    this.doc.line(14, this.tw_ren, 200, this.tw_ren);
  }
  printLineH() {
    this.doc.line(14, this.tw_ren, 286, this.tw_ren);
  }

  printLineF() {
    this.doc.line(5, this.tw_ren, 295, this.tw_ren);
  }
  printLineZ() {
    this.doc.line(185, this.tw_ren, 286, this.tw_ren);
  }
  printLine(x1,x2){
    this.doc.line(x1, this.tw_ren, x2, this.tw_ren);
  }
  //añade una nueva pagina al documento
  addPage() {
    this.doc.addPage();
  }
  //Hace un salto de pagina y prepara las variables para empezar desde el encabezado
  //Para hoja vertical
  pageBreak() {
    if (this.tw_ren >= this.tw_endRen) {
      this.tiene_encabezado = false;
      this.tw_ren = 0;
      this.addPage();
      this.doc.setPage(this.getNumberPages());
    }
  }

  //Para hoja Horizontal
  pageBreakH() {
    if (this.tw_ren >= this.tw_endRenH) {
      this.tiene_encabezado = false;
      this.tw_ren = 0;
      this.addPage();
      this.doc.setPage(this.getNumberPages());
    }
  }

  //Imprime el encabezado principal de todos los reportes
  //Para la impresion Vertical
  imprimeEncabezadoPrincipalV() {
    const { Encabezado } = this.configuracion;
    const ImagenL = "resources/Logo_Interaccion.png";

    if (!this.tiene_encabezado) {
      this.doc.addImage(ImagenL, "PNG", 10, 10, 26, 25);
      this.setFontSize(14);
      this.setTw_Ren(16);
      this.ImpPosX(Encabezado.Nombre_Aplicacion, 35, this.tw_ren);
      this.setFontSize(10);
      this.nextRow(6);
      this.ImpPosX(Encabezado.Nombre_Reporte, 35, this.tw_ren);
      this.nextRow(6);
      this.setFontSize(10);
      this.ImpPosX(Encabezado.Nombre_Usuario, 35, this.tw_ren);
      const date = new Date();
      const dateStr = formatDate(date);
      const timeStr = formatTime(date);
      this.setTw_Ren(16);
      this.ImpPosX(`Fecha: ${dateStr}`, 150, this.tw_ren);
      this.nextRow(6);
      this.ImpPosX(`Hora: ${timeStr}`, 150, this.tw_ren);
      this.nextRow(6);
      this.ImpPosX(`Hoja: ${this.getNumberPages()}`, 150, this.tw_ren);
    }
  }

  //impresion de pagos1

  imprimeEncabezadoPrincipalP(body, fecha) {
    const { Encabezado } = this.configuracion;
    const ImagenL = "resources/Logo_Interaccion.png";
    if (!this.tiene_encabezado) {
      this.doc.addImage(ImagenL, "PNG", 10, 10, 26, 25);
      this.setFontSize(14);
      this.setTw_Ren(16);
      this.ImpPosX(Encabezado.Nombre_Aplicacion, 35, this.tw_ren);
      this.setFontSize(10);
      this.nextRow(6);
      this.ImpPosX(Encabezado.Nombre_Reporte, 35, this.tw_ren);
      this.nextRow(6);
      this.setFontSize(10);
      this.ImpPosX(Encabezado.Nombre_Usuario, 35, this.tw_ren);
      const date = new Date();
      const dateStr = formatDate(date);
      const timeStr = formatTime(date);
      this.setTw_Ren(16);
      this.ImpPosX(`Fecha: ${dateStr}`, 250, this.tw_ren);
      this.nextRow(6);
      this.ImpPosX(`Hora: ${timeStr}`, 250, this.tw_ren);
      this.nextRow(6);
      this.ImpPosX(`Hoja: ${this.getNumberPages()}`, 250, this.tw_ren);
      this.nextRow(6);
      this.ImpPosX(`Fecha Pago: ${fecha}`, 35, this.tw_ren);
      this.ImpPosX(`Num Recibo: ${body.numero_recibo}`, 80, this.tw_ren);
      this.ImpPosX(
        `Tipo Pago: ${body.forma_pago_descripcion}`,
        120,
        this.tw_ren
      );
      this.nextRow(6);
      this.ImpPosX(`Comentario: ${body.comentario}`, 35, this.tw_ren);
      this.ImpPosX(
        `Num. Alumno: ${body.alumno_seleccionado}`,
        120,
        this.tw_ren
      );
    }
  }

  //Para la impresion Horizontal
  imprimeEncabezadoPrincipalH() {
    const { Encabezado } = this.configuracion;

    //la imagen tiene que ser en png para que la imprima
    const ImagenL = "resources/Logo_Interaccion.png";
    if (!this.tiene_encabezado) {
      this.doc.addImage(ImagenL, "PNG", 10, 10, 26, 25);
      this.setFontSize(14);
      this.setTw_Ren(16);
      this.ImpPosX(Encabezado.Nombre_Aplicacion, 35, this.tw_ren);
      this.setFontSize(10);
      this.nextRow(6);
      this.ImpPosX(Encabezado.Nombre_Reporte, 35, this.tw_ren);
      this.nextRow(6);
      this.setFontSize(10);
      this.ImpPosX(Encabezado.Nombre_Usuario, 35, this.tw_ren);
      const date = new Date();
      const dateStr = formatDate(date);
      const timeStr = formatTime(date);
      this.setTw_Ren(16);
      this.ImpPosX(`Fecha: ${dateStr}`, 250, this.tw_ren);
      this.nextRow(6);
      this.ImpPosX(`Hora: ${timeStr}`, 250, this.tw_ren);
      this.nextRow(6);
      this.ImpPosX(`Hoja: ${this.getNumberPages()}`, 250, this.tw_ren);
    }
  }
  generateTable(headers, data) {
    this.doc.autoTable({
      head: [headers], // Encabezados de las columnas
      body: data, // Datos de la tabla
      startY: this.tw_ren + 10, // Posición Y donde empieza la tabla
      theme: "plain", // Tema de la tabla
      // headStyles: { fillColor: [255, 255, 255],textColor: [0, 0, 0]  }, // Estilos para la cabecera
      styles: { fontSize: 10,lineWidth:0.5,lineColor:[211, 211, 211] }, // Estilos generales
      margin: { top: 10 },
      didDrawPage: (data) => {
        // Callback para agregar encabezado en cada página
        if (!this.tiene_encabezado) {
          this.imprimeEncabezadoPrincipalV(); // Cambia a H si es horizontal
          this.tiene_encabezado = true;
        }
      },
    });
    this.tw_ren = this.doc.lastAutoTable.finalY; // Actualiza tw_ren con la posición final de la tabla
  }
  //Guarda el reporte (rrecibe como parametro el nombre del reporte)
  guardaReporte(Nombre) {
    this.doc.save(`${Nombre}.pdf`);
  }
}
