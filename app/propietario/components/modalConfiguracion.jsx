function ModalConfiguracion({}){
    

    
    return(
        <>
            <dialog id="modal_Configuracion" className="modal">
                <div className="modal-box w-full max-w-7xl h-full bg-base-200">
                    <form  encType="multipart/form-data">
                        <div className="sticky -top-6 flex justify-between items-center bg-base-200 w-full h-10 z-10 mb-5">
                                <h2 className="font-bold text-lg text-neutral-600 dark:text-white"> Configuracion </h2>
                                <div className=" tooltip flex space-x-2 items-center">
                                <button
                                  className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    document.getElementById("modal_Configuracion").close();
                                  }}
                                >
                                  ✕
                                </button>
                                </div>
                            </div>
                        </form>
                </div>
            </dialog>
        </>
    );
}
export default ModalConfiguracion;