'use client'
import React, { useEffect, useState } from 'react'
import Acciones from './components/acciones'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getAplicaciones1, guradaAplicacion1, siguiente, Imprimir, ImprimirExcel } from '../utils/api/act_aplica/act_aplica'
import { useForm } from 'react-hook-form'
import TablaAplicacion1 from './components/tablaAplicacion1'
import ModalAplicacion1 from './components/modalAplicacion1'
import { Elimina_Comas, formatFecha, formatNumber } from '../utils/globalfn'
import { confirmSwal, showSwal } from '../utils/alerts'
import ModalVistaPreviaActAplica from './components/modalVistaPreviaActAplica'
import { ReportePDF } from '../utils/ReportesPDF'

function Act_Aplica() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [aplicaciones, setAplicaciones] = useState([])
    const [aplicacion, setAplicacion] = useState({})
    const [isLoading, setisLoading] = useState(false)
    const [currentID, setCurrentId] = useState("")
    const [accion, setAccion] = useState("")
    const [pdfData, setPdfData] = useState("");
    const [pdfPreview, setPdfPreview] = useState(false);

    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        const fetchData = async () => {
            setisLoading(true)
            const { token } = session.user
            const data = await getAplicaciones1(token)
            setAplicaciones(data)
            setisLoading(false)
        }
        fetchData()
    }, [ status])
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            numero: aplicacion.numero,
            numero_cuenta: aplicacion.numero_cuenta,
            cargo_abono: aplicacion.cargo_abono,
            importe_movimiento: formatNumber(aplicacion.importe_movimiento),
            referencia: aplicacion.referencia,
            fecha_referencia: formatFecha(aplicacion.fecha_referencia),
        }
    })
    useEffect(() => {
        reset({
            numero: aplicacion.numero,
            numero_cuenta: aplicacion.numero_cuenta,
            cargo_abono: aplicacion.cargo_abono,
            importe_movimiento: formatNumber(aplicacion.importe_movimiento),
            referencia: aplicacion.referencia,
            fecha_referencia: formatFecha(aplicacion.fecha_referencia),
        })
    }, [aplicacion, reset])

    const Alta = async () => {
        setCurrentId("")
        const { token } = session.user;
        reset({
            numero_cuenta: "",
            cargo_abono: "",
            importe_movimiento: "",
            referencia: "",
            fecha_referencia: "",
        })
        let siguienteId = await siguiente(token)
        siguienteId = Number(siguienteId)
        setAplicacion({ numero: siguienteId })
        setCurrentId(siguienteId)
        setAccion("Alta")
        showModal(true)
    }
    const showModal = (show) => {
        show
            ? document.getElementById("my_modal_3").showModal()
            : document.getElementById("my_modal_3").close();
    };
    const home = () => {
        router.push("/")
    }
    const cobranzaD = () => {
        router.push("/cobranza_diaria")
    }
    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    const onSubmit = handleSubmit(async (data) => {
        event.preventDefault;
        let res = null;
        data.numero = currentID
        if (accion === "Eliminar") {
            showModal(false);
            const confirmed = await confirmSwal(
                "¿Desea Continuar?",
                "Se eliminara la aplicacion  seleccionado",
                "warning",
                "Aceptar",
                "Cancelar"
            )
            if (!confirmed) {
                showModal(true);
                return;
            }
        }
        data.importe_movimiento= Elimina_Comas(data.importe_movimiento)
        res = await guradaAplicacion1(session.user.token, data, accion)                
        if (res.status) {
            if (accion === "Alta") {
                const nuevaAplicacion1 = { currentID, ...data }
                setAplicaciones([...aplicaciones, nuevaAplicacion1])
            }
            if (accion === "Eliminar" || accion === "Editar") {
                const index = aplicaciones.findIndex((c) => c.numero === data.numero)
                if (index !== -1) {
                    if (accion === "Eliminar") {
                        const aFiltrados = aplicaciones.filter(
                            (c) => c.numero !== data.numero
                        )
                        setAplicaciones(aFiltrados)
                    } else {
                        const aActualizadas = aplicaciones.map((c) =>
                            c.numero === currentID ? { ...c, ...data } : c
                        )
                        setAplicaciones(aActualizadas)
                    }
                }
            }
        }
        showSwal(res.alert_title, res.alert_text, res.alert_icon)
        showModal(false)
    })
    const showModalVista = (show) => {
        show
            ? document.getElementById("modalVPActAplica").showModal()
            : document.getElementById("modalVPActAplica").close();
    };
    const handleVerClick = async () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Poliza de Ingresos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
        }
        const Enca1 = (doc) => {
            if (!doc.tiene_encabezado) {
                doc.imprimeEncabezadoPrincipalV();
                doc.nextRow(12);
                doc.ImpPosX("numero", 14, doc.tw_ren, 0, "L");
                doc.ImpPosX("cuenta", 34, doc.tw_ren, 0, "L");
                doc.ImpPosX("cargo", 64, doc.tw_ren, 0, "L");
                doc.ImpPosX("abono", 94, doc.tw_ren, 0, "L");
                doc.ImpPosX("referencia", 114, doc.tw_ren, 0, "L");
                doc.ImpPosX("fecha", 164, doc.tw_ren, 0, "L");
                doc.nextRow(4);
                doc.printLineV();
                doc.nextRow(4);
                doc.tiene_encabezado = true;
            } else {
                doc.nextRow(6);
                doc.tiene_encabezado = true;
            }
        }
        const reporte = new ReportePDF(configuracion)
        Enca1(reporte)
        let sumAbono = 0
        let sumCargo = 0
        aplicaciones.forEach((aplicacion) => {
            reporte.ImpPosX(aplicacion.numero.toString(), 24, reporte.tw_ren, 0, "R")
            reporte.ImpPosX(aplicacion.numero_cuenta.toString(), 34, reporte.tw_ren, 0, "L")
            const abono = aplicacion.cargo_abono === "A" ? Elimina_Comas(Number(aplicacion.importe_movimiento)) : 0
            const cargo = aplicacion.cargo_abono === "C" ? Elimina_Comas(Number(aplicacion.importe_movimiento)) : 0
            sumAbono += abono
            sumCargo += cargo
            reporte.ImpPosX(formatNumber(cargo.toString()), 74, reporte.tw_ren, 0, "R")
            reporte.ImpPosX(formatNumber(abono.toString()), 104, reporte.tw_ren, 0, "R")
            reporte.ImpPosX(aplicacion.referencia, 114, reporte.tw_ren, 0, "L")
            reporte.ImpPosX(aplicacion.fecha_referencia, 164, reporte.tw_ren, 0, "L")
            Enca1(reporte)
            if (reporte.tw_ren >= reporte.tw_endRen) {
                reporte.pageBreak();
                Enca1(reporte);
            }
        })
        reporte.nextRow(6)
        reporte.ImpPosX("Total", 34, reporte.tw_ren, 0, "L")
        reporte.ImpPosX(formatNumber(sumCargo), 74, reporte.tw_ren, 0, "R")
        reporte.ImpPosX(formatNumber(sumAbono), 104, reporte.tw_ren, 0, "R")
        const pdfData = reporte.doc.output("datauristring");
        setPdfData(pdfData);
        setPdfPreview(true);
        showModalVista(true)
    }
    const PDF = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Reporte Poliza de Ingresos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: aplicaciones
        }
        Imprimir(configuracion)
    }
    const ImprimeExcel = () => {
        const data = []
        let sumAbono = 0
        let sumCargo = 0
        aplicaciones.map((aplicacion) => {
            const abono = aplicacion.cargo_abono === "A" ? Elimina_Comas(Number(aplicacion.importe_movimiento)) : 0
            const cargo = aplicacion.cargo_abono === "C" ? Elimina_Comas(Number(aplicacion.importe_movimiento)) : 0
            sumAbono += abono
            sumCargo += cargo
            data.push({
                numero: aplicacion.numero,
                numero_cuenta: aplicacion.numero_cuenta,
                cargo: formatNumber(cargo),
                abono: formatNumber(abono),
                referencia: aplicacion.referencia,
                fecha_referencia: aplicacion.fecha_referencia
            })
        })
        data.push({
            numero: "",
            numero_cuenta: "Total",
            cargo: formatNumber(sumCargo),
            abono: formatNumber(sumAbono),
            referencia: "",
            fecha_referencia: ""
        })
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Reporte Poliza de Ingresos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: data,
            columns: [
                { header: "Numero", dataKey: "numero" },
                { header: "Cuenta", dataKey: "numero_cuenta" },
                { header: "Cargo", dataKey: "cargo" },
                { header: "Abono", dataKey: "abono" },
                { header: "Referencia", dataKey: "referencia" },
                { header: "Fecha", dataKey: "fecha_referencia" },
            ],
            nombre:"Act Aplica"
        }
        ImprimirExcel(configuracion)
    }
    const handleBlur = (evt) => {
        if (evt.target.value === "") {
            evt.target.value = 0
            setValue(evt.target.name, 0)
            return
        };
        setAplicacion((apl) => ({
            ...apl,
            [evt.target.name]: formatNumber(evt.target.value, 2)
        }))
        setValue(evt.target.name, formatNumber(evt.target.value, 2))
    }
    const handleInputClick = (evt) => {
        evt.preventDefault();
        evt.target.select();
    };
    return (
        <>
            <ModalVistaPreviaActAplica
                pdfData={pdfData}
                pdfPreview={pdfPreview}
                PDF={PDF}
                Excel={ImprimeExcel}
            />
            <ModalAplicacion1
                accion={accion}
                currentID={currentID}
                errors={errors}
                register={register}
                onSubmit={onSubmit}
                handleInputClick={handleInputClick}
                handleBlur={handleBlur}
            />
            <div className='container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden'>
                <div className='flex flex-col justify-start p-3'>
                    <div className='flex flex-wrap md:flex-nowrap items-start md:items-center'>
                        <div className='order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0'>
                            <Acciones
                                Alta={Alta}
                                home={home}
                                cobranzaD={cobranzaD}
                                ver={handleVerClick}
                            />
                        </div>
                        <h1 className='order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5'>
                            Actualiza aplicación contable
                        </h1>
                    </div>
                </div>
                <div className='flex flex-col items-center h-full'>
                    <div className='w-full max-w-4xl'>
                        <TablaAplicacion1
                            aplicaciones={aplicaciones}
                            isLoading={isLoading}
                            setAccion={setAccion}
                            setAplicacion={setAplicacion}
                            setCurrentID={setCurrentId}
                            showModal={showModal}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Act_Aplica
