import React from "react";

import styled from "@emotion/styled";

const CardEntregable = ({ props }) => {
  //<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{props.nombre}</h5>
  //font-normal text-gray-400 dark:text-gray-400

  if (props.estado === "Revisado") {
    let newDate = new Date(Date.parse(props.ultimaModificacion));
    let newDate2 = newDate.toLocaleString();

    return (
      <Card id={props.id}>
        <div className="w-full">
          <div>
            <h5 className="mb-2 text-2xl font-signature tracking-tight text-gray-900 dark:text-white">
              {props.nombre}
            </h5>
          </div>
          <div className="flex flex-row w-full">
            <p className="font-signature text-gray-400 dark:text-gray-400 w-4/5">
              {props.estado}
            </p>
            <p className="font-signature text-gray-400 dark:text-gray-400 w-1/5">
              {newDate2}
            </p>
          </div>
        </div>
      </Card>
    );
  } else if (props.estado === "Por revisar") {
    return (
      <Card id={props.id}>
        <div className="w-full">
          <div>
            <h5 className="mb-2 text-2xl font-signature tracking-tight text-gray-900 dark:text-white">
              {props.nombre}
            </h5>
          </div>
          <div className="flex w-full">
            <p className="font-signature text-gray-700 dark:text-gray-400 w-4/5">
              {props.estado}
            </p>
            <p className="font-signature text-gray-700 dark:text-gray-400 w-1/5">
              {props.ultimaModificacion}
            </p>
          </div>
        </div>
      </Card>
    );
  } else if (props.estado === "Pendiente") {
    return (
      <Card id={props.id}>
        <div className="w-full">
          <div>
            <h5 className="mb-2 text-2xl font-signature tracking-tight text-gray-900 dark:text-white">
              {props.nombre}
            </h5>
          </div>
          <div className="flex w-full">
            <p className="font-signature text-orange-800 dark:text-gray-400 w-4/5">
              {props.estado}
            </p>
          </div>
        </div>
      </Card>
    );
  }
};

export default CardEntregable;

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
