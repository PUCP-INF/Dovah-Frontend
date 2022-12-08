import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link, useNavigate } from "react-router-dom";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useAuth } from "../../../componentes/Context";
import {
  obtenerTesisConUsuarioInscrito,
  obtenerInscritoPlanTesis ,
} from "../../../services/PlanTesisServices";
import axios from "axios";
function CursosCardconDataAlumno({ info }) {
  let display = info.data;
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  if (info) {
    display = info.map((x) => {
      let {
        activo,
        clave,
        coordinadorCurso,
        documentosGenerales,
        especialidad,
        fechaCreacion,
        idCurso,
        listaUsuariosAsignados,
        nombre,
        semestre,
        tareas,
      } = x;
return (
                <Card key={idCurso} id={idCurso}>
                    <Background/>
                    <Contenido>
                        <Columna1>
                        <h5>{clave} - {nombre}</h5>    
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{semestre['anhoAcademico']}-{semestre['periodo']}</p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Especialidad: {especialidad['nombre']}</p>
                        
                        <div>
                          <Link to="gestiontareas" state={x}>
                          <Button startIcon={<PendingActionsOutlinedIcon/>}>TAREAS</Button>
                          </Link>
                        </div>

                        <div>
                          <Link to="asesores" state={x}>
                          <Button startIcon={<AccountCircleIcon />}> MIS ASESORES</Button>
                          </Link>
                        </div>

                        <div>
                          <Link to="gestiondocumentos" state={x}>
                          <Button startIcon={<DisplaySettingsIcon/>}>DOCUMENTOS GENERALES</Button>
                          </Link>
                        </div>
                        <div>
                          <Link to="notas" state={x}>
                          <Button startIcon={<AssignmentTurnedInIcon />}>NOTAS</Button>
                          </Link>
                        </div>
                        
                        </Columna1>
                        <Columna2>
                        <div>
                        <Button color="error"  startIcon={<PriorityHighIcon/>} onClick={handleClickOpen}>RETIRARSE</Button>
                        </div>
                        </Columna2>
                    </Contenido>   


                    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                      <DialogTitle id="alert-dialog-title">
                        {"¿Estás seguro de retirarte?"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          En caso requieras retirarte del curso de {nombre}, tienes que solicitar el retiro por el Campus Virtual y también mandarle un correo al coordinador del curso, explicando los motivos de tu retiro
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleClose}> 
                        <a
                          href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&to="
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                        Enviar Correo 
                        </a>
                        </Button>
                      </DialogActions>
                    </Dialog>     


                </Card>
            );
    });
  } else {
    display = "No hay data";
  }
  return <>{display}</>;
}

export default CursosCardconDataAlumno;


const Card = styled.div`
    margin: 24px;
    padding: 0px;
    max-width: 100%;
    max-height: 500px;
    border-radius: 10px;
    border: 4px solid rgba(249, 249, 249, 0.9);
    box-shadow: rgb(0 0 0 / 7%) 0px 26px 30px -10px,
    rgb(0 0 0 / 7%) 0px 16px 10px -10px;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
    display: grid;
    grid-template-columns: 1fr;

    &:hover {
      box-shadow: rgb(0 0 0 / 7%) 0px 26px 30px -10px,
      rgb(0 0 0 / 7%) 0px 16px 10px -10px;
      transform: scale(1.05);
      border-color: rgba(249, 249, 249, 0.9);
    }
  `

  const Background = styled.div`

    display: flex;
    position: relative;
    overflow-x: hidden;
    width: 100%;
    height: 100px;
    margin-bottom: 20px;

    &:before {
        background: url("https://images.unsplash.com/photo-1578070181910-f1e514afdd08?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1233&q=80") center center / cover
        no-repeat;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
    }

    img{
        /*border: 3px solid rgb(197, 196, 196);*/
        height: 100%;
        width: 100%;
    }

  `


  const Contenido = styled.div`
    display: grid;
    grid-template-columns: 7fr 1fr ;
    padding: 0px 10px 0px 10px;
  `

  const Columna1 = styled.div`
    h5{
        margin-bottom: 8px;
        font-size: 24px;
        line-height: 32px;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: rgb(33, 33, 33);
    }
  `

  const Columna2 = styled.div`
    margin-left: auto;
  `