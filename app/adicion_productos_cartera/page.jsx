"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/adicion_productos_cartera/components/Acciones";
import { useSession } from "next-auth/react";
import BuscarCat from "../components/BuscarCat";
import Inputs from "@/app/adicion_productos_cartera/components/Inputs";
import { actualizarCartera, procesoCartera } from "@/app/utils/api/adicion_productos_cartera/adicion_productos_cartera";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { formatDate } from "../utils/globalfn";

function Adicion_Productos_Cartera() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [articulo, setArticulos] = useState("");
    const [cond_ant, setCondAnt] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isLoading2, setisLoading2] = useState(false);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const date = `${yyyy}-${mm}-${dd}`;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fecha: date,
            periodo: 0,
        },
    });

    const ActRef = handleSubmit(async (data) => {
        const { token } = session.user;
        setisLoading(true);
        if (articulo.cond_1 === 0) {
            showSwal(
                "Error: Generacion Cobranza",
                "Condicion Invalida.",
                "error"
            );
            setisLoading(false);
            return;
        }
        if (data.periodo === 0) {
            showSwal(
                "Error: Generacion Cobranza",
                "Numero de periodo en 0.",
                "error"
            );
            setisLoading(false);
            return;
        }
        const res = await actualizarCartera(token);
        if (res.status) {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            setCondAnt(res.data);
        } else {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
        }
        setisLoading(false);
    });

    const onSubmitProceso = handleSubmit(async (data) => {
        const { token } = session.user;
        setisLoading2(true);
        if (articulo.cond_1 === 0) {
            showSwal(
                "Error: Generacion Cobranza",
                "Condicion Invalida.",
                "error"
            );
            setisLoading2(false);
            return;
        }
        if (data.periodo === 0) {
            showSwal(
                "Error: Generacion Cobranza",
                "Numero de periodo en 0.",
                "error"
            );
            setisLoading2(false);
            return;
        }
        data.cond_ant = cond_ant;
        data.cond_1 = articulo.cond_1;
        const res = await procesoCartera(token, data);
        if (res.status) {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            setisLoading2(false);
        } else {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            setisLoading2(false);
        }
    });

    const home = () => {
        router.push("/");
    };

    if (status === "loading") {
        return (
            <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
        );
    }
    return (
        <>
            <div className='container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden'>
                <div className='flex flex-col justify-start p-3'>
                    <div className='flex flex-wrap md:flex-nowrap items-start md:items-center'>
                        <div className='order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0'>
                            <Acciones
                                isLoadingRef={isLoading}
                                isLoadingProc={isLoading2}
                                BRef={ActRef}
                                Bproceso={onSubmitProceso}
                                home={home}
                            />
                        </div>

                        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                            Proceso de Adición a Cobranza.
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col items-center h-full">
                    <div className="w-full max-w-4xl">
                        <BuscarCat
                            table="productos_cond"
                            itemData={[]}
                            fieldsToShow={["numero", "descripcion"]}
                            nameInput={["numero", "descripcion"]}
                            titulo={"Articulos: "}
                            setItem={setArticulos}
                            token={session.user.token}
                            modalId="modal_articulos1"
                            alignRight={"text-right"}
                            inputWidths={{ contdef: "150px", first: "70px", second: "120px" }}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4">
                            <div className="md:col-span-1">
                                <Inputs
                                    dataType={"string"}
                                    name={"fecha"}
                                    tamañolabel={"w-full"}
                                    className={"w-4/5"}
                                    Titulo={"Fecha: "}
                                    type={"date"}
                                    requerido={true}
                                    errors={errors}
                                    register={register}
                                    message={"Fecha Requerido"}
                                    isDisabled={false}
                                    maxLenght={7}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <Inputs
                                    dataType={"int"}
                                    name={"periodo"}
                                    tamañolabel={""}
                                    className={"w-2/5 text-right"}
                                    Titulo={"Periodo: "}
                                    type={"text"}
                                    requerido={true}
                                    errors={errors}
                                    register={register}
                                    message={"Periodo Requerido"}
                                    isDisabled={false}
                                    maxLenght={7}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );


}

export default Adicion_Productos_Cartera;
