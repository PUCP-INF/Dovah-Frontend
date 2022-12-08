import React from "react";
import axios from "axios";
import {DataGrid, GridActionsCellItem, GridColumns} from "@mui/x-data-grid";
import {Autocomplete, Box, Checkbox} from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DeleteIcon from '@mui/icons-material/Delete';
import type {Profesor, ProfesorTesis} from "../../general/DovahTypes";

type ProfesorState = {
    profesor: null | Profesor,
    profesores: Array<Profesor>
}

const ListarProfesorInscritos = (
    {idCurso, idPlanTesis}: {idCurso: number | string, idPlanTesis: number}) : JSX.Element => {
    const [profesoresInscritos, setProfesoresInscritos] = React.useState<Array<ProfesorTesis>>([]);
    const [profesorState, setProfesorState]: [ProfesorState, Function] = React.useState({
        profesor: null,
        profesores: []
    });
    const [rolArr, setRolArr] = React.useState(new Map());

    const cols: GridColumns<ProfesorTesis> = [
        {
            field: "nombre",
            headerName: "Nombre",
            flex: 1,
            valueGetter: params => {
                const prof = params.row["profesor"];
                return `${prof["usuario"]["nombre"]} ${prof["usuario"]["apellido"]}`;
            }
        },
        {
            field: "codigoPUCP",
            headerName: "Codigo",
            flex: 1,
            valueGetter: params => {
                return params.row.profesor.usuario.codigoPUCP;
            }
        },
        {
            field: "asesor",
            headerName: "Asesor",
            flex: 0.2,
            headerAlign: 'center',
            sortable: false,
            align: "center",
            renderCell: params => {
                const prof = params.row["profesor"];
                const found = prof["roles"].find(e => e["nombre"] === "ASESOR");
                if (typeof found === "undefined") {
                    return <Checkbox disabled/>
                }
                const tmp = new Set(rolArr.get(prof["id"]));
                return <Checkbox
                    checked={tmp.has("ASESOR")}
                    onChange={event => handleRolesChange(event, prof)}
                    inputProps={{ 'aria-label': 'controlled'}}
                    name="ASESOR" />
            }
        },
        {
            field: "jurado",
            headerName: "Jurado",
            flex: 0.2,
            headerAlign: 'center',
            sortable: false,
            align: "center",
            renderCell: params => {
                const prof = params.row["profesor"];
                const found = prof["roles"].find(e => e["nombre"] === "JURADO");
                if (typeof found === "undefined") {
                    return <Checkbox disabled/>
                }
                const tmp = new Set(rolArr.get(prof["id"]));
                return <Checkbox
                    checked={tmp.has("JURADO")}
                    onChange={event => handleRolesChange(event, prof)}
                    inputProps={{ 'aria-label': 'controlled'}}
                    name="JURADO" />
            }
        },
        {
            field: "actions",
            headerName: "Acciones",
            type: "actions",
            sortable: false,
            getActions: ({row}: {row: ProfesorTesis}) => {
                return [
                    <GridActionsCellItem
                        onClick={() => handleEliminarProfesor(row.profesor.id)}
                        icon={<DeleteIcon color="error"/>}
                        label="Eliminar"
                    />
                ]
            }
        }
    ]

    const handleRolesChange = async (event: React.ChangeEvent<HTMLInputElement>, profesor: Profesor) => {
        const rol = event.target.name;
        const map = new Map(rolArr);
        let set = new Set(rolArr.get(profesor["id"]));
        if (!set.delete(rol)) {
            set.add(rol);
        }
        map.set(profesor["id"], set);
        const json = {
            idProfesor: profesor["id"],
            idPlanTesis: idPlanTesis,
            roles: Array.from(set)
        }
        await axios.post("/coordinador/tesis/asignar/profesor", json);
        setRolArr(map);
    }

    const handleAgregarProfesor = async () => {
        if (profesorState.profesor == null) return;
        const json = {
            idProfesor: profesorState.profesor["id"],
            idPlanTesis: idPlanTesis,
            roles: []
        }
        await axios.post("/coordinador/tesis/asignar/profesor", json);
        await getProfesoresInscritos();
        await getProfesoresDisponibles();
    }

    const handleEliminarProfesor = async (id: number) => {
        await axios.delete(`/coordinador/tesis/eliminar/profesor/${id}/${idPlanTesis}`);
        await getProfesoresInscritos();
        await getProfesoresDisponibles();
    }

    const getProfesoresInscritos = async () => {
        if (idPlanTesis == null) return;
        if (idCurso == "") {
            setRolArr(new Map());
            setProfesoresInscritos([]);
            return;
        }
        const response = await axios.get<Array<ProfesorTesis>>(`/planTesis/listar/profesores/${idCurso}/${idPlanTesis}`);
        const map = new Map();
        response.data.forEach(value => {
            const prof = value["profesor"];
            const set = new Set();
            value["roles"].forEach(value1 => set.add(value1["nombre"]));
            map.set(prof["id"], set);
        });
        setRolArr(map);
        setProfesoresInscritos(response.data);
    };

    const getProfesoresDisponibles = async () => {
        if (idCurso === "") {
            setProfesorState({profesores: [], profesor: null});
            return;
        }
        const response = await axios.get(`/planTesis/listar/profesoresDisponibles/${idCurso}/${idPlanTesis}`);
        if (response.data.length === 0) {
            setProfesorState({profesores: [], profesor: null});
        } else {
            setProfesorState({profesores: response.data, profesor: null});
        }
    }

    React.useEffect(() => {
        getProfesoresInscritos().catch();
        getProfesoresDisponibles().catch();
    }, [idCurso])

    return (
        <Box sx={{ display: "grid", gridAutoRows: "10px" }}>
            <Typography sx={{gridRow: "span 3"}}>
                Profesores Inscritos
            </Typography>
            <Stack direction="row" spacing={2} sx={{gridRow: "span 5"}} justifyContent="flex-start" alignItems="center">
                <Autocomplete
                    ListboxProps={{style: { maxHeight: '15rem' }}}
                    renderInput={params => {
                        return <TextField
                            {...params}
                            label="Profesores"
                            size="small"
                        />
                    }}
                    value={profesorState.profesor}
                    onChange={(event, newValue) => {
                        setProfesorState({...profesorState, profesor: newValue});
                    }}
                    options={profesorState.profesores}
                    sx={{ width: 400 }}
                    getOptionLabel={(option) => {
                        return `${option["usuario"]["nombre"]} ${option["usuario"]["apellido"]}`;
                    }}
                />
                <Button onClick={handleAgregarProfesor}>Agregar Profesor</Button>
            </Stack>
            <Box sx={{gridRow: "span 40"}}>
                <DataGrid
                    columns={cols}
                    rows={profesoresInscritos}
                    autoPageSize
                    disableSelectionOnClick={true}
                />
            </Box>
        </Box>
    )
}

export default ListarProfesorInscritos;