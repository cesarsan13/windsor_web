import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Clave secreta para decodificar el token
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  // Obtén el token de sesión desde las cookies
  const token = await getToken({ req, secret });
  //console.log("Token recibido:", token);
  
  // Ruta solicitada
  const { pathname } = req.nextUrl;

  // Rutas públicas que no requieren validación
  const publicPaths = ["/control_escolar/auth/login", "/control_escolar/auth/register"];

  // Si la ruta es de logout (/control_escolar), eliminar el token y redirigir a login
  if (pathname === "/control_escolar") {
    const logoutResponse = NextResponse.redirect(new URL("/control_escolar/auth/login", req.url));
    // Eliminar el token de sesión (esto se hace mediante cookies)
    logoutResponse.cookies.set("next-auth.session-token", "", { maxAge: -1 }); // Elimina el token
    return logoutResponse;
  }

  if (publicPaths.includes(pathname)) {
    // Permitir acceso directo a rutas públicas
    return NextResponse.next();
  }

  // Si no existe el token (usuario no autenticado), redirigir al login
  if (!token) {
    const loginUrl = new URL("/control_escolar/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si el token no tiene el valor "xescuela", redirigir a login
  if (!token.xescuela) {
    const loginUrl = new URL("/control_escolar/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Permitir acceso si todas las validaciones pasan
  return NextResponse.next();
}

export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/formapago",
    "/productos",
    "/alumnos",
    "/asignaturas",
    "/accesos_menu",
    "/act_aplica",
    "/act_cobranza",
    "/actividades",
    "/adicion_productos_cartera",
    "/c_calificaciones",
    "/c_otra",
    "/cajeros",
    "/cambio_ciclo_escolar",
    "/cambio_numero_alumno",
    "/cancelacion_recibos",
    "/clases",
    "/cobranza_diaria",
    "/comentarios",
    "/comentarios",
    "/concentradoCalificaciones",
    "/creacion_boletas_3_bimestres",
    "/formfact",
    "/horarios",
    "/p_boletas",
    "/pagos1",
    "/productos",
    "/profesores",
    "/rep_femac_1",
    "/Rep_Femac_2",
    "/rep_femac_3",
    "/rep_femac_4",
    "/rep_femac_5",
    "/rep_femac_6",
    "/rep_femac_7",
    "/rep_femac_8_anexo_1",
    "/Rep_Femac_9_Anexo_4",
    "/rep_femac_10_Anexo_2",
    "/rep_femac_11_Anexo_3",
    "/rep_femac_12_anexo_12",
    "/rep_femac_13",
    "/rep_flujo_01",
    "/rep_inscritos",
    "/rep_w_becas",
    "/usuarios"
  ]
};
