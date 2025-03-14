import BuscarCat from '@/app/components/BuscarCat';
import iconos from '@/app/utils/iconos';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Inputs from '@/app/act_cobranza/components/Inputs';

function ModalActCobranza({
    accion,
    onSubmit,
    session,
    documento,
    errors,
    register,
    setProducto,
    handleBlur,
    handleInputClick
}) {
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);    
    useEffect(() => {
        if (accion === "Eliminar" || accion === "ver") {
            setIsDisabled(true)
        }
        if (accion === "Alta" || accion === "Editar") {
            setIsDisabled(false)
        }
        setTitulo(
            accion === "Alta"
                ? `Nueva Cobranza`
                : accion === "Editar"
                    ? `Editar Cobranza`
                    : accion === "Eliminar"
                        ? `Eliminar Cobranza`
                        : `Ver Cobranza`
        );
    }, [accion])
    
    return (
        <dialog className='modal' id='my_modal_3'>
            <div className='modal-box bg-base-200'>
                <form onSubmit={onSubmit}>
                    <div className='sticky -top-6 flex justify-between items-center bg-base-200 w-full h-10 z-10 mb-5'>
                        <h3 className='font-bold text-lg text-neutral-600 dark:text-white'>{titulo}</h3>
                        <div className='flex space-x-2 items-center'>
                            <div className={`tooltip tooltip-bottom ${accion === "Ver"
                                ? "hover:cursor-not-allowed hidden"
                                : "hover:cursor-pointer"
                                }`} data-tip="Guardar">
                                <button
                                    type="submit"
                                    id="btn_guardar"
                                    className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm "
                                >
                                    <Image
                                        src={iconos.guardar_w}
                                        alt="Guardar"
                                        className="w-5 h-5 md:w-6 md:h-6 mr-1 hidden dark:block"
                                    />
                                    <Image
                                        src={iconos.guardar}
                                        alt="Guardar"
                                        className="w-5 h-5 md:w-6 md:h-6 mr-1 block dark:hidden"
                                    />
                                    <span className="hidden sm:inline">Guardar</span>
                                </button>
                            </div>
                            <button
                                className="btn btn-sm btn-circle btn-ghost text-neutral-600 dark:text-white"
                                onClick={(event) => {
                                    event.preventDefault();
                                    document.getElementById("my_modal_3").close();
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    <fieldset id='fs_actcobranza'>
                        <div className='container flex flex-col space-y-5'>
                            <BuscarCat
                                deshabilitado={accion === "Ver" || accion === "Eliminar" || accion === "Editar"}
                                table="productos"
                                fieldsToShow={["numero", "descripcion"]}
                                nameInput={["producto", "nombre_producto"]}
                                setItem={setProducto}
                                token={session.user.token}
                                modalId="modal_actcobranza"
                                array={1}
                                id={documento.producto}
                                titulo="Productos"
                                alignRight={true}
                                accion={accion}
                            />  
                            <Inputs
                                dataType={"int"}
                                name={"numero_doc"}
                                tamañolabel={"w-3/6"}
                                className={"w-3/6 text-right"}
                                Titulo={"Documento: "}
                                type={"text"}
                                errors={errors}
                                register={register}
                                message={"documento Requerido"}
                                isDisabled={isDisabled || accion === "Editar" || accion === "Ver"}
                            />
                            <Inputs
                                dataType={"string"}
                                name={"fecha"}
                                tamañolabel={"w-3/6"}
                                className={"rounded block grow"}
                                Titulo={"Fecha: "}
                                type={"date"}
                                maxLenght={15}
                                errors={errors}
                                register={register}
                                message={"Fecha Requerido"}
                                isDisabled={isDisabled || accion === "Editar" || accion === "Ver"}
                            />
                            <Inputs
                                dataType={"float"}
                                name={"importe"}
                                tamañolabel={"w-3/6"}
                                className={"w-3/6 text-right"}
                                Titulo={"Importe: "}
                                type={"text"}
                                errors={errors}
                                register={register}
                                message={"importe Requerido"}
                                isDisabled={isDisabled || accion === "Ver"}
                                handleBlur={handleBlur}
                                requerido={true}
                                onClick={handleInputClick}
                            />
                            <Inputs
                                dataType={"float"}
                                name={"descuento"}
                                tamañolabel={"w-3/6"}
                                className={"w-3/6 text-right"}
                                Titulo={"Descuento: "}
                                type={"text"}
                                errors={errors}
                                register={register}
                                message={"descuento Requerido"}
                                isDisabled={isDisabled || accion === "Ver"}
                                handleBlur={handleBlur}
                                requerido={false}
                                onClick={handleInputClick}
                            />
                        </div>
                    </fieldset>
                </form>
            </div>
        </dialog>
    )
}

export default ModalActCobranza
