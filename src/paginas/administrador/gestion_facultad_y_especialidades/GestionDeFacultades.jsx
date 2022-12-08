import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "../../../componentes/Context";

import { Link, useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import { useSnackbar } from 'notistack'
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from '@mui/icons-material/Check';

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
  agregarFacultad,
  eliminarFacultad,
  actualizarFacultad,
} from "../../../services/FacultadServices";

import {
  listarEspecialidadesPorIdFacultad
} from "../../../services/EspecialidadServices";

//import FormEliminar from "../../../components/FormCRUD/FormEliminar";

/***** INICIO COMPONENTES Y FUNCIONES NUEVA TABLA ******/
/*ok*/
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
    id: "nombre", //para identificar la columna
    numeric: false,
    disablePadding: true,
    label: "Nombre", //esto se muestra como data
  },
  {
    id: "detalles",
    numeric: false,
    disablePadding: false,
    label: "Especialidades",
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
          Facultades PUCP
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

const GestionDeFacultades = () => {
  /*ESTILOS */
  const [loading, setLoading] = useState(false);
  /*LINEA DATA*/

  const { user, setUser } = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [nombreFac, setNombreFac] = useState("");
  const [anho, setAnho] = useState("");
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
    idFacultad: 0,
    nombre: "",
  });
  const [tipoModal, setTipoModal] = useState("");
  const [nuevaFacultad, setNuevaFacultad] = useState({
    nombre: "",
  });

  const [elimino, setElimino] = useState(false);
  /*Estados para implementar la eliminación*/
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
  const [errorNombreFacultadValue, setErrorNombreFacultadValue] =
    useState(false);
  const [errorNombreFacultadText, setErrorNombreFacultadText] = useState("");
  /*fin manejo de formulario*/

  /*funciones de validacion de formulario*/
  function validarNombre() {
    //linea que solo acepta strings que contiene caracteres (incluido mayusculas) y no es vacio
    let regex = new RegExp("^[a-zA-Z\u00E0-\u00FC ]+$");
    let cadena = nuevaFacultad.nombre.trim();

    if (cadena === "") {
      setErrorNombreFacultadText("El nombre ingresado no debe ser vacío.");
      setErrorNombreFacultadValue(true);
      return false;
    } else if (!regex.test(nuevaFacultad.nombre)) {
      setErrorNombreFacultadText(
        "El nombre no puede contener números ni caracteres especiales."
      );
      setErrorNombreFacultadValue(true);
      return false;
    } else if (nuevaFacultad.nombre.length >= 40) {
      setErrorNombreFacultadText(
        "El nombre no puede contener más de 40 caracteres."
      );
      setErrorNombreFacultadValue(true);
      return false;
    } else {
      console.log("TODO OK NOMBRE");
      setErrorNombreFacultadText("");
      setErrorNombreFacultadValue(false);
      return true;
    }
  }

  /*fin de funciones de validacion de formulario*/

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
  const seleccionarFacultad = (fac) => {
    const facultad = {
      nombre: fac.nombre,
    };
  };
  /*data*/
  const showData = async () => {
    try {
      const usuarios = await listarFacultades();
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
    setNuevaFacultad({
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
  //AGREGAR FACULTAD
  const modalInsertar = () => {
    setOpen(!open);
    /*limpiamos el form esto sirve para 1 campo*/
    setErrorNombreFacultadValue(false);
    setErrorNombreFacultadText("");
    /*fin limpiamos el form para 1 campoaa*/
    limpiarData();
  };

  const modalActualizar = (registro) => {
    setOpenActualizar(!openActualizar);
    setDataActualizar({
      idFacultad: registro.idFacultad,
      nombre: registro.nombre,
    });
  };

  const handleInputChange = (event) => {
    console.log();
    event.persist();
    setNuevaFacultad({
      ...nuevaFacultad,
      [event.target.name]: event.target.value,
    });
  };
  const handleInputChangeActualizar = (event) => {
    console.log();
    event.persist();
    setDataActualizar({
      ...dataActualizar,
      [event.target.name]: event.target.value,
    });
  };

  const addFacultad = () => {
    const validacion = validarNombre();
    if (validacion) {
      setLoading(true);
      agregarFacultad(nuevaFacultad);
      setTimeout(() => { modalInsertar();; setLoading(false);}, 1000);
      setInserto(true);
      limpiarData();
    }

    showData();
  };

  const deleteFacultad = async (id) => {
    const probando = await listarEspecialidadesPorIdFacultad(id);
    const dataCursos = probando.data;
    console.log("Especialidades de la facultad", dataCursos);
    if(dataCursos.length === 0){
      await eliminarFacultad({idFacultad:id});
      enqueueSnackbar("Se ha eliminado la facultad", {variant: "success"});  
    }else{
      enqueueSnackbar("La facultad tiene especialidades asociadas", {variant: "error"}); 
    }
    //showData();
    setElimino(true);
  };

  const updateFacultad = () => {
    setLoading(true);
    actualizarFacultad(dataActualizar);
    showData();
    setTimeout(() => { setOpenActualizar(false); setLoading(false);}, 1000);
    setActualizo(true);
  };


  //{JSON.stringify(user.nombre)}
  return (
    <div
      name="gestiondefacultades"
      className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-hidden bg-white"
    >
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit ">
        <div className="pb-10 mb-4 grid grid-cols-1">
          <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
            Gestión de Facultades
          </p>
        </div>
        {/*filtrado*/}
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
              + Nueva Facultad
            </Button>
          </Stack>
        </div>
        <div>
          <div></div>

          <div className="pb-6 w-full" style={{ height: 350, width: "100%" }}>
            {/*TABLAAAAAAAAAAAAAA*/}
            <Box sx={{ width: "100%", height: 350  }}>
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
                            console.log("ID FACULTAD: ", filtered.idFacultad);

                            return (
                              <TableRow
                                hover
                                onClick={(event) =>
                                  handleClick(event, filtered.idFacultad)
                                }
                                role="checkbox"
                                tabIndex={-1}
                                key={filtered.nombre}
                              >
                                <TableCell
                                  component="th"
                                  id={filtered.idFacultad}
                                  scope="row"
                                  padding="normal"
                                  align="left"
                                >
                                  {filtered.nombre}
                                </TableCell>

                                <TableCell align="left" padding="normal">
                                  <IconButton
                                    aria-label="ver"
                                    color="primary"
                                    onClick={() => {
                                      navigate("nuevaespecialidad", {
                                        state: {
                                          idFacultad: filtered.idFacultad,
                                          nombre: filtered.nombre,
                                          especialidades:
                                            filtered.especialidades,
                                        },
                                      });
                                    }}
                                  >
                                    <DisplaySettingsIcon/>
                                  </IconButton>
                                </TableCell>
                                <TableCell align="left" padding="normal">
                                  <IconButton
                                    aria-label="ver"
                                    color="error"
                                    onClick={() =>
                                      deleteFacultad(filtered.idFacultad)
                                    }
                                  >
                                    <DeleteIcon/>
                                  </IconButton>

                                  <IconButton
                                    aria-label="ver"
                                    color="primary"
                                    onClick={() => {
                                      modalActualizar(filtered);
                                    }}
                                  >
                                    <EditIcon/>
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })
                      ) : (
                        <Div alignItems="center">
                          {"Facultades no encontradas"}
                        </Div>
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

            {/*FIN TABLAAAAAA*/}
          </div>

          {/*aca comienza el form*/}

          <Dialog open={open}>
            <DialogTitle>Agregar Facultad</DialogTitle>
            <Divider />
            <DialogContent sx={{
          p: 3,
          minWidth: 500,
        }}>
              <Box
                sx={{
                  marginTop: 0,
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
                  label="Nombre de Facultad"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="nombre"
                  id="idnombre"
                  error={errorNombreFacultadValue}
                  helperText={errorNombreFacultadText}
                  onChange={handleInputChange}
                />
              </Box>
            </DialogContent>
            <Divider/>
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
                                onClick={() => addFacultad()}
                  >
                    Guardar
                </LoadingButton>
              </Stack>
            </DialogActions>
          </Dialog>

          <Dialog open={openActualizar}>
            <DialogTitle>Actualizar Facultad</DialogTitle>
            <Divider />
            <DialogContent sx={{
          p: 3,
          minWidth: 500,
        }}>
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
                  label="Nombre de Facultad"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="nombre"
                  id="idnombre"
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar.nombre}
                />
              </Box>
            </DialogContent>
            <Divider/>
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
                                onClick={() => updateFacultad()}
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

export default GestionDeFacultades;
