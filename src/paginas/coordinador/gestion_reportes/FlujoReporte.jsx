// @flow
import * as React from "react";
import {Outlet, Route, Routes} from "react-router-dom";
import {Tab, Tabs} from "@mui/material";
import {Link, useLocation} from "react-router-dom";
import ReporteDeAlumnos from "./ReporteDeAlumnos";
import ReporteDeSemestres from "./ReporteDeSemestres";
import ReporteDeEntregables from "./ReporteDeEntregables";
import axios from "axios";
import {useAuth} from "../../../componentes/Context"
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";

const FlujoReporte = (): React.Node => {
   
    const {state}= useLocation();  

    React.useEffect(() => {
        showData();    
      }, []);

    const showData = async () => {
        if(state !== null){
          setIdCurso(state.idCurso);
          setNombreCurso(state.nombreCurso); 
          setClaveCurso(state.clave);           
          setIdSemestre(state.idSemestre); 
          setAnho(state.anho);
          setPeriodo(state.periodo);              
        } 
        console.log(user);
    };

    const {user} = useAuth();
    const esp = user["especialidad"]["codigo"];
    const [value, setValue] = React.useState(-1);
    const [idCurso, setIdCurso] = React.useState(0);
    const [idSemestre, setIdSemestre] = React.useState(0);    
    const [anho, setAnho] = React.useState("");
    const [periodo, setPeriodo] = React.useState("");   
    const [nombreCurso, setNombreCurso] = React.useState("");
    const [claveCurso, setClaveCurso] = React.useState("");
    const handleTabChange = (event: SyntheticInputEvent<>, newValue: number) => {
        setValue(newValue);
    }

    return (
        <>
        <div className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white">
            <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">       

                <div className="pb-5 mb-4 flex flex-row text-black w-full">
                    <p className="text-3xl font-sans inline border-b-2 flex-auto border-black w-5/6">
                        {nombreCurso} {">"} Reportes
                    </p>
                    <p className="text-3xl font-sans inline border-b-2 flex-auto border-black text-right w-1/6">
                        {anho} - {periodo}
                    </p>
                </div>

                <div className="padding-pucp mb-4">

                <Card className="h-fit border-2 shadow-none border-blue-pucp">
                    <CardBody>
                        <Typography className="font-sans text-black text-lg">
                        <p className="font-medium">
                            Información general
                        </p>
                        <p>
                            {user["facultad"]["nombre"]} - {user["especialidad"]["nombre"]}
                        </p>
                        <p>
                            {claveCurso} - {nombreCurso} {"("} {anho} - {periodo} {")"}
                        </p>
                        </Typography>
                    </CardBody>
                </Card>
                </div>

                <div className="text-base font-sans text-gray-800 padding-pucp">
                    <p className="ml-6">
                       Haga click en el título del reporte que desea visualizar
                    </p>
                    
                </div>
                <Tabs value={value} onChange={handleTabChange} centered>
                    <Tab label="Reportes de Alumnos, Temas y Asesores" to="reportedealumnos" component={Link}/>
                    <Tab label="Reporte de Notas por entregable" to="reportedeentregables" component={Link}/>
                    <Tab label="Reporte de Notas Finales" to="reportedesemestres" component={Link}/>
                </Tabs>
                <Outlet/>
                <Routes>
                    <Route path="reportedealumnos" element={<ReporteDeAlumnos idSemestre={idSemestre} anho={anho} periodo={periodo} nombreCurso={nombreCurso} idCurso={idCurso} claveCurso={claveCurso} />}/>
                    <Route path="reportedesemestres" element={<ReporteDeSemestres idSemestre={idSemestre} anho={anho} periodo={periodo} nombreCurso={nombreCurso} idCurso={idCurso} claveCurso={claveCurso} />}/>
                    <Route path="reportedeentregables" element={<ReporteDeEntregables idSemestre={idSemestre} anho={anho} periodo={periodo} nombreCurso={nombreCurso} idCurso={idCurso} claveCurso={claveCurso} />}/>
                </Routes>
            </div>
        </div>
        </>        
    )
}

export default FlujoReporte;