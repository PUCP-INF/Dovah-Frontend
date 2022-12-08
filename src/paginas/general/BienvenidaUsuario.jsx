import React from "react";
import styled from '@emotion/styled';

const Home = () => {

  return (
    <Container name="home">
      <Content>
        <Titulo>
          <h2>
            Sistema de Gestión de Tesis
          </h2>
          <p>
            Bienvenido al Sistema de Gestión de Tesis PUCP. Elija la opción más
            adecuada a sus necesidades en la barra superior.
          </p>
        </Titulo>

        <Portada>
          <img
            src={"https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
            alt="main image"
          />
        </Portada>

      </Content>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 120px);
  padding: 0 calc(3.5vw + 5px);
  overflow-x: hidden;
  overflow-y: auto;
  background-color: white;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 110px;
`

const Titulo = styled.div`
  display: grid;
  grid-gap: 25px;
  
  h2 {
    font-size: 60px;
    line-height: 1;
    font-weight: bold;
    color: rgb(13, 71, 161);
  }

  p {
    font-size: small;
    line-height: 1;
    font-weight: bolder;
    color: rgb(158, 158, 158)
  }
`

const Portada = styled.div`
  display: grid;
  max-width: 65%;

  img {
    border-radius: 16px;
    margin: auto;
    max-width: 85%;
    max-height: 85%;
  }
`
