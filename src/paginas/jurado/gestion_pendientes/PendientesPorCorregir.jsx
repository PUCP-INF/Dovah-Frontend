import React,{useEffect, useState} from "react"; 
import { Link , useLocation} from "react-router-dom";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

import { BiTask } from "react-icons/bi";


const PendientesPorCorregir = () => {
  const {state} =useLocation();
  const {nombre,semestre}=state;
  return (

    <div className="pendientesporcorregir h-fit w-full bg-white">
    <div className="flex w-full h-5"></div>
    <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-fit">
      <div className="pb-6 flex flex-row w-full">          
        <p className="text-3xl font-semibold inline border-b-4 text-blue-pucp flex-auto border-blue-pucp w-5/6">
            {state.nombre} > Pendientes por corregir
        </p>
        <p className="text-3xl font-semibold inline border-b-4 text-blue-pucp flex-auto border-blue-pucp w-1/6 text-right">
          {`${semestre["anhoAcademico"]}-${semestre["periodo"]}`}
        </p>
      </div>
        <div className="max-w-screen-lg mx-auto flex flex-col justify-start w-full text-right">
          <p className="text-1xl font-normal inline pr-6 pb-4 text-blue-gray-700">
            Fecha de entrega
          </p>
        </div>

        <div className="pb-2">
        <Link to="listaentregablespendientes">
          <Card className="h-20">
            <CardBody>
              <div className="grid grid-cols-3 gap-4" > 
                <div classname="md:flex-row inline-block">  
                  <BiTask size={30} />           
                </div>
                <div classname="md:flex-row inline-block text-left">  
                  <p className="text-2xl font-semibold inline">
                    Entregable 1
                  </p>              
                </div>
                <div className ="text-right">
                  <p className="text-1xl font-normal inline">
                    15 de agosto, 23:57
                  </p>
                </div>
              </div>           
            </CardBody>                       
          </Card>
          </Link>
        </div>

        <div className="pb-2">
          <Card className="h-20">
            <CardBody>
              <div className="grid grid-cols-3 gap-4" > 
                <div classname="md:flex-row inline-block">  
                  <BiTask size={30} />           
                </div>
                <div classname="md:flex-row inline-block text-left">  
                  <p className="text-2xl font-semibold inline">
                    Entregable 2
                  </p>              
                </div>
                <div className ="text-right">
                  <p className="text-1xl font-normal inline">
                    15 de agosto, 23:57
                  </p>
                </div>
              </div>           
            </CardBody>                       
          </Card>
        </div>

        <div className="pb-2">
          <Card className="h-20">
            <CardBody>
              <div className="grid grid-cols-3 gap-4" > 
                <div classname="md:flex-row inline-block">  
                  <BiTask size={30} />           
                </div>
                <div classname="md:flex-row inline-block text-left">  
                  <p className="text-2xl font-semibold inline">
                    Entregable 3
                  </p>              
                </div>
                <div className ="text-right">
                  <p className="text-1xl font-normal inline">
                    15 de agosto, 23:57
                  </p>
                </div>
              </div>           
            </CardBody>                       
          </Card>
        </div>

      </div>
    </div>
  );
};

export default PendientesPorCorregir;