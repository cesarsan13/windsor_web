"use client";
import BuscarCat from "@/app/components/BuscarCat";
import React from "react";
import { useRouter } from "next/navigation";
import ModalCajeroPago from "@/app/pagos1/components/modalCajeroPago";
import ModalDocTabla from "@/app/pagos1/components/modalDocTabla";
import ModalNuevoRegistro from "@/app/pagos1/components/modalNuevoRegistro";
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
import {
  Elimina_Comas,
  formatNumber,
  pone_ceros,
  format_Fecha_String,
} from "@/app/utils/globalfn";
import Button from "@/app/components/button";
import Tooltip from "@/app/components/tooltip";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import Inputs from "@/app/pagos1/components/Inputs";
import TablaPagos1 from "@/app/pagos1/components/tablaPagos1";
import ModalPagoImprime from "@/app/pagos1/components/modalPagosImprime";
import { showSwal } from "@/app/utils/alerts";
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

  const [pagos, setPagos] = useState([]);
  const [pago, setPago] = useState({});
  let [pagosFiltrados, setPagosFiltrados] = useState([]);
  const [validar, setValidar] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
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
  const [accionB, setAccionB] = useState("");
  const [bloqueaEncabezado, setBloqueaEncabezado] = useState(false);

  const nameInputs = ["numero", "nombre_completo"];
  const columnasBuscaCat = ["numero", "nombre_completo"];
  const nameInputs2 = ["numero", "comentario_1"];
  const columnasBuscaCat2 = ["numero", "comentario_1"];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero_producto: 0,
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
    },
  });
  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      if (!validar) {
        showModal("my_modal_3", true);
      } else {
        showModal("my_modal_3", false);
      }
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const formattedToday = `${yyyy}-${mm}-${dd}`;
      setValue("fecha", formattedToday);
      // document.getElementById("fecha").value = formattedToday;
      if (cargado === false) {
        const [dataF, dataA] = await Promise.all([
          getFormasPago(session.user.token, false),
          getAlumnos(session.user.token, false),
        ]);
        setAlumnos(dataA);
        setFormaPago(dataF);
        setCargado(true);
      }
      setisLoading(false);
    };
    fetchData();
  }, [session, status, validar, cargado, setValue]);
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

  useEffect(() => {
    if (accionB === "Alta") {
      setAccionB("");
    }
  }, [accionB]);

  useEffect(() => {
    setBloqueaEncabezado(pagosFiltrados.length > 0);
  }, [pagosFiltrados]);

  const showModal = (id, show) => {
    show
      ? document.getElementById(id).showModal()
      : document.getElementById(id).close();
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
            newData.nombre_producto = item.nombre_producto || "";
            newData.alumno = item.alumno || "";
          }
        }
      }
      setdDocFiltrados((prevPagos) => [...prevPagos, newData]);
      showModal("my_modal_5", true);
    } else {
      showSwal("Oppss!", "No hay documentos para cobro", "error");
    }
  };

  const Recargos = async () => {
    let recargo = 0;
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
      recargo = formatNumber(arFind.por_recargo);
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
  const Alta = () => {
    showModal("modal_nuevo_registro", true);
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
    let validar = selectedTable.numero_producto;

    if (!validar) {
      showSwal("Error!", "No hay ningun articulo seleccionado ", "error");
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
          producto: selectedTable.numero_producto || 0,
          numero_doc: Doc_Ant || 0,
          fecha: data.fecha || "",
          descuento: 0,
          importe: A_Pagar || 0,
        };
        res = await buscaDocumento(token, newData);
        if (res.status) {
          res2 = await guardarDocumento(token, newData);
          if (res2.status) {
            showSwal(res2.alert_title, res2.alert_text, res2.alert_icon);
            setValue("monto_parcial", "");
            setValue("clave_acceso", "");
            setMuestraParciales(false);
          } else {
            showSwal(res2.alert_title, res2.alert_text, res2.alert_icon);
          }
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
    const numeroExiste = pagos.some(
      (pago) => pago.numero_producto === nuevoPago.numero_producto
    );
    if (numeroExiste) {
      showSwal("Oppss!", "Numero de articulo existente en recibo' ", "error");
      setMuestraRecargos(false);
      return;
    }
    const nuevoPagoArray = Array.isArray(nuevoPago) ? nuevoPago : [nuevoPago];

    muestraTotal(nuevoPago);
    setPagos((prevPagos) => [...prevPagos, ...nuevoPagoArray]);
    setPagosFiltrados((prevPagos) => [...prevPagos, ...nuevoPagoArray]);
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
    showModal("my_modal_4", true);
  };

  const BuscaArticulo = async (numero) => {
    let res;
    const { token } = session.user;
    res = await buscarArticulo(token, numero);
    return res.data;
  };

  const muestraTotal = (data) => {
    const dataTotal = data.total ? parseFloat(data.total.replace(/,/g, "")) : 0;
    const nuevoTotal = pagosFiltrados.reduce(
      (acc, pago) => acc + parseFloat(pago.total.replace(/,/g, "")),
      dataTotal
    );
    const formateado = formatNumber(nuevoTotal);
    setH1Total(formateado);
  };

  const EliminarCampo = (data) => {
    const index = pagos.findIndex(
      (p) => p.numero_producto === data.numero_producto
    );
    if (index !== -1) {
      const pFiltrados = pagos.filter(
        (p) => p.numero_producto !== data.numero_producto
      );
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
      showSwal("Oppss!", "Producto invalido", "error", "modal_nuevo_registro");
      return;
    }
    let alumnoInvalido = alumnos1.numero;
    if (!alumnoInvalido) {
      showSwal("Oppss!", "Alumno invalido", "error", "modal_nuevo_registro");
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
      numero_producto: productos1.numero || 0,
      descripcion: productos1.descripcion || "",
      cantidad_producto: data.cantidad_producto || 0,
      documento: "",
      descuento: 0,
    };
    const numeroExiste = pagos.some(
      (pago) => pago.numero_producto === nuevoPago.numero_producto
    );
    if (numeroExiste) {
      showSwal(
        "Oppss!",
        "Numero de articulo existente en recibo ",
        "error",
        "modal_nuevo_registro"
      );
      return;
    }
    const nuevoPagoArray = Array.isArray(nuevoPago) ? nuevoPago : [nuevoPago];

    muestraTotal(nuevoPago);
    setPagos((prevPagos) => [...prevPagos, ...nuevoPagoArray]);
    setPagosFiltrados((prevPagos) => [...prevPagos, ...nuevoPagoArray]);
    setValue("cantidad_producto", "1");
    setPrecioBase("");
    setAccionB("Alta");
    document.getElementById("numero_producto").focus();
  };

  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;

    setPago((pago) => ({
      ...pago,
      [evt.target.name]: pone_ceros(evt.target.value, 2, true),
    }));
    setValue(evt.target.name, pone_ceros(evt.target.value, 2, true));
  };
  const handleModalClick = (event) => {
    event.preventDefault();
    handleSubmit(handleEnterKey)();
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

  const tableSelect = (evt, item) => {
    console.log(item);
    const nuevoPago = {
      numero_producto: item.paquete,
      descripcion: item.nombre_producto,
      documento: "",
      cantidad_producto: 1,
      precio_base: item.paquete,
      descuento: item.descuento,
      neto: item.paquete,
      total: item.saldo,
      alumno: item.alumno,
    };
    const numeroExiste = pagos.some(
      (pago) => pago.numero_producto === nuevoPago.numero_producto
    );
    if (numeroExiste) {
      document.getElementById("my_modal_5").close();
      showSwal("Oppss!", "Numero de articulo existente en recibo", "error");
      return;
    }
    const nuevoPagoArray = Array.isArray(nuevoPago) ? nuevoPago : [nuevoPago];

    muestraTotal(nuevoPago);
    setPagos((prevPagos) => [...prevPagos, ...nuevoPagoArray]);
    setPagosFiltrados((prevPagos) => [...prevPagos, ...nuevoPagoArray]);
    document.getElementById("my_modal_5").close();
  };
  const handleInputClick = (evt) => {
    evt.preventDefault();
    evt.target.select();
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalNuevoRegistro
        session={session}
        setProductos1={setProductos1}
        register={register}
        errors={errors}
        accionB={accionB}
        colorInput={colorInput}
        precio_base={precio_base}
        handleKeyDown={handleKeyDown}
        handleBlur={handleBlur}
        handleInputClick={handleInputClick}
        handleEnterKey={handleEnterKey}
        handleModalClick={handleModalClick}
      />
      <ModalCajeroPago
        session={session}
        validarClaveCajero={validarClaveCajero}
        showModal={showModal}
        setValidar={setValidar}
        home={home}
        setCajero={setCajero}
        cajero={cajero}
        isLoading={isLoading}
      />
      <ModalPagoImprime
        session={session}
        showModal={showModal} //modal4
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
        showModal={showModal} //modal5
        docFiltrados={docFiltrados}
        isLoading={isLoading}
        tableSelect={tableSelect}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="flex items-center space-x-4">
              <Acciones
                ImprimePDF={btnPDF}
                home={home}
                Documento={Documento}
                Recargos={Recargos}
                Parciales={Parciales}
                Alta={Alta}
              />
              <h1 className="text-4xl font-xthin text-black dark:text-white">
                Pagos
              </h1>
            </div>
            <h1 className="text-4xl font-xthin text-black dark:text-white ml-auto">
              {h1Total}
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
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
              />
            </div>
            <div className="grid grid-flow-row gap-3 ">
              <div className="w-full">
                <BuscarCat
                  deshabilitado={bloqueaEncabezado}
                  table="alumnos"
                  itemData={[]}
                  fieldsToShow={columnasBuscaCat}
                  nameInput={nameInputs}
                  titulo={"Alumnos: "}
                  setItem={setAlumnos1}
                  token={session.user.token}
                  modalId="modal_alumnos1"
                  alignRight={"text-right"}
                  inputWidths={{
                    contdef: "180px",
                    first: "70px",
                    second: "170px",
                  }}
                />
              </div>
              <div className="w-full">
                <BuscarCat
                  deshabilitado={bloqueaEncabezado}
                  table="comentarios"
                  itemData={[]}
                  fieldsToShow={columnasBuscaCat2}
                  nameInput={nameInputs2}
                  titulo={"Comentario: "}
                  setItem={setComentarios1}
                  token={session.user.token}
                  modalId="modal_comentarios1"
                  alignRight={"text-right"}
                  inputWidths={{
                    contdef: "180px",
                    first: "70px",
                    second: "170px",
                  }}
                />
              </div>
              <div className="w-full ">
                <Inputs
                  name={"comentarios"}
                  tamañolabel={""}
                  className={"rounded "}
                  Titulo={"Comentario: "}
                  requerido={false}
                  type={"text"}
                  register={register}
                  errors={errors}
                  maxLength={15}
                  isDisabled={bloqueaEncabezado}
                />
              </div>
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
                setPago={setPago}
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
