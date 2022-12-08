import { FenceSharp, LibraryAddCheck } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import ErrorIcon from "@mui/icons-material/Error";
import styled from "@emotion/styled";

const CardNoHayAsesores= ({ info }) => {
  //hook para navegabilidad
  let navigate = useNavigate();
  //Uso de la data recibida
  let display = info;
  if (info) {
    return (
      <Card>
        <div className="mr-4">
          <ErrorIcon
            fontSize="large"
            className="mt-3"
            htmlColor="orange"
          ></ErrorIcon>
        </div>
        <div>
          <p className="text-1xl font-semibold inline border-b-4 text-blue-pucp flex-auto">
           Estimado:   {info.nombre} {info.apellido}
          </p>
          <p className="ml-auto font-signature text-gray-700 dark:text-gray-400">
            Le recordamos que tiene que escoger un tema de tesis para el curso o proponer el suyo en caso contrario
          </p>
        </div>
      </Card>
    );
  } else {
    display = "No hay data";
  }
  return <>display</>;
};

export default CardNoHayAsesores;

const Card = styled.div`
  margin: 20px;
  padding: 24px;
  max-width: 100%;
  max-height: 160px;
  border-radius: 10px;
  border: 2px solid rgba(249, 249, 249, 0.9);
  box-shadow: rgb(0 0 0 / 7%) 0px 26px 30px -10px,
    rgb(0 0 0 / 7%) 0px 16px 10px -10px;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  display: flex;

  &:hover {
    box-shadow: rgb(0 0 0 / 7%) 0px 26px 30px -10px,
      rgb(0 0 0 / 7%) 0px 16px 10px -10px;
    transform: scale(1.05);
    border-color: rgba(239, 108, 0, 0.8);
  }
`;
