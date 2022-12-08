import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import * as uuid from "uuid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const DetalleCurso = () => {
  //Para utilizar la data redirigida
  const { state } = useLocation();
  const {nombre, semestre} = state;

  const [usersState, setUsersState] = useState({
    libres: [],
    libreId: "",
    asignados: [],
    asignadoId: ""
  });
  const [roles, setRoles] = useState([]);

  const handleSelectChange = (event) => {
    setUsersState({...usersState, [event.target.name]: event.target.value})
  }

  const handleRolesChange = (event) => {
    setRoles(event.target.value);
  }

  const handleGuardarUsuarios = async () => {
    const json = {
      idCurso: state["idCurso"],
      usuarios: []
    };
    usersState.asignados.forEach(value => {
      const curso = value["cursos"].find(e => e["curso"]["idCurso"] === state["idCurso"]);
      json.usuarios.push({
        idUsuario: value["idUsuario"],
        roles: curso["roles"].map(value => value["nombre"])
      })
    });
    await axios.post("/curso/modificarUsuarios", json);
    await queryUsers();
  }

  const handleAgregarUsuarios = () => {
    const usr = usersState.libres.find(e => e["idUsuario"] === usersState.libreId);
    usr["cursos"].push({
      id: 0,
      curso: {idCurso: state["idCurso"]},
      roles: roles.map(value => {return {idRol:0, nombre: value}})
    })
    const newLibres = usersState.libres.filter((v) => v["idUsuario"] !== usr["idUsuario"]);
    const newAsignados = [...usersState.asignados, usr];
    setUsersState({...usersState, asignados: newAsignados, libres: newLibres, libreId: ""});
    setRoles([]);
  }

  const handleEliminarUsuarios = (event, index) => {
    const newAsignados = usersState.asignados.filter((v, i) => i !== index);
    const newLibres = [...usersState.libres, usersState.asignados[index]];
    setUsersState({...usersState, libres: newLibres, asignados: newAsignados});
  }


  const queryUsers = async () => {
    const esp = state["especialidad"]["idEspecialidad"];
    const cur = state["idCurso"];
    const res1 = await axios.get(`/usuario/especialidad/${esp}/in/curso/${cur}`);
    const res2 = await axios.get(`/usuario/especialidad/${esp}/not_in/curso/${cur}`);
    setUsersState({...usersState, libres: res2.data, asignados: res1.data});
  }

  useEffect(() => {
    queryUsers()
        .catch(() => {})
  }, []);

  return (
    <div className="detallecurso h-fit w-full bg-white">
      <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-fit">
      <div className="pb-5 mb-4 flex flex-row w-full">     
            <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp w-4/5">
            {nombre} {">"} Usuarios
            </p>     
            <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp w-1/5 text-right">
            {semestre["anhoAcademico"]}-{semestre["periodo"]}
            </p>
      </div>
        <Box className="flex w-full divide-x space-x-4 place-items-center">
          <TextField
              className="w-8/12 h-full"
              value={usersState.libreId}
              select
              label="Usuarios"
              name="libreId"
              margin="dense"
              onChange={handleSelectChange}>
            {
              usersState.libres.map((usr) => {
                return (
                    <MenuItem key={usr["idUsuario"]} value={usr["idUsuario"]}>
                      {`${usr["nombre"]} ${usr["apellido"]}`}
                    </MenuItem>
                )
              })
            }
          </TextField>
          <TextField
              className="w-4/12 h-full"
              select
              value={roles}
              name="roles"
              margin="dense"
              onChange={handleRolesChange}
              SelectProps={{
                multiple: true
              }}
              label="Roles">
            {
              ["ALUMNO", "PROFESOR", "ASESOR", "JURADO"].map((ele) => {
                return (
                    <MenuItem key={uuid.v4()} value={ele}>
                      {ele}
                    </MenuItem>
                )
              })              
            }
          </TextField>
          <IconButton color="primary" className="w0 h-full" onClick={handleAgregarUsuarios}>
            <AddCircleRoundedIcon fontSize="large"/>
          </IconButton>
        </Box>
        <div className="flex w-full h-2"></div>
        <div className="flex w-full divide-x space-x-4 place-items-center">
          <div className="w-11/12"></div>
          <Button variant="contained"
                  className="w-2/12 h-full"
                  size="medium" onClick={handleGuardarUsuarios}>Guardar</Button>
        </div>
        <div className="flex w-full h-2"></div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Codigo</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                usersState.asignados.map((value, index) => {
                  const user = value;
                  let rolStr = "";
                  if (value["cursos"].length !== 0) {
                    const curso = value["cursos"].find(e => e["curso"]["idCurso"] === state["idCurso"]);
                    curso["roles"].forEach(value => {
                      rolStr += value["nombre"] + " ";
                    });
                  }
                  return (
                      <TableRow
                          key={uuid.v4()}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {`${user["nombre"]} ${user["apellido"]}`}
                        </TableCell>
                        <TableCell>{user["codigoPUCP"]}</TableCell>
                        <TableCell>{rolStr}</TableCell>
                        <TableCell align="right">
                          <Link to="gestionusuariosdetalle" state={{usuario: value, idCurso: state["idCurso"],semestre: semestre, nombreCurso: state["nombre"]}}>
                            <IconButton color="primary">
                              <RemoveRedEyeIcon/>
                            </IconButton>
                          </Link>
                          <IconButton color="error" onClick={e => handleEliminarUsuarios(e, index)}>
                            <DeleteIcon/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default DetalleCurso;