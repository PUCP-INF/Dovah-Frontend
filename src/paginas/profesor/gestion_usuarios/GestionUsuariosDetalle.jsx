import React, { useState, useEffect } from "react";
import UsuarioImagen from "../../../assets/avatar.png";
import CuevaRony from "../../../assets/cueva.png";
import {Link, useLocation} from "react-router-dom";
import { Select, Option } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Button } from "@mui/material";
import { MdEmail } from "react-icons/md";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

import{
    buscarUsuarioPorId,
  } from "../../../services/UsuarioServices";

const GestionUsuariosDetalle = () => {
    const { state } = useLocation();
    const [usuario, setUsuario] = useState([]);
    const {idUsuario,idCurso, semestre, nombreCurso} = state;
    console.log("STATEEEEE: ",state);
    const [especialidad, setEspecialidad] = useState([]);
    const [facultad, setFacultad] = useState([]);
    const [correoAlumno, setCorreoAlumno] = useState();
    var vinculoCorreo = "";
    const showData = async() =>{
        try {
            const usuarios = await buscarUsuarioPorId(idUsuario);
            console.log("USUARIOS",usuarios);
            const data = usuarios.data;
            setEspecialidad(data.especialidad);
            setFacultad(data.facultad);
            console.log("USUARIO DATA",data);
            setUsuario(data);
            vinculoCorreo ="https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=" + data.correo;
            console.log(vinculoCorreo);
            setCorreoAlumno(vinculoCorreo);
          } catch (error) {
            console.log(error);
          }
      };
      
      useEffect(()=>{
        showData();
      },[]);
    
  return (
    <div name="gestionusuariosdetalle" className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white">
        <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
            <div className="pb-10 mb-4 grid grid-cols-1">          
                <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
                    {state.nombreCurso} {"-"} {usuario.nombre} {usuario.apellido}
                </p>
            </div>

            <div>
                <Card className="h-fit">
                <CardBody>
                <div className="flex flex-row align-middle">
                    <div className="h-21 justify-between w-1/5 flex-col pr-10">
                        <img
                            src={UsuarioImagen}
                            alt="teacher-image"
                            className="rounded-full mx-auto max-w-full max-h-full"
                        />
                    </div>
                    <div className="w-3/5 align-middle my-auto">
                        <p className="text-lg font-bold text-blue-pucp flex-auto">
                            {usuario.codigoPUCP} - {usuario.apellido}, {usuario.nombre}
                        </p>
                        <p className="text-base font-semibold text-blue-pucp flex-auto">
                        {facultad.nombre} - {especialidad.nombre}
                        </p>
                        <div className="inline-flex align-middle">                           
                        <Button color="warning"  startIcon={<MailOutlineIcon/>}>
                        <a
                            href={correoAlumno}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                        {usuario.correo}
                      </a>
                    </Button>
                        </div>
                    </div>
                </div>
                </CardBody>
                </Card>

            </div>
        </div>        
    </div>
  );
};

export default GestionUsuariosDetalle;
