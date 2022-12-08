import React from 'react';
import {Box} from "@mui/material";
import {useAuth} from "../../../componentes/Context";
import ListarAlumnosInscritos from "./ListarAlumnosInscritos";
import ListarProfesorInscritos from "./ListarProfesorInscritos";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {useLocation} from "react-router-dom";

const ListarTesisInscritos = (): JSX.Element => {
    const {user} = useAuth();
    const location = useLocation();
    const idEspecialidad = user["especialidad"]["idEspecialidad"];
    const idPlanTesis = location.state;

    const [semestreState, setSemestreState] = React.useState({
        id: "",
        semestres: [],
    });
    const [cursoState, setCursoState] = React.useState({
        id: "",
        cursos: []
    });

    React.useEffect(() => {
        axios.get("/semestre").then((response) => {
            setSemestreState({
                id: response.data[0]["idSemestre"],
                semestres: response.data,
            });
        });
    }, [])

    React.useEffect(() => {
        if (semestreState.id === "") return;
        axios.get(`/curso/especialidad/${idEspecialidad}/semestre/${semestreState.id}`)
            .then(response => {
                if (response.data.length === 0) {
                    setCursoState({
                        id: "",
                        cursos: []
                    })
                } else {
                    setCursoState({
                        id: response.data[0]["idCurso"],
                        cursos: response.data
                    })
                }
            })
            .catch((error) => console.log(error));
    }, [semestreState.id]);

    return (
        <Box sx={{
            display: "grid",
            gridAutoColumns: "1fr",
            gap: 1,
            marginTop: 1,
        }}>
            <Box sx={{ gridRow: 1, gridColumn: "span 12"}}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        select
                        label="Semestre"
                        style={{ width: 100 }}
                        value={semestreState.id}
                        onChange={event => {setSemestreState({...semestreState, id: event.target.value})}}
                        size="small"
                    >
                        {semestreState.semestres.map((semestre) => {
                            return (
                                <MenuItem
                                    key={semestre["idSemestre"]}
                                    value={semestre["idSemestre"]}
                                >
                                    {`${semestre["anhoAcademico"]}-${semestre["periodo"]}`}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                    <TextField
                        select
                        label="Curso"
                        style={{ width: 250 }}
                        value={cursoState.id}
                        onChange={event => {setCursoState({...cursoState, id: event.target.value})}}
                        size="small"
                    >
                        {cursoState.cursos.map((curso) => {
                            return (
                                <MenuItem
                                    key={curso["idCurso"]}
                                    value={curso["idCurso"]}
                                >
                                    {curso["nombre"]}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </Stack>
            </Box>
            <Box sx={{ gridRow: 2, gridColumn: "span 12"}}>
                <ListarAlumnosInscritos idCurso={cursoState.id} idPlanTesis={idPlanTesis}/>
            </Box>
            <Box sx={{ gridRow: 3, gridColumn: "span 12"}}>
                <ListarProfesorInscritos idCurso={cursoState.id} idPlanTesis={idPlanTesis}/>
            </Box>
        </Box>
    )
};

export default ListarTesisInscritos;