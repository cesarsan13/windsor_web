import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import React from 'react'

function AccessDenied() {
    const router = useRouter();
    const home = () => { 
        router.push("/");
    };
    const handleSingOut = async () => {
        await signOut({ redirect: true, callbackUrl: "/control_escolar" });
    };
    return (
        <div className="container flex justify-center items-center h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
            <div
                className="flex flex-col text-black dark:text-white items-center text-2xl font-bold px-4 py-3"
                role="alert"
            >
                <div className="flex justify-center items-center text-8xl mb-4">
                    <i className="fa-solid fa-circle-info"></i>
                </div>
                <h1 className="text-center mb-2 text-3xl">Acceso Denegado</h1>
                <p className="text-center mb-4 text-xl font-normal">
                    No tienes acceso a la aplicación. Por favor, contacta con el administrador.
                </p>
                <div className="flex justify-center gap-2">
                    <button className="btn btn-info text-white"
                        onClick={home}
                    >
                        Regresar a Home
                    </button>
                    <button className="btn btn-info text-white"
                        onClick={handleSingOut}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>

    )
}

export default AccessDenied
