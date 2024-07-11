import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatDate, formatTime } from "@/app/utils/globalfn";

export class ReportePDF {
  //constructor del nuevo reporte, acepta un JSON de configuracion
  //tw_ren = al valor de la cordenada Y ese aumenta para pasar de renglon
  //tw_endRen = al valor limite de la hoja en alto
  //tiene_encabezado = indica si la pagina ya se imprimio el encabezado del reporte
  //doc = instancia de jsPDF
  constructor(configuracion) {
    this.configuracion = configuracion;
    this.tw_ren = 0;
    this.tw_endRen = 280;
    this.tiene_encabezado = false;
    this.doc = new jsPDF();
  }
  //Imprime un texto, recibe como parametro el texto, la cordenada x y la cordenada y
  ImpPosX(texto, x, y) {
    this.doc.text(texto, x, y);
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
  printLine() {
    this.doc.line(14, this.tw_ren, 200, this.tw_ren);
  }
  //añade una nueva pagina al documento
  addPage() {
    this.doc.addPage();
  }
  //Hace un salto de pagina y prepara las variables para empezar desde el encabezado
  pageBreak() {
    if (this.tw_ren >= this.tw_endRen) {
      this.tiene_encabezado = false;
      this.tw_ren = 0;
      this.addPage();
      this.doc.setPage(this.getNumberPages());
      //   this.imprimeEncabezadoPrincipal();
    }
  }
  //Imprime el encabezado principal de todos los reportes
  imprimeEncabezadoPrincipal() {
    const { Encabezado } = this.configuracion;
    if (!this.tiene_encabezado) {
      this.setFontSize(14);
      this.setTw_Ren(16);
      this.ImpPosX(Encabezado.Nombre_Aplicacion, 14, this.tw_ren);
      this.setFontSize(10);
      this.nextRow(6);
      this.ImpPosX(Encabezado.Nombre_Reporte, 14, this.tw_ren);
      this.nextRow(6);
      this.setFontSize(10);
      this.ImpPosX(Encabezado.Nombre_Usuario, 14, this.tw_ren);
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
  //Guarda el reporte (rrecibe como parametro el nombre del reporte)
  guardaReporte(Nombre) {
    this.doc.save(`${Nombre}.pdf`);
  }
}
