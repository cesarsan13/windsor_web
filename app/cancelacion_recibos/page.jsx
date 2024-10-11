"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/cancelacion_recibos/components/Acciones";
import { useSession } from "next-auth/react";
import Inputs from "@/app/cancelacion_recibos/components/Inputs";
import { procesoCartera } from "@/app/utils/api/cancelacion_recibo/cancelacion_recibo";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { format_Fecha_String } from "../utils/globalfn";

function Cancelacion_Recibo() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setisLoading] = useState(false);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const date = `${yyyy}-${mm}-${dd}`;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fecha: date,
            recibo: 0,
        },
    });

    const Proceso = handleSubmit(async (data) => {
        const { token } = session.user;
        setisLoading(true);
        if (data.recibo === 0) {
            showSwal(
                "Error: Cancelación de Recibo",
                "Número de recibo invalido.",
                "error"
            );
            setisLoading(false);
            return;
        }
        const year = data.fecha.substring(0, 4);
        const mes = parseInt(data.fecha.substring(5, 7));
        const dia = data.fecha.substring(8, 10);
        const formatdate = `${year}/${mes}/${dia}`;
        data.fecha = formatdate;
        const res = await procesoCartera(token, data);
        if (res.status) {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
        } else {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
        }
        setisLoading(false);
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
            <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
                <div className="flex flex-col justify-start p-3">
                    <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
                        <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0 pr-4">
                            <Acciones
                                isLoadingRef={isLoading}
                                Bproceso={Proceso}
                                home={home}
                            />
                        </div>

                        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around w-auto">
                            Cancelación de Recibo.
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
                    <div className="col-span-7">
                        {/* <form onSubmit={onSubmit}> */}
                        <div className="flex flex-col h-[calc(100%)] space-y-4">
                            <Inputs
                                dataType={"int"}
                                name={"recibo"}
                                tamañolabel={"w-[22%]"}
                                className={"w-[50%] text-right"}
                                Titulo={"Recibo: "}
                                type={"text"}
                                requerido={true}
                                errors={errors}
                                register={register}
                                message={"Recibo Requerido"}
                                isDisabled={false}
                                maxLenght={7}
                            />
                            <Inputs
                                dataType={"string"}
                                name={"fecha"}
                                tamañolabel={"w-[22%]"}
                                className={"w-auto text-left"}
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
                        {/* </form> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cancelacion_Recibo;