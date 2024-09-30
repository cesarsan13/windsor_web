"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ModalCajeroPago from "@/app/pagos1/components/modalCajeroPago";
import ModalDocTabla from "@/app/pagos1/components/modalDocTabla";
import Acciones from "@/app/pagos1/components/Acciones";
import { useForm } from "react-hook-form";
import {
  buscaDocumentosCobranza,
  buscaPropietario,
  guardarDocumento,
  buscaDocumento,
  validarClaveCajero,
  buscarArticulo,
} from "@/app/utils/api/pagos1/pagos1";
import { getFormasPago } from "@/app/utils/api/formapago/formapago";
import { getAlumnos } from "@/app/utils/api/alumnos/alumnos";
import { Elimina_Comas, formatNumber, pone_ceros, format_Fecha_String } from "@/app/utils/globalfn";
import Button from "@/app/components/button";
import Tooltip from "@/app/components/tooltip";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import Inputs from "@/app/pagos1/components/Inputs";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
import BuscarCat from "@/app/components/BuscarCat";
import TablaPagos1 from "@/app/pagos1/components/tablaPagos1";
import TablaDoc from "@/app/pagos1/components/tablaDoc";
import ModalPagoImprime from "@/app/pagos1/components/modalPagosImprime";
import { showSwal, showSwalAndWait } from "@/app/utils/alerts";
import Swal from "sweetalert2";
function Pagos_1() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formaPago, setFormaPago] = useState([]);
  const [formaPagoPage, setformaPagoPage] = useState({});
  const [cajero, setCajero] = useState({});
  const [alumnos1, setAlumnos1] = useState({});
  const [comentarios1, setComentarios1] = useState({});
  const [productos1, setProductos1] = useState({});
  const nameInputs = ["numero", "nombre_completo"];
  const columnasBuscaCat = ["numero", "nombre_completo"];
  const nameInputs2 = ["numero", "comentario_1"];
  const columnasBuscaCat2 = ["numero", "comentario_1"];
  const nameInputs3 = ["numero", "descripcion"];
  const columnasBuscaCat3 = ["numero", "descripcion"];
  const [pagos, setPagos] = useState([]);
  const [pago, setPago] = useState({});
  let [pagosFiltrados, setPagosFiltrados] = useState([]);
  const [validar, setValidar] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  // const [TB_Busqueda, setTB_Busqueda] = useState("");
  // const [pdfPreview, setPdfPreview] = useState(false);
  // const [pdfData, setPdfData] = useState("");
  const [precio_base, setPrecioBase] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [h1Total, setH1Total] = useState("0.00");
  const [muestraRecargos, setMuestraRecargos] = useState(false);
  const [muestraParciales, setMuestraParciales] = useState(false);
  const [dRecargo, setDrecargo] = useState("");
  const [selectedTable, setSelectedTable] = useState({});
  const [cargado, setCargado] = useState(false);
  const [docFiltrados, setdDocFiltrados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: 0,
      alumno: 0,
      descripcion: "",
      fecha: "",
      comentarios: "",
      precio_base: 0,
      cantidad_producto: 1,
      documento: "",
      precio: 0,
      neto: 0,
      total: 0,
      descuento: 0,
      recargo: 0,
      monto_parcial: 0,
      clave_acceso: "",
      // D_Recargo: '',
      // R_Articulo: '',
    },
  });

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const formattedToday = `${yyyy}-${mm}-${dd}`;
      document.getElementById("fecha").value = formattedToday;
      if (cargado === false) {
        const [dataF, dataA] = await Promise.all([
          getFormasPago(session.user.token, false),
          getAlumnos(session.user.token, false),
        ]);
        setAlumnos(dataA);
        setFormaPago(dataF);
        setCargado(true);
      }
      if (!validar) {
        showModal(true);
      } else {
        showModal(false);
      }
      setisLoading(false);
    };
    fetchData();
  }, [session, status, validar, cargado]);

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const costo = formatNumber(productos1.costo);
      if (costo === 0) {
        setColorInput("bg-[#HFFFF00]");
      }
      setPrecioBase(costo);
      setisLoading(false);
    };
    fetchData();
  }, [productos1]);

  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };

  const showModal2 = (show) => {
    show
      ? document.getElementById("my_modal_4").showModal()
      : document.getElementById("my_modal_4").close();
  };

  const showModal3 = (show) => {
    show
      ? document.getElementById("my_modal_5").showModal()
      : document.getElementById("my_modal_5").close();
  };

  const home = () => {
    router.push("/");
  };

  const Documento = (event) => {
    event.preventDefault();
    handleSubmit(submitDocumento)();
  };

  const submitDocumento = async (data) => {
    const { token } = session.user;
    let newData = {};
    let alumnoInvalido = alumnos1.numero;
    if (!alumnoInvalido) {
      showSwal("Oppss!", "Alumno invalido", "error");
      return;
    }
    const dataR = await buscaDocumentosCobranza(token, alumnos1.numero);
    if (dataR.length > 0) {
      setdDocFiltrados([]);
      for (const item of dataR) {
        const importeConDescuento =
          item.importe - item.importe * (item.descuento / 100);
        const diferencia = parseFloat(importeConDescuento.toFixed(2));
        if (parseFloat((diferencia - item.importe_pago).toFixed(2)) > 0) {
          newData = {
            numero: item.numero_doc,
            paquete: item.producto,
            fecha: item.fecha,
          };
          if (parseFloat(item.importe_pago.toFixed(2)) > 0) {
            const Tw_Trabajo = parseFloat(importeConDescuento.toFixed(2));
            const saldoF = parseFloat(
              (Tw_Trabajo - item.importe_pago).toFixed(2)
            );
            newData.saldo = formatNumber(saldoF);
            newData.descuento = "0.00";
          } else {
            const saldoF = parseFloat(item.importe.toFixed(2));
            newData.saldo = formatNumber(saldoF);
            const descF = parseFloat(item.descuento.toFixed(2));
            newData.descuento = formatNumber(descF);
          }
        }
      }
      setdDocFiltrados((prevPagos) => [...prevPagos, newData]);
      showModal3(true);
    } else {
      showSwal("Oppss!", "No hay documentos para cobro", "error");
    }
  };

  const Recargos = async () => {
    let recargo;
    let prod = productos1.numero;
    let alumnoInvalido = alumnos1.numero;
    if (!alumnoInvalido) {
      showSwal("Oppss!", "Alumno invalido", "error");
      return;
    }
    const [arFind, ar9999] = await Promise.all([
      BuscaArticulo(prod),
      BuscaArticulo(9999),
    ]);
    let desPr = ar9999.descripcion;
    if (arFind) {
      recargo = formatNumber(arFind.pro_recargo);
    } else {
      recargo = formatNumber(0);
    }
    if (desPr) {
      setDrecargo(desPr);
      setMuestraRecargos(true);
    } else {
      setDrecargo("");
      setMuestraRecargos(false);
    }
  };

  const Parciales = async () => {
    let alumnoInvalido = alumnos1.numero;
    if (!alumnoInvalido) {
      showSwal("Oppss!", "Alumno invalido", "error");
      return;
    }
    setMuestraParciales(!muestraParciales);
  };

  const btnParciales = (event) => {
    event.preventDefault();
    handleSubmit(submitParicales)();
  };

  const submitParicales = async (data) => {
    let Monto_Pago;
    let Monto_Actual;
    let A_Pagar;
    let Doc_Ant = 0;
    let Arma_Doc;
    let res;
    let res2;
    let fecha = data.fecha;
    const { token } = session.user;
    let validar = selectedTable.numero;

    if (!validar) {
      showSwal("Error!", "No hay ningun articulo seleccionado' ", "error");
      return;
    }
    Monto_Pago = Elimina_Comas(data.monto_parcial);
    if (Monto_Pago === 0) {
      showSwal("Error!", "Monto del pago parcial en cero' ", "error");
      return;
    }
    const dat = await buscaPropietario(token, 1);
    const clave = dat.clave_seguridad;
    if (data.clave_acceso.toLowerCase() !== clave.toLowerCase()) {
      showSwal("Error!", "Clave de autorización invalida' ", "error");
      return;
    }
    Monto_Actual = Elimina_Comas(h1Total);
    if (Monto_Pago > Monto_Actual) {
      showSwal("", "El monto del pago parcial es mayor al pago total", "info");
      return;
    }
    A_Pagar = Monto_Actual - Monto_Pago;
    if (A_Pagar > Monto_Actual) {
      showSwal(
        "",
        "El se debe de aplicar a la partida indicada pero la cantidad restante. Es mayor al valor de la partida",
        "info"
      );
      return;
    }

    Swal.fire({
      title: "Es correcta la cantidad a cobrar en pago parcial?",
      text: "Una vez que se autoriza será generado el documento a cobranza. Esta completamente seguro que la operación es correcta",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!fecha) {
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const dd = String(today.getDate()).padStart(2, "0");
          fecha = `${yyyy}-${mm}-${dd}`;
        }
        if (!data.fecha) {
          data.fecha = format_Fecha_String(fecha);
        }
        const dateObject = new Date(fecha);
        const year = dateObject.getFullYear();
        Arma_Doc = year;
        const mes = parseInt(data.fecha.substring(5, 7));
        const dia = data.fecha.substring(6, 7);
        if (mes < 10) {
          Arma_Doc += "0" + dia;
        } else {
          Arma_Doc += data.fecha.substring(5, 7);
        }
        Doc_Ant = Arma_Doc;
        const newData = {
          alumno: selectedTable.alumno || 0,
          producto: selectedTable.numero || 0,
          numero_doc: Doc_Ant || 0,
          fecha: data.fecha || "",
          descuento: 0,
          importe: A_Pagar || 0,
        };
        res = await buscaDocumento(token, newData);
        if (res.status) {
          res2 = await guardarDocumento(token, newData);
        } else {
          showSwal(
            "",
            "El documento a generar ya existe no se realiza el proceso",
            "info"
          );
          return;
        }
      } else {
        return;
      }
    });
  };
  const btnRecargo = (event) => {
    event.preventDefault();
    handleSubmit(submitRecargo)();
  };

  const submitRecargo = async (data) => {
    if (dRecargo) {
      return;
    }
    const recargo = formatNumber(data.recargo);
    const total = data.recargo * data.cantidad_producto;
    const totalFormat = formatNumber(total);
    const nuevoPago = {
      precio_base: recargo || 0,
      neto: recargo || 0,
      total: totalFormat || 0,
      alumno: alumnos1.numero || 0,
      numero: 9999,
      descripcion: dRecargo || "",
      cantidad_producto: data.cantidad_producto || 0,
      documento: "",
      descuento: 0,
    };
    const numeroExiste = pagos.some((pago) => pago.numero === nuevoPago.numero);
    if (numeroExiste) {
      showSwal("Oppss!", "Numero de articulo existente en recibo' ", "error");
      setMuestraRecargos(false);
      return;
    }
    muestraTotal(nuevoPago);
    setPagos((prevPagos) => [...prevPagos, nuevoPago]);
    setPagosFiltrados((prevPagos) => [...prevPagos, nuevoPago]);
    setMuestraRecargos(false);
  };

  const btnPDF = (event) => {
    event.preventDefault();
    handleSubmit(ImprimePDF)();
  };

  const ImprimePDF = async (data) => {
    let fecha = data.fecha;
    if (!fecha) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      fecha = `${dd}-${mm}-${yyyy}`;
    }
    let alumnoInvalido = alumnos1.numero;
    if (!alumnoInvalido) {
      showSwal("Oppss!", "Alumno invalido", "error");
      return;
    }
    if (h1Total <= 0) {
      showSwal("Oppss!", "El monto total debe ser mayor a 0", "error");
      return;
    }
    let dataP = await buscaPropietario(session.user.token, 1);
    const formaPagoFind = formaPago.find((forma) => forma.numero === 1);
    const newData = {
      pago: h1Total || 0,
      recibo: dataP.con_recibos || 0,
      forma_pago_id: formaPagoFind.numero || 0,
      comentario_ad: data.comentarios || "",
      fecha: fecha || "",
    };
    setformaPagoPage(newData);
    showModal2(true);
  };

  const BuscaArticulo = async (numero) => {
    let res;
    const { token } = session.user;
    res = await buscarArticulo(token, numero);
    return res.data;
  };

  const muestraTotal = (data) => {
    const dataTotal = parseFloat(data.total.replace(/,/g, ""));
    const nuevoTotal = pagosFiltrados.reduce(
      (acc, pago) => acc + parseFloat(pago.total.replace(/,/g, "")),
      dataTotal
    );
    const formateado = formatNumber(nuevoTotal);
    setH1Total(formateado);
  };

  const EliminarCampo = (data) => {
    const index = pagos.findIndex((p) => p.numero === data.numero);
    if (index !== -1) {
      const pFiltrados = pagos.filter((p) => p.numero !== data.numero);
      const fTotal = Elimina_Comas(h1Total);
      const dTotal = Elimina_Comas(data.total);
      let restaTotal = fTotal - dTotal;
      if (!restaTotal) {
        restaTotal = "0";
      }
      const total = formatNumber(restaTotal);
      setH1Total(total);
      setPagos(pFiltrados);
      setPagosFiltrados(pFiltrados);
    }
  };

  const handleEnterKey = async (data) => {
    let productoInvalido = productos1.numero;
    if (!productoInvalido) {
      showSwal("Oppss!", "Producto invalido", "error");
      return;
    }
    let alumnoInvalido = alumnos1.numero;
    if (!alumnoInvalido) {
      showSwal("Oppss!", "Alumno invalido", "error");
      return;
    }
    const precio = Elimina_Comas(precio_base);
    const total = precio * data.cantidad_producto;
    const totalFormat = formatNumber(total);
    const nuevoPago = {
      precio_base: precio_base || 0,
      neto: precio_base || 0,
      total: totalFormat || 0,
      alumno: alumnos1.numero || 0,
      numero: productos1.numero || 0,
      descripcion: productos1.descripcion || "",
      cantidad_producto: data.cantidad_producto || 0,
      documento: "",
      descuento: 0,
    };
    const numeroExiste = pagos.some((pago) => pago.numero === nuevoPago.numero);
    if (numeroExiste) {
      showSwal("Oppss!", "Numero de articulo existente en recibo' ", "error");
      return;
    }
    muestraTotal(nuevoPago);
    setPagos((prevPagos) => [...prevPagos, nuevoPago]);
    setPagosFiltrados((prevPagos) => [...prevPagos, nuevoPago]);
  };

  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setPago((pago) => ({
        ...pago,
        [evt.target.name]: pone_ceros(evt.target.value, 0, true),
      }))
      : setPago((pago) => ({
        ...pago,
        [evt.target.name]: pone_ceros(evt.target.value, 2, true),
      }));
  };

  const handleKeyDown = (event) => {
    const key = event.key;
    if (key === "Enter") {
      event.preventDefault();
      handleSubmit(handleEnterKey)();
      return;
    }
    if (
      key === "Backspace" ||
      key === "Tab" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "Delete" ||
      key === "Escape"
    ) {
      return;
    }
    if (!/^\d$/.test(key)) {
      event.preventDefault();
    }
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <div className="h-[83vh] max-h-[83vh] container w-full bg-slate-100 rounded-3xl shadow-xl px-3 dark:bg-slate-700 overflow-y-auto">
        <ModalCajeroPago
          session={session}
          validarClaveCajero={validarClaveCajero}
          showModal={showModal}
          setValidar={setValidar}
          home={home}
          setCajero={setCajero}
          cajero={cajero}
        />
        <ModalPagoImprime
          session={session}
          showModal={showModal2}
          home={home}
          formaPagoPage={formaPagoPage}
          pagosFiltrados={pagosFiltrados}
          alumnos1={alumnos1}
          productos1={productos1}
          comentarios1={comentarios1}
          cajero={cajero}
          alumnos={alumnos}
        />
        <ModalDocTabla
          session={session}
          showModal={showModal3}
          docFiltrados={docFiltrados}
          isLoading={isLoading}
        />

        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Acciones
                ImprimePDF={btnPDF}
                home={home}
                Documento={Documento}
                Recargos={Recargos}
                Parciales={Parciales}
              />
              <h1 className="text-4xl font-xthin text-black dark:text-white">
                Pagos.
              </h1>
            </div>
            <h1 className="text-4xl font-xthin text-black dark:text-white ml-auto">
              {h1Total}
            </h1>
          </div>
        </div>


        {/* <div className="flex justify-start p-3">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
            Pagos.
          </h1>
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12 ml-auto">
            {h1Total}
          </h1>
        </div> */}

        <div className="grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
          {/* <div className="col-span-1 flex flex-col">
            <Acciones
              ImprimePDF={btnPDF}
              home={home}
              Documento={Documento}
              Recargos={Recargos}
              Parciales={Parciales}
            />
          </div> */}

          <div className="col-span-7">
            <div className="flex flex-col md:flex-row lg:flex-row pb-4">
              <Inputs
                tipoInput={""}
                name={"fecha"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Fecha: "}
                type={"date"}
                requerido={false}
                register={register}
                errors={errors}
                maxLength={15}
                isDisabled={false}
              // setValue={setFecha}
              />
            </div>

            <div className="flex flex-col md:flex-row lg:flex-row ">
              <div className="w-full">
                <BuscarCat
                  table="alumnos"
                  itemData={[]}
                  fieldsToShow={columnasBuscaCat}
                  nameInput={nameInputs}
                  titulo={"Alumnos: "}
                  setItem={setAlumnos1}
                  token={session.user.token}
                  modalId="modal_alumnos1"
                />
              </div>
              <div className="w-full">
                <BuscarCat
                  table="comentarios"
                  itemData={[]}
                  fieldsToShow={columnasBuscaCat2}
                  nameInput={nameInputs2}
                  titulo={"Comentario: "}
                  setItem={setComentarios1}
                  token={session.user.token}
                  modalId="modal_comentarios1"
                />
              </div>
            </div>
            <div className="pb-4">
              <Inputs
                name={"comentarios"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Comentarios: "}
                requerido={false}
                type={"text"}
                register={register}
                errors={errors}
                maxLength={15}
                isDisabled={false}
              />
            </div>
            <div className="flex flex-col md:flex-row lg:flex-row ">
              <BuscarCat
                table="productos"
                itemData={[]}
                fieldsToShow={columnasBuscaCat3}
                nameInput={nameInputs3}
                titulo={"Articulos: "}
                setItem={setProductos1}
                token={session.user.token}
                modalId="modal_articulos1"
              />
              <Inputs
                tipoInput={"enterEvent"}
                dataType={"int"}
                name={"cantidad_producto"}
                tamañolabel={""}
                className={`${colorInput}`}
                Titulo={"Cantidad: "}
                type={"text"}
                requerido={false}
                errors={errors}
                register={register}
                message={"numero requerido"}
                isDisabled={false}
                eventInput={handleKeyDown}
                handleBlur={handleBlur}
                maxLength={8}
              />
            </div>
            <div className="pb-3">
              <Inputs
                tipoInput={"numberDouble"}
                dataType={"double"}
                name={"precio_base"}
                tamañolabel={"w-1/2"}
                className={`w-1/2 text-right ${colorInput}`}
                Titulo={"Precio Base: "}
                type={"text"}
                requerido={false}
                errors={errors}
                register={register}
                message={"numero requerido"}
                isDisabled={false}
                valueInput={precio_base}
                eventInput={handleBlur}
                maxLength={8}
              />
            </div>

            {muestraRecargos && (
              <div className="flex flex-col md:flex-row lg:flex-row lg:space-x-2 ">
                <div className="w-full lg:w-auto pb-2 lg:pb-0 mt-0 mb-0">
                  <Inputs
                    tipoInput={"disabledInput"}
                    name={"R_Articulo"}
                    tamañolabel={""}
                    className={""}
                    Titulo={"Articulo: "}
                    type={"text"}
                    requerido={false}
                    register={register}
                    errors={errors}
                    maxLength={10}
                    isDisabled={true}
                    valueInput={"9999"}
                  />
                </div>
                <div className="w-full lg:w-auto pb-2 lg:pb-0 mt-0 mb-0">
                  <Inputs
                    tipoInput={"disabledInput"}
                    name={"D_Recargo"}
                    tamañolabel={""}
                    className={""}
                    Titulo={"Articulo: "}
                    type={"text"}
                    requerido={false}
                    register={register}
                    errors={errors}
                    maxLength={10}
                    isDisabled={true}
                    valueInput={dRecargo}
                  />
                </div>
                <div className="w-full lg:w-auto pb-2 lg:pb-0 mt-0 mb-0 flex">
                  <Inputs
                    tipoInput={""}
                    dataType={"double"}
                    name={"recargo"}
                    tamañolabel={""}
                    className={"rounded-l block grow text-right"}
                    Titulo={" "}
                    type={"text"}
                    requerido={false}
                    register={register}
                    errors={errors}
                    maxLength={8}
                    isDisabled={false}
                  />
                  <Tooltip Titulo={"Adiciona"} posicion={"tooltip-top"}>
                    <Button
                      icono={"fa-solid fa-circle-plus"}
                      onClick={btnRecargo}
                      className="rounded-r"
                    ></Button>
                  </Tooltip>
                </div>
              </div>
            )}

            {muestraParciales && (
              <div className="flex flex-col md:flex-row lg:flex-row lg:space-x-2">
                <div className="w-full lg:w-auto pb-2 lg:pb-0 mt-0 mb-0">
                  <Inputs
                    tipoInput={""}
                    dataType={"double"}
                    name={"monto_parcial"}
                    tamañolabel={""}
                    className={"rounded block grow text-right"}
                    Titulo={"Monto Parcial: "}
                    type={"text"}
                    requerido={false}
                    register={register}
                    errors={errors}
                    maxLength={8}
                    isDisabled={false}
                  />
                </div>
                <div className="w-full lg:w-auto pb-2 lg:pb-0 mt-0 mb-0 flex">
                  <Inputs
                    tipoInput={""}
                    dataType={"string"}
                    name={"clave_acceso"}
                    tamañolabel={""}
                    className={"rounded block grow text-right"}
                    Titulo={"Acceso: "}
                    type={"password"}
                    requerido={false}
                    register={register}
                    errors={errors}
                    maxLength={15}
                    isDisabled={false}
                  />
                  <Tooltip Titulo={"Actualiza"} posicion={"tooltip-top"}>
                    <Button
                      icono={"fa-solid fa-circle-plus"}
                      onClick={btnParciales}
                    ></Button>
                  </Tooltip>
                </div>
              </div>
            )}
            <div className="pb-5">
              <TablaPagos1
                isLoading={isLoading}
                pagosFiltrados={pagosFiltrados}
                setPagos={setPagos}
                setAccion={setAccion}
                setSelectedTable={setSelectedTable}
                deleteRow={EliminarCampo}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pagos_1;
