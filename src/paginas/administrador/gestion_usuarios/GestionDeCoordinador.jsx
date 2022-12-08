// @flow
import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import CommentBox from "../../general/CommentBox";
import { useAuth } from "../../../componentes/Context";
import { userHasRoles } from "../../general/utils";
import {
  listarFacultades,
} from "../../../services/FacultadServices";
import {
  listarEspecialidadesPorIdFacultad,
} from "../../../services/EspecialidadServices";
import { element } from "prop-types";

/* Cabecera de las celdas para la tabla */
const headCells = [
  {
    id: "codigoPUCP",
    numeric: false,
    disablePadding: true,
    label: "Código",
  },
  {
    id: "nombre",
    numeric: false,
    disablePadding: true,
    label: "Nombre completo",
  },
  {
    id: "correo",
    numeric: false,
    disablePadding: true,
    label: "Correo Electrónico",
  },
  {
    id: "facultad",
    numeric: false,
    disablePadding: true,
    label: "Facultad",
  },
  {
    id: "especialidad",
    numeric: false,
    disablePadding: true,
    label: "Especialidad",
  },
  {
    id: "rol",
    numeric: false,
    disablePadding: false,
    label: "Rol",
  },
];


const GestionDeCoordinador = (): React.Node => {

  /*componentes para listar facultad*/
  const [facultad, setFacultad] = useState([]);
  const [filtered, setFiltered] = useState([]);

  
  /*componentes para listar especialidad*/
  const [especialidad, setEspecialidad] = useState([]);

  const showData = async () => {
    try {
      const facultades = await listarFacultades();
      const especialidades = await listarEspecialidadesPorIdFacultad();
      const data = facultades.data;
      const data2 = especialidad.data2;
      setFacultad(data);
      setEspecialidad(data2);   
      console.log(data);
      console.log(data2);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showData();
  },[]); 

  return (
    <Box
      sx={{
        display: "grid",
        gridAutoColumns: "1fr",
        gap: 1,
        gridAutoRows: "20px",
        marginTop: 1,
      }}
    >
      <Box
        sx={{
          gridRow: "1",
          gridColumn: "span 6",
          display: "grid",
          gridAutoColumns: "1fr",
          gap: 1,
          justifyContent: "center",
        }}
      >
        <Typography variant={"h5"} sx={{ gridRow: "1", gridColumn: "span 9" }}>
          Asignación de Coordinador
        </Typography>
        {(
          <Button
            variant="outlined"
            color="success"
            size={"small"}
            //onClick={handleGuardarTesis}
            sx={{ gridRow: "1", gridColumn: "span 3", justifySelf: "end" }}
          >
            {" "}
            Guardar Cambios
          </Button>
        )}
        <TextField
          label="Nombre"
          variant="outlined"
          name="nombre"
          size={"small"}
          //value={tesis.titulo}
          InputLabelProps={{ shrink: true }}
          //disabled={tesis.proponiente.idUsuario !== user["idUsuario"]}
          sx={{ gridRow: "2", gridColumn: "span 4" }}
        />
        <TextField
          label="Apellido"
          variant="outlined"
          name="apellido"
          size={"small"}
          //value={tesis.titulo}
          InputLabelProps={{ shrink: true }}
          //disabled={tesis.proponiente.idUsuario !== user["idUsuario"]}
          sx={{ gridRow: "2", gridColumn: "span 4" }}
        />
        <TextField
          label="Sexo"
          variant="outlined"
          name="sexo"
          size={"small"}
          //value={tesis.titulo}
          InputLabelProps={{ shrink: true }}
          //disabled={tesis.proponiente.idUsuario !== user["idUsuario"]}
          sx={{ gridRow: "3", gridColumn: "span 4" }}
        />
        <TextField
          label="Código PUCP"
          variant="outlined"
          name="codigopucp"
          size={"small"}
          //value={tesis.titulo}
          InputLabelProps={{ shrink: true }}
          //disabled={tesis.proponiente.idUsuario !== user["idUsuario"]}
          sx={{ gridRow: "3", gridColumn: "span 4" }}
        />
        <TextField
          label="Correo"
          variant="outlined"
          name="correo"
          size={"small"}
          //value={tesis.titulo}
          InputLabelProps={{ shrink: true }}
          //disabled={tesis.proponiente.idUsuario !== user["idUsuario"]}
          sx={{ gridRow: "4", gridColumn: "span 4" }}
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          name="contraseña"
          size={"small"}
          //value={tesis.titulo}
          InputLabelProps={{ shrink: true }}
          //disabled={tesis.proponiente.idUsuario !== user["idUsuario"]}
          sx={{ gridRow: "4", gridColumn: "span 4" }}
        />

        <TextField
          select
          label="Facultad"
          name="facultad"
          margin="dense"
          variant="outlined"
          fullWidth
          size={"small"}
          //value={tesis.areaEspecialidad["nombre"]}
          //disabled={tesis.proponiente.idUsuario !== user["idUsuario"]}
          InputLabelProps={{ shrink: true }}
          sx={{ gridRow: "5", gridColumn: "span 4" }} 
        >
          {
            facultad.map((fac) => {
              return (
                  <MenuItem 
                    key={fac["idFacultad"]} 
                    value={fac["idFacultad"]}
                    >
                      {`${fac["nombre"]}`}
                  </MenuItem>
              )
            })
          }
        </TextField>

        <TextField
          label="Especialidad"
          name="especialidad"
          margin="dense"
          variant="outlined"
          fullWidth
          size={"small"}
          //value={tesis.areaEspecialidad["nombre"]}
          //disabled={tesis.proponiente.idUsuario !== user["idUsuario"]}
          InputLabelProps={{ shrink: true }}
          sx={{ gridRow: "5", gridColumn: "span 4" }}
        />

      </Box>
    </Box>
  );
};

export default GestionDeCoordinador;
