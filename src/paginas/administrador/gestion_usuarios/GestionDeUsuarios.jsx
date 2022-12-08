import React, { useState, useEffect } from "react";
import { useAuth } from "../../../componentes/Context";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";


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
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { styled } from "@mui/material/styles";

import {
  insertarUsuario,
  listarUsuarios,
  eliminarUsuario,
  actualizarUsuario,
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

/***** FIN COMPONENTES Y FUNCIONES NUEVA TABLA ******/
const GestionDeUsuarios = () => {
  const { user, setUser } = useAuth();
  const [users, setUsers] = useState([]);
  /*Nos servirá para hacer los filtros por nombre*/
  const [search, setSearch] =
    useState(""); /*Default: muestra todo copia de users */
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [openActualizar, setOpenActualizar] = useState(false);
  const [inserto, setInserto] = useState(false);
  const [actualizo, setActualizo] = useState(false);
  const [dataActualizar, setDataActualizar] = useState({
    idUsuario: 0,
    nombre: "",
    apellido: "",
    sexo: "",
    codigoPUCP: "",
    correo: "",
    password: "",
  });
  const [tipoModal, setTipoModal] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    sexo: "",
    codigoPUCP: "",
    correo: "",
    password: "",
  });
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

  /*para manejo de validacion de formulario */
  const [errorNombreUsuarioValue, setErrorNombreUsuarioValue] =
    useState(false);
  const [errorNombreUsuarioText, setErrorNombreUsuarioText] = useState("");

  const [errorApellidoUsuarioValue, setErrorApellidoUsuarioValue] =
    useState(false);
  const [errorApellidoUsuarioText, setErrorApellidoUsuarioText] = useState("");

  const [errorCodigoPUCPUsuarioValue, setErrorCodigoPUCPUsuarioValue] =
    useState(false);
  const [errorCodigoPUCPUsuarioText, setErrorCodigoPUCPUsuarioText] = useState("");

  const [errorSexoUsuarioValue, setErrorSexoUsuarioValue] =
    useState(false);
  const [errorSexoUsuarioText, setErrorSexoUsuarioText] = useState("");

  const [errorCorreoValue, setErrorCorreoValue] = useState(false);
  const [errorCorreoText, setErrorCorreoText] = useState("");

  const [errorPasswordValue, setErrorPasswordValue] = useState(false);
  const [errorPasswordText, setErrorPasswordText] = useState("");

  /*fin manejo de formulario*/

  /*funciones de validacion de formulario*/
  function validarNombre() {
    //linea que solo acepta strings que contiene caracteres (incluido mayusculas) y no es vacio
    let regex = new RegExp("^[a-zA-Z\u00E0-\u00FC ]+$");
    let cadena = nuevoUsuario.nombre.trim();

    if (cadena === "") {
      setErrorNombreUsuarioText("El nombre ingresado no debe ser vacío.");
      setErrorNombreUsuarioValue(true);
      return false;
    } else if (!regex.test(nuevoUsuario.nombre)) {
      setErrorNombreUsuarioText(
        "El nombre no puede contener números ni caracteres especiales."
      );
      setErrorNombreUsuarioValue(true);
      return false;
    } else if (nuevoUsuario.nombre.length >= 40) {
      setErrorNombreUsuarioText(
        "El nombre no puede contener más de 40 caracteres."
      );
      setErrorNombreUsuarioValue(true);
      return false;
    } else {
      console.log("TODO OK NOMBRE");
      setErrorNombreUsuarioText("");
      setErrorNombreUsuarioValue(false);
      return true;
    }
  }

  function validarApellido() {
    //linea que solo acepta strings que contiene caracteres (incluido mayusculas) y no es vacio
    let regex = new RegExp("^[a-zA-Z\u00E0-\u00FC ]+$");
    let cadena = nuevoUsuario.apellido.trim();

    if (cadena === "") {
      setErrorApellidoUsuarioText("El apellido ingresado no debe ser vacío.");
      setErrorApellidoUsuarioValue(true);
      return false;
    } else if (!regex.test(nuevoUsuario.nombre)) {
      setErrorApellidoUsuarioText(
        "El apellido no puede contener números ni caracteres especiales."
      );
      setErrorApellidoUsuarioValue(true);
      return false;
    } else if (nuevoUsuario.nombre.length >= 40) {
      setErrorApellidoUsuarioText(
        "El apellido no puede contener más de 40 caracteres."
      );
      setErrorApellidoUsuarioValue(true);
      return false;
    } else {
      console.log("TODO OK APELLIDO");
      setErrorApellidoUsuarioText("");
      setErrorApellidoUsuarioValue(false);
      return true;
    }
  }

  function validarCodigoPUCP() {
    let regex = new RegExp("^[0-9]*$");
    let cadena = nuevoUsuario.codigoPUCP.trim();

    if (cadena === "") {
      setErrorCodigoPUCPUsuarioText("El código PUCP ingresado no debe ser vacío.");
      setErrorCodigoPUCPUsuarioValue(true);
      return false;
    } else if (!regex.test(nuevoUsuario.codigoPUCP)) {
      setErrorCodigoPUCPUsuarioText(
        "El código PUCP solo admite números del 1-9."
      );
      setErrorCodigoPUCPUsuarioValue(true);
      return false;
    } else if (nuevoUsuario.codigoPUCP.length < 8 ||  nuevoUsuario.codigoPUCP.length > 8 ) {
      setErrorCodigoPUCPUsuarioText(
        "El código PUCP debe contener 8 números."
      );
      setErrorCodigoPUCPUsuarioValue(true);
      return false;
    } else {
      console.log("TODO OK codigo PUCP");
      setErrorCodigoPUCPUsuarioText("");
      setErrorCodigoPUCPUsuarioValue(false);
      return true;
    }
  }

  function validarSexo() {
    let regex = new RegExp("^[M,F]*$");
    let cadena = nuevoUsuario.sexo.trim();

    if (cadena === "") {
      setErrorSexoUsuarioText("El sexo no debe ser vacío.");
      setErrorSexoUsuarioValue(true);
      return false;
    } else if (!regex.test(nuevoUsuario.sexo)) {
      setErrorSexoUsuarioText(
        "El sexo solo admite F: Femenino y M: Masculino."
      );
      setErrorSexoUsuarioValue(true);
      return false;
    } else if (nuevoUsuario.sexo.length == 2) {
      setErrorSexoUsuarioText(
        "El sexo solo debe ser de un caracter."
      );
      setErrorSexoUsuarioValue(true);
      return false;
    } else {
      console.log("TODO OK sexo");
      setErrorSexoUsuarioText("");
      setErrorSexoUsuarioValue(false);
      return true;
    }
  }
  function validarCorreo() {
    let regex = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
    let cadena = nuevoUsuario.correo.trim();

    if (cadena === "") {
      setErrorCorreoText("Correo no puede ser vacío.");
      setErrorCorreoValue(true);
      return false;
    } else if (!regex.test(nuevoUsuario.correo)) {
      setErrorCorreoText(
        "Ingrese un correo válido"
      );
      setErrorCorreoValue(true);
      return false;
    }  else {
      console.log("TODO OK Correo");
      setErrorCorreoText("");
      setErrorCorreoValue(false);
      return true;
    }
  }
    function validarPassword() {
      //de 6 a 16 caracteres - al menos: un dígito & una minúscula & una mayúscula - no símbolos
      let regularExp =  /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/;
      let cadena = nuevoUsuario.password.trim();
      

      
      if (cadena === "") {
        setErrorPasswordText("Debe ingresar una contraseña.");
        setErrorPasswordValue(true);
        return false;
      } else if (!regularExp.test(nuevoUsuario.password)) {
        setErrorPasswordText(
          "Ingrese una contraseña válida"
        )
        setErrorPasswordValue(true);
        return false;
      }  else {
        console.log("TODO OK password");
        setErrorPasswordText("");
        setErrorPasswordValue(false);
        return true;
      }
  }
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

  /*data*/
  const showData = async () => {
    try {
      const usuarios = await listarUsuarios();
      const data = usuarios.data;
      setUsers(data);
      setFiltered(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  /*ayuda a que la tabla se actualice automáticamente*/
  useEffect(() => {
    showData();
    setInserto(false);
    setActualizo(false);
    setElimino(false);
  }, [inserto, actualizo, elimino]);
  /*fin ayuda para actualizar la tabla

  /*sirve para filtrar la data */
  
  function limpiarData() {
    setNuevoUsuario({
      nombre: "",
      apellido: "",
      sexo: "",
      codigoPUCP: "",
      correo: "",
      password: "",
    });
  }
  
  useEffect(() => {
    const result = users.filter((user) => {
      return user.nombre.toLowerCase().match(search.toLowerCase());
    });
    setFiltered(result);
  }, [search]);
  /*fin filtro de data*/

  /*Insertar Usuario*/
  const modalInsertar = () => {
    setOpen(!open);
    /*limpiamos el form, vamos a ver si funciona*/
    setErrorNombreUsuarioValue(false);
    setErrorNombreUsuarioValue("");
    setErrorApellidoUsuarioValue(false);
    setErrorApellidoUsuarioText("");
    setErrorSexoUsuarioText("");
    setErrorSexoUsuarioValue(false);
    setErrorCodigoPUCPUsuarioValue(false);
    setErrorCodigoPUCPUsuarioText("");
    setErrorCorreoText("");
    setErrorCorreoValue(false);
    setErrorPasswordText("");
    setErrorPasswordValue(false);
    /*fin limpiamos el form*/
    limpiarData();
  };

  const modalActualizar = (registro) => {
    setOpenActualizar(!openActualizar);
    setDataActualizar({
      idUsuario: registro.idUsuario,
      nombre: registro.nombre,
      apellido: registro.apellido,
      sexo: registro.sexo,
      codigoPUCP: registro.codigoPUCP,
      correo: registro.correo,
      password: registro.password,
    });
  };

  const handleInputChange = (event) => {
    console.log();
    event.persist();
    setNuevoUsuario({
      ...nuevoUsuario,
      [event.target.name]: event.target.value,
    });
    console.log(nuevoUsuario);
  };

  const handleInputChangeActualizar = (event) => {
    console.log();
    event.persist();
    setDataActualizar({
      ...dataActualizar,
      [event.target.name]: event.target.value,
    });
  };

  const addUsuario = () => {
    let flag1 = validarNombre();
    let flag2 = validarApellido(); 
    let flag3 = validarSexo() ;
    let flag4 =  validarCodigoPUCP();
    let flag5 = validarCorreo();
    let flag6 = validarPassword();

    console.log("flag 6: ", flag6);
    const val = flag1 && flag2 && flag3 && flag4 && flag5;
    const validacion = val && flag6 ;
    if( validacion){
      insertarUsuario(nuevoUsuario);
      modalInsertar();
      setInserto(true);
      limpiarData();
      showData();
    }
    showData();
  };

  const deleteUsuario = (id) => {
    eliminarUsuario(id);
    showData();
    setElimino(true); 
  };

  const updateUsuario = () => {
    actualizarUsuario(dataActualizar);
    showData();
    setOpenActualizar(false);
    setActualizo(true);
  };
  return (
    <div
      name="gestiondeusuarios"
      className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white"
    >
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
        <div className="pb-10 mb-4 grid grid-cols-1">
          <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
            Usuarios
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
          <Stack direction="row" spacing={1} className="ml-auto flex">
            <Button
              aria-label="add"
              variant="contained"
              onClick={() => {
                setTipoModal("insertar");
                modalInsertar();
              }}
            >
              + Nuevo Usuario
            </Button>
          </Stack>
        </div>
        <div>
          <div></div>

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
                                key={filtered.nombre} //anteriormente idUsuario
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
                                  <IconButton
                                    aria-label="ver"
                                    onClick={() =>
                                      deleteUsuario({
                                        idUsuario: filtered.idUsuario,
                                      })
                                    }
                                  >
                                    <DeleteIcon style={{ color: "#abdbe3" }} />
                                  </IconButton>

                                  <IconButton
                                    aria-label="ver"
                                    onClick={() => {
                                      modalActualizar(filtered);
                                    }}
                                  >
                                    <EditIcon style={{ color: "#abdbe3" }} />
                                  </IconButton>
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
          {/**aca empieza el formulario */}
          <Dialog open={open}>
            <DialogTitle>Nuevo Usuario</DialogTitle>
            <Divider />
            <DialogContent>
              <Box
                sx={{
                  marginY: 0,
                  marginX: 3, 
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Nombre"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="nombre"
                  id="idNombre"
                  error={errorNombreUsuarioValue}
                  helperText={errorNombreUsuarioText}
                  onChange={handleInputChange}
                />

                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Apellido"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="apellido"
                  id="idApellido"
                  error={errorApellidoUsuarioValue}
                  helperText={errorApellidoUsuarioText}
                  onChange={handleInputChange}
                />

                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Ingrese F o M para el sexo"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="sexo"
                  id="idSexo"
                  error={errorSexoUsuarioValue}
                  helperText={errorSexoUsuarioText}
                  onChange={handleInputChange}
                />

                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Codigo PUCP"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="codigoPUCP"
                  id="idCodigoPUCP"
                  error={errorCodigoPUCPUsuarioValue}
                  helperText={errorCodigoPUCPUsuarioText}
                  onChange={handleInputChange}
                />

                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Correo"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="correo"
                  id="idCorreo"
                  error = {errorCorreoValue}
                  helperText={errorCorreoText}
                  onChange={handleInputChange}
                />

                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Contraseña"
                  fullWidth
                  variant="standard"
                  type="password"
                  name="password"
                  id="idPassword"
                  error= {errorPasswordValue}
                  helperText= {errorPasswordText}
                  onChange={handleInputChange}
                />
              </Box>

              <div >
                  <li>De 8 a 16 caracteres</li>
                  <li>Al menos una mayúscula</li>
                  <li>Al menos una minúscula</li>
                  <li>Al menos 1 símbolo</li>
                </div>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => modalInsertar()}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={() => addUsuario()}>
                Guardar
              </Button>
            </DialogActions>
                

          </Dialog>

          <Dialog open={openActualizar}>
            <DialogTitle>Actualización de un Usuario</DialogTitle>
            <Divider />
            <DialogContent>
              <Box
                sx={{
                  marginTop: 2,
                  marginBottom: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Nombre"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="nombre"
                  id="idNombre"
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar.nombre}
                />

                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Apellido"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="apellido"
                  id="idApellido"
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar.apellido}
                />

                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Sexo"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="sexo"
                  id="idSexo"
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar.sexo}
                />

                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Codigo PUCP"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="codigoPUCP"
                  id="idCodigoPUCP"
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar.codigoPUCP}
                />

                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Correo"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="correo"
                  id="idCorreo"
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar.correo}
                />

                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Password"
                  fullWidth
                  variant="standard"
                  name="password"
                  id="idPassword"
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar.password}
                />  
              </Box>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => modalActualizar()}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={() => updateUsuario()}>
                Actualizar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default GestionDeUsuarios;
