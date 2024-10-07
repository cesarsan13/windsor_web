import React, { useState, useEffect } from "react";
import TablaDoc from "@/app/pagos1/components/tablaDoc";

function ModalDocTabla({ session, docFiltrados, isLoading, tableSelect }) {
    return (
        <dialog id="my_modal_5" className="modal">
            <div className="modal-box w-auto h-auto">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => document.getElementById("my_modal_5").close()}
                >
                    ✕
                </button>
                <h3 className="font-bold text-lg mb-5">Relación de documentos a cobro</h3>
                <fieldset id="fs_pagoimprime">
                    <div className="container flex flex-col space-y-5">
                        <TablaDoc
                            docFiltrados={docFiltrados}
                            isLoading={isLoading}
                            tableSelect={tableSelect}
                        />
                    </div>
                </fieldset>
            </div>
        </dialog>
    );
}

export default ModalDocTabla;
