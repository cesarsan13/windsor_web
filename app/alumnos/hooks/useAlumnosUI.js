import React from "react";
import Inputs from "@/app/alumnos/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import BuscarCat from "@/app/components/BuscarCat";
import Webcam from "react-webcam";
import Image from "next/image";
import { useRef, useState } from "react";
import { handleBlur, openFileSelector, handleFileChange} from "@/app/utils/globalfn";
import { useSession } from "next-auth/react";
export const useAlumnosUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors,
    alumno,
    setcond1,
    setcond2
) => {
    const { data: session, status } = useSession();
    const columnasBuscaCat = ["numero", "horario"];
    const nameInputs = ["horario_1", "horario_1_nombre"];
    const nameInputs2 = ["horario_2", "horario_2_nombre"];
    const [activeTab, setActiveTab] = useState(1);
    const [accion, setAccion] = useState("");
    const inputfileref = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [files, setFile] = useState(null);
    const [grado, setGrado] = useState({});
    const columnasBuscaCat1 = ["numero", "descripcion"];
    const nameInputs3 = ["cond_1", "cond_1_nombre"];
    const nameInputs4 = ["cond_2", "cond_2_nombre"];
    const webcamRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
  const [sinZebra, setSinZebra] = useState(false);

    const handleTabs = (num) => {
        setActiveTab(num);
    };

    const handleKeyDown = (evt) => {
        if (evt.key === "Enter") {
            evt.preventDefault(); 
    
            const fieldset = document.getElementById("fs_alumnos");
            const form = fieldset?.closest("form");
            if (!fieldset) return;
    
            // Seleccionar todos los inputs dentro del fieldset (excepto los de tipo checkbox, radio y button)
            const inputs = Array.from(fieldset.querySelectorAll(
                "input:not([type='checkbox']):not([type='radio']):not([type='button']):not([type='date']), textarea"
            ));    
            const currentIndex = inputs.indexOf(evt.target);
            if (currentIndex !== -1) {
                if (currentIndex < inputs.length - 1) {
                    inputs[currentIndex + 1].focus(); 
                } else {
                    const submitButton = form.querySelector("button[type='submit']");
                    if (submitButton) submitButton.click(); 
                }
            }
        }
    };

const itemHeaderTable = () => {
    return (
    <>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
        <td className="w-[20%]">Nombre</td>
        <td className="w-[20%]">A. Paterno</td>
        <td className="w-[20%]">A. Materno</td>
        <td className="w-[20%]">A. Nombre</td>
        <td className="w-[10%]">Fecha Nac.</td>
        <td className="w-[10%]">Fecha Inscripción</td>
        <td className="w-[10%]">Fecha Baja</td>
        <td className="w-[5%]">Sexo</td>
        <td className="w-[10%]">Teléfono 1</td>
        <td className="w-[10%]">Teléfono 2</td>
        <td className="w-[10%]">Celular</td>
        <td className="w-[10%]">Código Barras</td>
        <td className="w-[20%]">Dirección</td>
        <td className="w-[15%]">Colonia</td>
        <td className="w-[15%]">Ciudad</td>
        <td className="w-[10%]">Estado</td>
        <td className="w-[5%]">CP</td>
        <td className="w-[20%]">Email</td>
        <td className="w-[20%]">Ruta Foto</td>
        <td className="w-[5%]">Día 1</td>
        <td className="w-[5%]">Día 2</td>
        <td className="w-[5%]">Día 3</td>
        <td className="w-[5%]">Día 4</td>
        <td className="w-[5%]">Hora 1</td>
        <td className="w-[5%]">Hora 2</td>
        <td className="w-[5%]">Hora 3</td>
        <td className="w-[5%]">Hora 4</td>
        <td className="w-[5%]">Cancha 1</td>
        <td className="w-[5%]">Cancha 2</td>
        <td className="w-[5%]">Cancha 3</td>
        <td className="w-[5%]">Cancha 4</td>
        <td className="w-[10%]">Horario 1</td>
        <td className="w-[10%]">Horario 2</td>
        <td className="w-[10%]">Horario 3</td>
        <td className="w-[10%]">Horario 4</td>
        <td className="w-[10%]">Horario 5</td>
        <td className="w-[10%]">Horario 6</td>
        <td className="w-[10%]">Horario 7</td>
        <td className="w-[10%]">Horario 8</td>
        <td className="w-[10%]">Horario 9</td>
        <td className="w-[10%]">Horario 10</td>
        <td className="w-[10%]">Horario 11</td>
        <td className="w-[10%]">Horario 12</td>
        <td className="w-[10%]">Horario 13</td>
        <td className="w-[10%]">Horario 14</td>
        <td className="w-[10%]">Horario 15</td>
        <td className="w-[10%]">Horario 16</td>
        <td className="w-[10%]">Horario 17</td>
        <td className="w-[10%]">Horario 18</td>
        <td className="w-[10%]">Horario 19</td>
        <td className="w-[10%]">Horario 20</td>
        <td className="w-[15%]">Condición 1</td>
        <td className="w-[15%]">Condición 2</td>
        <td className="w-[15%]">Condición 3</td>
        <td className="w-[20%]">Nom. Pediatra</td>
        <td className="w-[10%]">Tel. P 1</td>
        <td className="w-[10%]">Tel. P 2</td>
        <td className="w-[10%]">Cel. P 1</td>
        <td className="w-[10%]">Tipo Sangre</td>
        <td className="w-[20%]">Alergia</td>
        <td className="w-[20%]">Aseguradora</td>
        <td className="w-[10%]">Póliza</td>
        <td className="w-[10%]">Tel. Aseg. 1</td>
        <td className="w-[10%]">Tel. Aseg. 2</td>
        <td className="w-[20%]">Razón Social</td>
        <td className="w-[20%]">Raz. Dirección</td>
        <td className="w-[10%]">Raz. CP</td>
        <td className="w-[15%]">Raz. Colonia</td>
        <td className="w-[15%]">Raz. Ciudad</td>
        <td className="w-[10%]">Raz. Estado</td>
        <td className="w-[20%]">Nombre Padre</td>
        <td className="w-[10%]">Tel. Padre 1</td>
        <td className="w-[10%]">Tel. Padre 2</td>
        <td className="w-[10%]">Cel. Padre</td>
        <td className="w-[20%]">Nombre Madre</td>
        <td className="w-[10%]">Tel. Madre 1</td>
        <td className="w-[10%]">Tel. Madre 2</td>
        <td className="w-[10%]">Cel. Madre</td>
        <td className="w-[20%]">Nombre Avi</td>
        <td className="w-[10%]">Tel. Avi 1</td>
        <td className="w-[10%]">Tel. Avi 2</td>
        <td className="w-[10%]">Cel. Avi 1</td>
        <td className="w-[10%]">Ciclo Escolar</td>
        <td className="w-[5%]">Descuento</td>
        <td className="w-[10%]">RFC Factura</td>
        <td className="w-[5%]">Estatus</td>
        <td className="w-[15%]">Escuela</td>
        <td className="w-[15%]">Grupo</td>
        <td className="w-[5%]">Baja</td>
    </>
    );
};

const itemDataTable = (item) => {
    return (
    <>
        <tr key={item.numero} className="hover:cursor-pointer">
        <th className="text-left">{item.numero}</th>
        <td>{item.nombre}</td>
        <td>{item.a_paterno}</td>
        <td>{item.a_materno}</td>
        <td>{item.a_nombre}</td>
        <td>{item.fecha_nac}</td>
        <td>{item.fecha_inscripcion}</td>
        <td>{item.fecha_baja}</td>
        <td>{item.sexo}</td>
        <td>{item.telefono1}</td>
        <td>{item.telefono2}</td>
        <td>{item.celular}</td>
        <td>{item.codigo_barras}</td>
        <td>{item.direccion}</td>
        <td>{item.colonia}</td>
        <td>{item.ciudad}</td>
        <td>{item.estado}</td>
        <td>{item.cp}</td>
        <td>{item.email}</td>
        <td>{item.imagen}</td>
        <td>{item.dia_1}</td>
        <td>{item.dia_2}</td>
        <td>{item.dia_3}</td>
        <td>{item.dia_4}</td>
        <td>{item.hora_1}</td>
        <td>{item.hora_2}</td>
        <td>{item.hora_3}</td>
        <td>{item.hora_4}</td>
        <td>{item.cancha_1}</td>
        <td>{item.cancha_2}</td>
        <td>{item.cancha_3}</td>
        <td>{item.cancha_4}</td>
        <td>{item.horario_1}</td>
        <td>{item.horario_2}</td>
        <td>{item.horario_3}</td>
        <td>{item.horario_4}</td>
        <td>{item.horario_5}</td>
        <td>{item.horario_6}</td>
        <td>{item.horario_7}</td>
        <td>{item.horario_8}</td>
        <td>{item.horario_9}</td>
        <td>{item.horario_10}</td>
        <td>{item.horario_11}</td>
        <td>{item.horario_12}</td>
        <td>{item.horario_13}</td>
        <td>{item.horario_14}</td>
        <td>{item.horario_15}</td>
        <td>{item.horario_16}</td>
        <td>{item.horario_17}</td>
        <td>{item.horario_18}</td>
        <td>{item.horario_19}</td>
        <td>{item.horario_20}</td>
        <td>{item.cond_1}</td>
        <td>{item.cond_2}</td>
        <td>{item.cond_3}</td>
        <td>{item.nom_pediatra}</td>
        <td>{item.tel_p_1}</td>
        <td>{item.tel_p_2}</td>
        <td>{item.cel_p_1}</td>
        <td>{item.tipo_sangre}</td>
        <td>{item.alergia}</td>
        <td>{item.aseguradora}</td>
        <td>{item.poliza}</td>
        <td>{item.tel_ase_1}</td>
        <td>{item.tel_ase_2}</td>
        <td>{item.razon_social}</td>
        <td>{item.raz_direccion}</td>
        <td>{item.raz_cp}</td>
        <td>{item.raz_colonia}</td>
        <td>{item.raz_ciudad}</td>
        <td>{item.raz_estado}</td>
        <td>{item.nom_padre}</td>
        <td>{item.tel_pad_1}</td>
        <td>{item.tel_pad_2}</td>
        <td>{item.cel_pad}</td>
        <td>{item.nom_madre}</td>
        <td>{item.tel_mad_1}</td>
        <td>{item.tel_mad_2}</td>
        <td>{item.cel_mad}</td>
        <td>{item.nom_avi}</td>
        <td>{item.tel_avi_1}</td>
        <td>{item.tel_avi_2}</td>
        <td>{item.cel_avi}</td>
        <td>{item.ciclo_escolar}</td>
        <td>{item.descuento}</td>
        <td>{item.rfc_factura}</td>
        <td>{item.estatus}</td>
        <td>{item.escuela}</td>
        <td>{item.grupo}</td>
        <td>{item.baja}</td>
        </tr>
    </>
    );
};

const tableColumns = (data = []) => {
    const hasBajas = data.some(item => item.baja === "*");
    return (
        <thead className={`sticky top-0 z-[2] ${
            hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"}`}
            style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}>
                <tr>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
        <td className="w-[30%] pt-[.10rem] pb-[.10rem]">Nombre</td>
        <td className="hidden sm:table-cell w:-[15%] pt-[.10rem] pb-[.10rem]">Grado</td>
        <td className="hidden sm:table-cell w:-[15%] pt-[.10rem] pb-[.10rem]">Fecha Nac</td>
        <td className="hidden sm:table-cell w:-[15%] pt-[.10rem] pb-[.10rem]">Papá</td>
        <td className="hidden sm:table-cell w:-[15%] pt-[.10rem] pb-[.10rem]">Mamá</td>
        <td className="hidden sm:table-cell w:-[20%] pt-[.10rem] pb-[.10rem]">Contacto</td>
        < ActionColumn
            description={"Ver"}
            permission={true}
        />
        {!hasBajas && <ActionColumn description={"Editar"} permission={permissions.cambios} />}
        {!hasBajas && <ActionColumn description={"Eliminar"} permission={permissions.bajas}/>}
        {hasBajas && <ActionColumn description={"Reactivar"} permission={true} />}
    </tr>
    </thead>
    );
};

