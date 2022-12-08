import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Select, Option, Textarea } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

import { BiTask } from "react-icons/bi";

const GestionAlumnosTareas = () => {
  /////comineza
  //1.- configurar los hooks
  const [users, setUsers] = useState([]);
  //2.- Funcion para mostrar los datos con fetch
  const URL = "http://localhost:8081/api/v1/facultad"; //sacar del postman
  //GA DE CAMBIO
  //obtencion de data ******IMPORTANTE********
  const showData = async () => {
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data);
    setUsers(data);
  };

  const columns: GridColDef[] = [
    {
      field: 'carpeta',
      headerName: 'Carpetas',
      width: 200,
      editable: true,
    },
    {
      field: 'fecha_ultmodificacion',
      headerName: 'Fecha de última modificación',
      width: 440,
      editable: true,
    },
    {
      field: 'observaciones',
      headerName: 'Observaciones',
      width: 200,
      editable: true,
    },
  ];
  
  const rows = [
    { id: 1, carpeta: 'Entregable 1', fecha_ultmodificacion: '05/10/2022', observaciones: 'Ver portafolio'},
    { id: 2, carpeta: 'Entregable 2', fecha_ultmodificacion: '05/10/2022', observaciones: 'Ver portafolio'},
    { id: 3, carpeta: 'Entregable 3', fecha_ultmodificacion: '05/10/2022', observaciones: 'Ver portafolio'},
    { id: 4, carpeta: 'Entregable final', fecha_ultmodificacion: '05/10/2022', observaciones: 'No asignado'},
  ];

  return (
    <div name="gestionalumnostareas" className="h-screen w-full bg-white">
      <div className="flex w-full h-20"></div>

      <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-fit">
        <div className="pb-10 mb-4 grid grid-cols-1">          
            <p className="text-3xl font-bold inline border-b-4  text-blue-pucp flex-auto border-blue-pucp">
              Alumno X {">"} Tareas
            </p>
        </div>

        <div>
          <Box sx={{ height: 350, width: '100%' }} className="pb-5">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={4}
              rowsPerPageOptions={[4]}
              checkboxSelection
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Box>

        </div>
      </div>
    </div>
  );
};

export default GestionAlumnosTareas;