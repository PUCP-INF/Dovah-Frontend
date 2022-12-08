import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Select, Option, Textarea } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import CardEntregable from "./CardEntregable";
import Collapsible from "react-collapsible";
import CardTareaPendiente from "./CardTareaPendiente";



const avances = [];

const parciales = [];

const PortafolioEntregable = (): React.Node => {
  // Para utilizar la data redirigida
    const location = useLocation();
    const [objeto, setObjeto] = React.useState(location.state);
    let tarea = objeto.filtered;
    let idCurso = objeto.idCurso;
    let clave = objeto.clave;
    let nombreCurso = objeto.nombreCurso;
    let semestre = objeto.semestre;

    const [principal, setPrincipal] = useState({
      id: idCurso,
      nombre: tarea.nombre,
      estado: "Pendiente",
      ultimaModificacion: tarea.fechaLimite,
    });

    useEffect(() => {
      console.log("TAREA PRINCIPAL---", principal);
    }, []);
  
  return (
    <div
      name="carpeta"
      className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white"
    >
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
        <div className="pb-10 mb-4 flex flex-row w-full">
          <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp w-5/6">
              {clave} {"-"} {nombreCurso} {">"} Portafolio del {tarea.nombre}
          </p>
          <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp w-1/6 text-right">
            {`${semestre["anhoAcademico"]}-${semestre["periodo"]}`}
          </p>
        </div>
        <div className="pb-4 grid grid-cols-1">
          <p className="text-2xl font-sans inline border-b-2 text-orange-800 flex-auto border-orange-800">
            Entregable Principal
          </p>                                    
          <Link to="detalleentregable" state={{tarea:tarea,idCurso:idCurso, clave:clave, nombreCurso:nombreCurso, semestre: semestre}}>
            <CardEntregable info={{
              id:tarea.id,
              nombre:tarea.nombre,
              ultimaModificacion:tarea.fechaLimite,
              descripcion: tarea.descripcion,
            }}/>
          </Link>
        </div>
        <div>
          <div className="pb-8 grid grid-cols-1">
            <p className="text-2xl font-sans inline border-b-2 text-orange-800 flex-auto border-orange-800">
              Avances
            </p>
            {avances.map((avance) => {
              return <CardEntregable key={avance.id} props={avance} />;
            })}

            <p className="pt-8 text-1xl font-sans flex-auto">
              Aún no se han asignado avances
            </p>

          </div>
        </div>

        <div>
          <div className="grid grid-cols-1">
            <p className="text-2xl font-sans inline border-b-2 text-orange-800 flex-auto border-orange-800">
              Entregables Parciales
            </p>
            {parciales.map((parcial) => {
              return <CardEntregable key={parcial.id} props={parcial} />;
            })}

            <p className="pt-8 text-1xl font-sans flex-auto">
              Aún no se han asignado entregables parciales
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PortafolioEntregable;
