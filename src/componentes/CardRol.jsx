import React from "react";
import { Link } from "react-router-dom";

import avatar from "../assets/avatar.png";

import styled from "@emotion/styled";
import {useAuth} from "./Context";

const CardRol = ({ roles }) => {
  const {user, setUser} = useAuth();
  let display;

  const actualizarRolSeleccionado = (event, rol) => {
    setUser({...user, rolActual: rol})
  }

  if (roles) {
    display = roles.map((value) => {
      const nombre = value["nombre"].toLowerCase();
      let link = `/${nombre}`;
      return (
        <Link to={link} key={value["idRol"]} onClick={event => actualizarRolSeleccionado(event, nombre)}>
          <Card className="position-relative text-dark d-flex flex-col justify-center">
            <div>
              <center>
                <img src={avatar} alt="" height={80} width={80} />
              </center>
            </div>
            <div className="content fs-5 fw-bold mt-3 font-sans">
              <center>{value["nombre"]}</center>
            </div>
          </Card>
        </Link>
      );
    });
  } else {
    display = "No posee ningún rol";
  }

  return <>{display}</>;
};

export default CardRol;

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
    box-shadow: rgb(0 0 0 / 7%) 0 26px 30px -10px;
      border-color: rgba(4, 35, 84, 0.8);
  }
`;
