import React from "react";
import CuevaRony from "../../../assets/cueva.png";
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

const GestionDocentesDetalle = () => {
  return (
    <div name="gestiondocentesdetalle" className="h-screen w-full bg-white">
        <div className="flex w-full h-20"></div>
        <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-fit">
            <div className="pb-5 mb-4 flex flex-row w-full">          
            <p className="text-3xl font-semibold inline border-b-4 text-blue-pucp flex-auto border-blue-pucp w-4/5">
                Usuarios > Docentes > Rony Cueva
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
                            src={CuevaRony}
                            alt="teacher-image"
                            className="rounded-full mx-auto max-w-full max-h-full"
                        />
                    </div>
                    <div className="w-3/5 align-middle my-auto">
                        <p className="text-lg font-bold text-blue-pucp flex-auto">
                            0000982X - CUEVA MOSCOSO, RONY
                        </p>
                        <p className="text-base font-semibold text-blue-pucp flex-auto">
                            Ciencias e Ingeniería - Ingeniería Informática
                        </p>
                        <div className="inline-flex align-middle">                           
                            <div className="pr-2">
                                <MdEmail size={25} />
                            </div>
                            <p className="text-base font-semibold text-amber-800 border-b-2 border-amber-800 flex-auto">                            
                                ronycueva@pucp.edu.pe
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

            <div className="inline-flex align-middle pt-6 pb-10">                           
                <p className="text-2xl font-semibold inline  text-amber-800 flex-auto">
                    Permisos
                </p>
            </div>

            <div className="grid grid-cols-3 w-full">
                <Card className="h-fit mr-2 border border-gray-300 hover:border-amber-800 hover:bg-amber-700 hover:text-white cursor-pointer transition ease-in duration-500">
                    <CardHeader>
                        <p className="text-lg text-blue-pucp font-bold flex-auto text-center">
                            ASESOR
                        </p>
                    </CardHeader>
                    <CardBody>
                        <p className="text-lg font-bold flex-auto text-left">
                            Proyecto de Tesis 1 - ON
                        </p>
                        <p className="text-lg font-bold flex-auto text-left">
                            Proyecto de Tesis 2 - ON
                        </p>
                    </CardBody>

                </Card>

                <Card className="h-fit mr-2 border border-gray-300 hover:border-amber-800 hover:bg-amber-700 hover:text-white cursor-pointer transition ease-in duration-500">
                    <CardHeader>
                        <p className="text-lg text-blue-pucp font-bold flex-auto text-center">
                            PROFESOR
                        </p>
                    </CardHeader>
                    <CardBody>
                        <p className="text-lg font-bold flex-auto text-left">
                            Proyecto de Tesis 1 - ON
                        </p>
                        <p className="text-lg font-medium flex-auto text-left">
                            Proyecto de Tesis 2 - OFF
                        </p>
                    </CardBody>
                </Card>
                 
                <Card className="h-fit mr-2 border border-gray-300 hover:border-amber-800 hover:bg-amber-700 hover:text-white cursor-pointer transition ease-in duration-500">
                    <CardHeader>
                        <p className="text-lg text-blue-pucp font-bold flex-auto text-center">
                            JURADO
                        </p>
                    </CardHeader>
                    <CardBody>
                        <p className="text-lg font-bold flex-auto text-left">
                            Proyecto de Tesis 1 - ON
                        </p>
                        <p className="text-lg font-medium flex-auto text-left">
                            Proyecto de Tesis 2 - OFF
                        </p>
                    </CardBody>
                </Card>          
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
    </div>
  );
};

export default GestionDocentesDetalle;
