import React from 'react'
import {Link, Outlet, Route, Routes} from "react-router-dom";

//Flujo de Gestion de pendientes
import GestionCursosProfesor from "../profesor/GestionCursosProfesor";
import PendientesPorCorregir from "../asesor/gestion_pendientes/PendientesPorCorregir";
import GestionUsuariosDetalle from "../profesor/gestion_usuarios/GestionUsuariosDetalle";
import Usuarios from "../profesor/gestion_usuarios/Usuarios";
import styled from "@emotion/styled";
import { BiHome } from "react-icons/bi";
import {FiFileText, FiUser} from "react-icons/fi";
import GestionTareas from "./gestion_tareas/GestionTareas";
import GestionTareaDetalle from "./gestion_tareas/GestionTareaDetalle";
import DetalleTareaEntrega from "../alumno/gestion_entregables/DetalleTareaEntrega";
import GestionDocumentos from "../general/GestionDocumentos";
import FlujoTemaTesis from "./FlujoTemaTesis";

const FlujoProfesor = (): JSX.Element => {
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
                    <Link to="tesis/listar" className="inline-flex"> <FiFileText size={25} className="pr-2"/><span>Gestion de Plan de Tesis</span></Link>
                </Wrap>
            </Nav>
            <Outlet/>
            <Routes>
                <Route index element={<GestionCursosProfesor/>}/>
                <Route path="gestionCursosProfesor" element={<GestionCursosProfesor />}/>
                <Route path="gestiondocumentos" element={<GestionDocumentos />}/>
                <Route path="usuarios"  element={<Usuarios/>}/>
                <Route path="usuarios/gestionusuariosdetalle" element={<GestionUsuariosDetalle/>}/>
                <Route path="pendientes" element={<PendientesPorCorregir />}/>
                <Route path="pendientes/detalle" element={<DetalleTareaEntrega/>}/>
                <Route path="tareas/detalle" element={<GestionTareaDetalle/>} />
                <Route path="tareas" element={<GestionTareas/>}/>
                <Route path="tesis/*" element={<FlujoTemaTesis/>}/>
            </Routes>
        </>
    )
}

export default FlujoProfesor;


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