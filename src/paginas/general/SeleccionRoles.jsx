import React, { useState, useEffect } from "react";
import { useAuth } from "../../componentes/Context";
import CardRol from "../../componentes/CardRol";
import { Navigate } from "react-router-dom";

const SeleccionRoles = () => {
  const { user } = useAuth();
  const [numCards, setNumCards] = useState();

  useEffect(() => {
    if (user["listaRoles"].length === 2) {
      setNumCards("repeat(2, minmax(0, 1fr))");
    } else if (user["listaRoles"].length === 3) {
      setNumCards("repeat(3, minmax(0, 1fr))");
    } else if (user["listaRoles"].length === 4) {
      setNumCards("repeat(4, minmax(0, 1fr))");
    } else if (user["listaRoles"].length === 5) {
      setNumCards("repeat(5, minmax(0, 1fr))");
    }
  }, []);

  if (user["listaRoles"].length === 0) {
    return <Navigate to="/sinrol" />;
  }

  if (user["listaRoles"].length === 1) {
    return (
      <Navigate to={`/${user["listaRoles"][0]["nombre"].toLowerCase()}`} />
    );
  }

  return (
    <div style={{marginTop: 40}} className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white">
      <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-center w-full h-fit">
        <div className="mt-20 pb-10 mb-4 grid grid-cols-1">
          <h1
            className="text-3x1 font-sans font-semibold text-blue-pucp flex-auto border-blue-pucp"
            align="center"
          >
            ¿Con qué rol desea ingresar?
          </h1>
        </div>
        <div className="container">
          <div className="col-lg-8 col-12">
            <div className="grid" style={{ gridTemplateColumns: numCards }}>
              <CardRol roles={user["listaRoles"]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeleccionRoles;
