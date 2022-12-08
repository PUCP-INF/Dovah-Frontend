import { FenceSharp, LibraryAddCheck } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import ErrorIcon from "@mui/icons-material/Error";
import styled from "@emotion/styled";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

const CardPlanTesisAlumno = ({ info }) => {
  //hook para navegabilidad
  let navigate = useNavigate();
  //Uso de la data recibida
  let display = info;
  if (info) {
    return (
      <Card className="h-fit mt-10">
      <CardHeader>
          <div>
              <p className="text-lg font-sans text-blue-pucp font-medium flex-auto py-3 px-6">
                  Tema de tesis : {info.titulo}
              </p>
          </div>
      </CardHeader>
      <CardBody>
      <div className="align-middle my-auto mx-4">
          <p className="text-base font-sans text-black flex-auto pb-4">
              Descripción: {info.descripcion}
          </p>
          <p className="text-base font-sans text-black flex-auto">
              Area : {info.area}
          </p>
      </div>
      </CardBody>
  </Card>         
       
    );
  } else {
    display = "No hay data";
  }
  return <>display</>;
};

export default CardPlanTesisAlumno;

