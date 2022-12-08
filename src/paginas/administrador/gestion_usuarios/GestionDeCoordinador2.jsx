import React, { useState, useEffect } from "react";
import { useAuth } from "../../../componentes/Context";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from '@mui/icons-material/Check';
import { useSnackbar } from 'notistack';

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
    listarFacultades,
  } from "../../../services/FacultadServices";

import {
  insertarUsuario,
  listarUsuarios,
  eliminarUsuario,
  actualizarUsuario,
} from "../../../services/AdministradorServices";

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
          Asignar Coordinador
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
const GestionDeCoordinador2 = () => {

  /*ESTILOS */
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /*componentes para listar facultad*/
  const [facultad, setFacultad] = useState([]);
  const [facultadState, setfacultadState] = React.useState({
    idFacultad: "",
    nombre: "",
  });
  /*componentes para listar especialidad*/
  const [especialidad, setEspecialidad] = useState([]);
  const [especialidadState, setEspecialidadState] = React.useState({
    idEspecialidad: "",
    nombre: "",
  });
  //const {idFacultad,idEspecialidad} = state;
  // 
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
    codigoPUCP: "",
    correo: "",
    password: "",
    idFacultad: "",
    idEspecialidad: "",
  });
  const [tipoModal, setTipoModal] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    codigoPUCP: "",
    correo: "",
    password: "",
    idFacultad: "",
    idEspecialidad: "",
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
    } else if (!regex.test(nuevoUsuario.apellido)) {
      setErrorApellidoUsuarioText(
        "El apellido no puede contener números ni caracteres especiales."
      );
      setErrorApellidoUsuarioValue(true);
      return false;
    } else if (nuevoUsuario.apellido.length >= 40) {
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
  async function codigoUnico(codigo){
    const response = await listarUsuarios();
    const datos = response.data;
    
    console.log("Codigo unico: ", datos);
    let flag = true;
    datos.map( (d) => {
        console.log("codigo-",codigo);
        console.log("user",d.codigoPUCP);
        if (codigo === d.codigoPUCP && flag){
            console.log("IGUALITOOOOS CODIGOS XD")
            flag = false;
        
        }
    })

    return flag;
  }
  async function validarCodigoPUCP() {
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
      if (await codigoUnico(nuevoUsuario.codigoPUCP)){
        setErrorCodigoPUCPUsuarioText("");
        setErrorCodigoPUCPUsuarioValue(false);
        return true;
      }
      else{
        setErrorCodigoPUCPUsuarioText("Este código ya existe");
        setErrorCodigoPUCPUsuarioValue(true);
        return false;
      }
    }
  } 

  async function correoUnico(correo){
    const response = await listarUsuarios();
    const datos = response.data;
    
    console.log("Codigo unico: ", datos);
    let flag = true;
    datos.map( (d) => {
        console.log("codigo-",correo);
        console.log("user",d.correo);
        if (correo === d.correo && flag){
            console.log("IGUALITOOOOS CORREOS XD")
            flag = false;
        
        }
    })
    

    return flag;
  }
  async function validarCorreo() {
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
      if (await correoUnico(nuevoUsuario.correo)){
        setErrorCorreoText("");
        setErrorCorreoValue(false);
        return true;
      }
      else{
        setErrorCorreoText("Este correo ya existe");
        setErrorCorreoValue(true);
        return false;
      }
    }
  }
    function validarPassword() {
       //de 8 a 16 caracteres - al menos: un dígito & una minúscula & una mayúscula - no símbolos
       let regularExpAntigua =  /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/;
       let regularExp = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filtered.length) : 0;
  /*fin hooks manejo tabla */


  /*data*/
  const showData = async () => {
    try {
      const usuarios = await listarUsuarios();
      const facultades = await listarFacultades();

      const data = usuarios.data;
      const data2 = facultades.data;

      setUsers(data);
      setFacultad(data2);

      setFiltered(data);
      console.log("DATA EN SHOWDATA: ",data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(facultadState.id === undefined || facultadState.id ==""){ 
      console.log("ID FACULTAD VACIO"); 
      return;
    }
    else {
      axios.get(`/especialidadListar/${facultadState.id}`)  
          .then(response => {
            const data = response.data;
            setEspecialidad(data);
          })
          .catch((error) => console.log(error));
      }
  }, [facultadState.id, dataActualizar]);

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
      idFacultad: "",
      idEspecialidad: "",
    }); 

    setfacultadState({
      idFacultad: "",
      nombre: "",
    });

    
    setEspecialidadState({
      idEspecialidad: "",
      nombre: "",
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
    setfacultadState({...facultadState, id: registro.facultad.idFacultad});
    setEspecialidadState({...especialidadState, id: registro.especialidad.idEspecialidad});
    setDataActualizar({
      idUsuario: registro.idUsuario,
      nombre: registro.nombre,
      apellido: registro.apellido,
      codigoPUCP: registro.codigoPUCP,
      correo: registro.correo,
      password: "1234",
      idFacultad: registro.facultad.idFacultad,
      idEspecialidad: registro.especialidad.idEspecialidad,
    });
    console.log("DATA ACTUALIZAR:",dataActualizar);
    
    
  };

  const handleInputChange = (event) => {
    console.log();
    event.persist();
    setNuevoUsuario({
      ...nuevoUsuario,
      [event.target.name]: event.target.value,
    });
    console.log("Handle Input Change: ",nuevoUsuario);
  };

  const handleInputChangeActualizar = (event) => {
    console.log();
    event.persist();
    setDataActualizar({
      ...dataActualizar,
      [event.target.name]: event.target.value,
    });
  };

  const addUsuario = async () => {
  try{
    const flag1 = validarNombre();
    const flag2 = validarApellido(); 
    //const flag3 = validarSexo() ;
    const flag4 = await validarCodigoPUCP();
    const flag5 = await validarCorreo();
    const flag6 = validarPassword();
    const val = flag1 && flag2  && flag4 && flag5 && flag6;
    if( val){
      console.log("Usuario antes de Insertar: ", nuevoUsuario);
      setLoading(true);
      nuevoUsuario.idFacultad = facultadState.id;
      nuevoUsuario.idEspecialidad = especialidadState.id;
      console.log("Antes de agregar: ",nuevoUsuario);
      const usu = await insertarUsuario(nuevoUsuario);
      setTimeout(() => { modalInsertar(); setLoading(false);}, 1000);
      setInserto(true);
      limpiarData();
      console.log("INSERTO USUARIO OK")
    }
  }catch (error) {
    console.log(error);
  }
    showData();
  };

  const deleteUsuario = (id) => {
    eliminarUsuario(id);
    enqueueSnackbar("Se ha eliminado el coordinador", {variant: "success"});  
    showData();
    setElimino(true);
  };

  const updateUsuario = async() => {
    setLoading(true);
    console.log("VAMOS A ACTUALIZAR LO SIGUIENTE ", dataActualizar);
    const data = await actualizarUsuario(dataActualizar);
    showData();
    setTimeout(() => { setOpenActualizar(false); setLoading(false);}, 1000);
    setActualizo(true);
    console.log("GAAAA");
  };
  return (
    <div
      name="gestiondecoordinador2"
      className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white"
    >
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
        <div className="pb-10 mb-4 grid grid-cols-1">
          <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
            Coordinadores de Tesis
          </p>
        </div>

        <div className="pb-8 flex flex-row">
          <div className="w-100">
            <Input
              label="Buscar por nombre"
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
              + Nuevo Coordinador
            </Button>
          </Stack>
        </div>
        <div>
          <div></div>

          {/*Inicio de tabla*/}
          <div className="pb-6 w-full" style={{ height: 350, width: "100%" }}>
            <Box sx={{ height: 350, width: "100%" }}>
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
                            console.log("DATA FILTRADA: ", filtered);

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
                                  {filtered.nombre + " " + filtered.apellido+ " " + filtered.sexo}
                                </TableCell>

                                <TableCell align="left" padding="normal">
                                  {filtered.correo}
                                </TableCell>

                                <TableCell align="left" padding="normal">
                                  <IconButton
                                    aria-label="ver"
                                    color="error"
                                    onClick={() =>
                                      deleteUsuario(
                                        filtered.idUsuario,
                                    
                                      )
                                    }
                                  >
                                    <DeleteIcon/>
                                  </IconButton>

                                  <IconButton
                                    aria-label="ver"
                                    color="primary"
                                    onClick={() => {
                                      console.log("MODAL ACT",filtered);
                                      modalActualizar(filtered);
                                      console.log("DATA ACTUALIZAR DSPS DEL FORM: ",dataActualizar);
                                    }}
                                  >
                                    <EditIcon/>
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
            <DialogTitle>Nuevo Coordinador</DialogTitle>
            <Divider sx={{
                  marginBottom: 0,
                }}/>
            <DialogContent sx={{
                  p: 3,
                  minWidth: 500,
                }}>
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
                  type="text"
                  name="password"
                  id="idPassword"
                  error= {errorPasswordValue}
                  helperText= {errorPasswordText}
                  onChange={handleInputChange}
                />

                <TextField
                    select
                    defaultValue = ""
                    label="Facultad"
                    name="facultad"
                    margin="normal"
                    marginTop=""
                    variant="outlined"
                    fullWidth
                    onChange={event => {
                      setfacultadState({...facultadState, id: event.target.value});
                      console.log(facultadState.id);
                      nuevoUsuario.idFacultad= facultadState.id;

                      console.log("Nuevo usuario", nuevoUsuario);
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mt: 3}}
                >
                  {facultad.map((fac) => {
                      return (
                          <MenuItem
                              key={fac["idFacultad"]}
                              value={fac["idFacultad"]}
                          >
                              {`${fac["nombre"]}`}
                          </MenuItem>
                      );
                  })}
                </TextField>

                <TextField
                    select
                    defaultValue = ""
                    label="Especialidad"
                    name="especialidad"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={event => {
                      setEspecialidadState({...especialidadState, id: event.target.value});
                      console.log(especialidadState.id);
                      nuevoUsuario.idEspecialidad= especialidadState.id;

                      console.log("Nuevo usuario", nuevoUsuario);
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 3}}>
                    {
                        especialidad.map((esp) => {
                          console.log(esp);
                        return (
                            <MenuItem 
                                key={esp["idEspecialidad"]} 
                                value={esp["idEspecialidad"]}
                                >
                                {`${esp["nombre"]}`}
                            </MenuItem>
                        )
                        })
                    }
                </TextField>


              </Box>

              <div className="text-xm font-sans">
                <li>De 8 a 16 caracteres</li>
                <li>Al menos un número</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos una minúscula</li>
              </div>
            </DialogContent>
            <DialogActions>

              <Stack direction="row" spacing={2}>
                  <Button
                    startIcon={<CancelIcon/>}
                    color="error"
                    variant="contained"
                    onClick={() => modalInsertar()}>
                    Cancelar  
                  </Button>

                  <LoadingButton
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<CheckIcon/>}
                                component="label"
                                variant="contained"
                                onClick={() => addUsuario()}
                  >
                    Guardar
                </LoadingButton>
              </Stack>

            </DialogActions>
                

          </Dialog>

          <Dialog open={openActualizar}>
            <DialogTitle>Actualización de un Coordinador</DialogTitle>
            <Divider sx={{
                  marginBottom: 0,
                }}/>
            <DialogContent sx={{
                  p: 3,
                  minWidth: 500,
                }}>
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
                  defaultValue = ""
                  select
                  label="Facultad"
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  value={facultadState.id}
                  onChange={event => {
                    setfacultadState({...facultadState, id: event.target.value});
                    console.log(facultadState.id);
                    dataActualizar.idFacultad= facultadState.id;

                    console.log("Data act textfield", dataActualizar);
                  } 
                  
                  
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 3}}
                >
                  {facultad.map((fac) => {
                      return (
                          <MenuItem
                              key={fac["idFacultad"]}
                              value={fac["idFacultad"]}
                          >
                              {`${fac["nombre"]}`}
                          </MenuItem>
                      );
                  })}
                </TextField>

                <TextField
                  select
                  
                  defaultValue=""
                  label="Especialidad"
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  value = {especialidadState.id}
                  onChange={event => {
                    setEspecialidadState({...especialidadState, id: event.target.value});
                    console.log(especialidadState.id);
                    dataActualizar.idEspecialidad= especialidadState.id;

                    console.log("Data act textfield esp", dataActualizar);
                  }


                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 3, mb: 3}}
                >
                    {
                        especialidad.map((esp) => {
                          console.log(esp);
                        return (
                            <MenuItem 
                                key={esp["idEspecialidad"]} 
                                value={esp["idEspecialidad"]}
                                >
                                {`${esp["nombre"]}`}
                            </MenuItem>
                        )
                        })
                    }
                </TextField>
                
                {/*
                <TextField
                  required
                  margin="normal"
                  className="form"
                  label="Nueva contraseña"
                  fullWidth
                  variant="standard"
                  type="password"
                  name="password"
                  id="idPassword"
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar.password}
                /> 
                  */}
              </Box>
              {/*
              <div className="text-xm font-sans">
                <li>De 8 a 16 caracteres</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos una minúscula</li>
                <li>Al menos un símbolo</li>
              </div>
              */}
            </DialogContent>
            <DialogActions>

              <Stack direction="row" spacing={2}>
                  <Button
                    startIcon={<CancelIcon/>}
                    color="error"
                    variant="contained"
                    onClick={() => modalActualizar()}>
                    Cancelar  
                  </Button>

                  <LoadingButton
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<CheckIcon/>}
                                component="label"
                                variant="contained"
                                onClick={() => updateUsuario()}
                  >
                    Actualizar
                </LoadingButton>
              </Stack>

            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default GestionDeCoordinador2;
