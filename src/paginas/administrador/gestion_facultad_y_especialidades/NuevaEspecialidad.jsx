import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
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
  TextField, Checkbox,
} from "@mui/material";

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
import { facultadAgregarEspecialidad } from "../../../services/FacultadServices";
import {
  listarEspecialidadesPorIdFacultad,
  agregarEspecialidad,
  eliminarEspecialidad,
  actualizarEspecialidad,
} from "../../../services/EspecialidadServices";

import {listarCursosPorIdEspecialidad} from "../../../services/CursoServices";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

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
    id: "codigo", //para identificar la columna
    numeric: false,
    disablePadding: true,
    label: "Codigo", //esto se muestra como data
  },
  {
    id: "nombre",
    numeric: false,
    disablePadding: false,
    label: "Nombre",
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
          Nutrition
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

const NuevaEspecialidad = () => {
  const { state } = useLocation();
  /*ESTILOS */
  const [loading, setLoading] = useState(false);

  const { idFacultad, nombre, especialidades } = state;
  const [users, setUsers] = useState([]);
  /*Nos servirá para hacer los filtros por nombre*/
  const [search, setSearch] =
    useState(""); /*Default: muestra todo copia de users */
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  /* para manejo de la tabla*/

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("nombre");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  /*fin manejo tabla */
  /*ok*/
  /*para agregar la esp a la facultad */
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState({
    codigo: "",
    nombre: "",
    alumnosProponenTesis: false
  });

  //fin para agregar la esp a la facultad

  const [openActualizar, setOpenActualizar] = useState(false);
  const [inserto, setInserto] = useState(false);
  const [actualizo, setActualizo] = useState(false);
  const [dataActualizar, setDataActualizar] = useState({
    idEspecialidad: 0,
    codigo: "",
    nombre: "",
  });
  const [elimino, setElimino] = useState(false);

  /*para manejo de validacion de formulario */
  const [errorCodigoValue, setErrorCodigoValue] = useState(false);
  const [errorCodigoText, setErrorCodigoText] = useState("");

  const [errorNombreEspecialidadValue, setErrorNombreEspecialidadValue] =
    useState(false);
  const [errorNombreEspecialidadText, setErrorNombreEspecialidadText] =
    useState("");

  const [errorNombreCoordinadorValue, setErrorNombreCoordinadorValue] =
    useState(false);
  const [errorNombreCoordinadorText, setErrorNombreCoordinadorText] =
    useState(false);

  const [errorDescripcionValue, setErrorDescripcionValue] = useState(false);
  const [errorDescripcionText, setErrorDescripcionText] = useState("");
  /*fin manejo de formulario*/
  function limpiarData() {
    setNuevaEspecialidad({
      codigo: "",
      nombre: "",
      nombreCoordinador: "",
      descripcion: "",
      alumnosProponenTesis: false
    });
  }

  /*funciones de validacion de formulario*/
  function validarCodigo() {
    //linea que solo acepta strings que contiene caracteres ( mayusculas) y no es vacio
    let regex = new RegExp("^[A-Z ]+$");
    let cadena = nuevaEspecialidad.codigo.trim();

    if (cadena === "") {
      setErrorCodigoText("El codigo ingresado no debe ser vacío.");
      setErrorCodigoValue(true);
      return false;
    } else if (!regex.test(nuevaEspecialidad.codigo)) {
      setErrorCodigoText(
        "El nombre no puede contener números ni caracteres en minúscula."
      );
      setErrorCodigoValue(true);
      return false;
    } else if (nuevaEspecialidad.codigo.length > 6) {
      setErrorCodigoText("El código no puede contener más de 6 caracteres.");
      setErrorCodigoValue(true);
      return false;
    } else {
      setErrorCodigoText("");
      setErrorCodigoValue(false);
      return true;
    }
  }

  function validarNombreEspecialidad() {
    //se aceptan mayusculas, minisculas, tildes y maximo 60 caracteres
    let regex = new RegExp("^[a-zA-Z\u00E0-\u00FC ]+$");
    let cadena = nuevaEspecialidad.nombre.trim();

    if (cadena === "") {
      setErrorNombreEspecialidadText("El nombre ingresado no debe ser vacío.");
      setErrorNombreEspecialidadValue(true);
      return false;
    } else if (!regex.test(nuevaEspecialidad.nombre)) {
      setErrorNombreEspecialidadText(
        "El nombre de la especialidad no puede contener números ni caracteres especiales."
      );
      setErrorNombreEspecialidadValue(true);
      return false;
    } else if (nuevaEspecialidad.nombre.length > 60) {
      setErrorNombreEspecialidadText(
        "El nombre no puede contener más de 60 caracteres."
      );
      setErrorNombreEspecialidadValue(true);
      return false;
    } else {
      setErrorNombreEspecialidadText("");
      setErrorNombreEspecialidadValue(false);
      return true;
    }
  }

  /*fin de funciones de validacion de formulario*/
  /*data*/
  const showData = async () => {
    try {
      const usuarios = await listarEspecialidadesPorIdFacultad(idFacultad);
      const data = usuarios.data;
      setUsers(data);
      setFiltered(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showData();
    setInserto(false);
    setActualizo(false);
    setElimino(false);
  }, [inserto, actualizo, elimino]);

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

  useEffect(() => {
    const result = users.filter((user) => {
      return user.nombre.toLowerCase().match(search.toLowerCase());
    });
    setFiltered(result);
  }, [search]);
  const modalInsertar = () => {
    setOpen(!open);
    setErrorCodigoValue(false);
    setErrorCodigoText("");

    setErrorNombreEspecialidadText("");
    setErrorNombreEspecialidadValue(false);

    setErrorNombreCoordinadorText("");
    setErrorNombreCoordinadorValue(false);

    setErrorDescripcionText("");
    setErrorDescripcionValue(false);

    limpiarData();
  };

  const modalActualizar = (registro) => {
    setOpenActualizar(!openActualizar);
    setDataActualizar({
      idEspecialidad: registro.idEspecialidad,
      nombre: registro.nombre,
      codigo: registro.codigo,
      nombreCoordinador: registro.nombreCoordinador,
      descripcion: registro.descripcion,
      alumnosProponenTesis: registro.alumnosProponenTesis
    });
  };

  const handleInputChangeActualizar = (event) => {
    setDataActualizar({
      ...dataActualizar,
      [event.target.name]: event.target.value,
    });
  };

  const handleInputChange = (event) => {
    setNuevaEspecialidad({
      ...nuevaEspecialidad,
      [event.target.name]: event.target.value,
    });
  };

  const addEspecialidad = async () => {
    try {
      const flag_1 = validarCodigo();
      const flag_2 = validarNombreEspecialidad();

      const validacion = flag_1 && flag_2;
      if (validacion) {
        setLoading(true);
        const esp = await agregarEspecialidad(nuevaEspecialidad);
        const data = esp.data;

        const idEsp = data.idEspecialidad;

        const facEsp = await facultadAgregarEspecialidad({
          idFacultad: idFacultad,
          idEspecialidad: idEsp,
        });
        const segData = facEsp.data;
        setTimeout(() => { modalInsertar(); setLoading(false);}, 1000);
        setInserto(true);
        limpiarData();
      }
    } catch (error) {
      console.log(error);
    }

    showData();
  };

  const deleteEspecialidad = async (id) => {
    const probando = await listarCursosPorIdEspecialidad(id);
    const dataCursos = probando.data;
    if(dataCursos.length === 0){
      await eliminarEspecialidad({idEspecialidad:id});
      enqueueSnackbar("Se ha eliminado la especialidad ", {variant: "success"});  
    }else{
      enqueueSnackbar("La especialidad tiene cursos asociados", {variant: "error"}); 
    }
    showData();
    setElimino(true);
  };

  const updateEspecialidad = () => {
    setLoading(true);
    actualizarEspecialidad(dataActualizar);
    showData();
    setTimeout(() => { setOpenActualizar(false); setLoading(false);}, 1000);
    setActualizo(true);
  };

  return (
    <div
      name="gestiondeespecialidades"
      className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-hidden bg-white"
    >
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
        <div className="pb-10 mb-4 grid grid-cols-1">
          <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
            Gestion de Especialidades de {nombre}
          </p>
        </div>
        {/*filtrado*/}
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
              + Nueva Especialidad
            </Button>
          </Stack>
        </div>
        <div>
          <div></div>

          <div className="pb-6 w-full" style={{ height: 350, width: "100%" }}>
            {/*TABLAAAAAAAAAAAAAA*/}
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
                      {filtered.length > 0 ? (
                        stableSort(filtered, getComparator(order, orderBy))
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((filtered, index) => {
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
                                <TableCell align="left" padding="normal">
                                  {filtered.codigo}
                                </TableCell>

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
                                    color="error"
                                    onClick={() =>
                                      deleteEspecialidad(filtered.idEspecialidad)
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
                                    <EditIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })
                      ) : (
                        <Div alignItems="center">
                          {"Especialidades no encontradas"}
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
            <DialogTitle>Agregar Especialidad</DialogTitle>
            <Divider sx={{
                  marginBottom: 0,
                }}/>
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
                  className="form"
                  label="Codigo de Especialidad"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="codigo"
                  id="idcodigo"
                  error={errorCodigoValue}
                  helperText={errorCodigoText}
                  onChange={handleInputChange}
                />

                <TextField
                  required
                  defaultValue=""
                  margin="normal"
                  id="idnombre"
                  label="Nombre de Especialidad"
                  type="text"
                  fullWidth
                  variant="standard"
                  name="nombre"
                  error={errorNombreEspecialidadValue}
                  helperText={errorNombreEspecialidadText}
                  onChange={handleInputChange}
                />
                <FormGroup sx={{
                  marginTop: 1,
                }}>
                  <FormControlLabel control={
                    <Checkbox
                        checked={nuevaEspecialidad.alumnosProponenTesis}
                        onChange={event => {
                          setNuevaEspecialidad({...nuevaEspecialidad, alumnosProponenTesis: event.target.checked});
                        }}
                        inputProps={{ 'aria-label': 'controlled'}}/>
                  } label="Alumnos Proponen Tesis"/>
                </FormGroup>
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
                                onClick={() => addEspecialidad()}
                  >
                    Guardar
                </LoadingButton>
              </Stack>
            </DialogActions>
          </Dialog>

          <Dialog open={openActualizar}>
            <DialogTitle>Actualizar Especialidad</DialogTitle>
            <Divider sx={{
                  marginBottom: 0,
                }}/>
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
                  className="form"
                  label="Codigo de Especialidad"
                  fullWidth
                  variant="standard"
                  type="text"
                  name="codigo"
                  id="idcodigo"
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar.codigo}
                />
                <TextField
                  required
                  defaultValue=""
                  margin="normal"
                  id="idnombre"
                  label="Nombre de Especialidad"
                  type="text"
                  fullWidth
                  variant="standard"
                  name="nombre"
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar.nombre}
                />
                <FormGroup sx={{
                  marginTop: 1,
                }}>
                  <FormControlLabel control={
                    <Checkbox
                        checked={dataActualizar.alumnosProponenTesis}
                        onChange={event => {
                          setDataActualizar({...dataActualizar, alumnosProponenTesis: event.target.checked});
                        }}
                        inputProps={{ 'aria-label': 'controlled'}}/>
                  } label="Alumnos Proponen Tesis"/>
                </FormGroup>
              </Box>
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
                                onClick={() => updateEspecialidad()}
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

export default NuevaEspecialidad;
