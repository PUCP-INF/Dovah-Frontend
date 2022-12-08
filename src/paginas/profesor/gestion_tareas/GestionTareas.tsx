import * as React from "react";
import {Link, useLocation} from "react-router-dom";
import { useSnackbar } from 'notistack';
import {
  eliminarTarea,
} from "../../../services/TareaServices";
import axios from "axios";
import dayjs from "dayjs";
import {Box, Button} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Curso, Semestre, Tarea} from "../../general/DovahTypes";
import {
    DataGrid,
    GridActionsCellItem,
    GridColumns,
    GridToolbarContainer,
    GridToolbarQuickFilter
} from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';

const CustomToolbar = (): JSX.Element => {
    return (
        <GridToolbarContainer>
            <GridToolbarQuickFilter debounceMs={250}/>
        </GridToolbarContainer>
    )
}

const GestionTareas = (): JSX.Element => {
    const location = useLocation();
    const idCurso = location.state;
    const [tareas, setTareas] = React.useState<Array<Tarea>>([]);
    const [semestre, setSemestre] = React.useState<Semestre | null>(null);
    const [curso, setCurso] = React.useState<Curso | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    const showData = async () => {
        const tareas =  (await axios.get(`/tareas/por_curso/${idCurso}`)).data;
        setTareas(tareas);
        const curso: Curso = (await axios.get(`/curso/${idCurso}`)).data;
        setCurso(curso);
        setSemestre(curso.semestre);
    };

    const deleteTarea = async (id: number) => {
        await eliminarTarea(id);
        enqueueSnackbar("Se ha eliminado la tarea exitosamente", {variant: "success"});
        await showData();
    };

    const handleVisibilidadChange = async (event: React.MouseEvent<HTMLButtonElement>, tarea: Tarea) => {
        event.preventDefault();
        await axios.post("/tareas/cambiarVisibilidad", {
            idTarea: tarea["id"],
            visible: !tarea["visible"]
        });
        const estadoVisible = tarea.visible;
        if(estadoVisible){
            enqueueSnackbar("Se ha inhabilitado "+ tarea.nombre, {variant: "info"});
        }else{
            enqueueSnackbar("Se ha habilitado "+ tarea.nombre, {variant: "info"});
        }
        await showData();
    }

    const columns: GridColumns<Tarea> = [
        {
        field: "nombre",
        headerName: "Nombre",
        flex: 1
        },
        {
        field: "descripcion",
        headerName: "Descripcion",
        flex: 1
        },
        {
            field: "fechaLimite",
            headerName: "Fecha Limite",
            type: "string",
            flex: 1,
            valueGetter: params => {
                const dt = dayjs.utc(params.row.fechaLimite);
                return dt.local().format("DD/MM/YYYY HH:mm");
            }
        },
        {
            field: "peso",
            headerName: "Peso",
            type: "number",
            headerAlign: "center",
            align: "center"
        },
        {
            field: "acciones",
            headerName: "Acciones",
            type: "actions",
            width: 150,
            getActions: params => {
                return [
                    <GridActionsCellItem
                        label="edit"
                        color="primary"
                        icon={<Link to="detalle" state={params.row}>
                            <EditIcon/>
                        </Link>}
                    />
                    ,
                    <GridActionsCellItem
                        label="change-visiblity"
                        onClick={event => handleVisibilidadChange(event, params.row)}
                        color="primary"
                        icon={params.row.visible ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                    />,
                    <GridActionsCellItem
                        label="delete"
                        onClick={() => deleteTarea(params.row.id)}
                        icon={<DeleteIcon color="error"/>}/>
                ]
            }
        }
    ]

    React.useEffect(() => {
        showData().catch();
    }, []);

    if (curso == null || semestre == null) return <></>;

    return (
        <div>
            <div className="mt-6 mb-1 grid grid-cols-2">
                <p className="text-3xl font-sans inline border-b-2  text-black-pucp flex-auto border-black">
                    {curso.nombre} {">"} Gestión de Tareas
                </p>
                <p className="text-3xl font-sans inline border-b-2  text-black-pucp flex-auto border-black text-right">
                {semestre.anhoAcademico}{"-"}{semestre.periodo}
                </p>
            </div>
        
        <Box sx={{display: "grid", gridAutoColumns: "1fr", gap: 1, marginTop: 2}}>
            
            <Button
                component={Link}
                state={{curso}}
                variant="contained"
                to="detalle"
                sx={{gridRow: 2, gridColumn: "span 12", justifySelf: "flex-end"}}
            >
                Nueva Tarea
            </Button>
            <Box sx={{gridRow: 3, height: "500px", gridColumn: "span 12", marginTop: 2}}>
                <DataGrid
                    columns={columns}
                    rows={tareas}
                    autoPageSize
                    disableSelectionOnClick
                    components={{Toolbar: CustomToolbar}}
                />
            </Box>
        </Box>
        </div>
    )
};

export default GestionTareas;