import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import styled from "styled-components";

import {
  listarCursos,
  buscarCursoPorId,
  agregarCurso,
  actualizarCurso,
  eliminarCurso,
  listarCursosPorIdEspecialidad,
  listarCursosPorIdSemestre,
  
} from "../../../services/CursoServices";

  const CursoCardDetalle = ( {info} ) => {
    //hook para navegabilidad
    let navigate = useNavigate();
    //uso de la data recibida
    let display = info.data;

    //para eliminar
    const deleteCurso = (id) => {
      eliminarCurso(id);
    };

    //si se recibe info, se retorna una card por cada elemento del array
    if (info) {
      display = info.map((x) => {
        let { id, clave, coordinadorCurso, descripcion, fechaCreacion, fechaFinalizacion, idCurso, listaUsuarios, nombre, tareas } = x;
        console.log(nombre);
        return (
            <Card id={id}>
                <div>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{clave} - {nombre}</h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{descripcion}</p>
                </div>
                <div className="ml-auto flex-row text-right border-radius:50%">                        
                  <IconButton 
                    aria-label="view"
                    onClick={() => {
                      navigate("detallecurso", {
                        state: {
                          idCurso : idCurso,
                          clave : clave,
                          nombre : nombre,
                          coordinador : coordinadorCurso,
                          descripcion : descripcion,
                          fechaCreacion : fechaCreacion,
                          fechaFinalizacion : fechaFinalizacion,
                          listaUsuarios : listaUsuarios,
                          tareas : tareas,
                        },
                      });
                    }}
                    >
                    <DisplaySettingsIcon />
                  </IconButton>
                  <IconButton 
                    aria-label="delete"
                    onClick={() =>
                      deleteCurso({
                        idCurso: idCurso,
                      })
                    }
                    >
                    <DeleteIcon />
                  </IconButton>
                </div>
            </Card>
        );
      });
    }else{
      display = "No hay data";
    }
    return <>{display}</>;
  }

  export default CursoCardDetalle;

  const Card = styled.div`
    margin: 20px;
    padding: 24px;
    max-width: 100%;
    max-height: 160px;
    border-radius: 10px;
    border: 4px solid rgba(249, 249, 249, 0.9);
    box-shadow: rgb(0 0 0 / 7%) 0px 26px 30px -10px,
    rgb(0 0 0 / 7%) 0px 16px 10px -10px;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
    display: flex;

    &:hover {
      box-shadow: rgb(0 0 0 / 7%) 0px 26px 30px -10px,
      rgb(0 0 0 / 7%) 0px 16px 10px -10px;
      transform: scale(1.05);
      border-color: rgba(255, 143, 0, 0.8);
    }
  `
  