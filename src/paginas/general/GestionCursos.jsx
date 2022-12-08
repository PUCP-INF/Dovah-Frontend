import React, { useState, useEffect } from 'react'
import {Link, Outlet, Route, Routes, useLocation} from "react-router-dom";
import CursosCard from "./componentes/CursosCard";
import styled from "styled-components";
import {useAuth} from "../../componentes/Context";
import {
  listarCursosPorIdUsuario,
} from "../../services/CursoServices";


function GestionCursos() {

  const location = useLocation();
  const {user} = useAuth();
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    showData();
    console.log(location.pathname);
  }, []);

  
  const showData = async () => {
    try {
      let id = user["idUsuario"];
      const aux = await listarCursosPorIdUsuario(id);
      let data = aux.data;
      setCursos(data);
      console.log(data);
    } catch (error) {
      setCursos();
      console.log(error);
    }
  };


  return (
    <Container>
        <Titulo> <p>Gestion de Cursos</p> </Titulo>
        <CursosCard info={cursos}/>
    </Container>
    
  )
}

export default GestionCursos

const Container = styled.main`
    min-height: calc(100vh - 120px);
    padding: 0 calc(3.5vw + 5px);
    overflow-y: hidden;

    div{
        align-items: center;
        justify-content: center;
    }
`

const Titulo = styled.div`
  margin-top: 25px;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  p{
    font-size: 30px;
    font-weight: 700;
    display: inline;
    border-bottom-width: 4px;
    color: rgb(4, 35, 84);
    border-color: rgb(4, 35, 84);
    flex: 1 1 auto;
  }
`