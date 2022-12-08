import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Select, Option, Textarea } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import CardTareaPendiente from "../gestion_entregables/CardTareaPendiente";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { Box, Card, CardContent } from "@mui/material";

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
import { useAuth } from "../../../componentes/Context";

import axios from "axios";

import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
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

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
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

/*COLUMNAS*/
const headCells = [
  {
    id: "nombre", 
    numeric: false,
    disablePadding: true,
    label: "Nombre de la Tarea", 
  },
  {
    id: "nota",
    numeric: false,
    disablePadding: false,
    label: "Nota",
  },
];

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
          Notas
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

const Notas = () => {
  // Para utilizar la data redirigida
  const { state } = useLocation();
  const { user } = useAuth();
  
  const { idCurso, nombreCurso, semestre } = state;

  //TODO ESTO ES PARA ENTREGABLES

  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  /*Nos servirá para hacer los filtros por nombre*/
  const [search, setSearch] =
  useState(""); /*Default: muestra todo copia de users */
  const [filtered, setFiltered] = useState([]);
  /* para manejo de la tabla*/
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("nombre");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [notaFinal,setNotaFinal] = React.useState();


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
  
  const showData = async () => {
    const response = await axios.get(`/alumno/${user.idUsuario}/${idCurso}`);
    const tasks =  await axios.get(`/tareas/tareasVisibles/${idCurso}`);
    const checkedTasks = await axios.get(`/tareas/entregas/${response.data.id}`);
    setCheckedTasks(checkedTasks.data);
    setTasks(tasks.data);
    setFiltered(tasks.data);
    setNotaFinal(obtnerNotaFinal(tasks.data,checkedTasks.data).toFixed());
  }
  useEffect(() => {
    showData()
        .catch(() => {});
  }, []);

  const obtnerNotaFinal = (tareas, tareasRevisadas) => {
    let nota = 0;
    let pesos = 0;
    for ( let i = 0; i<tareas.length; i++) {
      let idTarea = tareas[i].id;
      pesos = pesos + tareas[i].peso;
      for ( let j = 0; j < tareasRevisadas.length; j++) {
        if(tareasRevisadas[j].tarea.id === idTarea) {
          nota += tareasRevisadas[j].notaFinal * tareas[i].peso;
          break;
        }
      }
    }
    return nota/pesos;
  };

    /*sirve para filtrar la data */
    useEffect(() => {
      const result = tasks.filter((task) => {
        return task.nombre.toLowerCase().match(search.toLowerCase());
      });
      setFiltered(result);
    }, [search]);

  return (
    <div
      name="notas"
      className="h-screen-pucp padding-pucp flex overflow-x-hidden overflow-y-auto bg-white"
    >
      <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
        <div className="pb-8 flex flex-row w-full">
          <p className="text-3xl font-sans inline border-b-2 text-black flex-auto border-black w-5/6">
            {state.nombre} {">"} Notas
          </p>
          <p className="text-3xl font-sans inline border-b-2 text-black flex-auto border-black w-1/6 text-right">
            {`${semestre["anhoAcademico"]}-${semestre["periodo"]}`}
          </p>
        </div>
        <div className="flex flex-col w-full">
          {/*filtrado*/}
          <div className="pb-8 flex flex-row">
            <div className="w-100">
              <Input
                label="Búsqueda por nombre"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="pb-6 w-full" style={{ height: 350, width: "100%" }}>
            {/*TABLAAAAAAAAAAAAAA*/}
            <Box sx={{ width: "100%" }}>
              <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size="small"
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
                      {
                        stableSort(filtered, getComparator(order, orderBy))
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((filtered) => {
                              let dt = new Date(Date.parse(filtered.fechaLimite));
                              return (
                                  <TableRow
                                      hover
                                      onClick={(event) =>
                                          handleClick(event, filtered.id)
                                      }
                                      role="checkbox"
                                      tabIndex={-1}
                                      key={filtered.nombre}
                                  >
                                    <TableCell
                                        component="th"
                                        id={filtered.id}
                                        scope="row"
                                        padding="normal"
                                        align="left"
                                    >
                                      {filtered.nombre}

                                    </TableCell>
                                    <TableCell align="left" padding="normal">
                                      {(() => {
                                        var size = checkedTasks.length;
                                        for (let i=0; i<size; i++) {
                                          if(checkedTasks[i].tarea.id === filtered.id) {
                                            if(checkedTasks[i].notaFinal >= 0)
                                              return checkedTasks[i].notaFinal;
                                          }
                                        }
                                      })()}
                                    </TableCell>
                                  </TableRow>
                              );
                            })
                      }
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: 33 * emptyRows,
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
              <Card sx={{display: "grid", gridAutoColumns: "1fr"}}>
                <CardContent sx={{display: "grid", gridAutoColumns: "1fr"}}>
                  <Box sx={{gridRow: 1, gridColumn: "span 2"}}>
                    <Stack alignItems="center">
                      <Typography>
                        Nota Final
                      </Typography>
                      <Typography variant="h3" color={notaFinal < 11 ? "#d32f2f": ""}>
                        {notaFinal}
                      </Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            {/*FIN TABLAAAAAA*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notas;
