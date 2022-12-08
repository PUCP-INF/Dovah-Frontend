import React, { useState, useEffect } from 'react'
import { useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import {useAuth} from "../../componentes/Context";
import {
  listarCursosPorIdUsuario,
} from "../../services/CursoServices";

import CursosCardconDataProfesor from "../general/componentes/CursosCardconDataProfesor";
import axios from "axios";
function GestionCursosProfesor() {
  const {user} = useAuth();
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    showData();
  }, []);

  
  const showData = async () => {
    try {
      const aux = await axios.get(`/curso/listarCursosPorUsuario/${user.idUsuario}/${user.rolActual}`);
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
        <br></br>
        <div className="pb-10 mb-4 grid grid-cols-1">
          <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp">
            Gestión de Cursos
          </p>
        </div>
        <CursosCardconDataProfesor info={cursos}/>
    </Container>
    
  )
}

export default GestionCursosProfesor

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