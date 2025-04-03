"use client";
import BuscarCat from "@/app/components/BuscarCat";
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
  storeBatchDetallePedido,
} from "@/app/utils/api/pagos1/pagos1";
import ModalProcesarDatos from "@/app/components/modalProcesarDatos";
import { getFormasPago } from "@/app/utils/api/formapago/formapago";
import { getAlumnos } from "@/app/utils/api/alumnos/alumnos";
import {
  Elimina_Comas,
  formatNumber,
  pone_ceros,
  format_Fecha_String,
  permissionsComponents,
  fechaFormatExcel,
  chunkArray,
} from "@/app/utils/globalfn";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import Inputs from "@/app/pagos1/components/Inputs";
import TablaPagos1 from "@/app/pagos1/components/tablaPagos1";
import ModalPagoImprime from "@/app/pagos1/components/modalPagosImprime";
import ModalRecargos from "@/app/pagos1/components/modalRecargos";
import ModalParciales from "@/app/pagos1/components/modalParciales";
import { showSwal, showSwalAndWait, confirmSwal } from "@/app/utils/alerts";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import ModalNuevoRegistro from "@/app/pagos1/components/ModalNuevoRegistro";
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
  const [muestraImpresion, setMuestraImpresion] = useState(false);
  const [muestraDocumento, setMuestraDocumento] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [dRecargo, setDrecargo] = useState("");
  const [PRecargo, setPrecargo] = useState("");
  const [selectedTable, setSelectedTable] = useState({});
  const [cargado, setCargado] = useState(false);
  const [docFiltrados, setdDocFiltrados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [accionB, setAccionB] = useState("");
  const [accionC, setAccionC] = useState("");
  const [bloqueaEncabezado, setBloqueaEncabezado] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const nameInputs = ["numero", "nombre_completo"];
  const columnasBuscaCat = ["numero", "nombre_completo"];
  const nameInputs2 = ["numero", "comentario_1"];
  const columnasBuscaCat2 = ["numero", "comentario_1"];
  const [permissions, setPermissions] = useState({});

  const [dataJson, setDataJson] = useState([]);
  const [reload_page, setReloadPage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero_producto: 0,
      alumno: 0,
      descripcion: "",
      fecha: "",
      comentarios: "",
      precio_base: 0,
      cantidad_producto: "1",
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
  const cantidad_producto = watch("cantidad_producto");
  const fecha = watch("fecha");

  const {
    register: registerImpr,
    reset: resetImpr,
    handleSubmit: handleSumbitImpr,
    formState: { errors: errorsImpr },
    setValue: setValueImpr,
  } = useForm({
    defaultValues: {
      pago: formaPagoPage.pago,
      pago_2: "0.00",
      referencia: "",
      referencia_2: "",
      num_copias: 1,
      recibo_imprimir: formaPagoPage.recibo,
    },
  });

  const {
    register: registerCaj,
    handleSubmit: handleSubmitCaj,
    reset: resetCaj,
    formState: { errors: errorsCaj },
  } = useForm({
    defaultValues: {
      clave_cajero: "",
    },
  });

  const showModal = (id, show) => {
    show
      ? document.getElementById(id).showModal()
      : document.getElementById(id).close();
  };

  useEffect(() => {
    resetImpr({
      pago: formaPagoPage.pago,
      pago_2: "0.00",
      referencia: "",
      quien_paga: "",
      recibo_imprimir: formaPagoPage.recibo,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formaPagoPage]);

  useEffect(() => {
    if (cantidad_producto === "") {
      setValue("cantidad_producto", formatNumber(1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cantidad_producto]);

  useEffect(() => {
    reset({
      recargo: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muestraRecargos]);

  useEffect(() => {
    reset({
      monto_parcial: 0,
      clave_acceso: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muestraParciales]);

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      let { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      if (!validar) {
        showModal("my_modal_3", true);
        setValue("cantidad_producto", formatNumber(1));
      } else {
        showModal("my_modal_3", false);
      }
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const formattedToday = `${yyyy}-${mm}-${dd}`;
      setValue("fecha", formattedToday);
      if (cargado === false) {
        const [dataF, dataA] = await Promise.all([
          getFormasPago(token, false),
          getAlumnos(token, false),
        ]);
        setAlumnos(dataA);
        setFormaPago(dataF);
        setCargado(true);
      }
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      setPermissions(permisos);
      setisLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, validar, cargado, setValue]);

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
    setBloqueaEncabezado(pagosFiltrados.length > 0);
  }, [pagosFiltrados]);

  const reiniciarPage = () => {
    setFormaPago([]);
    setformaPagoPage({});
    setPagos([]);
    setPagosFiltrados([]);
    setCajero({});
    setAlumnos([]);
    setAlumnos1({});
    setH1Total("0.00");
    setSelectedTable({});
    setComentarios1({});
    setProductos1({});
    setColorInput("");
    setPrecioBase("");
    setDrecargo("");
    setPrecargo("");
    setdDocFiltrados([]);
    setValidar(false);
    setCargado(false);
    setSelectedRow(null);
    reset({
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
      monto_parcial: 0,
      clave_acceso: "",
      //recargo: 0,
    });
    resetImpr({
      pago: formaPagoPage.pago,
      pago_2: "0.00",
      referencia: "",
      quien_paga: "",
      recibo_imprimir: formaPagoPage.recibo,
    });
    resetCaj({
      clave_cajero: "",
    });
    setAccionC("Alta");
  };

  useEffect(() => {
    if (accionB === "Alta") {
      setAccionB("");
    }
  }, [accionB]);

  useEffect(() => {
    if (accionC === "Alta") {
      setAccionC("");
    }
  }, [accionC]);

  const home = () => {
    router.push("/");
  };

  const Documento = (event) => {
    event.preventDefault();
    handleSubmit(submitDocumento)();
  };

  const submitDocumento = async (data) => {
    const { token } = session.user;
    const alumnoInvalido = alumnos1.numero;
    setMuestraDocumento(true);
    if (!alumnoInvalido) {
      showSwal("Oppss!", "Alumno inválido", "error");
      setMuestraDocumento(false);
      return;
    }
    const dataR = await buscaDocumentosCobranza(token, alumnos1.numero);
    if (dataR.length > 0) {
      const documentosFiltrados = dataR
        .filter((item) => {
          const importeConDescuento =
            item.importe - item.importe * (item.descuento / 100);
          const diferencia = parseFloat(importeConDescuento.toFixed(2));
          return parseFloat((diferencia - item.importe_pago).toFixed(2)) > 0;
        })
        .map((item) => {
          const importeConDescuento =
            item.importe - item.importe * (item.descuento / 100);
          const diferencia = parseFloat(importeConDescuento.toFixed(2));
          const saldoF = parseFloat(
            (diferencia - item.importe_pago).toFixed(2)
          );
          const isPagado = parseFloat(item.importe_pago.toFixed(2)) > 0;
          return {
            numero: item.numero_doc,
            paquete: item.producto,
            fecha: item.fecha,
            saldo: isPagado
              ? formatNumber(saldoF)
              : formatNumber(parseFloat(item.importe.toFixed(2))),
            descuento: isPagado
              ? "0.00"
              : formatNumber(parseFloat(item.descuento.toFixed(2))),
            nombre_producto: item.nombre_producto || "",
            alumno: item.alumno || "",
          };
        });
      if (documentosFiltrados.length > 0) {
        setdDocFiltrados(documentosFiltrados);
        setMuestraDocumento(false);
        showModal("my_modal_5", true);
      } else {
        setMuestraDocumento(false);
        showSwal("Oppss!", "No hay documentos para cobro", "error");
      }
    } else {
      setMuestraDocumento(false);
      showSwal("Oppss!", "No hay documentos para cobro", "error");
    }
  };

  const Recargos = async () => {
    setMuestraRecargos(true);

    let recargo = 0;
    let prod = selectedTable.numero_producto;
    let alumnoInvalido = alumnos1.numero;
    if (!alumnoInvalido) {
      showSwal("Oppss!", "Alumno invalido", "error");
      setMuestraRecargos(false);
      return;
    }
    let validar = selectedTable.numero_producto;
    if (!validar) {
      await showSwalAndWait(
        "¡Error!",
        "No hay ningún artículo seleccionado. Asegúrate de haberlo elegido en la tabla.",
        "error"
      );
      setMuestraRecargos(false);
      return;
    }

    const [arFind, ar9999] = await Promise.all([
      BuscaArticulo(prod),
      BuscaArticulo(9999),
    ]);

    let desPr = ar9999.descripcion;
    let prePr = arFind.por_recargo;
    
    if (arFind) {
      recargo = formatNumber(prePr);
    } else {
      recargo = formatNumber(0);
    }

    if (desPr) {
      setDrecargo(desPr);
      setPrecargo(recargo);
      setMuestraRecargos(false);
      setTimeout(() => {
        showModal("modal_recargos", true);
        document.getElementById("recargo").focus();
      }, 100);
    } else {
      setDrecargo("");
      setPrecargo("");
      setMuestraRecargos(false);
      showModal("modal_recargos", false);
    }
  };

  const Parciales = async () => {
    setMuestraParciales(true);
    let alumnoInvalido = alumnos1.numero;
    if (!alumnoInvalido) {
      showSwal("Oppss!", "Alumno invalido", "error");
      setMuestraParciales(false);
      return;
    }
    let validar = selectedTable.numero_producto;
    if (!validar) {
      await showSwalAndWait(
        "¡Error!",
        "No hay ningún artículo seleccionado. Asegúrate de haberlo elegido en la tabla.",
        "error"
      );
      setMuestraParciales(false);
      return;
    }
    showModal("modal_parciales", true);
    document.getElementById("monto_parcial").focus();
    setMuestraParciales(false);
  };

  const Alta = () => {
    if (Object.keys(alumnos1).length === 0) {
      showSwal(
        "¡Advertencia!",
        "Seleccione un alumno para generar pagos",
        "warning"
      );
      return;
    }
    reset({
      cantidad_producto: 1,
    });
    setPrecioBase(0);
    setAccionB("Alta");
    showModal("modal_nuevo_registro", true);
    document.getElementById("cantidad_producto").focus();
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

    Monto_Pago = Elimina_Comas(data.monto_parcial);
    if (Monto_Pago === 0) {
      showModal("modal_parciales", false);
      await showSwalAndWait(
        "Error!",
        "Monto del pago parcial en cero' ",
        "error"
      );
      showModal("modal_parciales", true);
      return;
    }
    const dat = await buscaPropietario(token, 1);
    const clave = dat.clave_seguridad;
    if (data.clave_acceso.toLowerCase() !== clave.toLowerCase()) {
      showModal("modal_parciales", false);
      await showSwalAndWait(
        "Error!",
        "Clave de autorización inválida.",
        "error"
      );
      showModal("modal_parciales", true);
      return;
    }
    Monto_Actual = Elimina_Comas(h1Total);
    if (Monto_Pago > Monto_Actual) {
      showModal("modal_parciales", false);
      await showSwalAndWait(
        "",
        "El monto del pago parcial es mayor al pago total.",
        "info"
      );
      showModal("modal_parciales", true);
      return;
    }
    A_Pagar = Monto_Actual - Monto_Pago;
    if (A_Pagar > Monto_Actual) {
      showModal("modal_parciales", false);
      await showSwalAndWait(
        "",
        "La cantidad restante es mayor al valor de la partida. Asegúrate de aplicarla correctamente a la partida indicada.",
        "info"
      );
      showModal("modal_parciales", true);
      return;
    }
    showModal("modal_parciales", false);
    Swal.fire({
      title: "¿Confirmas el monto del pago parcial?",
      text: "Al autorizar, se generará el documento de cobranza. ¿Estás completamente seguro de que los datos son correctos?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "No, cancelar",
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
          fecha: format_Fecha_String(data.fecha) || "",
          descuento: 0,
          importe: A_Pagar || 0,
        };
        res = await buscaDocumento(token, newData);
        if (res.status) {
          res2 = await guardarDocumento(token, newData);
          if (res2.status) {
            const data2 = res2.data;
            const pagosActualizados = pagosFiltrados.map((pago) =>
              pago.numero_producto === newData.producto
                ? {
                    ...pago,
                    precio_base: formatNumber(Monto_Pago),
                    neto: formatNumber(Monto_Pago),
                    total: formatNumber(Monto_Pago),
                  }
                : pago
            );
            const fTotal = Elimina_Comas(h1Total);
            const dTotal = Elimina_Comas(data2.importe);
            let restaTotal = fTotal - dTotal;
            if (!restaTotal) {
              restaTotal = "0";
            }
            setH1Total(formatNumber(restaTotal));
            setPagosFiltrados(pagosActualizados);
            showSwal(res2.alert_title, res2.alert_text, res2.alert_icon);
            setValue("monto_parcial", "");
            setValue("clave_acceso", "");
            showModal("modal_parciales", false);
            setSelectedRow(null);
            setSelectedTable({});
            handleSubmit(async () => {
              await datosImpresion(formatNumber(restaTotal), data);
            })();
          } else {
            showSwal(res2.alert_title, res2.alert_text, res2.alert_icon);
            setSelectedRow(null);
            setSelectedTable({});
          }
        } else {
          showSwal(
            "",
            "El documento a generar ya existe, no se realiza el proceso.",
            "info"
          );
          setSelectedRow(null);
          setSelectedTable({});
          showModal("modal_parciales", false);
          return;
        }
      } else {
        showModal("modal_parciales", true);
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
      numero_producto: 9999,
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
      showModal("modal_recargos", false);
      return;
    }
    const nuevoPagoArray = Array.isArray(nuevoPago) ? nuevoPago : [nuevoPago];

    muestraTotal(nuevoPago);
    setPagos((prevPagos) => [...prevPagos, ...nuevoPagoArray]);
    setPagosFiltrados((prevPagos) => [...prevPagos, ...nuevoPagoArray]);
    showModal("modal_recargos", false);
  };

  const btnPDF = (event) => {
    event.preventDefault();
    handleSubmit(ImprimePDF)();
  };

  const ImprimePDF = async (data) => {
    setMuestraImpresion(true);
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
      setMuestraImpresion(false);
      return;
    }
    if (h1Total <= 0) {
      showSwal("Oppss!", "El monto total debe ser mayor a 0", "error");
      setMuestraImpresion(false);
      return;
    }
    await datosImpresion(h1Total, data);
  };

  const datosImpresion = async (total, data) => {
    let dataP = await buscaPropietario(session.user.token, 1);
    const formaPagoFind = formaPago.find((forma) => forma.numero === 1);
    const newData = {
      pago: total || 0,
      recibo: Number(dataP.con_recibos) === 0 ? 1 : Number(dataP.con_recibos) + 1 || 0,
      forma_pago_id: formaPagoFind.numero || 0,
      comentario_ad: data.comentarios || "",
      fecha: fecha || "",
    };
    setformaPagoPage(newData);
    setMuestraImpresion(false);
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
      restaTotal = restaTotal < 0 ? 0 : restaTotal;
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
    const nuevoPago = {
      numero_producto: item.paquete,
      descripcion: item.nombre_producto,
      documento: item.numero,
      cantidad_producto: 1,
      precio_base: item.saldo,
      descuento: item.descuento,
      neto: item.saldo,
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

  const buttonProcess = async () => {
    event.preventDefault();
    setisLoadingButton(true);
    const { token } = session.user;
    const chunks = chunkArray(dataJson, 20);
    for (let chunk of chunks) {
      await storeBatchDetallePedido(token, chunk);
    }
    setDataJson([]);
    document.getElementById("my_modal_detalle_pedido").close();
    showSwal("Éxito", "Los datos se han subido correctamente.", "success");
    setReloadPage(!reload_page);
    setisLoadingButton(false);
  };

  const handleFileChange = async (e) => {
    const confirmed = await confirmSwal(
      "¿Desea Continuar?",
      "Asegúrate de que las columnas del archivo de excel coincidan exactamente con las columnas de la tabla en la base de datos.",
      "warning",
      "Aceptar",
      "Cancelar",
      "my_modal_detalle_pedido"
    );
    if (!confirmed) {
      return;
    }
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const convertedData = jsonData.map((item) => ({
          recibo: parseInt(item.Recibo || 0),
          alumno: parseInt(item.Alumno || 0),
          articulo: parseInt(item.Articulo || 0),
          documento: parseInt(item.Documento || 0),
          fecha: fechaFormatExcel(item.Fecha) || "",
          cantidad: parseInt(item.Cantidad || 0),
          precio_unitario: parseFloat(item.Precio_Unitario || 0),
          descuento: parseInt(item.Descuento || 0),
          iva: parseFloat(item.IVA || 0),
          numero_factura: parseInt(item.Numero_Factura || 0),
        }));
        setDataJson(convertedData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const itemHeaderTable = () => {
    return (
      <>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Recibo.</td>
        <td className="w-[40%]">Alumno</td>
        <td className="w-[15%]">Articulo</td>
        <td className="w-[15%]">Documento</td>
        <td className="w-[10%]">Fecha</td>
        <td className="w-[15%]">Cantidad</td>
        <td className="w-[10%]">Precio Unitario</td>
        <td className="w-[10%]">Descuento</td>
        <td className="w-[10%]">IVA</td>
        <td className="w-[10%]">Numero Factura</td>
      </>
    );
  };

  const itemDataTable = (item) => {
    return (
      <>
        <tr key={item.recibo} className="hover:cursor-pointer">
          <th
            className={
              typeof item.recibo === "number" ? "text-left" : "text-right"
            }
          >
            {item.recibo}
          </th>
          <td className="text-left">{item.alumno}</td>
          <td className="text-left">{item.articulo}</td>
          <td className="text-left">{item.documento}</td>
          <td className="text-left">{item.fecha}</td>
          <td className="text-right">{item.cantidad}</td>
          <td className="text-right">{item.precio_unitario}</td>
          <td className="text-right">{item.descuento}</td>
          <td className="text-right">{item.iva}</td>
          <td className="text-right">{item.numero_factura}</td>
        </tr>
      </>
    );
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
        productos1={productos1}
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
      <ModalProcesarDatos
        id_modal={"my_modal_detalle_pedido"}
        session={session}
        buttonProcess={buttonProcess}
        isLoadingButton={isLoadingButton}
        isLoading={isLoading}
        title={"Procesar Datos desde Excel."}
        setDataJson={setDataJson}
        dataJson={dataJson}
        handleFileChange={handleFileChange}
        itemHeaderTable={itemHeaderTable}
        itemDataTable={itemDataTable}
        //clase para mover al tamaño del modal a preferencia (max-w-4xl)
        classModal={"modal-box w-full max-w-4xl h-full bg-base-200"}
      />

      <ModalRecargos
        register={register}
        errors={errors}
        handleModalClick={handleModalClick}
        dRecargo={dRecargo}
        PRecargo={PRecargo}
        setPrecargo = {setPrecargo}
        btnRecargo={btnRecargo}
        handleBlur={handleBlur}
        handleKeyDown={handleKeyDown}
      />
      <ModalParciales
        session={session}
        register={register}
        errors={errors}
        handleModalClick={handleModalClick}
        setProductos1={setProductos1}
        accionB={accionC}
        btnParciales={btnParciales}
        handleBlur={handleBlur}
        handleKeyDown={handleKeyDown}
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
        registerCaj={registerCaj}
        errorsCaj={errorsCaj}
        handleSubmitCaj={handleSubmitCaj}
        accionB={accionC}
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
        reiniciarPage={reiniciarPage}
        errorsImpr={errorsImpr}
        registerImpr={registerImpr}
        handleSumbitImpr={handleSumbitImpr}
        accionB={accionC}
      />
      <ModalDocTabla
        session={session}
        showModal={showModal} //modal5
        docFiltrados={docFiltrados}
        isLoading={isLoading}
        tableSelect={tableSelect}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
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
                muestraRecargos={muestraRecargos}
                muestraParciales={muestraParciales}
                muestraImpresion={muestraImpresion}
                muestraDocumento={muestraDocumento}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
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
                  accion={accionC}
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
                  table="comentarios"
                  itemData={[]}
                  fieldsToShow={columnasBuscaCat2}
                  nameInput={nameInputs2}
                  titulo={"Comentario: "}
                  setItem={setComentarios1}
                  accion={accionC}
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
                />
              </div>
            </div>
            <div className="pb-5">
              <TablaPagos1
                session={session}
                isLoading={isLoading}
                pagosFiltrados={pagosFiltrados}
                setPago={setPago}
                setAccion={setAccion}
                setSelectedTable={setSelectedTable}
                deleteRow={EliminarCampo}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                permiso_baja={permissions.bajas}
                permiso_cambio={permissions.cambios}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pagos_1;