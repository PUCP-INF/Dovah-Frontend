import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Select, Option, Textarea } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import { Modal } from "@mui/material";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


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
import { BiTask } from "react-icons/bi";
/*tabla components*/

import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { styled } from "@mui/material/styles";

import{
  listarUsuariosPorCurso, 
} from "../../../services/UsuarioServices";



/***** INICIO COMPONENTES Y FUNCIONES NUEVA TABLA ******/

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

/*COLUMNAS*/

const headCells = [
  {
    id: "codigo",
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
    id: "acciones",
    numeric: false,
    disablePadding: false,
    label: "Acciones",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{ fontWeight: "bold" }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Usuarios
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const Usuarios = () => {

  // Para utilizar la data redirigida
  const {state}=useLocation();
  const {idCurso, nombreCurso, semestre,especialidad} =state;
  //DATOS PARA INSERTAR UN CURSO:
  const idEspecialidad = 3;
  //const [prueba,setPrueba] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [sexo, setGenero] = useState("");
  const [codigoPUCP, setCodigoPUCP] = useState("");
  const [correo, setCorreo] = useState("");
  const [urldisponibilidad, setURL] = useState("");
  const [alumnos, setAlumnos]=useState([]);
  const [flag,setFlag] = useState(true);
  //Linea Data
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [openActualizar, setOpenActualizar] = useState(false);
  const [inserto, setInserto] = useState(false);
  const [actualizo, setActualizo] = useState(false);
  const [tipoModal, setTipoModal] = useState("");
  const [elimino, setElimino] = useState(false);
  /*Estados para implementar la eliminación de usuarios*/
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const [id, setId] = useState(0);

  /* para manejo de la tabla*/
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("nombre");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  /*fin manejo tabla */

  /*hooks para manejo tabla **/
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filtered.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filtered.length) : 0;
  /*fin hooks manejo tabla */

  let navigate = useNavigate();

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
    console.log(selectedRows);
    setSelectedRowId(state.selectedRowId);
  }, []);

  const setearId = (id) => {
    setId(id);
  };

  const eliminarOActualizar = () => {
    console.log(id);
  };
  const seleccionarUsuario = (usu) => {
    const usuario = {
      nombre: usu.nombre,
      apellido: usu.apellido,
      sexo: usu.sexo,
      codigoPUCP: usu.codigoPUCP,
      correo: usu.correo,
      password: usu.password,
    };
  };
  const showData = async () => {
    //alumnos=[];
    try {
      //alumnos=[];
      let idPrueba =state.idCurso;
      console.log("idprueba",idPrueba);
      console.log("ID CURSO",state.idCurso);
      console.log("STATE", state);
      let idEspecialidad= state.especialidad['idEspecialidad'];
      console.log("ID ESPECIALIDAD", idEspecialidad);
      const aux = await listarUsuariosPorCurso(idEspecialidad,idPrueba);
      const data = aux.data;
      console.log("tamanio",data.length);
      const aux2 = data[0];
      console.log("USUARIO",aux2);
      const rol = aux2["listaRoles"][0];
      const nombreRol = rol.nombre;
      
      console.log("ROL", rol);
      console.log("NOMBRE DEL ROL LA PTMR", nombreRol);

      for (let i = 0; i<data.length; i++){
        const aux2 = data[i];
        console.log("USUARIO LA PTMR",aux2);
        const rol = aux2["listaRoles"][0];
        const codleido = aux2["codigoPUCP"];
        console.log("MIS ROLES CTMR", rol);
        const nombreRol = rol.nombre;
        if(alumnos.length==0){
          if(nombreRol=== "ALUMNO"){
            alumnos.push(aux2);
          }
        }else{
          if(nombreRol === "ALUMNO"){
          let contador = 0;
          for(let j=0; j<alumnos.length;j++){
            console.log("ALUMNOS LA PTMR",alumnos);
            const aux3 = alumnos[j];
            const cod = aux3["codigoPUCP"];
            if(cod != codleido){
              contador = contador + 1;
            }
          }
          if(contador == alumnos.length){
            alumnos.push(aux2);
          }
        }
      }
      }
      if(flag == true) {
        setUsers(alumnos);
        setFiltered(alumnos);
        setFlag(false);
      } 

      //console.log(data);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    showData();
    const result = users.filter((user) => {
      return user.nombre.toLowerCase().match(search.toLowerCase()); 
    });
    setFiltered(result);
  }, [search]);

  return (
    <div name="usuarios" className="h-screen w-full bg-white">

      <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-fit">
    
      <div className="pb-6 mt-4 mb-4 flex flex-row w-full">          
          <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp w-4/5">
              {state.nombre} {">"} Alumnos
          </p>
          <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp w-4/5 text-right">
            {`${semestre["anhoAcademico"]}-${semestre["periodo"]}`}
          </p>
        </div>

        <div className="pb-8 flex flex-row">
          <div className="w-100">
            <Input
              label="Filtrar por nombre"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div>
          

          {/*Inicio de tabla*/}
          <div className="pb-6 w-full" style={{ height: 350, width: "100%" }}>
            <Box sx={{ width: "100%" }}>
              <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                  >
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={filtered.length}
                    />
                    <TableBody>
                      {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                      {filtered.length > 0 ? (
                        stableSort(filtered, getComparator(order, orderBy))
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((filtered, index) => {
                            console.log("ID USUARIO: ", filtered.idUsuario);

                            return (
                              <TableRow
                                hover
                                onClick={(event) =>
                                  handleClick(event, filtered.idUsuario)
                                }
                                role="checkbox"
                                tabIndex={-1}
                                key={filtered.idUsuario}
                              >
                                <TableCell
                                  component="th"
                                  id={filtered.idUsuario}
                                  scope="row"
                                  padding="normal"
                                  align="left"
                                >
                                  {filtered.codigoPUCP}
                                </TableCell>

                                <TableCell align="left" padding="normal">
                                  {filtered.nombre + " " + filtered.apellido}
                                </TableCell>

                                <TableCell align="left" padding="normal">
                                  {filtered.correo}
                                </TableCell>

                                <TableCell align="left" padding="normal">

                                <Link to="gestionusuariosdetalle" state={{idUsuario: filtered.idUsuario, idCurso: state["idCurso"],semestre: semestre, nombreCurso: state["nombre"]}}>
                                  <IconButton color="primary">
                                  <RemoveRedEyeIcon/>
                                  </IconButton>
                                </Link>
                                </TableCell>
                              </TableRow>
                            );
                          })
                      ) : (
                        <Div>{"No se encuentran datos"}</Div>
                      )}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: (dense ? 33 : 53) * emptyRows,
                          }}
                        >
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filtered.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Box>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;