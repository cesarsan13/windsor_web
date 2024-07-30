"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ModalCajeroPago from "@/app/pagos1/components/modalCajeroPago";
import Acciones from "@/app/pagos1/components/Acciones";
import { useForm } from "react-hook-form";
import {
    validarClaveCajero,
    buscarArticulo,
    Imprimir,
    ImprimirExcel,
    verImprimir,
} from "@/app/utils/api/pagos1/pagos1";
import { Elimina_Comas, formatNumber, pone_ceros } from "@/app/utils/globalfn"
import Button from "@/app/components/button";
import Tooltip from "@/app/components/tooltip";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import Inputs from "@/app/pagos1/components/Inputs";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import BuscarCat from "@/app/components/BuscarCat";
import TablaPagos1 from "@/app/pagos1/components/tablaPagos1";
import { showSwal } from "@/app/utils/alerts";
function Pagos_1() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [alumnos1, setAlumnos1] = useState({});
    const [comentarios1, setComentarios1] = useState({});
    const [productos1, setProductos1] = useState({});
    // let [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
    const nameInputs = ["id", "nombre_completo"];
    const columnasBuscaCat = ["id", "nombre_completo"];
    const nameInputs2 = ["id", "comentario_1"];
    const columnasBuscaCat2 = ["id", "comentario_1"];
    const nameInputs3 = ["id", "descripcion"];
    const columnasBuscaCat3 = ["id", "descripcion"];
    // let [fecha, setFecha] = useState("");
    const [pagos, setPagos] = useState([]);
    const [pago, setPago] = useState({});
    let [pagosFiltrados, setPagosFiltrados] = useState([]);
    const [validar, setValidar] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const [TB_Busqueda, setTB_Busqueda] = useState("");
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const [precio_base, setPrecioBase] = useState("");
    const [colorInput, setColorInput] = useState("");
    const [h1Total, setH1Total] = useState('0.00');
    const [muestraRecargos, setMuestraRecargos] = useState(false);
    const [muestraParciales, setMuestraParciales] = useState(false);
    const [dRecargo, setDrecargo] = useState('');
    const [selectedOption, setSelectedOption] = useState('Nombre');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
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
            // if (!validar) {
            //     showModal(true);
            // } else {
            //     showModal(false);
            // }
            setisLoading(false);
        };
        fetchData();
    }, [session, status, validar]);

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

    // useEffect(() => {
    //     reset({
    //         numero: 0,
    //         alumno: 0,
    //         descripcion: "",
    //         fecha: "",
    //         comentarios: "",
    //         precio_base: 0,
    //         cantidad_producto: 0,
    //         documento: "",
    //         precio: 0,
    //         neto: 0,
    //         total: 0,
    //         descuento: 0,
    //     });
    // }, [pagos, reset]);

    const showModal = (show) => {
        show
            ? document.getElementById("my_modal_3").showModal()
            : document.getElementById("my_modal_3").close();
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
        if (!alumnoInvalido) {
            showSwal("Oppss!", "Alumno invalido", "error");
            return;
        }
        const [arFind, ar9999] = await Promise.all([
            BuscaArticulo(prod),
            BuscaArticulo(9999)
        ]);
        let desPr = ar9999.descripcion;
        console.log(desPr);
        if (arFind) {
            recargo = formatNumber(arFind.pro_recargo);
        } else {
            recargo = formatNumber(0);
        }
        if (desPr) {
            console.log('true');
            setDrecargo(desPr);
            setMuestraRecargos(true);
            console.log('false');
            setDrecargo('');
            setMuestraRecargos(false);
        }
    }

    const Parciales = async () => {
        let alumnoInvalido = alumnos1.id;
        if (!alumnoInvalido) {
            showSwal("Oppss!", "Alumno invalido", "error");
            return;
        }
    };

    const btnRecargo = (event) => {
        event.preventDefault();
        handleSubmit(sumbitRecargo)();
    };

    const sumbitRecargo = async (data) => {
        // if (dRecargo) { return; }
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
        }
        muestraTotal(nuevoPago);
        setPagos((prevPagos) => [...prevPagos, nuevoPago]);
        setPagosFiltrados((prevPagos) => [...prevPagos, nuevoPago]);
        setMuestraRecargos(false);
    }

    const CerrarView = () => {
        setPdfPreview(false);
        setPdfData('');
    };

    const handleVerClick = async () => {
        console.log(session);
        const alumnosFiltrados = await formaImprime();
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Relación General de Alumnos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: alumnosFiltrados,
        };
        const pdfData = await verImprimir(configuracion);
        setPdfData(pdfData);
        setPdfPreview(true);
    };

    const formaImprime = async () => {
        let data;
        const { token } = session.user;
        console.log('baja check', bajas);
        console.log('alumnos 1', alumnos1);
        console.log('alumnos 2', alumnos2);
        if (alumnos1) {
            if (!alumnos2.id) { alumnos2.id = 0 }
            data = await getreportAlumn(token, bajas, selectedOption, alumnos1.id, alumnos2.id);
        } else {
            showSwal("Oppss!", "Para imprimir, minimo debe estar seleccionado un alumno en 'Inicio' ", "error");
        }
        console.log('data get report', data);
        return data;
    }

    const ImprimePDF = async () => {
        alumnosFiltrados = await formaImprime();
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Relación General de Alumnos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: alumnosFiltrados,
        };
        Imprimir(configuracion);
    };

    const ImprimeExcel = async () => {
        alumnosFiltrados = await formaImprime();
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Relación General de Alumnos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: alumnosFiltrados,
            columns: [
                { header: "No", dataKey: "id" },
                { header: "Nombre", dataKey: "nombre_completo" },
                { header: "Estatus", dataKey: "estatus" },
                { header: "Fecha", dataKey: "fecha_nac" },
                { header: "Horario", dataKey: "horario_1_nombre" },
                { header: "Telefono", dataKey: "telefono_1" },
            ],
            nombre: "Relación General de Alumnos",
        };
        ImprimirExcel(configuracion);
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
        console.log('nuevoPago', nuevoPago);
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
            // validar={validar}
            // pago={pago}
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
                            ImprimePDF={ImprimePDF}
                            ImprimeExcel={ImprimeExcel}
                            home={home}
                            Ver={handleVerClick}
                            CerrarView={CerrarView}
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
                                    dataType={"string"}
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
                                            maxLength={15}
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
                                            maxLength={15}
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
                                            maxLength={15}
                                            isDisabled={false}
                                        />
                                        <Tooltip Titulo={"Actualiza"} posicion={"tooltip-top"}>
                                            <Button icono={"fa-solid fa-circle-plus"} onClick={btnRecargo}></Button>
                                        </Tooltip>
                                    </div>
                                </>
                            )}

                            {muestraRecargos && (
                                <>
                                    <div className="w-full max-w-sm p-4 border dark:border-gray-300 border-black rounded-lg">
                                        <h2 className="text-lg font-bold mb-4 dark:text-white text-black">Ordenado por...</h2>
                                        <div className="flex flex-col space-y-2">
                                            <label className="flex items-center space-x-2 dark:text-white text-black">
                                                <input
                                                    type="radio"
                                                    name="options"
                                                    value="Nombre"
                                                    checked={selectedOption === 'Nombre'}
                                                    onChange={handleOptionChange}
                                                    className="form-radio"
                                                />
                                                <span>Nombre</span>
                                            </label>
                                            <label className="flex items-center space-x-2 dark:text-white text-black">
                                                <input
                                                    type="radio"
                                                    name="options"
                                                    value="Numero"
                                                    checked={selectedOption === 'Numero'}
                                                    onChange={handleOptionChange}
                                                    className="form-radio"
                                                />
                                                <span>Número</span>
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
                                setCurrentId={setCurrentId}
                                deleteRow={EliminarCampo}
                            />
                            <div className="col-span-7">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default Pagos_1;
