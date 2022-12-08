import { LibraryAddCheck } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

import ErrorIcon from "@mui/icons-material/Error";
import styled from "@emotion/styled";

const CardTareaPendiente = ({ info }) => {
  //hook para navegabilidad
  let navigate = useNavigate();
  //Uso de la data recibida
  let display = info;

  if (info) {
    return (
      <Card id={info.id}>
        <div className="mr-4">
          <ErrorIcon
            fontSize="large"
            className="mt-3"
            htmlColor="orange"
          ></ErrorIcon>
        </div>
        <div>
          <h5 className="ml-auto text-2xl font-signature tracking-tight text-gray-900 dark:text-white">
            {info.nombre}
          </h5>
          <p className="ml-auto font-signature text-gray-700 dark:text-gray-400">
            {info.descripcion}
          </p>
        </div>

       
      </Card>
    );
  } else {
    display = "No hay data";
  }
  return <>display</>;
};

export default CardTareaPendiente;

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


 /*botón en reserva por el momento

        <div className="ml-auto mt-auto flex-row text-right border-radius:50%">
          <Button>Ver Todo</Button>
        </div>

        */