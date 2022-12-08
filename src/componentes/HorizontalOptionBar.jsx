import React from "react";
import { FiSettings } from "react-icons/fi";
import { BsPersonBadge } from "react-icons/bs";

import LogoutIcon from '@mui/icons-material/Logout';

import { BiTask } from "react-icons/bi";
import { Link } from "react-router-dom";
import styled from "styled-components";

const HorizontalOptionBar = () => {
  const links = [
    {
      id: 1,
      child: (
        <Link
          to="/"
          className="flex w-full text-white justify-center items-center"
        >
          <FiSettings size={25} />
          <p className="pl-4">Configuración</p>    
        </Link>
      ),
      style: "rounded-tr-md",
    },
    {
      id: 2,
      child: (
        <Link
          to="/gestiondefacultades"
          className="flex w-full text-white justify-center items-center"
        >
          <BsPersonBadge size={25} />
          <p className="pl-4">Roles</p>
        </Link>
      ),
    },
    {
      id: 3,
      child: (
        <Link
          to="/gestiondesemestres"
          className="flex w-full text-white justify-center items-center"
        >
          <LogoutIcon size={25} />
          <p className="pl-4">Cerrar Sesión</p>
        </Link>
      ),
    },
  ];

  return (
    <Nav>
      <Opciones>
        {links.map(({ id, child, href, style, download }) => (
          <li key={id}>
            {child}
          </li>
        ))}
      </Opciones>
    </Nav>
  );
};

export default HorizontalOptionBar;

const Nav = styled.div`
  display: inline-flex;
  position: absolute;
  margin-top: 0px;
  right: 0px;
  background-color: rgb(4, 35, 84);
`

const Opciones = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  

  li{
    display: inline-block;
    width: 160px;
    height: fit-content;
    padding: 10px 10px 10px 10px;
  }

`