const tableBody = (data = []) => {
    const hasBajas = data.some(item => item.baja === "*");
    setSinZebra(hasBajas);
    return (
        <tbody style={{ backgroundColor: hasBajas ? "#CD5C5C" : "" }}>
        {data.map((item) => (
        <tr key={item.numero} className="hover:cursor-pointer">
            <th
            className={
                typeof item.comision === "number"
                ? "text-left"
                : "text-right"
            }
            >
            {item.numero}
            </th>
            <td className="w-[30%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
            {`${item.a_nombre} ${item.a_paterno} ${item.a_materno}`}
            </td>
            <td className="hidden sm:table-cell w-[15%] pt-[.10rem] pb-[.10rem] truncate">
            {item.horario_1_nombre}
            </td>
            <td className="hidden sm:table-cell w-[15%] pt-[.10rem] pb-[.10rem] truncate">
            {item.fecha_nac}
            </td>
            <td className="hidden sm:table-cell w-[15%] pt-[.10rem] pb-[.10rem] truncate">
            {item.nom_padre}
            </td>
            <td className="hidden sm:table-cell w-[15%] pt-[.10rem] pb-[.10rem] truncate">
            {item.nom_madre}
            </td>
            <td className="hidden sm:table-cell w-[20%] pt-[.10rem] pb-[.10rem]">
            {item.celular}
            </td>
            <ActionButton
            tooltip="Ver"
            iconDark={iconos.ver}
            iconLight={iconos.ver_w}
            onClick={(evt) => tableAction(evt, item, "Ver")}
            permission={true}
            />
            {item.baja !== "*" ? (
                    <>
                        <ActionButton
                        tooltip="Editar"
                        iconDark={iconos.editar}
                        iconLight={iconos.editar_w}
                        onClick={(evt) => tableAction(evt, item, "Editar")}
                        permission={permissions.cambios}
                        />
                        <ActionButton
                        tooltip="Eliminar"
                        iconDark={iconos.eliminar}
                        iconLight={iconos.eliminar_w}
                        onClick={(evt) => tableAction(evt, item, "Eliminar")}
                        permission={permissions.bajas}
                        />
                    </>
                    ) : (
                    <ActionButton
                        tooltip="Reactivar"
                        iconDark={iconos.documento}
                        iconLight={iconos.documento_w}
                        onClick={(evt) => tableAction(evt, item, "Reactivar")}
                        permission={true}
                    />
                    )}
                </tr>
                ))}
            </tbody>
        );
    };
