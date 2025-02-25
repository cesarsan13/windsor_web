import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    getAccesosUsuarios,
    guardaAccesosUsuarios,
    actualizaTodos,
} from "@/app/utils/api/accesos_usuarios/accesos_usuarios";
import { confirmSwal, showSwal } from "@/app/utils/alerts";

export const useAccesosUsuariosABC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [accesoUsuario, setAccesoUsuario] = useState({});
    const [usuario, setUsuario] = useState({});
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [accesosUsuarios, setAccesosUsuarios] = useState([]);
    const [accesosUsuariosFiltrados, setAccesosUsuariosFiltrados] = useState([]);
    const [currentID, setCurrentId] = useState("");
    const [currentMenu, setCurrentMenu] = useState("");
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [titulo, setTitulo] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
          id_usuario: accesoUsuario.id_usuario,
          id_punto_menu: accesoUsuario.id_punto_menu,
          t_a: accesoUsuario.t_a,
          altas: accesoUsuario.altas,
          bajas: accesoUsuario.bajas,
          cambios: accesoUsuario.cambios,
          impresion: accesoUsuario.impresion
        },
    });

    useEffect(() => {
        if (status === "loading" || !session || !usuario.id) {
          return;
        }
        const fetchData = async () => {
          setisLoading(true);
          const { token } = session.user;
          const data = await getAccesosUsuarios(token, usuario);
          setAccesosUsuarios(data);
          setAccesosUsuariosFiltrados(data);
          setisLoading(false);
        };
        fetchData();
    }, [session, status, usuario]);
    
    useEffect(() => {
        setTitulo(
          `Ver Sub. Menu: ${currentMenu}`
        );
    }, [accion, currentMenu]);

    useEffect(() => {
        reset({
          id_usuario: accesoUsuario.id_usuario,
          id_punto_menu: accesoUsuario.id_punto_menu,
          t_a: accesoUsuario.t_a,
          altas: accesoUsuario.altas,
          bajas: accesoUsuario.bajas,
          cambios: accesoUsuario.cambios,
          impresion: accesoUsuario.impresion
        });
    }, [accesoUsuario, reset]);

    const showModal = (show) => {
        show
          ? document.getElementById("my_modal_3").showModal()
          : document.getElementById("my_modal_3").close();
    };

    const tableAction = (evt, accesoUsuario, accion) => {
        setAccesoUsuario(accesoUsuario);
        setAccion(accion);
        setCurrentId(accesoUsuario.id_punto_menu);
        setCurrentMenu(accesoUsuario.descripcion);
        console.log("a", accesoUsuario.descripcion);
        showModal(true);
    };
      
    const onSubmitModal = handleSubmit(async (data) => {
        setisLoadingButton(true);
        data.id_punto_menu = currentID;
        data.id_usuario = usuario.id;
    
        let res = null;
        res = await guardaAccesosUsuarios(session.user.token, data);
        if (res.status) {
          data.t_a = data.t_a === true ? 1 : 0 || data.t_a === 1 ? 1 : 0;
          data.altas = data.altas === true ? 1 : 0 || data.altas === 1 ? 1 : 0;
          data.bajas = data.bajas === true ? 1 : 0 || data.bajas === 1 ? 1 : 0;
          data.cambios = data.cambios === true ? 1 : 0 || data.cambios === 1 ? 1 : 0;
          data.impresion = data.impresion === true ? 1 : 0 || data.impresion === 1 ? 1 : 0;
    
          const accUsuarioActualizados = accesosUsuarios.map((c) =>
            c.id_punto_menu === currentID ? { ...c, ...data } : c
          );
          setAccesosUsuarios(accUsuarioActualizados);
          setAccesosUsuariosFiltrados(accUsuarioActualizados);
          showSwal(res.alert_title, res.alert_text, res.alert_icon);
          showModal(false);
          setisLoadingButton(false);
        }
    });
    
    const TodosSiNo = async (event) => {
        event.preventDefault();
        if (!usuario.id) {
          showSwal("Error", "Seleccione un Usuario.", "error");
          return;
        }
        const { name } = event.target;
        const confirmed = await confirmSwal(
          "¿Desea continuar?",
          `Se ${name === "si" ? " habilitaran " : " deshabilitaran "
          } todos los permisos.`,
          "info",
          "Continuar",
          "Cancelar"
        );
        if (!confirmed) {
          return;
        }
        let res = null;
        const data = {};
        data.name = name;
        data.id_usuario = usuario.id;
        res = await actualizaTodos(session.user.token, data);
        if (res.status) {
          const flag = name === "si" ? true : false;
          const accUsuarioActualizados = accesosUsuarios.map((c) => ({
            ...c,
            t_a: flag ? 1 : 0,
            altas: flag ? 1 : 0,
            bajas: flag ? 1 : 0,
            cambios: flag ? 1 : 0,
            impresion: flag ? 1 : 0,
          }));
          setAccesosUsuarios(accUsuarioActualizados);
          setAccesosUsuariosFiltrados(accUsuarioActualizados);
          showSwal(res.alert_title, res.alert_text, res.alert_icon);
          showModal(false);
        }
    };
    
    const home = () => {
        router.push("/");
    };

    return{
        TodosSiNo,
        onSubmitModal,
        home,
        setUsuario,
        tableAction,
        register,
        setValue,
        watch,
        isLoadingButton,
        status,
        titulo,
        accion,
        errors,
        session, 
        isLoading,
        accesosUsuariosFiltrados
    }

};