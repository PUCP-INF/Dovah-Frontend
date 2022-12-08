import React from "react";
import {Outlet, Routes, Route} from "react-router-dom";
import DetallePlanTesis from "../coordinador/gestion_temas_tesis/DetallePlanTesis";
import ListarTesisInscritos from "../coordinador/gestion_temas_tesis/ListarTesisInscritos";
import ListarPlanTesis from "../coordinador/gestion_temas_tesis/ListarPlanTesis";
import BienvenidaUsuario from "../general/BienvenidaUsuario";

const FlujoTemaTesis = (): JSX.Element => {
    return (
        <>
            <Outlet/>
            <Routes>
                <Route index element={<BienvenidaUsuario/>}/>
                <Route path="listar" element={<ListarPlanTesis/>}/>
                <Route path="detalle" element={<DetallePlanTesis/>}/>
                <Route path="detalle/inscritos" element={<ListarTesisInscritos/>}/>
            </Routes>
        </>
    )
}

export default FlujoTemaTesis;