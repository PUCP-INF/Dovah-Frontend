import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import { useSnackbar } from 'notistack';
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
  listarSemestres,
  agregarSemestre,
  eliminarSemestre,
  actualizarSemestre,
} from "../../../services/SemestreServices";

import {
  listarCursosPorIdSemestre
} from "../../../services/CursoServices";

//import FormEliminar from "../../../components/FormCRUD/FormEliminar";

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
    id: "semestre",
    numeric: false,
    disablePadding: true,
    label: "Semestre",
  },
  {
    id: "inicio",
    numeric: false,
    disablePadding: true,
    label: "Inicio de Ciclo",
  },
  {
    id: "fin",
    numeric: false,
    disablePadding: true,
    label: "Fin de Ciclo",
  },
  {
    id: "acciones",
    numeric: false,
    disablePadding: true,
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

const GestionDeSemestres = () => {

  
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /*ESTILOS */
  const [loading, setLoading] = useState(false);

  const [anio, setAnioAcademico] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [iniPeriodo, setIniPeriodo] = useState("");
  const [finPeriodo, setFinPeriodo] = useState("");
  const [iniNotas, setIniNotas] = useState("");
  const [finNotas, setFinNotas] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [openActualizar, setOpenActualizar] = useState(false);
  const [inserto, setInserto] = useState(false);
  const [actualizo, setActualizo] = useState(false);
  const [dataActualizar, setDataActualizar] = useState({
    idSemestre: 0,
    anhoAcademico: "",
    periodo: "",
    fechaInicio: "",
    fechaFin: "",
    fechaCierreNotasParcial: "",
    fechaCierreNotasFinal: "",
  });
  const [tipoModal, setTipoModal] = useState("");
  const [nuevoSemestre, setNuevoSemestre] = useState({
    anhoAcademico: "",
    periodo: "",
    fechaInicio: "",
    fechaFin: "",
    fechaCierreNotasParcial: "",
    fechaCierreNotasFinal: "",
  });
  const [elimino, setElimino] = useState(false);
  /*Estados para implementar la eliminación de semestres*/
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

  /*validaciones */
  const [errorAnhoValue, setErrorAnhoValue] = useState(false);
  const [errorAnhoText, setErrorAnhoText] = useState("");
  const [errorPeriodoValue, setErrorPeriodoValue] = useState(false);
  const [errorPeriodoText, setErrorPeriodoText] = useState("");
  const [errorIniValue, setErrorIniValue] = useState(false);
  const [errorIniText, setErrorIniText] = useState("");
  const [errorFinValue, setErrorFinValue] = useState(false);
  const [errorFinText, setErrorFinText] = useState("");

  function limpiarData(){
    setNuevoSemestre({
      anhoAcademico:"",
      periodo:"",
      fechaInicio:"",
      fechaFin:"",

    })
  }
  function validarForm() {
    let regexAnho = new RegExp("^[0-9]+$");
    let regexPeriodo = new RegExp("^[0-9]+$");
    let regexIni = new RegExp("^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$"
    );
    let regexFin = new RegExp("^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$"
    );
    let flagAnho = true;
    let flagPeriodo = true;
    let flagIni = true;
    let flagFin = true;

    let flagFechas = false;
    if (nuevoSemestre.anhoAcademico.trim() === "") {
      setErrorAnhoText("Campo no puede estar vacio");
      setErrorAnhoValue(true);
      flagAnho = false;
    } else if (!regexAnho.test(nuevoSemestre.anhoAcademico)) {
      setErrorAnhoText("Ingrese un año");
      setErrorAnhoValue(true);
      flagAnho = false;
    } else if (nuevoSemestre.anhoAcademico.length != 4) {
      setErrorAnhoText("Campo debe contener 4 caracteres");
      setErrorAnhoValue(true);
      flagAnho = false;
    } else {
      console.log("Paso prueba Año Academico");
      setErrorAnhoValue(false);
      setErrorAnhoText("");
    }

    if (nuevoSemestre.periodo.trim() === "") {
      setErrorPeriodoText("Campo no puede estar vacio");
      setErrorPeriodoValue(true);
      flagPeriodo = false;
    } else if (!regexPeriodo.test(nuevoSemestre.periodo)) {
      setErrorPeriodoText("Ingrese un valor numérico");
      setErrorPeriodoValue(true);
      flagPeriodo = false;
    } else if (nuevoSemestre.periodo.length != 1) {
      setErrorPeriodoText("Campo debe contener 1 caracter numérico");
      setErrorPeriodoValue(true);
      flagPeriodo = false;
    } else {
      console.log("Paso prueba Periodo");
      setErrorPeriodoValue(false);
      setErrorPeriodoText("");
    }

    if (nuevoSemestre.fechaInicio.trim() === "") {
      setErrorIniText("Campo no puede estar vacio");
      setErrorIniValue(true);
      flagIni = false;
    } else if (!regexIni.test(nuevoSemestre.fechaInicio || nuevoSemestre.fechaInicio.length != 10 )) {
      setErrorIniText("Ingrese un formato de fecha valido dd/mm/aaaa");
      setErrorIniValue(true);
      flagIni = false;
    } else {
      console.log("Paso prueba Inicio Periodo");
      setErrorIniValue(false);
      setErrorIniText("");
    }

    if (nuevoSemestre.fechaFin.trim() === "") {
      setErrorFinText("Campo no puede estar vacio");
      setErrorFinValue(true);
      flagFin = false;
    } else if (!regexFin.test(nuevoSemestre.fechaFin || nuevoSemestre.fechaFin.length != 10)) {
      setErrorFinText("Ingrese un formato de fecha valido dd/mm/aaaa");
      setErrorFinValue(true);
      flagFin = false;
    } else {
      console.log("Paso prueba Fin Periodo");
      setErrorFinValue(false);
      setErrorFinText("");
    }

    if (flagIni && flagFin){
      let ddI = nuevoSemestre.fechaInicio.substr(0,2);
      let mmI = nuevoSemestre.fechaInicio.substr(3,2);
      let aaI = nuevoSemestre.fechaInicio.substr(6,4);

      let ddF = nuevoSemestre.fechaFin.substr(0,2);
      let mmF = nuevoSemestre.fechaFin.substr(3,2);
      let aaF = nuevoSemestre.fechaFin.substr(6,4);

      let fechaI = parseInt(ddI,10) + 10*parseInt(mmI,10) + 1000*parseInt(aaI,10);
      let fechaF = parseInt(ddF,10) + 10*parseInt(mmF,10) + 1000*parseInt(aaF,10);
      console.log("fecha inicio: ", fechaI);
      console.log("fecha fin: ", fechaF);
      if (fechaF > fechaI) {
        flagFechas = true;
      }
      else{
        setErrorIniValue(true);
        setErrorFinValue(true);
        setErrorIniText("Error: Fecha de inicio del periodo mayor a fecha fin");
        setErrorFinText("Error: Fecha de inicio del periodo mayor a fecha fin");
      }
    }
    return flagAnho && flagPeriodo && flagIni && flagFin && flagFechas;
  }

  function validarFormActualizar() {
    let regexAnho = new RegExp("^[0-9]+$");
    let regexPeriodo = new RegExp("^[0-9]+$");
    let regexIni = new RegExp("^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$"
    );
    let regexFin = new RegExp("^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$"
    );
    let flagAnho = true;
    let flagPeriodo = true;
    let flagIni = true;
    let flagFin = true;
    console.log("DATA ACTUALIZAR: ", dataActualizar);
    let flagFechas = false;
    if (dataActualizar.anhoAcademico.trim() === "") {
      setErrorAnhoText("Campo no puede estar vacio");
      setErrorAnhoValue(true);
      console.log("Año academico vacio");
      flagAnho = false;
    } else if (!regexAnho.test(dataActualizar.anhoAcademico)) {
      setErrorAnhoText("Ingrese un año");
      setErrorAnhoValue(true);
      flagAnho = false;
    } else if (dataActualizar.anhoAcademico.length != 4) {
      setErrorAnhoText("Campo debe contener 4 caracteres");
      setErrorAnhoValue(true);
      flagAnho = false;
    } else {
      console.log("Paso prueba Año Academico");
      setErrorAnhoValue(false);
      setErrorAnhoText("");
    }

    if (dataActualizar.periodo.trim() === "") {
      setErrorPeriodoText("Campo no puede estar vacio");
      setErrorPeriodoValue(true);
      flagPeriodo = false;
    } else if (!regexPeriodo.test(dataActualizar.periodo)) {
      setErrorPeriodoText("Ingrese un valor numérico");
      setErrorPeriodoValue(true);
      flagPeriodo = false;
    } else if (dataActualizar.periodo.length != 1) {
      setErrorPeriodoText("Campo debe contener 1 caracter numérico");
      setErrorPeriodoValue(true);
      flagPeriodo = false;
    } else {
      console.log("Paso prueba Periodo");
      setErrorPeriodoValue(false);
      setErrorPeriodoText("");
    }

    if (dataActualizar.fechaInicio.trim() === "") {
      setErrorIniText("Campo no puede estar vacio");
      setErrorIniValue(true);
      flagIni = false;
    } else if (!regexIni.test(dataActualizar.fechaInicio || dataActualizar.fechaInicio.length != 10 )) {
      setErrorIniText("Ingrese un formato de fecha valido dd/mm/aaaa");
      setErrorIniValue(true);
      flagIni = false;
    } else {
      console.log("Paso prueba Inicio Periodo");
      setErrorIniValue(false);
      setErrorIniText("");
    }

    if (dataActualizar.fechaFin.trim() === "") {
      setErrorFinText("Campo no puede estar vacio");
      setErrorFinValue(true);
      flagFin = false;
    } else if (!regexFin.test(dataActualizar.fechaFin || dataActualizar.fechaFin.length != 10)) {
      setErrorFinText("Ingrese un formato de fecha valido dd/mm/aaaa");
      setErrorFinValue(true);
      flagFin = false;
    } else {
      console.log("Paso prueba Fin Periodo");
      setErrorFinValue(false);
      setErrorFinText("")
    }

    if (flagIni && flagFin){
      let ddI = dataActualizar.fechaInicio.substr(0,2);
      let mmI = dataActualizar.fechaInicio.substr(3,2);
      let aaI = dataActualizar.fechaInicio.substr(6,4);

      let ddF = dataActualizar.fechaFin.substr(0,2);
      let mmF = dataActualizar.fechaFin.substr(3,2);
      let aaF = dataActualizar.fechaFin.substr(6,4);

      let fechaI = parseInt(ddI,10) + 10*parseInt(mmI,10) + 1000*parseInt(aaI,10);
      let fechaF = parseInt(ddF,10) + 10*parseInt(mmF,10) + 1000*parseInt(aaF,10);
      console.log("fecha inicio: ", fechaI);
      console.log("fecha fin: ", fechaF);
      if (fechaF > fechaI) {
        flagFechas = true;
      }
      else{
        setErrorIniValue(true);
        setErrorFinValue(true);
        setErrorIniText("Error: Fecha de inicio del periodo mayor a fecha fin");
        setErrorFinText("Error: Fecha de inicio del periodo mayor a fecha fin");
      }
    }
    return flagAnho && flagPeriodo && flagIni && flagFin && flagFechas;
  }
  /*fin validaciones */
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
  const seleccionarSemestre = (sem) => {
    const facultad = {
      anhoAcademico: sem.anhoAcademico,
      periodo: sem.periodo,
      fechaInicio: sem.fechaInicio,
      fechaFin: sem.fechaFin,
      fechaCierreNotasParcial: sem.fechaCierreNotasParcial,
      fechaCierreNotasFinal: sem.fechaCierreNotasFinal,
    };
  };

  const showData = async () => {
    try {
      const usuarios = await listarSemestres();
      const data = usuarios.data;
      setUsers(data);
      setFiltered(data);
      console.log(data);
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

  useEffect(() => {
    const result = users.filter((user) => {
      return user.anhoAcademico.toLowerCase().match(search.toLowerCase());
    });
    setFiltered(result);
  }, [search]);

  /*Insertar Semestre*/
  const modalInsertar = () => {
    setOpen(!open);

    setErrorAnhoText("");
    setErrorAnhoValue(false);
    setErrorPeriodoText("");
    setErrorPeriodoValue(false);
    setErrorIniText("");
    setErrorIniValue(false);
    setErrorFinText("");
    setErrorFinValue(false);

    limpiarData();
  };

  const modalActualizar = (registro) => {
    setOpenActualizar(!openActualizar);
    setDataActualizar({
      idSemestre: registro.idSemestre,
      anhoAcademico: registro.anhoAcademico,
      periodo: registro.periodo,
      fechaInicio: registro.fechaInicio,
      fechaFin: registro.fechaFin,
      fechaCierreNotasParcial: registro.fechaCierreNotasParcial,
      fechaCierreNotasFinal: registro.fechaCierreNotasFinal,
    });
  };

  const modalCancelarActualizar = () =>{
    setOpenActualizar(!openActualizar);

    setErrorAnhoText("");
    setErrorAnhoValue(false);
    setErrorPeriodoText("");
    setErrorPeriodoValue(false);
    setErrorIniText("");
    setErrorIniValue(false);
    setErrorFinText("");
    setErrorFinValue(false);

  }
  const handleInputChange = (event) => {
    console.log();
    event.persist();
    setNuevoSemestre({
      ...nuevoSemestre,
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

  const addSemestre = () => {
    if (validarForm()) {
      setLoading(true);
      agregarSemestre(nuevoSemestre);
      setTimeout(() => { modalInsertar(); setLoading(false);}, 1000);
      setInserto(true);
    }
    showData();
  };
  const updateSemestre = () => {
    const flag = validarFormActualizar();
    console.log(flag);
    if (validarFormActualizar()){
    setLoading(true);
    actualizarSemestre(dataActualizar);
    setTimeout(() => { setOpenActualizar(!openActualizar); setLoading(false);}, 1000);
    setActualizo(true);
  }
    showData();
    
    
  };

  const deleteSemestre = async (id) => {
    const probando = await listarCursosPorIdSemestre(id);
    const dataCursos = probando.data;
    console.log("Cursos del semestre", dataCursos);
    if(dataCursos.length === 0){
      await eliminarSemestre({idSemestre:id});
      enqueueSnackbar("Se ha eliminado el semestre", {variant: "success"});  
    }else{
      enqueueSnackbar("El semestre tiene cursos asociados", {variant: "error"}); 
    }
    showData();
    setElimino(true);
  };
  return (
    <div
      name="gestiondesemestres"
      className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white"
    >
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
        <div className="pb-10 mb-4 grid grid-cols-1">
          <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
            Semestres Académicos
          </p>
        </div>

        <div className="pb-8 flex flex-row">
          <div className="w-100">
            <Input
              label="Buscar por semestre"
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
              + Nuevo Semestre
            </Button>
          </Stack>
        </div>
        <div>
          <div></div>

          {/*Inicio de tabla*/}
          <div className="pb-6 w-full" style={{ height: 350, width: "100%" }}>
            <Box sx={{ width: "100%", height: 350 }}>
              <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                  <Table
                    sx={{ minWidth: 750}}
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
                            console.log("ID SEMESTRE: ", filtered.idSemestre);

                            return (
                              <TableRow
                                hover
                                onClick={(event) =>
                                  handleClick(event, filtered.idSemestre)
                                }
                                role="checkbox"
                                tabIndex={-1}
                                key={filtered.idSemestre}
                              >
                                <TableCell
                                  component="th"
                                  id={filtered.idSemestre}
                                  scope="row"
                                  padding="normal"
                                  align="left"
                                >
                                  {filtered.anhoAcademico +
                                    "-" +
                                    filtered.periodo}
                                </TableCell>

                                <TableCell align="left" padding="normal">
                                  {filtered.fechaInicio}
                                </TableCell>

                                <TableCell align="left" padding="normal">
                                  {filtered.fechaFin}
                                </TableCell>

                                <TableCell align="left" padding="normal">
                                  <IconButton
                                    aria-label="ver"
                                    color="error"
                                    onClick={() =>
                                      deleteSemestre(filtered.idSemestre)
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

          <Dialog open={open}>
            <DialogTitle>Nuevo semestre</DialogTitle>
            <Divider sx={{
                  marginBottom: 0,
                }}/>
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
                  name="anhoAcademico"
                  id="anio"
                  label="Año académico"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={handleInputChange}
                  error={errorAnhoValue}
                  helperText={errorAnhoText}
                />

                <TextField
                  required
                  margin="normal"
                  name="periodo"
                  id="idPeriodo"
                  label="Periodo"
                  type="text"
                  fullWidth
                  variant="standard"
                  error={errorPeriodoValue}
                  helperText={errorPeriodoText}
                  onChange={handleInputChange}
                />

                <TextField
                  required
                  margin="normal"
                  name="fechaInicio"
                  id="idIniPeriodo"
                  label="Inicio del Periodo"
                  fullWidth
                  variant="standard"
                  error={errorIniValue}
                  helperText={errorIniText}
                  onChange={handleInputChange}
                />

                <TextField
                  required
                  margin="normal"
                  name="fechaFin"
                  id="idFinPeriodo"
                  label="Fin del Periodo"
                  fullWidth
                  variant="standard"
                  error={errorFinValue}
                  helperText={errorFinText}
                  onChange={handleInputChange}
                />
              </Box>
            </DialogContent>
            <Divider />
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
                                onClick={() => addSemestre()}
                  >
                    Guardar
                </LoadingButton>
              </Stack>


            </DialogActions>
          </Dialog>

          <Dialog open={openActualizar}>
            <DialogTitle>Actualización de un Semestre</DialogTitle>
            <Divider sx={{
                  marginBottom: 0,
                }}/>
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
                  name="anhoAcademico"
                  id="anio"
                  label="Año académico"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={handleInputChangeActualizar}
                  error={errorAnhoValue}
                  helperText={errorAnhoText}
                  value={dataActualizar ? dataActualizar.anhoAcademico : ""}
                />

                <TextField
                  required
                  margin="normal"
                  name="periodo"
                  id="idPeriodo"
                  label="Periodo"
                  type="text"
                  fullWidth
                  variant="standard"
                  error={errorPeriodoValue}
                  helperText={errorPeriodoText}
                  onChange={handleInputChangeActualizar}
                  value={dataActualizar ? dataActualizar.periodo : ""}
                />

                <TextField
                  required
                  margin="normal"
                  name="fechaInicio"
                  id="idIniPeriodo"
                  label="Inicio del Periodo"
                  fullWidth
                  variant="standard"
                  onChange={handleInputChangeActualizar}
                  error={errorIniValue}
                  helperText={errorIniText}
                  value={dataActualizar ? dataActualizar.fechaInicio : ""}
                />

                <TextField
                  required
                  margin="normal"
                  name="fechaFin"
                  id="idFinPeriodo"
                  label="Fin del Periodo"
                  fullWidth
                  variant="standard"
                  onChange={handleInputChangeActualizar}
                  error={errorFinValue}
                  helperText={errorFinText}
                  value={dataActualizar ? dataActualizar.fechaFin : ""}
                />
              </Box>
            </DialogContent>
            <Divider />
            <DialogActions>

              <Stack direction="row" spacing={2}>
                  <Button
                    startIcon={<CancelIcon/>}
                    color="error"
                    variant="contained"
                    onClick={() => modalCancelarActualizar()}>
                    Cancelar  
                  </Button>

                  <LoadingButton
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<CheckIcon/>}
                                component="label"
                                variant="contained"
                                onClick={() => updateSemestre()}
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

export default GestionDeSemestres;
