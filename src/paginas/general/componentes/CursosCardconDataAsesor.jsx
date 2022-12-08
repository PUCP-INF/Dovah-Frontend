import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import styled from '@emotion/styled';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Box,
  Button,
  TextField,
} from "@mui/material";
function CursosCardconDataAsesor({info}) {
    let navigate = useNavigate();

    let display = info.data;
    if (info) {
        display = info.map((x) => {
            let { activo, clave, coordinadorCurso, documentosGenerales, especialidad, fechaCreacion, idCurso, listaUsuariosAsignados, nombre, semestre, tareas } = x;
            return (
              <Card id={idCurso}>
              <Background/>
              <Contenido>
                  <Columna1>
                      <h5>{clave} - {nombre}</h5>     
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{semestre['anhoAcademico']}-{semestre['periodo']}</p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Especialidad: {especialidad['nombre']}</p>
                  <div>
                    <Link to="pendientes" state={x}>
                    <Button startIcon={<AssignmentTurnedInIcon  />}>Pendientes por corregir</Button>
                    </Link>
                  </div>
                  <div>
                    <Link to="usuarios" state={x}>
                    <Button startIcon={<AccountCircleIcon />}>Alumnos</Button>
                    </Link>
                  </div>
                  </Columna1>
              </Contenido>        
          </Card>
            );
        });
    }else{
        display = "No hay data";
    }
    return <>{display}</>;
}

export default CursosCardconDataAsesor

const Card = styled.div`
    margin: 24px;
    padding: 0px;
    max-width: 100%;
    max-height: 500px;
    border-radius: 10px;
    border: 2px solid rgba(249, 249, 249, 0.9);
    box-shadow: rgb(0 0 0 / 7%) 0px 26px 30px -10px,
    rgb(0 0 0 / 7%) 0px 16px 10px -10px;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
    display: grid;
    grid-template-columns: 1fr;

    &:hover {
      box-shadow: rgb(0 0 0 / 7%) 0 26px 30px -10px;
      border-color: rgba(4, 35, 84, 0.8);
    }
  `



  const Background = styled.div`

    display: flex;
    position: relative;
    overflow-x: hidden;
    width: 100%;
    height: 100px;
    margin-bottom: 20px;

    &:before {
        background: url("https://images.unsplash.com/photo-1578070181910-f1e514afdd08?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1233&q=80") center center / cover
        no-repeat;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
    }

    img{
        /*border: 3px solid rgb(197, 196, 196);*/
        height: 100%;
        width: 100%;
    }

  `


  const Contenido = styled.div`
    display: grid;
    grid-template-columns: 7fr 1fr ;
    padding: 0px 10px 0px 10px;
  `

  const Columna1 = styled.div`
    h5{
        margin-bottom: 8px;
        font-size: 24px;
        line-height: 32px;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: rgb(33, 33, 33);
    }
  `

  const Columna2 = styled.div`
    margin-left: auto;
  `