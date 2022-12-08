import React from "react";
import {DataGrid, GridActionsCellItem, GridColumns} from "@mui/x-data-grid";
import axios from "axios";
import Stack from "@mui/material/Stack";
import {Autocomplete, Box} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type {Alumno} from "../../general/DovahTypes";
import DeleteIcon from "@mui/icons-material/Delete";

type AlumnoState = {
    alumno: Alumno | null,
    alumnos: Array<Alumno>
}

const ListarAlumnosInscritos =
    ({idCurso, idPlanTesis}: {idCurso: number | string, idPlanTesis: number}): JSX.Element => {
    const [alumnosInscritos, setAlumnosInscritos] = React.useState([]);
    const [alumnoState, setAlumnoState] = React.useState<AlumnoState | null>(null);

    const cols: GridColumns<Alumno> = [
        {
            field: "nombre",
            headerName: "Nombre",
            flex: 1,
            valueGetter: params => {
                return `${params.row["usuario"]["nombre"]} ${params.row["usuario"]["apellido"]}`;
            }
        },
        {
            field: "codigo",
            headerName: "Codigo",
            flex: 1,
            valueGetter: params => {
                return params.row["usuario"]["codigoPUCP"];
            }
        },
        {
            field: "actions",
            headerName: "Acciones",
            type: "actions",
            sortable: false,
            getActions: params => {
                return [
                    <GridActionsCellItem
                        onClick={() => handleEliminarAlumno(params.row.id)}
                        icon={<DeleteIcon color="error"/>}
                        label="Eliminar"
                    />
                ]
            }
        }
    ]

    const getAlumnosEnTesis = async () => {
        if (idPlanTesis == null) return;
        if (idCurso == "") {
            setAlumnosInscritos([]);
            return;
        }
        const response = await axios.get(`/planTesis/listar/alumnos/${idCurso}/${idPlanTesis}`);
        setAlumnosInscritos(response.data);
    }

    const getAlumnosDisponibles = async () => {
        if (idCurso === "") {
            setAlumnoState({alumnos: [], alumno: null});
            return;
        }
        const response = await axios.get(`/planTesis/listar/alumnosDisponibles/${idCurso}`);
        if (response.data.length === 0) {
            setAlumnoState({alumnos: [], alumno: null});
        } else {
            setAlumnoState({alumnos: response.data, alumno: null});
        }
    }

    const handleAgregarAlumno = async () => {
        if (alumnoState == null || alumnoState.alumno == null) return;
        const json = {
            idAlumno: alumnoState.alumno.id,
            idPlanTesis
        }
        await axios.post("/coordinador/tesis/asignar/alumno", json);
        await getAlumnosDisponibles();
        await getAlumnosEnTesis();
    }

    const handleEliminarAlumno = async (id: number) => {
        await axios.delete(`/coordinador/tesis/eliminar/alumno/${id}`);
        await getAlumnosDisponibles();
        await getAlumnosEnTesis();
    }

    React.useEffect(() => {
        getAlumnosDisponibles().catch();
        getAlumnosEnTesis().catch();
    }, [idCurso]);

    if (alumnoState == null) return <></>;

    return (
        <Box sx={{ display: "grid", gridAutoRows: "10px" }}>
            <Typography sx={{gridRow: "span 3"}}>
                Alumnos Inscritos
            </Typography>
            <Stack direction="row" spacing={2} sx={{gridRow: "span 5"}} justifyContent="flex-start" alignItems="center">
                <Autocomplete
                    ListboxProps={{style: { maxHeight: '15rem' }}}
                    renderInput={params => {
                        return <TextField
                            {...params}
                            label="Alumnos"
                            size="small"
                        />
                    }}
                    value={alumnoState.alumno}
                    onChange={(event, newValue) => {
                        setAlumnoState({...alumnoState, alumno: newValue});
                    }}
                    options={alumnoState.alumnos}
                    sx={{ width: 400 }}
                    getOptionLabel={(option) => {
                        return `${option["usuario"]["nombre"]} ${option["usuario"]["apellido"]}`;
                    }}
                />
                <Button onClick={handleAgregarAlumno}>Agregar Alumno</Button>
            </Stack>
            <Box sx={{gridRow: "span 25"}}>
                <DataGrid
                    columns={cols}
                    rows={alumnosInscritos}
                    autoPageSize
                    disableSelectionOnClick={true}
                />
            </Box>
        </Box>
    )
};

export default ListarAlumnosInscritos;