const modalBody = () => {
    return (
        <fieldset id="fs_alumnos"
        disabled={accion === "Ver" || accion === "Eliminar" ? true : false}>
        <div role="tablist" className="tabs tabs-lifted ">
        <input
            type="radio"
            name="my_tabs"
            role="tab"
            className="tab "
            aria-label="Alumno"
            checked={activeTab === 1}
            onChange={() => handleTabs(1)}
        />
        <div
            role="tabpanel"
            className={`tab-content p-6 rounded-box max-md:!row-start-4 ${
            activeTab === 1 ? "tab-active " : ""
            }`}
        >
            <div className="flex flex-wrap -mx-3 mb-6 px-3">
            <Inputs
                dataType={"string"}
                name={"a_paterno"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"A. Paterno: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Apellido paterno requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"a_materno"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"A. Materno: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Apellido materno requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"a_nombre"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Nombre: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Nombre requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"estatus"}
                tamañolabel={""}
                className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                Titulo={"Estatus: "}
                type={"select"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Estatus requerido"}
                maxLenght={25}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                arreglos={[
                { id: "Activo", descripcion: "Activo" },
                { id: "Cartera", descripcion: "Cartera" },
                { id: "Enfermo", descripcion: "Enfermo" },
                { id: "Permiso", descripcion: "Permiso" },
                { id: "Baja", descripcion: "Baja" },
                ]}
            />
            <Inputs
                dataType={"string"}
                name={"fecha_nac"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Fecha nacimiento: "}
                type={"date"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Fecha nacimiento requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
            />
            <Inputs
                dataType={"string"}
                name={"fecha_inscripcion"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Fecha inscripción: "}
                type={"date"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Fecha inscripción requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
            />
            <Inputs
                dataType={"string"}
                name={"fecha_baja"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Fecha baja: "}
                type={"date"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Fecha baja requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
            />
            <Inputs
                dataType={"string"}
                name={"sexo"}
                tamañolabel={""}
                className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                Titulo={"Sexo: "}
                type={"select"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Sexo requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                arreglos={[
                { id: "H", descripcion: "Hombre" },
                { id: "M", descripcion: "Mujer" },
                { id: "O", descripcion: "Otro" },
                ]}
            />
            <Inputs
                dataType={"string"}
                name={"escuela"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Escuela: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Escuela requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"telefono1"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tels: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefono requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"telefono2"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tel (opcional)"}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefono requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"celular"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Celular: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Celular requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"codigo_barras"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Matricula: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Matricula requerida"}
                maxLenght={255}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"referencia"}
                tamañolabel={""}
                className={"rounded block grow text-right"}
                Titulo={"Referencia: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Referencia requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            </div>
        </div>
        <input
            type="radio"
            name="my_tabs"
            role="tab"
            className="tab max-md:!row-start-1 max-md:!col-start-2"
            aria-label="Generales"
            checked={activeTab === 2}
            onChange={() => handleTabs(2)}
        />
        <div
            role="tabpanel"
            className={`tab-content p-6 rounded-box max-md:!row-start-4 ${
            activeTab === 2 ? "tab-active " : ""
            }`}
        >
            <div className="flex flex-wrap -mx-3 mb-6">
            <Inputs
                dataType={"string"}
                name={"direccion"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Direccion: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Direccion requerida"}
                maxLenght={255}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"colonia"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Colonia: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Colonia requerido"}
                maxLenght={100}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"ciudad"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Ciudad: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Ciudad requerida"}
                maxLenght={100}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"estado"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Estado: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Estado requerida"}
                maxLenght={100}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"cp"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"CP: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Codigo postal requerida"}
                maxLenght={6}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"email"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Email: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Email requerido"}
                maxLenght={255}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                pattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}
                message_pattern={"Formato de Correo inválido"}
            />
            </div>
        </div>
        <input
            type="radio"
            name="my_tabs"
            role="tab"
            className="tab max-md:!row-start-1 max-md:!col-start-3"
            aria-label="Foto"
            checked={activeTab === 3}
            onChange={() => handleTabs(3)}
        />
        <div
            role="tabpanel"
            className={`tab-content p-6 rounded-box max-md:!row-start-4 ${
            activeTab === 3 ? "tab-active " : ""
            }`}
        >
            <div>
            {isCameraOn && (
                <>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full object-contain mx-auto my-4"
                    videoConstraints={{ facingMode: "user" }}
                    mirrored={false}
                />
                </>
            )}
            <div className="bottom-0 left-0 w-full flex justify-center mb-4">
                <button
                type="button"
                onClick={openFileSelector}
                className="ml-4 btn hover:bg-transparent border-none shadow-md bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-black dark:text-white font-bold px-4 rounded"
                >
                Seleccionar Foto
                </button>
            </div>
            <input
                type="file"
                name="imagen"
                onChange={handleFileChange}
                ref={inputfileref}
                style={{ display: "none" }}
                className="ml-4 btn hover:bg-transparent border-none shadow-md bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-black dark:text-white font-bold px-4 rounded"
            />

            {(capturedImage || files) && (
                <div className="bottom-0 left-0 w-full">
                <h2 className="text-center text-xl mb-2">
                    {condicion ? "Imagen Seleccionada:" : "Foto Seleccionada:"}
                </h2>
                <Image
                    src={
                    condicion ? URL.createObjectURL(files) : capturedImage
                    }
                    alt="Imagen"
                    width={80}
                    height={80}
                    className="w-full object-contain mx-auto my-4"
                />
                </div>
            )}
            </div>
        </div>
        <input
            type="radio"
            name="my_tabs"
            role="tab"
            className="tab max-md:!row-start-1 max-md:!col-start-4"
            aria-label="Grado"
            checked={activeTab === 4}
            onChange={() => handleTabs(4)}
        />
        <div
            role="tabpanel"
            className={`tab-content p-6 rounded-box max-md:!row-start-4 ${
            activeTab === 4 ? "tab-active " : ""
            }`}
        >
            <div className="flex flex-wrap -mx-3 mb-6">
            <BuscarCat
                table="horarios"
                itemData={alumno}
                fieldsToShow={columnasBuscaCat}
                nameInput={nameInputs}
                titulo={"Grado: "}
                setItem={setGrado}
                token={session.user.token}
                modalId="modal_horarios"
                array={alumno?.horario_1}
                id={alumno?.numero}
                alignRight={true}
                inputWidths={{ first: "60px", second: "380px" }}
                accion={accion}
            />
            </div>
        </div>
        <input
            type="radio"
            name="my_tabs"
            role="tab"
            className="tab max-md:!row-start-2 max-md:!col-start-1"
            aria-label="Pago"
            checked={activeTab === 5}
            onChange={() => handleTabs(5)}
        />
        <div
            role="tabpanel"
            className={`tab-content p-6 rounded-box max-md:!row-start-4 space-y-4 ${
            activeTab === 5 ? "tab-active " : ""
            }`}
        >
            <div className="flex flex-wrap -mx-3 mb-6 gap-4">
            <div className="flex w-full md:w-full gap-4">
            <Inputs
                dataType={"string"}
                name={"ciclo_escolar"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Ciclo escolar: "}
                type={"text"}
                requerido={accion == "Alta" || accion == "Editar" ? true : false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Ciclo escolar requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"double"}
                name={"descuento"}
                tamañolabel={""}
                className={"rounded block grow text-right"}
                Titulo={"Descuento: "}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Descuento requerido"}
                maxLenght={12}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            </div>
            <BuscarCat
                table="formaPago"
                fieldsToShow={columnasBuscaCat1}
                nameInput={nameInputs3}
                setItem={setcond1}
                token={session.user.token}
                modalId="modal_formaPago1"
                array={alumno?.cond_1}
                id={alumno?.cond_1}
                titulo="Forma pago: "
                alignRight={true}
                inputWidths={{ first: "80px", second: "380px" }}
                accion={accion}
            />
            <BuscarCat
                table={"formaPago"}
                fieldsToShow={columnasBuscaCat1}
                nameInput={nameInputs4}
                setItem={setcond2}
                token={session.user.token}
                modalId="modal_formaPago2"
                array={alumno?.cond_2}
                id={alumno?.cond_2}
                titulo={"Forma pago:"}
                alignRight={true}
                inputWidths={{ first: "80px", second: "380px" }}
                accion={accion}
            />
            </div>
        </div>
        <input
            type="radio"
            name="my_tabs"
            role="tab"
            className="tab max-md:!row-start-2 max-md:!col-start-2"
            aria-label="Medicos"
            checked={activeTab === 6}
            onChange={() => handleTabs(6)}
        />
        <div
            role="tabpanel"
            className={`tab-content p-6 rounded-box max-md:!row-start-4 ${
            activeTab === 6 ? "tab-active " : ""
            }`}
        >
            <div className="flex flex-wrap -mx-3 mb-6">
            <Inputs
                dataType={"string"}
                name={"nom_pediatra"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Pediatra: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Pediatra requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"tel_p_1"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tel del pediatra: "}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefono del pediatra requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"tel_p_2"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tel (opcional)"}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Pediatra requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"cel_p_1"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Cel. Pediatra: "}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Celular del pediatra requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"tipo_sangre"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Tipo de sangre: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Tipo sangre requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"alergia"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Alergia: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Alergia requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"aseguradora"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Aseguradora: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Aseguradora requerido"}
                maxLenght={100}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"poliza"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Poliza: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Poliza requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"tel_ase_1"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tels. Aseguradora: "}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefono de la aseguradora requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"tel_ase_2"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tel (opcional)"}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefonos de la aseguradora requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            </div>
        </div>
        <input
            type="radio"
            name="my_tabs"
            role="tab"
            className="tab max-md:!row-start-2 max-md:!col-start-3"
            aria-label="Facturas"
            checked={activeTab === 7}
            onChange={() => handleTabs(7)}
        />
        <div
            role="tabpanel"
            className={`tab-content p-6 rounded-box max-md:!row-start-4 ${
            activeTab === 7 ? "tab-active " : ""
            }`}
        >
            <div className="flex flex-wrap -mx-3 mb-6">
            <Inputs
                dataType={"string"}
                name={"razon_social"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Razon social: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Razon social requerido"}
                maxLenght={30}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"rfc_factura"}
                tamañolabel={""}
                className={"rounded block grow uppercase"}
                Titulo={"RFC Factura: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"RFC Factura requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                pattern={
                /^([A-ZÑ&]{3,4})\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z\d]{2}[A-Z\d]{1}$/i
                }
                message_pattern={accion !== "Baja" ? "Formato de RFC Inválido" : ""}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"raz_direccion"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Dirección: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Dirección requerido"}
                maxLenght={255}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"raz_colonia"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Colonia: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Colonia requerido"}
                maxLenght={100}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"raz_ciudad"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Ciudad: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Ciudad requerido"}
                maxLenght={100}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"raz_estado"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Estado: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Estado requerido"}
                maxLenght={100}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"raz_cp"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"CP: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Codigo postal requerido"}
                maxLenght={6}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            </div>
        </div>
        <input
            type="radio"
            name="my_tabs"
            role="tab"
            className="tab max-md:!row-start-2 max-md:!col-start-4"
            aria-label="Familiares"
            checked={activeTab === 8}
            onChange={() => handleTabs(8)}
        />
        <div
            role="tabpanel"
            className={`tab-content p-6 rounded-box max-md:!row-start-4 ${
            activeTab === 8 ? "tab-active " : ""
            }`}
        >
            <div className="flex flex-wrap -mx-3 mb-6">
            <Inputs
                dataType={"string"}
                name={"nom_padre"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Nombre Padre: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Nombre del padre requerido"}
                maxLenght={100}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"tel_pad_1"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tel del padre: "}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefono del padre requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"tel_pad_2"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tel (opcional)"}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefonos de la aseguradora requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"cel_pad_1"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Celular del padre: "}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Celular requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"nom_madre"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Nombre Madre: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Nombre de la madre requerido"}
                maxLenght={100}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"tel_mad_1"}
                tamañolabel={""}
                className={"rounded block grow text-right"}
                Titulo={"Tel de la madre: "}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefono de la madre requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"tel_mad_2"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tel (opcional)"}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefonos requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"cel_mad_1"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Celular Madre: "}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Celular requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"string"}
                name={"nom_avi"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Avisar:"}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Avisar requerido"}
                maxLenght={100}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"tel_avi_1"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tel del aviso: "}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefono de la madre requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"tel_avi_2"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Tel (opcional)"}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Telefonos requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            <Inputs
                dataType={"int"}
                name={"cel_avi"}
                tamañolabel={""}
                className={"rounded block grow text-left"}
                Titulo={"Celular del aviso: "}
                type={"text"}
                requerido={false}
                isNumero={true}
                errors={errors}
                register={register}
                message={"Celular requerido"}
                maxLenght={15}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
                onKeyDown={(evt) => {
                    handleKeyDown(evt);
                }}
            />
            </div>
        </div>
        </div>
    </fieldset>
    );
};

return {
    itemHeaderTable,
    itemDataTable,
    tableColumns,
    tableBody,
    modalBody,
    alumno,
    sinZebra
};
};