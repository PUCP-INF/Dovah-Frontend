import React from "react";
import axios from "axios";
import {useAuth} from "../../../componentes/Context";
import {Link as RouterLink, useLocation} from "react-router-dom";
import {Box, Card, CardContent, CardHeader, Link} from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import Typography from "@mui/material/Typography";
import type {Profesor, Tarea, TareaEntrega} from "../../general/DovahTypes";
import Stack from "@mui/material/Stack";

const PendientesPorCorregir = (): JSX.Element => {
    const location = useLocation();
    const curso = location.state;
    const {idCurso} = location.state;
    const {user} = useAuth();

    const [tareas, setTareas] = React.useState<Array<Tarea>>([]);
    const [entregas, setEntregas] = React.useState<Array<Array<TareaEntrega>>>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            const prof = (await axios.get<Profesor>(`/profesor/${user["idUsuario"]}/${idCurso}`)).data;
            const res1 = await axios.get<Array<Tarea>>(`/tareas/encargadas/${idCurso}/${user["rolActual"]}`);
            const entregasPromises = res1.data.map(
                value => axios.get<Array<TareaEntrega>>(`/tareas/entregasEncargadas/${value["id"]}/${prof["id"]}`));
            const entregas = (await Promise.all(entregasPromises)).map(value => value["data"]);
            setTareas(res1.data);
            setEntregas(entregas);
        }

        fetchData()
            .catch(() => {console.log("error")});
    }, []);

    return (
        <Box sx={{
            display: "grid",
            gap: 2,
            gridAutoColumns: "1fr",
            marginTop: 1,
        }}>
            <Box sx={{gridRow: 1, gridColumn: "span 12"}}>
                <div className="pb-10 mt-6 mb-1 grid grid-cols-1">
                    <p className="text-3xl font-sans inline border-b-2  text-blue-pucp flex-auto border-blue-pucp">
                        Entregas pendientes de corregir
                    </p>
                </div>
            </Box>
            {tareas.map((tarea, index) => {
                return (
                    <Card key={tarea["id"]} sx={{gridRow: index + 1 + 1, marginTop: 1, gridColumn: "span 12"}}>
                        <CardHeader
                            avatar={<AssignmentIcon/>}
                            title={tarea["nombre"]}
                            subheader={tarea["descripcion"]}
                        />
                        <CardContent>
                            <Stack spacing={1}>
                                {entregas[index].map(entrega => {
                                    const alumn = entrega["alumno"]["usuario"];
                                    return (
                                        <Link key={entrega["id"]}
                                              component={RouterLink}
                                              to="detalle"
                                              state={{
                                                  tarea: entrega["tarea"],
                                                  curso: curso,
                                                  alumno: entrega["alumno"]
                                              }}>
                                            <Typography variant={"subtitle2"}>
                                                {`${entrega["planTesis"]["titulo"]} - ${alumn["nombre"]} ${alumn["apellido"]}`}
                                            </Typography>
                                        </Link>
                                    )
                                })}
                            </Stack>
                        </CardContent>
                    </Card>
                )
            })}
        </Box>
    )
};

export default PendientesPorCorregir;