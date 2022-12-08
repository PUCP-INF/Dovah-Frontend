import React, { useState, useEffect } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import UsuarioImagen from "../../../assets/avatar.png";
import CuevaRony from "../../../assets/cueva.png";
import { Link, useLocation } from "react-router-dom";
import { Select, Option } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Button } from "@mui/material";
import { MdEmail } from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";
import styled from "@emotion/styled";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CardNoHayAsesores from "../../general/componentes/CardNoHayAsesores";
import CardPlanTesisAlumno from "../../general/componentes/CardPlanTesisAlumno";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { useAuth } from "../../../componentes/Context";
import {
  obtenerTesisConUsuarioInscrito,
  obtenerProfesoresAsociadosAlumnoPlanTesis,
} from "../../../services/PlanTesisServices";
import { useSnackbar } from "notistack";
const Asesores = () => {
  const { state } = useLocation();
  const { usuario, idCurso, semestre } = state;
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [consiguio, setConsiguio] = useState(false);
  const [asesor, setAsesor] = useState([]);
  const [planTesis, setPlanTesis] = useState([]);
  let display;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [permisos, setPermisos] = useState({
    asesor: false,
    profesor: false,
    jurado: false,
  });
  const [correoAsesor, setCorreoAsesor] = useState();
  var vinculoCorreo = "";

  const handleChange = (event) => {
    setPermisos({
      ...permisos,
      [event.target.name]: event.target.checked,
    });

    console.log("PERMISOS", permisos);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const showData = async () => {
    try {
      const prueba = await obtenerTesisConUsuarioInscrito(user.idUsuario);
      const data = prueba.data;
      var tamanio = data.length;
      if (tamanio == 1) {
        const prueba2 = data[0];
        const profesores = await obtenerProfesoresAsociadosAlumnoPlanTesis(
          prueba2.id
        );
        console.log("PROFESORES", profesores);
        const dataProfesor = profesores.data;
        const asesorEscogido = dataProfesor[0];
        const dataEscogido = asesorEscogido.profesor;
        const dataFinal = dataEscogido.usuario;
        setConsiguio(true);
        setAsesor(dataFinal);
        setPlanTesis(prueba2);
      }
      vinculoCorreo =
        "https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=" + asesor.correo;
      console.log(vinculoCorreo);
      setCorreoAsesor(vinculoCorreo);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showData();
  }, []);

  return (
    <div
      name="asesores"
      className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white"
    >
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
        <div className="pb-10 mb-4 flex flex-row w-full">
          <p className="text-3xl font-sans inline border-b-2 text-black flex-auto border-black w-4/5">
            Asesores
          </p>
          <p className="text-3xl font-sans inline border-b-2 text-black flex-auto border-black w-1/5 text-right">
            {semestre["anhoAcademico"]}-{semestre["periodo"]}
          </p>
        </div>
        {consiguio === false && (
          <CardNoHayAsesores
            info={{
              nombre: user.nombre,
              apellido: user.apellido,
            }}
          />
        )}

        {consiguio === true && (
          <div>
            <Card className="h-fit shadow-none border-2 border-blue-pucp">
              <CardBody>
                <div className="flex flex-row align-middle">
                  <div className="h-21 justify-between w-1/5 flex-col pr-10">
                    <img
                      src={UsuarioImagen}
                      alt="teacher-image"
                      className="rounded-full mx-auto max-w-full max-h-full"
                    />
                  </div>
                  
                  <div className="w-4/5 align-middle my-auto">
                    <p className="text-lg font-sans flex-auto text-black">
                      {asesor.codigoPUCP} - {asesor.nombre} {asesor.apellido}
                    </p>
                    <p className="text-base font-sans flex-auto  text-black">
                      {asesor.facultad.nombre} - {asesor.especialidad.nombre}
                    </p>
                    
                    <div className="inline-flex align-middle">
                    <Button   startIcon={<MailOutlineIcon/>}>
                    <a
                        href={correoAsesor}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {asesor.correo}
                      </a>
                    </Button>
                    </div>
                  </div>
                  <Button color="info"  startIcon={<AssignmentIcon/>} onClick={handleClickOpen}>
                    Encuesta de Opinión
                </Button>
                </div>
              </CardBody>
            </Card>
            <div className="inline-flex pb-4">
            </div>
            <CardPlanTesisAlumno
              info={{
                titulo: planTesis.titulo,
                descripcion: planTesis.descripcion,
                area: planTesis.areaEspecialidad.nombre,
              }}
            />
          </div>
        )}
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
         <DialogTitle id="alert-dialog-title">
         {"ENCUESTA DE OPINION SOBRE PROFESORES - GENERAL"}
         </DialogTitle>
         <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <b>Estimado(a) alumno(a): </b>          
          <br></br>
          Para realizar la Encuesta de Opinión debe ingresar al Campus Virtual y efectuar ahi la encuesta hacia su docente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose}> 
          <a
                href="https://ares.pucp.edu.pe/pucp/encdocen/edwendoc/edwendoc?accion=VerEncuestas"
                target="_blank"
                rel="noopener noreferrer"
              >
          Ingresar a Campus Virtual 
          </a>
          </Button>
        </DialogActions>
        </Dialog>     
    </div>
  );
};

export default Asesores;
