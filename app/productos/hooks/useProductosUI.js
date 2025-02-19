import React from "react";
import Inputs from "@/app/productos/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import { formatNumber } from "@/app/utils/globalfn";
export const useProductosUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors
) => {
const itemHeaderTable = () => {
    return (
    <>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
        <td className="w-[40%]">Descripcion</td>
        <td className="w-[15%]">Costo</td>
        <td className="w-[15%]">Frecuencia</td>
        <td className="w-[10%]">Recargo</td>
        <td className="w-[15%]">Aplicacion</td>
        <td className="w-[10%]">IVA</td>
        <td className="w-[10%]">Condición</td>
        <td className="w-[10%]">Cambia Precio</td>
        <td className="w-[10%]">Referencia</td>
        <td className="w-[10%]">Baja</td>
    </>
    );
};

const itemDataTable = (item) => {
    return (
    <>
        <tr key={item.numero} className="hover:cursor-pointer">
        <th
            className={
            typeof item.numero === "number" ? "text-left" : "text-right"
            }
        >
            {item.numero}
        </th>
        <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
            {item.descripcion}
        </td>
        <td className="text-right">{formatNumber(item.costo)}</td>
        <td className="text-left">{item.frecuencia}</td>
        <td className="text-right">{item.por_recargo}</td>
        <td className="text-right">{item.aplicacion}</td>
        <td className="text-right">{item.iva}</td>
        <td className="text-right">{item.cond_1}</td>
        <td className="text-right">{item.cam_precio}</td>
        <td className="text-left">{item.ref}</td>
        <td className="text-left">{item.baja}</td>
        </tr>
    </>
    );
};
const tableColumns = () => {
    return (
        <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
        <tr>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
        <td className="w-[40%]">Descripcion</td>
        <td className="w-[15%]">Aplicacion</td>
        <td className="w-[15%]">Costo</td>
        <td className="w-[10%]">Recargo</td>
        <td className="w-[10%]">Condición</td>
        <td className="w-[10%]">IVA</td>
        < ActionColumn
            description={"Ver"}
            permission={true}
        />
        < ActionColumn
            description={"Editar"}
            permission={permissions.cambios}
        />
        < ActionColumn
            description={"Eliminar"}
            permission={permissions.bajas}
        />
        </tr>
    </thead>
    );
};

const tableBody = (data) => {
    return (
        <tbody>
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
            <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
            {item.descripcion}
            </td>
            <td>{item.aplicacion}</td>
            <td className="text-right">{formatNumber(item.costo)}</td>
            <td className="text-right">{formatNumber(item.por_recargo)}</td>
            <td className="text-right">{item.cond_1}</td>
            <td className="text-right">{formatNumber(item.iva)}</td>

            <ActionButton
            tooltip="Ver"
            iconDark={iconos.ver}
            iconLight={iconos.ver_w}
            onClick={(evt) => tableAction(evt, item, "Ver")}
            permission={true}
            />
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
            
        </tr>
        ))}
    </tbody>
    );
};

const modalBody = () => {
    return (
        <fieldset id="fs_productos">
            <div className="container flex flex-col space-y-5">
            <Inputs
                dataType={"int"}
                name={"numero"}
                tamañolabel={"w-2/6"}
                className={"w-3/6 text-right"}
                Titulo={"Numero: "}
                type={"inputNum"}
                requerido={true}
                errors={errors}
                register={register}
                maxLenght={6}
                message={"Numero requerido"}
                isDisabled={isDisabled}
            />
            <Inputs
                dataType={"string"}
                name={"descripcion"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Descripción: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Descripción requerido"}
                maxLenght={30}
                isDisabled={isDisabled}
            />
            <Inputs
                dataType={"string"}
                name={"ref"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Referencia: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Referencia requerido"}
                maxLenght={3}
                isDisabled={isDisabled}
            />
            <Inputs
                dataType={"string"}
                name={"frecuencia"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Frecuencia:"}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Frecuencia requerido"}
                maxLenght={6}
                isDisabled={isDisabled}
            />
            <Inputs
                dataType={"string"}
                name={"aplicacion"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Aplicación:"}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Aplicación requerido"}
                maxLenght={34}
                isDisabled={isDisabled}
            />
            <Inputs
                dataType={"float"}
                name={"costo"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow text-right"}
                Titulo={"Costo:"}
                type={"float"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Costo requerido"}
                maxLenght={10}
                isDisabled={isDisabled}
            />
            <Inputs
                dataType={"float"}
                name={"por_recargo"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow text-right"}
                Titulo={"Recargos:"}
                type={"float"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Recargos requerido"}
                maxLenght={10}
                isDisabled={isDisabled}
            />
            <Inputs
                dataType={"float"}
                name={"iva"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow text-right"}
                Titulo={"IVA:"}
                type={"float"}
                requerido={true}
                errors={errors}
                register={register}
                message={"IVA requerido"}
                maxLenght={10}
                isDisabled={isDisabled}
            />
            <Inputs
                dataType={"int"}
                name={"cond_1"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow text-right"}
                Titulo={"Condición:"}
                type={"int"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Condición requerido"}
                maxLenght={10}
                isDisabled={isDisabled}
            />
            <Inputs
                dataType={"boolean"}
                name={"cam_precio"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow"}
                Titulo={"Cambia P."}
                type={"checkbox"}
                requerido={false}
                errors={errors}
                register={register}
                message={"Cambia precio requerido"}
                maxLenght={1}
                isDisabled={isDisabled}
            />
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
};
};