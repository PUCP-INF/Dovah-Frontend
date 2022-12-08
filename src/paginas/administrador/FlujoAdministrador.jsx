import {Link, Outlet, Route, Routes} from "react-router-dom";
import GestionDeFacultades from "./gestion_facultad_y_especialidades/GestionDeFacultades";
import GestionDeSemestres from "./gestion_semestres/GestionDeSemestres";
import GestionDeUsuarios from "./gestion_usuarios/GestionDeUsuarios";
import NuevaEspecialidad from "./gestion_facultad_y_especialidades/NuevaEspecialidad";
import DetalleCurso from "../coordinador/gestion_cursos/DetalleCurso";
import BienvenidaUsuario from "../general/BienvenidaUsuario";
import styled from "@emotion/styled";
import { BiHome } from "react-icons/bi";
import { BiBook } from "react-icons/bi";
import { BiBookContent } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import GestionDeCoordinador from "./gestion_usuarios/GestionDeCoordinador";
import GestionDeCoordinador2 from "./gestion_usuarios/GestionDeCoordinador2";


const FlujoAdministrador = () => {
    return (
        <>
            <Nav>
                <Wrap>
                    <Link to="" className="inline-flex"> <BiHome size={25} className="pr-2"/><span>Inicio</span></Link>
                </Wrap>
                <Wrap>
                    <Link to="gestiondefacultades" className="inline-flex"> <BiBook size={25} className="pr-2"/><span>Facultades</span></Link>
                </Wrap>
                <Wrap>
                    <Link to="gestiondesemestres" className="inline-flex"> <BiBookContent size={25} className="pr-2"/><span>Semestres</span></Link>
                </Wrap>
                {/*<Wrap>
                    <Link to="gestiondeusuarios" className="inline-flex"> <FiUsers size={25} className="pr-2"/><span>Usuarios</span></Link>
                </Wrap>*/}    
                <Wrap>
                    <Link to="gestiondecoordinador" className="inline-flex"> <FiUsers size={25} className="pr-2"/><span>Coordinadores</span></Link>
                </Wrap>                            
            </Nav>

            <Outlet/>
            <Routes>
                <Route index element={<BienvenidaUsuario/>}/>
                <Route path="gestiondesemestres" element={<GestionDeSemestres />} />
                <Route path="gestiondeusuarios" element={<GestionDeUsuarios />} />
                <Route path="gestiondecoordinador" element={<GestionDeCoordinador2 />} />
                <Route path="gestiondefacultades" element={<GestionDeFacultades />} />
                <Route path="gestiondefacultades/nuevaespecialidad" element={<NuevaEspecialidad />} />
                <Route path="gestiondefacultades/nuevaespecialidad/nuevocurso" element={<DetalleCurso />} />
            </Routes>
        </>
    )
}

export default FlujoAdministrador;

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