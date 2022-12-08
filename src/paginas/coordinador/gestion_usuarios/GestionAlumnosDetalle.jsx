import React from "react";
import IvanCordova from "../../../assets/alumno.png";
import CesarAguilera from "../../../assets/asesor.png";
import { Link } from "react-router-dom";
import { Select, Option } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { MdEmail } from "react-icons/md";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

const GestionAlumnosDetalle = () => {
  return (
    <div name="gestionalumnosdetalle" className="h-screen w-full bg-white">
        <div className="flex w-full h-20"></div>
        <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-fit">
            <div className="pb-5 mb-4 flex flex-row w-full">          
                <p className="text-3xl font-semibold inline border-b-4 text-blue-pucp flex-auto border-blue-pucp w-4/5">
                    Usuarios {">"} Alumnos {">"} Iván Córdova
                </p>
                <p className="text-3xl font-semibold inline border-b-4 text-blue-pucp flex-auto border-blue-pucp w-1/5 text-right">
                    2022-2
                </p>
            </div>

            <div>
                <Card className="h-fit">
                <CardBody>
                <div className="flex flex-row align-middle">
                    <div className="h-21 justify-between w-1/5 flex-col pr-10">
                        <img
                            src={IvanCordova}
                            alt="student-image"
                            className="rounded-full mx-auto max-w-full max-h-full"
                        />
                    </div>
                    <div className="w-3/5 align-middle my-auto">
                        <p className="text-lg font-bold text-blue-pucp flex-auto">
                            0000982X - CORDOVA RIVERO, IVAN
                        </p>
                        <p className="text-base font-semibold text-blue-pucp flex-auto">
                            Ciencias e Ingeniería - Ingeniería Informática
                        </p>
                        <div className="inline-flex align-middle">                           
                            <div className="pr-2">
                                <MdEmail size={25} />
                            </div>
                            <p className="text-base font-semibold text-amber-800 border-b-2 border-amber-800 flex-auto">                            
                                sebastian.cordova@pucp.edu.pe
                            </p>
                        </div>
                    </div>
                    <div className="w-1/5 align-top text-right pl-10">
                        <IconButton aria-label="modify">
                            <EditIcon />
                        </IconButton>
                    </div>
                </div>
                </CardBody>
                </Card>

            <div className="inline-flex align-middle pt-10 pb-4">                           
                <p className="text-2xl font-semibold inline  text-amber-800 flex-auto">
                    Asesor y Tema de Tesis
                </p>
            </div>

            <div className="mt-4">

                <div className="grid grid-cols-2 w-full">
                    <div> </div>
                    <div className="flex flex-row justify-items-end">
                    <Button variant="contained" className="bg-white text-blue-pucp border-b-3 w-32 ml-48 mr-4">Asignar</Button>
                    <Button variant="contained" className="bg-amber-800  w-32 ">Modificar</Button>
                    </div>          
                </div>

                <Card className="h-fit mt-10">
                    <CardHeader>
                        <div>
                            <p className="text-lg font-semibold text-blue-pucp flex-auto p-8">
                                Propuesta de la plataforma de Big Data orientado al sector turístico
                            </p>
                        </div>
                    </CardHeader>
                <CardBody>
                <div className="flex flex-row align-middle">
                    <div className="h-21 justify-between w-1/5 flex-col pr-10">
                        <img
                            src={CesarAguilera}
                            alt="adviser-image"
                            className="rounded-full mx-auto max-w-full max-h-full"
                        />
                    </div>
                    <div className="w-3/5 align-middle my-auto">
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
                    <div className="w-1/5 align-top text-right pl-10">
                        <IconButton aria-label="modify">
                            <EditIcon />
                        </IconButton>
                    </div>
                </div>
                <div className="align-middle my-auto mt-5">
                    <p className="text-lg font-bold text-blue-pucp flex-auto">
                        Áreas de especialización
                    </p>

                    <p className="text-base font-semibold text-blue-pucp flex-auto">
                        Sistemas de Información Empresariales, Ciencias de la Computación aplicada a la Industria.
Sistema ERP SAP (Supply Chain), Administracion de Base de Datos (MSSQL y Oracle)
                    </p>
                </div>
                </CardBody>
                </Card>

            </div>

        </div>
        <div className="grid grid-cols-3 w-full pt-8">
            <div> </div>
            <div> </div>
            <div className="text-right">
                <Button variant="contained" className="bg-blue-pucp">Salir</Button>
            </div>          
            </div>
      </div>
    </div>
  );
};

export default GestionAlumnosDetalle;