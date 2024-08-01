import { Elimina_Comas, formatNumber, pone_ceros } from "@/app/utils/globalfn"
import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/cajeros/components/Inputs";
import BuscarCat from "@/app/components/BuscarCat";
import { useForm } from "react-hook-form";
import { showSwalAndWait } from "@/app/utils/alerts";
import { guardarDetallePedido, guardaEcabYCobrD, Imprimir } from "@/app/utils/api/pagos1/pagos1"
import { FaSpinner } from "react-icons/fa";
function ModalPagoImprime({
    session,
    showModal,
    formaPagoPage,
    pagosFiltrados,
    alumnos1,
    productos1,
    comentarios1,
    cajero,
    alumnos
}) {
    const [error, setError] = useState(null);
    const columnasBuscaCat = ["id", "descripcion"];
    const nameInputs = ["id", "descripcion"];
    const [Handlepago, setPago] = useState([]);
    const [formpago, setFormPago] = useState({});
    const [formpago2, setFormPago2] = useState({});
    const [cargado, setCargado] = useState(false);
    const [isLoading, setisLoading] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
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

    useEffect(() => {
        const fetchData = async () => {
            if (cargado === false) {
                const { token } = session.user;

            }
        };
        fetchData();
    }, [session, reset]);


    useEffect(() => {
        reset({
            pago: formaPagoPage.pago,
            pago_2: "0.00",
            referencia: "",
            referencia_2: "",
            num_copias: 1,
            recibo_imprimir: formaPagoPage.recibo,
        });
    }, [showModal, reset]);

    // const formaImprime = async (dataSub) => {
    //     console.log(dataSub);
    //     let data;
    //     const { token } = session.user;
    //     const fechaIniFormateada = fecha_ini ? fecha_ini.replace(/-/g, '/') : 0;
    //     const fechaFinFormateada = fecha_fin ? fecha_fin.replace(/-/g, '/') : 0;
    //     data = await getRelaciondeRecibos(token, tomaFechas, fechaIniFormateada, fechaFinFormateada, factura_ini, factura_fin, recibo_ini, recibo_fin, alumno_ini.id, alumno_fin.id);
    //     console.log('data get report', data);
    //     return data;
    // };

    const onSubmitModal = handleSubmit(async (data) => {
        try {
            const { token } = session.user;
            let newData;
            let res;
            if (formaPagoPage.recibo <= 0) { showModal(false); await showSwalAndWait("", "El recibo debe ser mayor a 0", "info"); showModal(true); return; }
            let totalFormat = Elimina_Comas(formaPagoPage.pago);
            let imp_pago = Elimina_Comas(data.pago);
            let imp_pago2 = Elimina_Comas(data.pago_2);
            const totalPago = (imp_pago + imp_pago2);

            if (totalFormat !== totalPago) { showModal(false); await showSwalAndWait("", "Diferencia entre el total recibido contra el pago", "info"); showModal(true); return; }
            if (data.pago_2 > 0 && data.referencia_2 === "") { showModal(false); await showSwalAndWait("", "Es necesario seleccionar segundo pago", "info"); showModal(true); return; }
            setisLoading(true);
            for (const pago of pagosFiltrados) {
                const pagoUnitF = Elimina_Comas(pago.precio_base)
                newData = {
                    recibo: data.recibo_imprimir || 0,
                    alumno: pago.alumno || 0,
                    fecha: formaPagoPage.fecha || '',
                    articulo: pago.numero || 0,
                    cantidad: pago.cantidad_producto || 0,
                    precio_unitario: pagoUnitF || 0,
                    descuento: pago.descuento || 0,
                    documento: pago.documento || 0,
                    total_general: totalFormat || 0,
                };
                // console.log(`primero`, newData);
                res = await guardarDetallePedido(token, newData)
            }

            const postNewData = {
                recibo: data.recibo_imprimir || 0,
                alumno: alumnos1.id || 0,
                fecha: formaPagoPage.fecha || '',
                articulo: productos1.id || 0,
                cajero: cajero.numero || 0,
                total_neto: totalFormat || 0,
                n_banco: formpago.id || 0,
                imp_pago: imp_pago || 0,
                referencia_1: data.referencia || '',
                n_banco_2: formpago2.id || 0,
                imp_pago_2: imp_pago2 || 0,
                referencia_2: data.referencia_2 || '',
                quien_paga: data.quien_paga || '',
                comenta: comentarios1.id || '',
                comentario_ad: formaPagoPage.comentario_ad || '',
            }
            res = await guardaEcabYCobrD(token, postNewData)
            // if (res.status) {        
            const pagoFiltrado = formaImprime(data);
            const encaPago = formaEnca(data);
            const configuracion = {
                Encabezado: {
                    Nombre_Aplicacion: "Sistema de Control Escolar",
                    Nombre_Reporte: "Pagos",
                    Nombre_Usuario: `Usuario: ${session.user.name}`,
                },
                body: pagoFiltrado,
                encaBody: encaPago,
                // encaBody: Old_Standard_TT,
            };
            Imprimir(configuracion);
            setisLoading(false);
            showModal(false);
        } catch (e) {
            setisLoading(false);
        }
        // } else { }
    });

    const formaImprime = (dataSubmit) => {
        console.log(dataSubmit);
        console.log(pagosFiltrados);
        console.log(formaPagoPage);
        let body = [];
        for (const item of pagosFiltrados) {
            const formaPagoFind = alumnos.find(forma => forma.id === item.alumno);
            const data = {
                alumno_id: formaPagoFind.id || '',
                alumno_nombre_completo: formaPagoFind.nombre_completo || '',
                articulo_id: item.numero || '',
                articulo_nombre: item.descripcion || '',
                nom_doc: formaPagoFind.nom_pediatra || '',
                cantidad: item.cantidad_producto || '',
                precio: item.total || '',
                importe: item.precio_base || '',
            };
            body.push(data);
        }

        console.log('data get report', body);
        return body;
    };

    const formaEnca = (dataSubmit) => {
        let data = {
            fecha: formaPagoPage.fecha || '',
            alumno_seleccionado: alumnos1.id || '',
            numero_recibo: formaPagoPage.recibo || '',
            forma_pago_descripcion: formpago.descripcion || '',
            comentario: comentarios1.comentario_1 || '',
            cajero_descripcion: cajero.nombre || '',
            tota_general: formaPagoPage.pago || '',
        }
        console.log('data get report', data);
        return data;
    };

    const handleBlur = (evt, datatype) => {
        if (evt.target.value === "") return;
        datatype === "int"
            ? setPago((alumno) => ({
                ...alumno,
                [evt.target.name]: pone_ceros(evt.target.value, 0, true),
            }))
            : setPago((alumno) => ({
                ...alumno,
                [evt.target.name]: pone_ceros(evt.target.value, 2, true),
            }));
    };

    return (
        <dialog id="my_modal_4" className="modal">
            <div className="modal-box w-full h-full">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => document.getElementById("my_modal_4").close()}
                >
                    ✕
                </button>
                <form onSubmit={onSubmitModal}>
                    <h3 className="font-bold text-lg mb-5">Imprime</h3>
                    <fieldset id="fs_pagoimprime">
                        <div className="container flex flex-col space-y-5">
                            <div className="w-auto p-4 border dark:border-gray-300 border-black rounded-lg">
                                <h2 className="text-lg font-bold mb-4 dark:text-white text-black">Pago Parcial</h2>
                                <div className="flex flex-col space-y-2">
                                    <label className=" items-center space-x-2 dark:text-white text-black">
                                        <BuscarCat
                                            table="formaPago"
                                            fieldsToShow={columnasBuscaCat}
                                            nameInput={nameInputs}
                                            titulo={" "}
                                            setItem={setFormPago}
                                            token={session.user.token}
                                            modalId="modal_formpago"
                                            id={formaPagoPage.forma_pago_id}
                                        />
                                    </label>
                                    <label className=" items-center space-x-2 dark:text-white text-black">
                                        <Inputs
                                            tipoInput={""}
                                            dataType={"int"}
                                            name={"pago"}
                                            tamañolabel={""}
                                            className={`grow text-right`}
                                            Titulo={"Pago: "}
                                            type={"text"}
                                            requerido={false}
                                            errors={errors}
                                            register={register}
                                            message={"Pago requerido"}
                                            isDisabled={false}
                                            handleBlur={handleBlur}
                                            maxLength={8}
                                        />
                                    </label>
                                    <label className=" items-center space-x-2 dark:text-white text-black">
                                        <Inputs
                                            tipoInput={""}
                                            dataType={"string"}
                                            name={"referencia"}
                                            tamañolabel={""}
                                            className={`grow`}
                                            Titulo={"Referencia: "}
                                            type={"text"}
                                            requerido={false}
                                            errors={errors}
                                            register={register}
                                            message={"Referencia requerido"}
                                            isDisabled={false}
                                            handleBlur={handleBlur}
                                            maxLength={8}
                                        />
                                    </label>
                                </div>
                            </div>
                            {/*  */}
                            <div className="w-auto p-4 border dark:border-gray-300 border-black rounded-lg">
                                <h2 className="text-lg font-bold mb-4 dark:text-white text-black">Pago Parcial</h2>
                                <div className="flex flex-col space-y-2">
                                    <label className="items-center space-x-2 dark:text-white text-black">
                                        <BuscarCat
                                            table="formaPago"
                                            fieldsToShow={columnasBuscaCat}
                                            nameInput={nameInputs}
                                            titulo={" "}
                                            setItem={setFormPago2}
                                            token={session.user.token}
                                            modalId="modal_formpago2"
                                        />
                                    </label>
                                    <label className="items-center space-x-2 dark:text-white text-black">
                                        <Inputs
                                            tipoInput={""}
                                            dataType={"float"}
                                            name={"pago_2"}
                                            tamañolabel={""}
                                            className={`grow text-right`}
                                            Titulo={"Pago: "}
                                            type={"text"}
                                            requerido={false}
                                            errors={errors}
                                            register={register}
                                            message={"Pago requerido"}
                                            isDisabled={false}
                                            handleBlur={handleBlur}
                                            maxLength={8}
                                        />
                                    </label>
                                    <label className="items-center space-x-2 dark:text-white text-black">
                                        <Inputs
                                            tipoInput={""}
                                            dataType={"string"}
                                            name={"referencia_2"}
                                            tamañolabel={""}
                                            className={`grow`}
                                            Titulo={"Referencia: "}
                                            type={"text"}
                                            requerido={false}
                                            errors={errors}
                                            register={register}
                                            message={"Referencia requerido"}
                                            isDisabled={false}
                                            handleBlur={handleBlur}
                                            maxLength={50}
                                        />
                                    </label>
                                </div>
                            </div>
                            <Inputs
                                tipoInput={""}
                                dataType={"string"}
                                name={"quien_paga"}
                                tamañolabel={""}
                                className={`grow`}
                                Titulo={"Paga: "}
                                type={"text"}
                                requerido={false}
                                errors={errors}
                                register={register}
                                message={"Paga requerido"}
                                isDisabled={false}
                                handleBlur={handleBlur}
                                maxLength={50}
                            />
                            <Inputs
                                tipoInput={""}
                                dataType={"int"}
                                name={"recibo_imprimir"}
                                tamañolabel={""}
                                className={`grow text-right`}
                                Titulo={"Recibo Imprimir: "}
                                type={"text"}
                                requerido={false}
                                errors={errors}
                                register={register}
                                message={"Paga requerido"}
                                isDisabled={false}
                                handleBlur={handleBlur}
                                maxLength={10}
                            />
                            <Inputs
                                tipoInput={""}
                                dataType={"int"}
                                name={"num_copias "}
                                tamañolabel={""}
                                className={`grow text-right`}
                                Titulo={"Número de Copias: "}
                                type={"text"}
                                requerido={false}
                                errors={errors}
                                register={register}
                                message={"num_copias requerido"}
                                isDisabled={false}
                                handleBlur={handleBlur}
                                maxLength={5}
                            />
                        </div>
                    </fieldset>
                    <div className="modal-action">
                        <div
                            className="tooltip tooltip-top my-5 hover:cursor-pointer"
                            data-tip="Imprimir"
                        >
                            <button
                                type="submit"
                                id="btn_imprimir"
                                className="btn bg-blue-500 hover:bg-blue-700 text-white relative"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <FaSpinner className="animate-spin mx-2" />
                                ) : (
                                    <i className="fas fa-file-pdf mx-2"></i>
                                )}
                                {isLoading ? " Cargando..." : " Imprimir"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </dialog>
    );
}

export default ModalPagoImprime;
