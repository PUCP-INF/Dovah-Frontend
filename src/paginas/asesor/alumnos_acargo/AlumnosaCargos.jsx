import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "@emotion/styled";
import Stack from "@mui/material/Stack";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import {useAuth} from "../../../componentes/Context";
import {
  obtenerTesisConUsuarioInscrito,
} from "../../../services/PlanTesisServices";
import { useSnackbar } from 'notistack';

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

const columns: GridColDef[]  = [
  {
    field: "codigoPucp",
    headerName: 'Codigo PUCP',
    flex: 0.5,
    valueGetter: params => {
        const usr = params["row"];
        return usr["codigoPucp"];
    }
  },
  {
    field: "nombres",
    headerName: 'Nombres y Apellidos',
    flex: 1.4,
    valueGetter: params => {
        const usr = params["row"];
        return usr["nombres"]+ " " + usr["apellidos"];
    }
  },
  {
    field: "tituloTema",
    headerName: 'Tema de Tesis',
    flex: 1,
    valueGetter: params => {
        const usr = params["row"];
        return usr["tituloTema"];
    }
  },
  {
    field: "descripcionTema",
    headerName: 'Descripcion',
    flex: 1,
    valueGetter: params => {
        const usr = params["row"];
        return usr["descripcionTema"];
    }
  },
];


const AlumnosaCargos = () => {
    const {user} = useAuth();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [open, setOpen] = useState(false);
    const [pruebaFinal,setPruebaFinal] = useState([]);
    
    const showData = async () => {
      try {
        const usuariosInscritosTesis = await obtenerTesisConUsuarioInscrito(user.idUsuario);
        console.log("Usuarios inscritos en la tesis:", usuariosInscritosTesis);
        const data = usuariosInscritosTesis.data;
        const arreglo = [];
        for (let i = 0; i < data.length; i++) {
          let alumno = {
            nombres: "",
            apellidos: "",
            codigoPucp: "",
            correo: "",
            id: 0,
            tituloTema: "",
            descripcionTema: "",
            idTema: 0,
          };
          alumno.tituloTema = data[i]["titulo"];
          alumno.descripcionTema = data[i]["descripcion"];
          alumno.idTema = data[i]["id"];
          console.log("Tamanio",data[i]["alumnos"].length);
          for (let j = 0; j < data[i]["alumnos"].length; j++) {
            const alumnoSeleccionado = {
              ...alumno,
            }
            alumnoSeleccionado.nombres = data[i]["alumnos"][j]["usuario"]["nombre"];
            alumnoSeleccionado.apellidos = data[i]["alumnos"][j]["usuario"]["apellido"];
            alumnoSeleccionado.codigoPucp = data[i]["alumnos"][j]["usuario"]["codigoPUCP"];
            alumnoSeleccionado.correo = data[i]["alumnos"][j]["usuario"]["correo"];
            alumnoSeleccionado.id = data[i]["alumnos"][j]["usuario"]["idUsuario"];
            
            let flag = false;
            for(let k =0; k<arreglo.length; k++){
              if(data[i]["alumnos"][j]["usuario"]["codigoPUCP"] === arreglo[k]["codigoPucp"]){
                flag = true;
                break;
              }                    
            }
            if(flag === false){
              arreglo.push( alumnoSeleccionado);
            }
          }
        }
          setPruebaFinal(arreglo);
          console.log("prueba final", arreglo);
        } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      showData();
    }, []);
  
    return (
      <div name="alumnosacargo" className="h-screen w-full bg-white">
        <div className="max-w-screen-lg py-8 mx-auto flex flex-col justify-start w-full h-fit">
          <div className="pb-10 mt-4 mb-4 flex flex-row w-full">
            <p className="text-3xl font-sans inline border-b-2 text-blue-pucp flex-auto border-blue-pucp w-4/5">
              Alumnos a cargo
            </p>
          </div>
          <Box sx={{gridRow: 'span 53'}}>
            <DataGrid
              columns={columns}
              rows={pruebaFinal}
              disableSelectionOnClick={true}
              autoHeight
            />
          </Box>
        </div>
      </div>
    );
  };
  
  export default AlumnosaCargos;