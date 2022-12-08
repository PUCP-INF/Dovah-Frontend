// @flow
import * as React from "react";
import {Box, Button, TextField} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {DataGrid} from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import {GridColDef} from "@mui/x-data-grid";
import dayjs from "dayjs";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useSnackbar } from 'notistack';
import { useAuth } from "../../../componentes/Context";
const AreaTesis = (): React.Node => {
    const { user } = useAuth();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [errorNombreAreaText, setErrorNombreAreaText] = React.useState("");
    const [errorNombreAreaValue, setErrorNombreAreaValue] = React.useState(false);
    const emptyUser={
        nombre: "",
    }

    function validarNombreArea(){
        let cadena = areaState.newArea.nombre.trim();

        if (cadena ===""){
            setErrorNombreAreaText("Debe ingresar un nombre");
            setErrorNombreAreaValue(true);
            return false;
        }
        else{
            console.log("Paso validacion nombre OK");
            setErrorNombreAreaValue(false);
            setErrorNombreAreaText("");
            return true;
        }
    }

    const [areaState, setAreaState] = React.useState({
        areas: [],
        newArea: {
            idAreaPlanTesis: 0,
            idEspecialidad: 0,
            nombre: ""
        }
    });
    const [areaPrueba, setAreaPrueba] = React.useState({...emptyUser});
    const getAreas = async () => {
        console.log("user",user["especialidad"]["idEspecialidad"]);
        const idEspecialidad = user["especialidad"]["idEspecialidad"];
        const response = await axios.get(`/planTesis/areas/${idEspecialidad}`);
        const area = {...areaState.newArea};
        area.idAreaPlanTesis =0 ;
        area.nombre = "";
        area.idEspecialidad=0;
        setAreaState({...areaState, areas: response.data, newArea: area});
    }

    const handleAreaChange = (event: SyntheticInputEvent<>) => {
        const area = {...areaState.newArea};
        area.nombre = event.target.value;
        area.idEspecialidad=user["especialidad"]["idEspecialidad"];
        setAreaState({...areaState, newArea: area});
    }

    const handleAreaSave = async () => {
        if (validarNombreArea()){
            if(areaState.newArea["idAreaPlanTesis"]===0){
                await axios.post("/planTesis/areas/nuevo", areaState.newArea);
            }else{
                await axios.post("/planTesis/areas/modificar", areaState.newArea);
            }
            enqueueSnackbar("Cambios guardados correctamente", {variant: "success"});
        }else{
        enqueueSnackbar("Error al guardar una nueva area", {variant: "error"});
        }
        await getAreas();
        
    }

    const handleAreaModificar = (row) => {
        const auxiliar = row;
        //setAreaState([]);
        console.log("AREA A ACTUALIZAR", auxiliar);
        const tmp = {...areaState};
        tmp.newArea["idAreaPlanTesis"] = row["id"];
        tmp.newArea["nombre"] = row["nombre"];
        setAreaState(tmp);
    }


    const handleAreaDelete = async (idAreaPlanTesis:number) => {
        const json ={idAreaPlanTesis};
        console.log("ID",idAreaPlanTesis);
        await axios.post("/planTesis/areas/eliminar",json);
        getAreas();
        enqueueSnackbar("Eliminación de area correcta", {variant: "success"});
    }
    
    React.useEffect(() => {
        getAreas()
            .catch();
    }, []);
    const columns: GridColDef[] = [
        {
            field: 'nombre',
            headerName: 'Nombre',
            sortable: false,
            flex: 1
        },
        {
            field: "fechaCreacion",
            headerName: "Fecha de Creacion",
            sortable: false,
            flex: 1,
            valueGetter: (params) => {
                const dt = dayjs(params.value).local();
                return dt.format("DD/MM/YYYY HH:mm");
            }
        },
        {
            field: "acciones",
            headerName: "Acciones",
            flex: 0.3,
            renderCell: params => {
                return <Stack direction="row">
                    <IconButton color="primary" onClick={() => handleAreaModificar(params.row)}><EditIcon/></IconButton>
                    <IconButton color="error" onClick={() => handleAreaDelete(params.row["id"])}><DeleteIcon/></IconButton>
                </Stack>
            }
        },
    ]
    return (
        <>
            <div className="pb-6 mt-6 grid grid-cols-1">
                <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
                    Áreas de Tesis 
                </p>
            </div>
            <Grid spacing={2} container>
                
                <Grid xs={4}>
                    <TextField
                        value={areaState.newArea.nombre}
                        label="Nueva area"
                        size="small"
                        error={errorNombreAreaValue}
                        helperText={errorNombreAreaText}
                        fullWidth
                        onChange={handleAreaChange}/>
                </Grid>
                <Grid xs={3} display="flex" justifyContent="left" alignItems="center">
                    <Button onClick={handleAreaSave}>Guardar</Button>
                </Grid>
                <Grid xs={12}>
                    <Box sx={{ height: 500, width: '100%', marginBottom:6, marginTop:1 }}>
                        <DataGrid
                            rows={areaState.areas}
                            columns={columns}
                            disableSelectionOnClick={true}
                            experimentalFeatures={{ newEditingApi: true }}
                            autoPageSize
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default AreaTesis;