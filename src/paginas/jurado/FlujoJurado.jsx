import React, { useState, useEffect } from 'react'
import {Link, Outlet, Route, Routes, useLocation} from "react-router-dom";
import GestionCursosJurado from "../jurado/GestionCursosJurado";
import BienvenidaUsuario from "../general/BienvenidaUsuario";
import PendientesPorCorregir from "../asesor/gestion_pendientes/PendientesPorCorregir";
import GestionUsuariosDetalle from "../jurado/gestion_usuarios/GestionUsuariosDetalle";
import Usuarios from "../jurado/gestion_usuarios/Usuarios";

import styled from "@emotion/styled";
import { BiHome } from "react-icons/bi";
import { FiEdit, FiUser} from "react-icons/fi";
import DetalleTareaEntrega from "../alumno/gestion_entregables/DetalleTareaEntrega";
import GestionDocumentos from "../general/GestionDocumentos";

const FlujoJurado = () => {

    const [flagBarra, setFlagBarra] = useState(false);
    const location = useLocation();

    useEffect(() => {
        evaluarPagina();
    },[location]);

    const evaluarPagina = () => {
        if(location.pathname === "/jurado" || location.pathname === "/jurado/"){
            setFlagBarra(false);
        }else if(location.pathname !== "/jurado"){
            setFlagBarra(true);
        } //Mostrar barra horizontal
    };

    const BarraHorizontal = ( {flagBarra} ) => {
        let barra = <></>;
            
        if(flagBarra === true){
            barra =                       
                <Nav>
                    <Wrap>
                        <Link to = '/jurado/' className="inline-flex"> <BiHome size={25} className="pr-2"/><span>Cursos</span></Link>
                    </Wrap>

                    <Wrap>
                        <Link to="pendientesporcorregir" className="inline-flex"> <FiEdit size={25} className="pr-2"/><span>Pendientes</span></Link>
                    </Wrap>

                    <Wrap>
                        <Link to="gestiondocumentos" className="inline-flex"> <FiEdit size={25} className="pr-2"/><span>Gestion de Documentos</span></Link>
                    </Wrap>

                    <Wrap>
                        <Link to="usuarios" className="inline-flex"> <FiEdit size={25} className="pr-2"/><span>Gestion de Usuarios</span></Link>
                    </Wrap>
                    
                           
                </Nav>;
        }
        return barra;
    }    


    return (
        <>
            <Nav>
                <Wrap>
                    <Link to="/seleccionderoles" className="inline-flex"> <FiUser size={25} className="pr-2"/><span>Roles</span></Link>
                </Wrap>
                <Wrap>
                    <Link to="" className="inline-flex"> <BiHome size={25} className="pr-2"/><span>Inicio</span></Link>
                </Wrap>                      
            </Nav>

            <Outlet/>
            <Routes>
                <Route index element={<GestionCursosJurado/>}/>
                <Route path="gestionCursosJurado" element={<GestionCursosJurado />}/>
                <Route path="bienvenida" element={<BienvenidaUsuario />}/>
                <Route path="gestiondocumentos" element={<GestionDocumentos />}/>
                <Route path="usuarios"  element={<Usuarios/>}/>
                <Route path="usuarios/gestionusuariosdetalle" element={<GestionUsuariosDetalle/>}/>
                <Route path="pendientes" element={<PendientesPorCorregir />}/>
                <Route path="pendientes/detalle" element={<DetalleTareaEntrega/>}/>
            </Routes>
        </>
    )
}

export default FlujoJurado;


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