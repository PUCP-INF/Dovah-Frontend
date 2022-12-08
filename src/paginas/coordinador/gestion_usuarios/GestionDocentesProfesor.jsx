import React from "react";
import { Link } from "react-router-dom";
import { Select, Option } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Switch } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

const GestionDocentesProfesor = () => {
  return (
    <div name="gestiondocentesprofesor" className="h-screen w-full bg-white">
        <div className="flex w-full h-20"></div>
        <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-fit">
            <div className="pb-5 mb-4 flex w-full">          
              <p className="text-3xl font-semibold inline border-b-4 text-blue-pucp flex-auto border-blue-pucp">
                Usuarios > Docentes > Rony Cueva > Permisos de Profesor
              </p>
            </div>

            <div className="flex flex-row align-middle pb-6 ">  
              <p className="text-2xl font-semibold inline  text-amber-800 flex-auto">
                Configuración de Permisos
              </p>      
              <div className="w-1/8 align-top text-right pl-8">
                <Stack direction="row" spacing={1} className="ml-auto flex">
                  <IconButton aria-label="modify">
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="add">
                    <SaveIcon />
                  </IconButton>
                </Stack>
              </div>
            </div>
            <div className="pb-2 ">
              <div className="mx-2 flex flex-row mb-4">
              <div className="w-1/3 text-gray-700 text-lg font-semibold flex-auto align-middle mt-1">
                  Proyecto de Tesis 1
                </div>

                <div className="w-1/12 mt-2">
                  <Switch color="orange" defaultChecked/>
                </div>

                <div className="">
                  <Select label="Periodo Académico">
                    <Option>2022-2</Option>
                    <Option>2023-0</Option>
                  </Select>
                </div>

                <div className="ml-4">
                    <Select label="Horario">
                        <Option>H104</Option>
                        <Option>H105</Option>
                    </Select>
                </div>
              </div>
              <div className="mx-2 flex flex-row mb-4">
                <div className="w-1/3 text-gray-700 text-lg font-semibold flex-auto align-middle mt-1">
                  Proyecto de Tesis 2
                </div>

                <div className="w-1/12 mt-2">
                  <Switch color="orange"/>
                </div>

                <div className="">
                  <Select label="Periodo Académico">
                    <Option>2022-2</Option>
                    <Option>2023-0</Option>
                  </Select>
                </div>

                <div className="ml-4">
                    <Select label="Horario">
                        <Option>H104</Option>
                    </Select>
                </div>
              </div>
            </div> 
            <div className="pb-8">  
              <p className="text-2xl font-semibold inline  text-amber-800 flex-auto">
                Información general del Profesor
              </p>      
            </div>

            <div className="pb-4">
              <Card className="h-fit border">               
                <CardBody>
                  <p className="text-lg text-blue-pucp font-bold flex-auto pb-4">
                    Proyecto de Tesis 1
                  </p>

                  <div className="flex flex-row align-middle w-full pb-2">
                    <div className="flex flex-row align-middle w-1/2 mr-6">
                      <p className="text-lg font-normal inline flex-auto">
                        Cantidad de alumnos del horario
                      </p>  
                      <p className="text-lg text-right font-normal inline flex-auto">
                        20
                      </p>
                    </div>

                    <div className="flex flex-row align-middle w-1/2 ml-6">
                      <p className="text-lg font-normal inline flex-auto">
                        Cantidad de asesores del horario
                      </p>  
                      <p className="text-lg text-right font-normal inline flex-auto">
                        15
                      </p>
                    </div>                                        
                  </div>               
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
  );
};

export default GestionDocentesProfesor;