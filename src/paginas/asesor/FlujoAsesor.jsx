import React, { useState, useEffect } from 'react'
import {Link, Outlet, Route, Routes, useLocation} from "react-router-dom";
import styled from '@emotion/styled';

import { BiHome } from "react-icons/bi";
import { FiEdit,FiFileText,FiUser} from "react-icons/fi";
import Usuarios from '../asesor/gestion_usuarios/Usuarios';
import GestionUsuariosDetalle from "../asesor/gestion_usuarios/GestionUsuariosDetalle";
import GestionCursosAsesor from "../asesor/GestionCursosAsesor";
import PlanTesis from "../../paginas/asesor/tesis/PlanTesis";
import PendientesPorCorregir from "./gestion_pendientes/PendientesPorCorregir";
import DetallePlanTesis from "../coordinador/gestion_temas_tesis/DetallePlanTesis";
import CreacionPlanTesis from "../coordinador/gestion_temas_tesis/CreacionPlanTesis";
import DetalleTareaEntrega from "../alumno/gestion_entregables/DetalleTareaEntrega";
import AlumnosaCargos from "../asesor/alumnos_acargo/AlumnosaCargos";
import ListarTesisInscritos from "../coordinador/gestion_temas_tesis/ListarTesisInscritos";
const FlujoAsesor = () => {

    const [flagBarra, setFlagBarra] = useState(false);
    const location = useLocation();

    useEffect(() => {
        evaluarPagina();
        console.log(location.pathname, flagBarra);
    },[location]);

    const evaluarPagina = () => {
        if(location.pathname === "/asesor" || location.pathname === "/asesor/"){
            setFlagBarra(false);
        }else if(location.pathname !== "/asesor"){
            setFlagBarra(true);
        } //Mostrar barra horizontal
    };

    const BarraHorizontal = ( {flagBarra} ) => {
        let barra = <></>;
            
        if(flagBarra === true){
            barra =                       
                <Nav>
                    <Wrap>
                        <Link to = '/asesor/' className="inline-flex"> <BiHome size={25} className="pr-2"/><span>Cursos</span></Link>
                    </Wrap>
                    <Wrap>
                        <Link to="pendientesporcorregir" className="inline-flex"> <FiEdit size={25} className="pr-2"/><span>Pendientes</span></Link>
                    </Wrap>
                    <Wrap>
                        <Link to="alumnosacargo" className="inline-flex"> <FiEdit size={25} className="pr-2"/><span>Alumnos a cargo</span></Link>
                    </Wrap>
                    <Wrap>
                        <Link to="planTesis" className="inline-flex"> <FiEdit size={25} className="pr-2"/><span>Tesis</span></Link>
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
                <Wrap>
                    <Link to="planTesis" className="inline-flex"> <FiEdit size={25} className="pr-2"/><span>Gestion de Plan de Tesis</span></Link>
                </Wrap>     
                <Wrap>
                    <Link to="alumnosacargo" className="inline-flex"> <FiFileText size={25} className="pr-2"/><span>Alumnos a cargo</span></Link>
                </Wrap>                       
            </Nav>

            <Outlet/>
            <Routes>
                <Route index element={<GestionCursosAsesor />}/>
                <Route path="alumnosacargo" element={<AlumnosaCargos/>}/>
                <Route path="gestionCursosAsesor" element={<GestionCursosAsesor />}/>
                <Route path="planTesis/creaciontesis" element={<CreacionPlanTesis/>}/>
                <Route path="planTesis/detalle" element={<DetallePlanTesis/>}/>
                <Route path="planTesis" element={<PlanTesis/>}/>
                <Route path="usuarios"  element={<Usuarios/>}/>
                <Route path="usuarios/gestionusuariosdetalle" element={<GestionUsuariosDetalle/>}/>
                <Route path="pendientes" element={<PendientesPorCorregir />}/>
                <Route path="pendientes/detalle" element={<DetalleTareaEntrega/>}/>
                <Route path="planTesis/detalle/inscritos" element={<ListarTesisInscritos/>}/>"
            </Routes>
        </>
    )
}

export default FlujoAsesor;


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