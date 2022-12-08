import React, { useState, useEffect } from "react";
import UsuarioImagen from "../../../assets/avatar.png";
import CuevaRony from "../../../assets/cueva.png";
import {Link, useLocation} from "react-router-dom";
import { Select, Option } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { MdEmail } from "react-icons/md";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';

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
    const {usuario, idCurso, semestre,nombreCurso} = state;
    console.log("QUE ME SACA STATE",state);
    let display;

    const [permisos, setPermisos] = useState({
        asesor: false,
        profesor: false,
        jurado: false,
    });
    
    const handleChange = (event) => {

            setPermisos({
                ...permisos,
                [event.target.name]: event.target.checked,
              });

        console.log("PERMISOS", permisos);
    };

    const showData = async () => {      
        try {
            const aux = usuario["listaRoles"];
            display = aux.map((x) => {
                let { id, idRol, nombre} = x;
                console.log(nombre);
                if(nombre === "PROFESOR"){
                    
                    setPermisos({
                        
                        asesor: permisos.asesor,
                        profesor: true,
                        jurado: permisos.jurado,
                    })

                }
                if(nombre === "ASESOR"){
                    setPermisos({
                        asesor: true,
                        profesor: permisos.profesor,
                        jurado: permisos.jurado,
                    })
                }
                if(nombre === "JURADO"){
                    setPermisos({
                        asesor: permisos.asesor,
                        profesor: permisos.profesor,
                        jurado: true,
                    })
                }
            })
          } catch (error) {
            console.log(error);
          }

      };

    useEffect(() => {
        showData();
    }, []);


  return (
    <div name="gestionusuariosdetalle" className="h-screen w-full bg-white">
        <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-fit">
            <div className="pb-5 mb-4 flex flex-row w-full">     
            <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp w-4/5">
            {state.nombreCurso} {">"} Usuarios {">"} {usuario.nombre} {usuario.apellido}
            </p>     
            <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp w-1/5 text-right">
            {semestre["anhoAcademico"]}-{semestre["periodo"]}
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
                    <div className="w-4/5 align-middle my-auto">
                        <p className="text-lg font-bold text-blue-pucp flex-auto">
                            {usuario.codigoPUCP} - {usuario.apellido}, {usuario.nombre}
                        </p>
                        <p className="text-base font-semibold text-blue-pucp flex-auto">
                            {usuario["facultad"]["nombre"]} - {usuario["especialidad"]["nombre"]}
                        </p>
                        <div className="inline-flex align-middle">                           
                            <div className="pr-2">
                                <MdEmail size={25} />
                            </div>
                            <p className="text-base font-semibold text-amber-800 border-b-2 border-amber-800 flex-auto">                            
                                {usuario.correo}
                            </p>
                        </div>
                    </div>                    
                </div>
                </CardBody>
                </Card>


            { usuario["listaRoles"][0]["nombre"] === "ALUMNO" &&

                <div>
                    <div className="inline-flex pt-6 pb-4"> 
                        <p className="text-2xl font-semibold inline  text-amber-800 flex-auto ">
                            Tema de Tesis
                        </p>
                    </div>         

                    <Card className="h-fit mt-10">
                        <CardHeader>
                            <div>
                                <p className="text-lg font-semibold text-blue-pucp flex-auto py-3 px-6">
                                    Chatbot conversacional que sugiere libros según las preferencias del usuario
                                </p>
                            </div>
                        </CardHeader>
                        <CardBody>
                        <div className="align-middle my-auto mx-4">
                            <p className="text-base font-semibold text-blue-pucp flex-auto pb-4">
                                Estos chatbots ofrecen al usuario la posibilidad de elegir entre varias opciones presentadas en forma de menús o botones. En función de lo que el usuario pulse, el bot le proporciona otra serie de opciones para elegir, llegando a la sugerencia idónea para satisfacer al usuario.
                            </p>
                            <p className="text-base font-bold text-amber-800 flex-auto">
                                Área: Ciencias de la computación
                            </p>
                        </div>
                        </CardBody>
                    </Card>         
                    
                    <div className="flex flex-row align-middle w-full pt-6">
                        <div className=" w-11/12"> 
                            <p className="text-2xl font-semibold  text-amber-800">
                            Asesor
                            </p>
                        </div>
                        <div className="w-1/12 text-right">                        
                            <IconButton aria-label="modify">
                                <EditIcon />
                            </IconButton>
                        </div>          
                    </div>

                    <Card className="h-fit mt-10">
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
                                <p className="text-lg font-bold text-blue-pucp flex-auto">
                                    0000980X - AGUILERA SERPA, OSCAR
                                </p>
                                <p className="text-base font-semibold text-blue-pucp flex-auto">
                                    Ciencias e Ingeniería - Ingeniería Informática
                                </p>
                                <div className="inline-flex align-middle">                           
                                    <div className="pr-2">
                                        <MdEmail size={25} />
                                    </div>
                                    <p className="text-base font-semibold text-amber-800 border-b-2 border-amber-800 flex-auto">                            
                                        cesar.aguilera@pucp.edu.pe
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                </div>

            }

            { usuario["listaRoles"][0]["nombre"] !== "ALUMNO" &&
                <div>
                    <div className="inline-flex pt-6 mb-4"> 
                        <p className="text-2xl font-semibold inline  text-amber-800 flex-auto">
                            Permisos
                        </p>
                    </div>         
                    <div className="grid grid-cols-1 w-full">

                    <FormControl component="fieldset" variant="standard">
                        <FormGroup>
                            <FormControlLabel
                            control={
                                <Switch checked={permisos.asesor} onChange={handleChange} name="asesor" />
                            }
                            label="Asesor"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={permisos.profesor} onChange={handleChange} name="profesor" />
                            }
                            label="Profesor"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={permisos.jurado} onChange={handleChange} name="jurado" />
                            }
                            label="Jurado"
                            />
                        </FormGroup>
                    </FormControl>
                                
                    </div>
                 
                </div>
            }
            
            </div>
        </div>        
    </div>
  );
};

export default GestionUsuariosDetalle;
