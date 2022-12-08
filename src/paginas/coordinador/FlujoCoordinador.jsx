import {Link, Outlet, Route, Routes} from "react-router-dom";
import GestiondeCurso from "./gestion_cursos/GestiondeCurso";
import DetalleCurso from "./gestion_cursos/DetalleCurso";
import GestionTareas from "../profesor/gestion_tareas/GestionTareas";
import styled from "@emotion/styled";
import { BiHome} from "react-icons/bi";
import { FiFileText, FiUser} from "react-icons/fi";
import ListaDeDocentes from "./gestion_usuarios/ListaDeDocentes";
import GestionTareaDetalle from "../profesor/gestion_tareas/GestionTareaDetalle";
import FlujoTemaTesis from "./gestion_temas_tesis/FlujoTemaTesis";
import GestionUsuarios from "../general/GestionUsuarios";
import FlujoReporte from "./gestion_reportes/FlujoReporte";
import GestionDocumentos from "../general/GestionDocumentos";
const FlujoCoordinador = () => {
    return (
        <>

            <Nav>
                <Wrap>
                    <Link to="/seleccionderoles" className="inline-flex"> <FiUser size={25} className="pr-2"/><span>Roles</span></Link>
                </Wrap>
                <Wrap>
                    <Link to="" className="inline-flex"> <BiHome size={25} className="pr-2"/><span>Inicio</span></Link>
                </Wrap>
                <Wrap>
                    <Link to="gestiontesis" className="inline-flex"> <FiFileText size={25} className="pr-2"/><span>Gestión de Plan de Tesis</span></Link>
                </Wrap>                               
            </Nav>

            <Outlet/>
            <Routes>
                <Route index element={<GestiondeCurso />} />
                <Route path="gestiontesis/*" element={<FlujoTemaTesis/>}/>
                <Route path="detallecurso" element={<DetalleCurso />} />
                <Route path="detallecurso/gestionalumnos" element={<GestionUsuarios tipoUsuario={"alumno"}/>}/>
                <Route path="detallecurso/gestionprofesores" element={<GestionUsuarios tipoUsuario={"profesor"}/>}/>
                <Route path="detallecurso/documentosgenerales" element={<GestionDocumentos/>}/>
                <Route path="detallecurso/tareas" element={<GestionTareas/>}/>
                <Route path="detallecurso/tareas/detalle" element={<GestionTareaDetalle/>} />
                <Route path="detallecurso/reportes/*" element={<FlujoReporte/>}/>
                <Route path="listadedocentes" element={<ListaDeDocentes/>}/>
            </Routes>
        </>
    )
}

export default FlujoCoordinador;

const Nav = styled.div`
  height: 40px;
  background-color: rgb(28, 72, 143);
  display: flex;
  align-items: center;
`

const Wrap = styled.div`
    color: white;
    font-weight: bolder;

    display: flex;
    align-items: center;
    margin: auto;

    span {
      position: relative;

        &:after {
            content: "";
            height: 2px;
            background: white;
            position: absolute;
            left: 0;
            right: 0;
            bottom: -1px;
            opacity: 0;
            transform-origin: left center;
            transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
            transform: scaleX(0);
        }
    }

    &:hover {
        span:after {
            transform: scaleX(1);
            opacity: 1;
        }
    }
    
`