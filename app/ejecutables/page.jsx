"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  getEjecutable,
  postEjecutable,
} from "@/app/utils/api/ejecutables/ejecutables";
import iconos from "@/app/utils/iconos";
import { FaPlay } from "react-icons/fa";
import { TbLoader3 } from "react-icons/tb";
import Image from "next/image";
import { showSwal } from "@/app/utils/alerts";

export default function Ejecutables() {
  const { data: session, status } = useSession();
  const [ejecutables, setEjecutables] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);

  useEffect(() => {
    const fetchExe = async () => {
      const { token } = session.user;
      const data = await getEjecutable(token, false);
      setEjecutables(data);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchExe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const ejecutarExe = async (event, item) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }
    setisLoading(true);
    setLoadingButton(item.numero);
    const { token } = session.user;
    const res = await postEjecutable(token, item);
    if (!res.status) {
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
    }
    setisLoading(false);
    setLoadingButton(null);
  };

  const RenderIcon = ({ icono }) => {
    const iconoSrc = iconos[icono];
    return iconoSrc ? (
      <Image
        src={iconoSrc}
        alt="icono"
        width={40}
        height={40}
        className="object-contain"
      />
    ) : (
      <div className="flex items-center justify-center w-10 h-10">
        <FaPlay className="text-3xl text-green-400 hover:text-green-300 transition duration-300" />
      </div>
    );
  };

  if (status === "loading" || !session) {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }
  return (
    <div className="flex flex-col p-10 justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
      <h2 className="text-2xl font-bold text-white mb-6">
        Ejecutables Disponibles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {ejecutables.map((item) => (
          <button
            key={item.numero}
            onClick={(event) => ejecutarExe(event, item)}
            className="flex flex-col items-center bg-gray-900 p-4 rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading && loadingButton === item.numero ? (
              <TbLoader3 className="animate-spin text-3xl text-white" />
            ) : (
              <RenderIcon icono={item.icono} />
            )}
            <p className="mt-4 text-lg font-medium text-white text-center h-12 flex items-center justify-center">
              {item.descripcion}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
