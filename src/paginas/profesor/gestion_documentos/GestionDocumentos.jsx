import React, {useState, useContext, useEffect} from "react";
import {Link, useNavigate,useLocation} from "react-router-dom";
import { Input } from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import axios from "axios";
import LinkIcon from '@mui/icons-material/Link';
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
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { styled } from "@mui/material/styles";
import { useSnackbar } from 'notistack';
import{
    listarArchivos,
    agregarArchivo,
    eliminarArchivo,
    encontrarArchivo,
} from "../../../services/DocumentoServices";
import{
  agregarDocumentoporCurso,
  listarDocumentosGeneralesPorCurso,
  eliminarDocumentoGeneral,
} from "../../../services/CursoServices";

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

const headCells=[
  {
      id: "documento",
      numeric: false,
      disablePadding: true,
      label: "Documento",
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
            Documentos PUCP
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

const GestionDocumentos = () => {
  const [fileCurso, setFileCurso] =useState({
    idCurso: 0,
    idDocumento: 0,
  });
  const [fileEliminable, setFileEliminable] = useState({
    idCurso: 0,
    idDocumento: 0,
  })
  const {state}= useLocation();
  const {idCurso,nombreCurso, semestre}=state;
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [openActualizar, setOpenActualizar] = useState(false);
  const [inserto, setInserto] = useState(false);
  const [actualizo, setActualizo] = useState(false);
  const [dataActualizar, setDataActualizar] = useState({
    id: 0,
    nombre: "",
    base64: "",
  });
  const [tipoModal, setTipoModal] = useState("");
  const [nuevoDocumento, setNuevoDocumento] = useState({
    nombre: "",
    base64: "",
  });
  const [selectedFile, setSelectedFile] = useState("");
  const [elimino, setElimino] = useState(false);
  /*Estados para implementar la eliminación de semestres*/
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const [id, setId] = useState(0);
  const [documentoPrueba,setDocumentoPrueba] = useState([]);
  /* para manejo de la tabla*/
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("nombre");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  /*fin manejo tabla */
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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

  //let navigate = useNavigate();

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
    console.log(selectedRows);
    setSelectedRowId(state.selectedRowId);
  }, []);

  const setearId = (id) => {
    setId(id);
  };

  const eliminarOActualizar=()=>{
    console.log(id);
  };

  const seleccionarDocumento=(doc)=>{
    const documento={
        nombre: doc.nombre,
        base64: doc.base64,
    };
  };

  const showData = async() =>{
    try {
        const usuarios = await listarArchivos();
        const data = usuarios.data;
        console.log("ULTIMO DOCUMENTOS", nuevoDocumento);
        var idDocumentoLeido=0;
        var tamanio =data.length;
        for(let i=0; i<tamanio;i++){
          const archivo = data[i];
          console.log("Documento Leido", archivo);
          const idDocumento = archivo.id;
          var ID = idDocumento;
          console.log("ID DEL ARCHIVO ",idDocumento);
          const nombreArchivoLeido =archivo.nombre;
          console.log("nombre del archivo", nombreArchivoLeido);
          const ultimoArchivoNombre=nuevoDocumento.nombre;
          if(nombreArchivoLeido===ultimoArchivoNombre){
            idDocumentoLeido=ID;
          }
        }
        if(idDocumentoLeido != 0){
          const documentos = encontrarArchivo(idDocumentoLeido);
          console.log("DOCUMENTO ENCONTRADO", documentos);
          fileCurso.idCurso=idCurso;
          fileCurso.idDocumento=idDocumentoLeido;
          console.log("DOCUMENTO A PUNTO DE GUARDAR: ", fileCurso);
          agregarDocumentoporCurso(fileCurso);
        }
        const documentosXCurso = await listarDocumentosGeneralesPorCurso(idCurso);
        const data4 = documentosXCurso.data;
        console.log("DATA FINAAAAAAL ", data4);
        setUsers(data4);
        setFiltered(data4);
      } catch (error) {
        console.log(error);
      }
  };

  useEffect(()=>{
    showData();
    setInserto(false);
    setActualizo(false);
    setElimino(false);
  },[inserto,actualizo,elimino]);

  useEffect(() => {
    const result = users.filter((user) => {
      return user.nombre.toLowerCase().match(search.toLowerCase());
    });
    setFiltered(result);
  }, [search]);

  /*Insertar Documento*/
  const modalInsertar = () => {
    setOpen(!open);
  };


  const modalActualizar = (registro) => {
    setOpenActualizar(!openActualizar);
    setDataActualizar({
      id: registro.id,
      nombre: registro.nombre,
      base64: registro.base64,
    });
  };  
  const handleInputChange2=(event)=>{
    nuevoDocumento.nombre=event.target.value;
  }

  const handleInputChange = async (event) => {
    const file = event.target.files[0];
    const prueba = nuevoDocumento.nombre;
    const formData = new FormData();
        formData.append("file", file);
        formData.append("nombre",prueba);
        setDocumentoPrueba(formData);
  };

  const addDocumento = async (event) =>{

    const response = await axios.post(`/documento/crear`,documentoPrueba, {
      headers: {
          "Content-type": "multipart/form-data",
      }
    }).catch((error) => {
      if (error.response) {
        enqueueSnackbar("No se puede subir el documento", {variant: "error"}); 
      } 
    });
    if(response){
      modalInsertar();  
      setInserto(true);
      showData();
      enqueueSnackbar("Subida realizada correctamente", {variant: "success"});
    }
  };

  
  const deleteDocumento = (id) => {
    fileEliminable.idCurso=idCurso;
    fileEliminable.idDocumento=id;
    eliminarDocumentoGeneral(fileEliminable);
    eliminarArchivo(id);
    showData();
    setElimino(true);
    enqueueSnackbar("Eliminación de documento correcta", {variant: "success"});
  };

  const redireccionaPage= async (id) => {
    const archivoSeleccionado= await encontrarArchivo(id);
    const dataArchivo = archivoSeleccionado.data;
    setSelectedFile(dataArchivo.url);
    var URL = "";
    URL=selectedFile;
    window.open(URL,'_blank');
  };
  
  return (
    <div name="gestiondocumentos" className="h-screen w-full bg-white">
      <div className="flex w-full h-20"></div>

      <div className="max-w-screen-lg p-8 mx-auto flex flex-col justify-start w-full h-fit">
      <div className="pb-6 flex flex-row w-full">          
          <p className="text-3xl font-semibold inline border-b-4 text-blue-pucp flex-auto border-blue-pucp w-5/6">
              {state.nombre} {">"} Documentos Generales
          </p>
          <p className="text-3xl font-semibold inline border-b-4 text-blue-pucp flex-auto border-blue-pucp w-1/6 text-right">
            {`${semestre["anhoAcademico"]}-${semestre["periodo"]}`}
          </p>
        </div>

        <div className="pb-8 flex flex-row">
          <div className="w-100">
            <Input
              label="Busqueda por nombre"
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
              Nuevo Documento
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
                            console.log("ID DOCUMENTO: ", filtered.id);

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
                                  <IconButton
                                    color="error"
                                    aria-label="ver"
                                    onClick={() =>
                                      deleteDocumento(filtered.id)
                                    }
                                  >
                                    <DeleteIcon  />
                                  </IconButton>
                                  <IconButton
                                    color="primary"
                                    aria-label="ver"
                                    onClick={()=>redireccionaPage(filtered.id)}
                                  >
                                    <LinkIcon/>
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
            <DialogTitle>Nuevo Documento</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  marginTop: 2,
                  marginBottom: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <TextField
                  required
                  margin="normal"
                  name="nombre"
                  id="idNombre"
                  label="Nombre del Documento"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={handleInputChange2}
                />
                <br></br>
                <br></br>
                <label>Archivo adjunto:</label>
                <br></br>
                <input type="file" onChange={handleInputChange}/>

              </Box>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => modalInsertar()}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={() => addDocumento()}>
                Guardar
              </Button>
            </DialogActions>
          </Dialog>

          
        </div>
      </div>
    </div>
  );
};

export default GestionDocumentos;