import { Elimina_Comas, formatNumber, pone_ceros } from "@/app/utils/globalfn"
import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/cajeros/components/Inputs";
import BuscarCat from "@/app/components/BuscarCat";
import { useForm } from "react-hook-form";

function ModalPagoImprime({
    session,
    showModal,
    formaPagoPage,
    pagosFiltrados
}) {
    const [error, setError] = useState(null);
    const columnasBuscaCat = ["id", "descripcion"];
    const nameInputs = ["id", "descripcion"];
    const [Handlepago, setPago] = useState([]);
    const [formpago, setFormPago] = useState({});
    const [formpago2, setFormPago2] = useState({});

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
        // if (showModal) {
        reset({
            pago: formaPagoPage.pago,
            pago_2: "0.00",
            referencia: "",
            referencia_2: "",
            num_copias: 1,
            recibo_imprimir: formaPagoPage.recibo,
        });
        // document.getElementById("my_modal_4").showModal();
        // } else {
        //     document.getElementById("my_modal_4").close();
        // }
    }, [showModal, reset]);

    const onSubmitModal = handleSubmit(async (data) => {
        console.log(data);
        if (formaPagoPage.recibo <= 0) { showSwal("", "El recibo debe ser mayor a 0", "info"); return; }
        let totalFormat = Elimina_Comas(formaPagoPage.total);
        let imp_pago = Elimina_Comas(data.pago);
        let imp_pago2 = Elimina_Comas(data.pago_2);

        const totalGeneralRounded = Math.round(totalFormat * 100) / 100;
        const totalPago = Math.round((imp_pago + imp_pago2) * 100) / 100;
        console.log(totalGeneralRounded, totalPago);
        if (totalGeneralRounded !== totalPago) { showSwal("", "Diferencia entre el total recibido contra el pago", "info"); return; }
        if (data.pago_2 > 0 && data.referencia_2 === "") { showSwal("", "Es necesario seleccionar segundo pago", "info"); return; }


    });

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
                    <div className=" modal-action">
                        <div
                            className={"tooltip tooltip-top my-5 hover:cursor-pointer"}
                            data-tip="Guardar"
                        >
                            <button
                                type="submit"
                                id="btn_imprimir"
                                className="btn  bg-blue-500 hover:bg-blue-700 text-white"
                            >
                                <i className="fas fa-file-pdf mx-2"></i> Imprimir
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </dialog>
    );
}

export default ModalPagoImprime;
