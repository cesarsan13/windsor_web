'use client'
import React from 'react'
import ModalComponent from "@/app/components/Catalogs_Components/modalComponent";
import TableComponent from "@/app/components/Catalogs_Components/tableComponent";
import Acciones from '@/app/actividades/components/Acciones';
import Busqueda from '@/app/actividades/components/Busqueda';
import VistaPrevia from "@/app/components/VistaPrevia";
import ModalProcesarDatos from '@/app/components/modalProcesarDatos';
import BarraCarga from '@/app/components/BarraCarga';
import { useActividadesPdfExcel } from '@/app/actividades/Hooks/useActividadesPdfExcel';
import { useActividadesABC } from '@/app/actividades/Hooks/useActividadesABC';
import { useActividadesUI } from '@/app/actividades/Hooks/useActividadesUI';
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";


function Actividades() {
    const {
        onSubmitModal,
        Buscar,
        Alta,
        home,
        setBajas,
        limpiarBusqueda,
        handleBusquedaChange,
        fetchActividadStatus,
        setReloadPage,
        setisLoadingButton,
        tableAction,
        register,
        status,
        session,
        isLoadingButton,
        isLoading,
        accion,
        permissions,
        active,
        inactive,
        busqueda,
        ActividadesFiltradas,
        titulo,
        reload_page,
        isDisabled,
        errors,
        inactiveActive,
        asignaturas,
        handleAsignaturaChange
    } = useActividadesABC();

    const{
        handleVerClick,
        CerrarView,
        ImprimePDF,
        ImprimeExcel,
        handleFileChange,
        buttonProcess,
        procesarDatos,
        setDataJson,
        pdfPreview,
        pdfData,
        animateLoading,
        porcentaje,
        cerrarTO,
        dataJson
    } = useActividadesPdfExcel(
        ActividadesFiltradas,
        session,
        reload_page,
        inactiveActive,
        busqueda,
        fetchActividadStatus,
        setReloadPage,
        setisLoadingButton
    );

    const {
        itemHeaderTable,
        itemDataTable,
        tableColumns,
        tableBody,
        modalBody,
        sinZebra
    } = useActividadesUI(
        tableAction,
        register,
        permissions,
        isDisabled,
        errors,
        asignaturas,
        handleAsignaturaChange
    );
    
    if (status === "loading" && !session) {
        return (
          <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
        );
    };

    return (
        <>
            <BarraCarga 
                porcentaje={porcentaje} 
                cerrarTO={cerrarTO}
            />
            <ModalProcesarDatos
              id_modal={"my_modal_actividades"}
              session={session}
              buttonProcess={buttonProcess}
              isLoadingButton={isLoadingButton}
              isLoading={isLoading}
              title={"Procesar Datos desde Excel."}
              setDataJson={setDataJson}
              dataJson={dataJson}
              handleFileChange={handleFileChange}
              itemHeaderTable={itemHeaderTable}
              itemDataTable={itemDataTable}
              //clase para mover al tamaño del modal a preferencia (max-w-4xl)
              classModal={"modal-box w-full max-w-4xl h-full bg-base-200"}
            />

            <ModalComponent
                accion={accion}    
                onSubmit={onSubmitModal}
                isLoadingButton={isLoadingButton}
                titulo={titulo}
                modalBody={modalBody}
            />

            <VistaPrevia 
                id={"modalVPActividades"}
                titulo={"Vista Previa Actividades"}
                pdfData={pdfData} 
                pdfPreview={pdfPreview} 
                PDF={ImprimePDF}
                Excel={ImprimeExcel} 
                CerrarView={CerrarView}
            />

            <div className='container h-[85vh] w-full max-w-[1800px] bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden'>
                <div className='flex flex-col justify-start p-3'>
                    <div className='flex flex-wrap md:flex-nowrap items-start md:items-center'>
                        <div className='order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0'>
                            <Acciones
                                Alta={Alta}
                                Ver={handleVerClick}
                                Buscar={Buscar}
                                procesarDatos={procesarDatos}
                                animateLoading={animateLoading}
                                permiso_alta={permissions.altas}
                                permiso_imprime={permissions.impresion}
                                home={home}
                                es_admin={session?.user?.es_admin || false}
                            />
                        </div>
                        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                            Actividades
                        </h1>
                        <h3 className="ml-auto order-3 text-black dark:text-white">{`Actividades Activas: ${
                          active || 0
                        }\nActividades Inactivas: ${inactive || 0}`}</h3>
                    </div>
                </div>
                <div className='flex flex-col items-center h-full'>
                    <div className='w-full max-w-full'>
                        <Busqueda
                            busqueda={busqueda}
                            Buscar={Buscar}
                            handleBusquedaChange={handleBusquedaChange}
                            limpiarBusqueda={limpiarBusqueda}
                            setBajas={setBajas}
                        />
                        {status === "loading" || (!session ? (
                            <></>
                        ) : (
                            <TableComponent
                                data={ActividadesFiltradas}
                                session = {session}
                                isLoading={isLoading}
                                tableColumns={tableColumns}
                                tableBody={tableBody}
                                sinZebra={sinZebra}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Actividades;
