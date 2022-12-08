import {useState, useEffect, useMemo} from "react";
import React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {Box, Card, CardContent} from "@mui/material";
import DetalleRetroalimentacion from "./DetalleRetroalimentacion";
import dayjs from "dayjs";
import DetalleAvances from "./DetalleAvances";
import Typography from "@mui/material/Typography";
import DetalleEntrega from "./DetalleEntrega";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import type {TareaEntrega} from "../../general/DovahTypes";
import Stack from "@mui/material/Stack";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@mui/material";
import {useAuth} from "../../../componentes/Context";
import DetalleDescripcion from "./DetalleDescripcion";

const DetalleTareaEntrega = (): JSX.Element => {
    //PARAMETROS STATE
    const {user} = useAuth();
    const location = useLocation();
    const {tarea, curso, alumno} = location.state;
    const [open, setOpen] = React.useState(false);
    let nombreCurso = curso["nombre"];
    let semestre = curso["semestre"];
    let dt = dayjs(tarea.fechaLimite).local();
    let fecha = dt.format("DD-MM-YYYY hh:mm A");
    //FIN PARAMETROS STATE
    const [tareaEntrega, setTareaEntrega] = useState<TareaEntrega | null>(null);
    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
    const estado = useMemo(() => {
        if (tareaEntrega == null) return;
        if (tareaEntrega.listaDocumentos.length === 0 && !tareaEntrega.tarea.esExposicion) return "Entrega pendiente";
        if (tareaEntrega.retroalimentaciones.length === 0) return "Revision pendiente";
        return "Revisado";
    }, [tareaEntrega])

    const showData = async() =>{
        const res1 = await axios.get(`/tareas/obtenerTareaEntrega/${alumno["id"]}/${tarea["id"]}`);
        setTareaEntrega(res1.data);
    };

    useEffect(()=>{
        showData().catch();
    },[]);

    if (tareaEntrega == null) return <></>;

    return (
        <div>
        <div className="mt-6 pb-5 mb-4 flex flex-row w-full">
            <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
                {tarea.nombre} de {nombreCurso}
            </p>
            <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp text-right">
                {`${semestre["anhoAcademico"]}-${semestre["periodo"]}`}
            </p>
        </div>
        <Box sx={{marginTop: 1, display: "grid", gridAutoColumns: "1fr", gap: 1}}>
            <Box sx={{gridColumn: "span 12", gridRow: 1, display: "grid", gridAutoColumns: "1fr", gap: 1}}>
            
                <Card sx={{gridRow: 2, gridColumn: "span 12"}}>
                    <CardContent sx={{display: "grid", gridAutoColumns: "1fr"}}>
                        <Box sx={{gridRow: 1, gridColumn: "span 10"}}>
                            <Typography fontWeight="bold">
                                <PersonIcon/> Alumno: {`${tareaEntrega.alumno.usuario.nombre} ${tareaEntrega.alumno.usuario.apellido}`}
                            </Typography>
                            <Typography gutterBottom>
                                <EventAvailableIcon/> {tareaEntrega.tarea.esExposicion ? "Fecha exposicion": "Fecha limite"}: {fecha}
                            </Typography>
                            {!tareaEntrega.tarea.esExposicion && (
                                <Typography gutterBottom>
                                    <EventAvailableIcon/> Ultima modificacion: {
                                    dayjs(tareaEntrega.ultimaModificacion).format("DD-MM-YYYY hh:mm A")}
                                </Typography>
                            )}
                            <Typography gutterBottom>
                                <CheckCircleIcon/> Estado: {estado}
                            </Typography>
                        </Box>
                        <Box sx={{gridRow: 1, gridColumn: "span 2"}}>
                            <Stack alignItems="center">
                                <Typography>
                                    Nota
                                </Typography>
                                <Typography variant="h1" color={tareaEntrega.notaFinal < 11 ? "#d32f2f": ""}>
                                    {tareaEntrega.notaFinal}
                                </Typography>
                                { user.rolActual === "alumno" && estado === "Revisado" &&
                                    <Button color="warning" onClick={handleClickOpen}>Reclamar nota</Button>
                                }
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
                <Box sx={{gridRow: 3, gridColumn: "span 12", marginTop: 3, marginBottom: 3}}>
                    <DetalleDescripcion tareaEntrega={tareaEntrega}/>
                </Box>
                <Box sx={{gridRow: 4, gridColumn: "span 12", marginBottom: 3}}>
                    <DetalleEntrega
                        tareaEntrega={tareaEntrega}
                        reload={showData}/>
                </Box>
            </Box>
            <Box sx={{gridColumn: "span 12", gridRow: 2, marginBottom: 3}}>
                <DetalleAvances tareaEntrega={tareaEntrega} reload={showData}/>
            </Box>
            <Box sx={{gridColumn: "span 12", gridRow: 3, marginBottom: 3}}>
                <DetalleRetroalimentacion
                    tareaEntrega={tareaEntrega}
                    curso={curso}
                    reload={showData}/>
            </Box>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                      <DialogTitle id="alert-dialog-title">
                        {"Proceso de Reclamos de Evaluaciones"} {`${semestre["anhoAcademico"]}-${semestre["periodo"]}`}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        <b>Estimado(a) alumno(a): </b>          
                        <br></br>
                        Se comparte nuevamente información sobre el proceso de registro de reclamos sobre la calificación de evaluaciones de prácticas y exámenes, tanto virtuales como presenciales, los cuales se deberán registrar a través del módulo de reclamos del Campus Virtual.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleClose}> 
                        <a
                            href=" https://agora.pucp.edu.pe/tutorial/campusvirtual/respuesta.php?id=1529"
                            target="_blank"
                            rel="noopener noreferrer"
                            ></a>
                            Mas información
                        </Button>
                        <Button onClick={handleClose}> 
                        <a
                            href="https://pandora.pucp.edu.pe/pucp/login?TARGET=https%3A%2F%2Feros.pucp.edu.pe%2Fpucp%2Fjsp%2FIntranet.jsp"
                            target="_blank"
                            rel="noopener noreferrer"
                            ></a>
                            Campus Virtual
                        </Button>
                      </DialogActions>
                    </Dialog>
        </Box>
        </div>
    );
}

export default DetalleTareaEntrega;
