import { ReportePDF } from "../../ReportesPDF";

export const getDetallePedido = async (
  token,
  fecha1,
  fecha2,
  articulo,
  artFin
) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/cobranzaProducto/${fecha1}/${fecha2}/${articulo}/${artFin}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const resJson = await res.json();
  console.log(resJson);
  return resJson.data;
};

export const getTrabRepCobr = async (token, orden) => {
  const porNombre = orden === "nombre" ? 1 : 0;
  const res = await fetch(
    `${process.env.DOMAIN_API}api/cobranzaProducto/info/${porNombre}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const resJson = await res.json();
  console.log(resJson);
  return resJson.data;
};

export const insertTrabRepCobr = async (token, data) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/cobranzaProducto/insert`,
    {
      method: "POST",
      body: JSON.stringify({
        recibo: data.recibo,
        fecha: data.fecha,
        articulo: data.articulo,
        documento: data.documento,
        alumno: data.alumno,
        nombre: data.nombre,
        importe: data.importe,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
    }
  );
  const resJson = await res.json();
  return resJson;
};

export const Imprimir = (configuracion)=>{
    const newPDF = new ReportePDF(configuracion)
    Enca1(newPDF)
}
const Enca1 = (doc)=>{
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Alumno", 14, doc.tw_ren);
        doc.ImpPosX("Nombre", 28, doc.tw_ren);
        doc.ImpPosX("Producto", 108, doc.tw_ren);
        doc.ImpPosX("Descripcion", 128, doc.tw_ren);
        doc.ImpPosX("Fecha", 208, doc.tw_ren);
        doc.ImpPosX("Saldo", 228, doc.tw_ren);
        doc.ImpPosX("Total", 248, doc.tw_ren);
        doc.ImpPosX("Telefono", 268, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
}
