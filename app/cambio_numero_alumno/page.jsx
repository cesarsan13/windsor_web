"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/cambio_numero_alumno/components/Acciones";
import { useSession } from "next-auth/react";
import BuscarCat from "../components/BuscarCat";
import Inputs from "@/app/cambio_numero_alumno/components/Inputs";
import { cambiarIdAlumno } from "@/app/utils/api/cambio_numero_alumno/cambio_numero_alumno";
import { showSwal, confirmSwal } from "@/app/utils/alerts";

function Cambio_Numero_Alumno() {
    const router = useRouter();
    const { data: session, status } = useSession();
    // const [isLoading, setisLoading] = useState(false);
    let [alumno, setAlumnoIni] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            numero_nuevo: 0,
        },
    });

    const onSubmit = handleSubmit(async (data) => {
        const { token } = session.user;
        data.numero_ant = alumno.numero
        const confirmed = await confirmSwal(
            "¿Desea Continuar?",
            "Se cambiara el numero del alumno por el ingresado.",
            "warning",
            "Aceptar",
            "Cancelar"
        );
        if (!confirmed) {
            return;
        }
        const res = await cambiarIdAlumno(token, data);
        console.log(data);
        if (res.status) {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            home();
        } else {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
        }
    });

    const home = () => {
        router.push("/");
    };

    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    return (
        <>
            <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
                <div className="flex flex-col justify-start p-3">
                    <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
                        <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
                            <Acciones
                                Alta={onSubmit}
                                home={home}
                            />
                        </div>

                        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around w-auto">
                            Cambio de Numero Alumno.
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
                    <div className="col-span-7">
                        <form onSubmit={onSubmit}>
                            <div className="flex flex-col h-[calc(100%)] space-y-4">
                                <BuscarCat
                                    table="alumnos"
                                    itemData={[]}
                                    fieldsToShow={["numero", "nombre_completo"]}
                                    nameInput={["numero", "nombre_completo"]}
                                    titulo={"Alumnos: "}
                                    setItem={setAlumnoIni}
                                    token={session.user.token}
                                    modalId="modal_alumnos1"
                                    inputWidths={{ first: "100px", second: "300px" }}
                                />
                                <Inputs
                                    dataType={"int"}
                                    name={"numero_nuevo"}
                                    tamañolabel={"w-96"}
                                    className={"w-auto text-right"}
                                    Titulo={"Numero de Alumno Nuevo: "}
                                    type={"text"}
                                    requerido={true}
                                    errors={errors}
                                    register={register}
                                    message={"Cambio Numero Requerido"}
                                    isDisabled={false}
                                    maxLenght={7}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cambio_Numero_Alumno;