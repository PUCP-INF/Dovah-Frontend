import React from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import styled from "@emotion/styled";
import { BiHome } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";

import GestionTareasAlumno from "./gestion_entregables/GestionTareasAlumno";
import DetalleTareaEntrega from "./gestion_entregables/DetalleTareaEntrega";
import GestionCursosAlumno from "./GestionCursosAlumno";
import Asesores from "../alumno/detalle_asesor/Asesores";
import Notas from "../alumno/gestion_notas/Notas";

import PlanTesis from "../../paginas/alumno/tesis/PlanTesis";
import DetallePlanTesis from "../coordinador/gestion_temas_tesis/DetallePlanTesis";
import CreacionPlanTesis from "../coordinador/gestion_temas_tesis/CreacionPlanTesis";
import GestionDocumentos from "../general/GestionDocumentos";

const FlujoAlumno = (): JSX.Element => {
  return (
    <>
      <Nav>
        <Wrap>
          <Link to="" className="inline-flex"> {" "} <BiHome size={25} className="pr-2" /> <span>Inicio</span>{" "} </Link>
        </Wrap>
        <Wrap>
          <Link to="planTesis" className="inline-flex"> {" "}<FiEdit size={25} className="pr-2" />{" "}<span>Gestion de Plan de Tesis</span>{" "}</Link>
        </Wrap>
      </Nav>

      <Outlet />
      <Routes>
        <Route index element={<GestionCursosAlumno />} />
        <Route path="gestionCursosAlumno" element={<GestionCursosAlumno />} />
        <Route path="asesores" element={<Asesores />} />
        <Route
          path="gestiontareas"
          element={<GestionTareasAlumno />}
        />
       
        <Route path="notas" element={<Notas />} />
        <Route path="gestiondocumentos" element={<GestionDocumentos />} />
        <Route path="planTesis/creaciontesis" element={<CreacionPlanTesis/>}/>
        <Route path="planTesis/detalle" element={<DetallePlanTesis/>}/>
        <Route path="planTesis" element={<PlanTesis/>}/>
        <Route path="gestiontareas/detalleentregable" element={<DetalleTareaEntrega/>}/>
      </Routes>
    </>
  );
};

export default FlujoAlumno;

const Nav = styled.div`
  height: 40px;
  background-color: rgb(28, 72, 143);
  display: flex;
  align-items: center;
`;

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
`;
