import React from "react";
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "../../../componentes/Context";
import type {Alumno, Curso, Semestre, Tarea} from "../../general/DovahTypes";
import axios from "axios";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {DataGrid, GridActionsCellItem, GridColumns} from "@mui/x-data-grid";
import dayjs from "dayjs";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";

const GestionTareasAlumno = (): JSX.Element => {
    const location = useLocation();
    const curso: Curso = location.state;
    const semestre: Semestre = curso.semestre;
    const {user} = useAuth();
    const [alumno, setAlumno] = React.useState<Alumno | null>(null);
    const [tareas, setTareas] = React.useState<Array<Tarea>>([]);

    const columns: GridColumns<Tarea> = [
        {
            field: "nombre",
            headerName: "Nombre",
            flex: 1
        },
        {
            field: "fechaLimite",
            headerName: "Fecha Limite",
            type: "dateTime",
            flex: 1,
            valueGetter: params => {
                const dt = dayjs.utc(params.row.fechaLimite).local();
                return dt.format("DD/MM hh:mm A");
            }
        },
        {
            field: "acciones",
            headerName: "Acciones",
            type: "actions",
            getActions: params => {
                return [
                    <GridActionsCellItem
                        label="edit"
                        color="primary"
                        icon={<Link to="detalleentregable" state={{tarea: params.row, curso, alumno}}><DisplaySettingsIcon/></Link>}
                    />
                ]
            }
        }
    ];

    const getData = async () => {
        const alumno: Alumno = (await axios.get(`/alumno/${user.idUsuario}/${curso.idCurso}`)).data;
        const tareas = (await axios.get(`/tareas/entregasActivas/${alumno.id}`)).data;
        setAlumno(alumno);
        setTareas(tareas);
    }

    React.useEffect(() => {
        getData().catch();
    }, []);

    return (
        <div>
            <div className="mt-6 pb-5 mb-4 flex flex-row w-full">
                    <p className="text-3xl font-sans inline border-b-2  text-black-pucp flex-auto border-black">
                    {`${curso.clave} - ${curso.nombre} > `} Tareas
                    </p>
                    <p className="text-3xl font-sans inline border-b-2  text-black-pucp flex-auto border-black text-right">
                    {`${semestre.anhoAcademico} - ${semestre.periodo}`}
                    </p>
            </div>
        
        <Box sx={{display: "grid", gridAutoColumns: "1fr", marginTop: 2}}>
            
            
            <Typography variant="h6" gutterBottom sx={{gridColumn: "span 12", gridRow: 2}}>
                Tareas Asignadas
            </Typography>
            <Box sx={{height: 600, gridColumn: "span 12", gridRow: 3}}>
                <DataGrid columns={columns} rows={tareas} autoPageSize/>
            </Box>
        </Box>
        </div>
    )
};

export default GestionTareasAlumno;