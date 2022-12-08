import React from "react";
import { Link } from "react-router-dom";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { Select, Option } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";

const ListaEntregablesPendientes = () => {
  const rows: GridRowsProp = [
    {
      id: 1,
      col1: "20181923",
      col2: "Iván Córdova Rivero",
      col3: "01/09/2000",
      col4: "Por revisar",
    },
    {
      id: 2,
      col1: "20182778",
      col2: "Elizabeth Oyarce Tocto",
      col3: "01/09/2000",
      col4: "Por revisar",
    },
    {
      id: 3,
      col1: "20182970",
      col2: "Ángel Lino Campos",
      col3: "01/09/2000",
      col4: "Por revisar",
    },
    {
      id: 4,
      col1: "20190666",
      col2: "Bruno del Rio Escudero",
      col3: "01/09/2000",
      col4: "No entregado",
    },
    {
      id: 5,
      col1: "20173485",
      col2: "Osman Vilchez Aguirre",
      col3: "01/09/2000",
      col4: "No entregado",
    },
    {
      id: 6,
      col1: "20183294",
      col2: "Fernando Vergara Guzman",
      col3: "01/09/2000",
      col4: "No entregado",
    },
  ];

  const columns: GridColDef[] = [
    { field: "col1", headerName: "Código", width: 150 },
    { field: "col2", headerName: "Nombre completo", width: 350 },
    { field: "col3", headerName: "Fecha de entrega", width: 150 },
    { field: "col4", headerName: "Estado", width: 150 },
  ];

  return (
    <div name="listaentregablespendientes" className="h-screen w-full bg-white">
      <div className="flex w-full h-20"></div>
      <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-full">
        <div className="pb-10 grid grid-cols-2">
          <p className="text-3xl font-semibold inline border-b-4  text-blue-900 flex-auto border-blue-900">
            INF391 - Proyecto de Tesis
          </p>
          <p className="text-3xl font-semibold inline border-b-4  text-blue-900 flex-auto border-blue-900 text-right">
            2022-2
          </p>
        </div>

        <div className="pb-8 grid grid-cols-2">
          <p className="text-3xl font-semibold inline border-b-4  text-amber-600 flex-auto border-amber-600">
            Entregable 1
          </p>
          <p className="text-3xl font-semibold inline border-b-4  text-white flex-auto border-amber-600 text-right">
            -
          </p>
        </div>

        <div className="pb-8 flex flex-row">
          <div className="w-72">
            <Input label="Nombre del alumno" />
          </div>

          <div className="w-72  mx-12">
            <Select label="Estado">
              <Option>Por revisar</Option>
              <Option>Revisados</Option>
              <Option>No entregados</Option>
            </Select>
          </div>

          <Button className="ml-72 bg-blue-900">Buscar</Button>
        </div>

        <div className="pb-6" style={{ height: 350, width: "100%" }}>
          <Link to="gestionentrega">
            <DataGrid rows={rows} columns={columns} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListaEntregablesPendientes;
