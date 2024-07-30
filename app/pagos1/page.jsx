"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ModalCajeroPago from "@/app/pagos1/components/modalCajeroPago";
import Acciones from "@/app/pagos1/components/Acciones";
import { useForm } from "react-hook-form";
import {
    buscaPropietario,
    guardarDocumento,
    buscaDocumento,
    validarClaveCajero,
    buscarArticulo,
} from "@/app/utils/api/pagos1/pagos1";
import { getFormasPago } from "@/app/utils/api/formapago/formapago";
import { Elimina_Comas, formatNumber, pone_ceros } from "@/app/utils/globalfn";
import Button from "@/app/components/button";
import Tooltip from "@/app/components/tooltip";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import Inputs from "@/app/pagos1/components/Inputs";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
import BuscarCat from "@/app/components/BuscarCat";
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
    const nameInputs = ["id", "nombre_completo"];
    const columnasBuscaCat = ["id", "nombre_completo"];
    const nameInputs2 = ["id", "comentario_1"];
    const columnasBuscaCat2 = ["id", "comentario_1"];
    const nameInputs3 = ["id", "descripcion"];
    const columnasBuscaCat3 = ["id", "descripcion"];
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
    const [h1Total, setH1Total] = useState('0.00');
    const [muestraRecargos, setMuestraRecargos] = useState(false);
    const [muestraParciales, setMuestraParciales] = useState(false);
    const [dRecargo, setDrecargo] = useState('');
    const [selectedTable, setSelectedTable] = useState({});
    const [cargado, setCargado] = useState(false);
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
            clave_acceso: ""
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
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const formattedToday = `${yyyy}-${mm}-${dd}`;
            document.getElementById('fecha').value = formattedToday;
            if (cargado === false) { const data = await getFormasPago(session.user.token, false); setFormaPago(data); setCargado(true); }
            // if (!validar) {
            //     showModal(true);
            // } else {
            //     showModal(false);
            // }
            setisLoading(false);
        };
        fetchData();
    }, [session, status, validar, cargado]);

    useEffect(() => {
        const fetchData = async () => {
            setisLoading(true);
            const costo = formatNumber(productos1.costo);
            if (costo === 0) {
                setColorInput("bg-[#HFFFF00]")
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

    const home = () => {
        router.push("/");
    };

    const Documento = () => {
    }

    const Recargos = async () => {
        let recargo;
        let prod = productos1.id;
        let alumnoInvalido = alumnos1.id;
        if (!alumnoInvalido) { showSwal("Oppss!", "Alumno invalido", "error"); return; }
        const [arFind, ar9999] = await Promise.all([
            BuscaArticulo(prod),
            BuscaArticulo(9999)
        ]);
        let desPr = ar9999.descripcion;
        console.log(desPr);
        if (arFind) { recargo = formatNumber(arFind.pro_recargo); }
        else { recargo = formatNumber(0); }
        if (desPr) { setDrecargo(desPr); setMuestraRecargos(true); }
        else { setDrecargo(''); setMuestraRecargos(false); }
    }

    const Parciales = async () => {
        let alumnoInvalido = alumnos1.id;
        if (!alumnoInvalido) { showSwal("Oppss!", "Alumno invalido", "error"); return; }
        setMuestraParciales(!muestraParciales);
    };

    const btnParciales = (event) => {
        event.preventDefault();
        handleSubmit(submitParicales)();
    }

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

        if (!validar) { showSwal("Error!", "No hay ningun articulo seleccionado' ", "error"); return; }
        Monto_Pago = Elimina_Comas(data.monto_parcial);
        if (Monto_Pago === 0) { showSwal("Error!", "Monto del pago parcial en cero' ", "error"); return; }
        const dat = await buscaPropietario(token, 1); const clave = dat.clave_seguridad;
        if (data.clave_acceso.toLowerCase() !== clave.toLowerCase()) { showSwal("Error!", "Clave de autorización invalida' ", "error"); return; }
        Monto_Actual = Elimina_Comas(h1Total);
        if (Monto_Pago > Monto_Actual) { showSwal("", 'El monto del pago parcial es mayor al pago total', 'info'); return; }
        A_Pagar = (Monto_Actual - Monto_Pago)
        if (A_Pagar > Monto_Actual) { showSwal("", "El se debe de aplicar a la partida indicada pero la cantidad restante. Es mayor al valor de la partida", "info"); return; }

        Swal.fire({
            title: 'Es correcta la cantidad a cobrar en pago parcial?',
            text: 'Una vez que se autoriza será generado el documento a cobranza. Esta completamente seguro que la operación es correcta',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!fecha) {
                    const today = new Date(); const yyyy = today.getFullYear(); const mm = String(today.getMonth() + 1).padStart(2, '0'); const dd = String(today.getDate()).padStart(2, '0'); fecha = `${dd}-${mm}-${yyyy}`;
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
                    fecha: data.fecha || '',
                    descuento: 0,
                    importe: A_Pagar || 0,
                };
                res = await buscaDocumento(token, newData);
                console.log(res);
                if (res.status) {
                    res2 = await guardarDocumento(token, newData);
                    console.log(res2);
                } else { showSwal("", "El documento a generar ya existe no se realiza el proceso", "info"); return; }
            } else { return; }
        });
    }
    const btnRecargo = (event) => {
        event.preventDefault();
        handleSubmit(submitRecargo)();
    };

    const submitRecargo = async (data) => {
        if (dRecargo) { return; }
        const recargo = formatNumber(data.recargo);
        const total = data.recargo * data.cantidad_producto;
        const totalFormat = formatNumber(total);
        const nuevoPago = {
            precio_base: recargo || 0,
            neto: recargo || 0,
            total: totalFormat || 0,
            alumno: alumnos1.id || 0,
            numero: 9999,
            descripcion: dRecargo || '',
            cantidad_producto: data.cantidad_producto || 0,
            documento: '',
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
    }

    const btnPDF = (event) => {
        event.preventDefault();
        handleSubmit(ImprimePDF)();
    };

    const ImprimePDF = async (data) => {
        let fecha = data.fecha;
        if (!fecha) {
            const today = new Date(); const yyyy = today.getFullYear(); const mm = String(today.getMonth() + 1).padStart(2, '0'); const dd = String(today.getDate()).padStart(2, '0'); fecha = `${dd}-${mm}-${yyyy}`;
        }
        console.log('data imprime', data);
        let alumnoInvalido = alumnos1.id;
        if (!alumnoInvalido) { showSwal("Oppss!", "Alumno invalido", "error"); return; }
        if (h1Total <= 0) { showSwal("Oppss!", "El monto total debe ser mayor a 0", "error"); return; }
        let dataP = await buscaPropietario(session.user.token, 1);
        const formaPagoFind = formaPago.find(forma => forma.id === 1);
        const newData = {
            pago: h1Total,
            recibo: dataP.con_recibos,
            forma_pago_id: formaPagoFind.id,
            comentario_id: comentarios1.id,
            comentario_desc: comentarios1.comentario_1,
            comentarios: data.comentarios,
            fecha: fecha,
            total: h1Total,
        }; console.log('dataaaaaaaaaa', newData); setformaPagoPage(newData); showModal2(true);
    };

    const BuscaArticulo = async (numero) => {
        let res;
        const { token } = session.user;
        res = await buscarArticulo(token, numero)
        console.log(res);
        return res.data;
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

    const muestraTotal = (data) => {
        const dataTotal = parseFloat(data.total.replace(/,/g, ''));
        const nuevoTotal = pagosFiltrados.reduce((acc, pago) => acc + parseFloat(pago.total.replace(/,/g, '')), dataTotal);
        const formateado = formatNumber(nuevoTotal);
        setH1Total(formateado);
    };

    const handleEnterKey = async (data) => {
        let productoInvalido = productos1.id;
        if (!productoInvalido) {
            showSwal("Oppss!", "Producto invalido", "error");
            return;
        }
        let alumnoInvalido = alumnos1.id;
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
            alumno: alumnos1.id || 0,
            numero: productos1.id || 0,
            descripcion: productos1.descripcion || '',
            cantidad_producto: data.cantidad_producto || 0,
            documento: '',
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

    const EliminarCampo = (data) => {
        const index = pagos.findIndex((p) => p.numero === data.numero);
        if (index !== -1) {
            const pFiltrados = pagos.filter((p) => p.numero !== data.numero);
            const fTotal = Elimina_Comas(h1Total);
            const dTotal = Elimina_Comas(data.total);
            let restaTotal = fTotal - dTotal;
            if (!restaTotal) {
                restaTotal = '0'
            }
            const total = formatNumber(restaTotal);
            setH1Total(total);
            setPagos(pFiltrados);
            setPagosFiltrados(pFiltrados);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit(handleEnterKey)();
        }
    };

    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    return (
        <>
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
            />
            <div className="container w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3">
                <div className="flex justify-start p-3">
                    <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
                        Pagos.
                    </h1>
                    <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12 ml-auto">
                        {h1Total}
                    </h1>
                </div>

                <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
                    <div className="col-span-1 flex flex-col">
                        <Acciones
                            ImprimePDF={btnPDF}
                            home={home}
                            Documento={Documento}
                            Recargos={Recargos}
                            Parciales={Parciales}
                        />
                    </div>

                    <div className="col-span-7">
                        <div className="flex flex-col h-full space-y-4">
                            <div className="flex items-center space-x-4">
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

                            <div className="flex">
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
                            <div className="flex">
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
                                    maxLength={8}
                                />
                            </div>
                            <div className="flex">
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
                                <>
                                    <div className="flex">
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
                                        <Inputs
                                            tipoInput={""}
                                            dataType={"double"}
                                            name={"recargo"}
                                            tamañolabel={""}
                                            className={"rounded block grow text-right"}
                                            Titulo={" "}
                                            type={"text"}
                                            requerido={false}
                                            register={register}
                                            errors={errors}
                                            maxLength={8}
                                            isDisabled={false}
                                        />
                                        <Tooltip Titulo={"Adiciona"} posicion={"tooltip-top"}>
                                            <Button icono={"fa-solid fa-circle-plus"} onClick={btnRecargo}></Button>
                                        </Tooltip>
                                    </div>
                                </>
                            )}

                            {muestraParciales && (
                                <>
                                    <div className="sm:w-[calc(80%)] md:w-[calc(70%)] lg:w-[calc(70%)] p-4 border dark:border-gray-300 border-black rounded-lg">
                                        <h2 className="text-lg font-bold mb-4 dark:text-white text-black">Pago Parcial</h2>
                                        <div className="flex flex-col space-y-2">
                                            <label className="flex items-center space-x-2 dark:text-white text-black">
                                                <Inputs
                                                    tipoInput={""}
                                                    dataType={"double"}
                                                    name={"monto_parcial"}
                                                    tamañolabel={"w-80"}
                                                    className={"rounded block grow text-right"}
                                                    Titulo={"Monto Parcial: "}
                                                    type={"text"}
                                                    requerido={false}
                                                    register={register}
                                                    errors={errors}
                                                    maxLength={8}
                                                    isDisabled={false}
                                                />
                                                <Inputs
                                                    tipoInput={""}
                                                    dataType={"string"}
                                                    name={"clave_acceso"}
                                                    tamañolabel={"w-80"}
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
                                                    <Button icono={"fa-solid fa-circle-plus"} onClick={btnParciales}></Button>
                                                </Tooltip>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                            <TablaPagos1
                                isLoading={isLoading}
                                pagosFiltrados={pagosFiltrados}
                                setPagos={setPagos}
                                setAccion={setAccion}
                                setSelectedTable={setSelectedTable}
                                deleteRow={EliminarCampo}
                            // tableHeight={tableHeight}
                            // setTableHeight={setTableHeight}
                            />
                            {/* <div className="col-span-7">
                                <div className="flex flex-col h-[calc(95%)] w-full bg-white dark:bg-white">
                                    {pdfPreview && pdfData && (
                                        <div className="pdf-preview flex overflow-auto border border-gray-300 rounded-lg shadow-lg">
                                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                                <div style={{ height: "500px", width: "100%" }}>
                                                    <Viewer fileUrl={pdfData} />
                                                </div>
                                            </Worker>
                                        </div>
                                    )}
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>


            </div >
        </>
    );
}

export default Pagos_1;
