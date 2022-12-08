// @flow
import * as React from "react";
import {Outlet, Route, Routes} from "react-router-dom";
import AreaTesis from "./AreaTesis";
import {Tab, Tabs} from "@mui/material";
import { Link } from "react-router-dom";
import DetallePlanTesis from "./DetallePlanTesis";
import PeriodoDeTesis from "./PeriodoDeTesis";
import ListarPlanTesis from "./ListarPlanTesis";
import ListarTesisInscritos from "./ListarTesisInscritos";
import ReporteTesis from "./ReporteTesis";

const FlujoTemaTesis = (): React.Node => {
    const [value, setValue] = React.useState(0);

    const handleTabChange = (event: SyntheticInputEvent<>, newValue: number) => {
        setValue(newValue);
    }

    return (
        <>
            <Tabs value={value} onChange={handleTabChange} centered>
                <Tab label="Áreas de Tesis" to="" component={Link}/>
                <Tab label="Periodo de Propuestas" to="periodo" component={Link}/>
                <Tab label="Lista de Propuestas de Tesis" to="listar" component={Link}/>
                <Tab label="Reporte de Tesis" to="reporte" component={Link}/>
            </Tabs>
            <Outlet/>
            <Routes>
                <Route index element={<AreaTesis/>}/>
                <Route path="modificacion" element={<DetallePlanTesis/>}/>
                <Route path="periodo" element={<PeriodoDeTesis/>}/>
                <Route path="listar" element={<ListarPlanTesis/>}/>
                <Route path="detalle" element={<DetallePlanTesis/>}/>
                <Route path="detalle/inscritos" element={<ListarTesisInscritos/>}/>
                <Route path="reporte" element={<ReporteTesis/>}/>
            </Routes>
        </>
    )
}

export default FlujoTemaTesis;