import * as React from "react";
import {Avatar, Box, Button, Card, CardActions, CardContent, CardHeader} from "@mui/material";
import Typography from "@mui/material/Typography";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import axios from "axios";
import {useAuth} from "../../../componentes/Context";
import dayjs from "dayjs";
import CommentBox from "../../general/CommentBox";
import Stack from "@mui/material/Stack";
import type {Criterio, Curso, Profesor, Retroalimentacion, TareaEntrega} from "../../general/DovahTypes";

const DetalleRetroalimentacion = (
    {tareaEntrega, curso, reload}:
        {tareaEntrega: TareaEntrega | null, curso: Curso, reload: Function}): JSX.Element => {
    const {user} = useAuth();
    const [profesor, setProfesor] = React.useState<Profesor | null>(null);
    const [retroalimentaciones, setRetroalimentaciones] = React.useState<Array<Retroalimentacion>>([]);
    const [criterios, setCriterios] = React.useState<Map<number,Array<Criterio>>>(new Map());

    const calificado = React.useMemo(() => {
        if (profesor == null) return true;
        for (const retro of retroalimentaciones) {
            if (retro.profesor.usuario.idUsuario === user["idUsuario"]) return true;
        }
        return false;
    }, [retroalimentaciones]);

    const columns: GridColDef<Criterio>[] = [
        {
            field: "titulo",
            headerName: "Titulo",
            flex: 0.5,
            sortable: false,
        },
        {
            field: "descripcion",
            headerName: "Descripcion",
            flex: 1,
            sortable: false,
        },
        {
            field: "notaMaxima",
            headerName: "Nota Maxima",
            width: 110,
            headerAlign: 'center',
            align: "center",
            sortable: false,
        },
        {
            field: "notaObtenida",
            headerName: "Nota Obtenida",
            width: 120,
            editable: user["rolActual"] !== "alumno",
            headerAlign: 'center',
            align: "center",
            sortable: false,
            type: "number",
            valueSetter: params => {
                return {...params.row, notaObtenida: Number(params.value)};
            }
        }
    ]

    const processRowUpdate = async (newRow: Criterio, oldRow: Criterio, idRetroalimentacion: number) => {
        const newCrit = new Map(criterios);
        let tmp = newCrit.get(idRetroalimentacion);
        if (typeof tmp === "undefined") return newRow;
        tmp = tmp.map(value => {
            return value["id"] === newRow["id"] ? newRow: value;
        })
        newCrit.set(idRetroalimentacion, tmp);
        setCriterios(newCrit);
        return newRow;
    }

    const onProcessRowUpdateError = (error: Error) => {
        console.log("error!", error)
    }

    const handleModificarRetroalimentacion = async (idRetroalimentacion: number) => {
        const notas = [];
        const crit = criterios.get(idRetroalimentacion);
        if (crit == null) return;
        for (const criterio of crit) {
            notas.push({
                idCriterio: criterio.id,
                nota: criterio.notaObtenida
            })
        }
        const json = {
            idRetroalimentacion: idRetroalimentacion,
            notas: notas,
            documentos: []
        }
        await axios.post("/tareas/modificarRetroalimentacion", json);
        await getRetroalimentaciones();
        await reload();
    }

    const getRetroalimentaciones = async () => {
        if (tareaEntrega == null) return;
        const response = await axios.get(`/tareas/entregas/${tareaEntrega["id"]}/retroalimentaciones`);
        // mantener retro del actual profesor al principio
        if (profesor != null) {
            const index = response.data.findIndex((e: Retroalimentacion) => e["profesor"]["id"] === profesor["id"]);
            if (index !== -1) {
                const tmp = response.data[index];
                response.data[index] = response.data[0];
                response.data[0] = tmp;
            }
        }
        const tmp = new Map();
        for (const retro of response.data) {
            const crit = [...tareaEntrega["tarea"]["rubrica"]["criterios"]];
            tmp.set(retro["id"], crit.map(value => {
                const tmpval = {...value};
                let nota = 0;
                if (Object.keys(retro["notasObtenidas"]).length !== 0) {
                    nota = retro["notasObtenidas"][tmpval["id"]];
                }
                tmpval["notaObtenida"] = nota;
                return tmpval;
            }));
        }
        setCriterios(tmp);
        setRetroalimentaciones(response.data);
    }

    const getData = async () => {
        if (user["rolActual"] === "alumno") return;
        const res1 = await axios.get(`/profesor/${user["idUsuario"]}/${curso["idCurso"]}`);
        setProfesor(res1.data);
    }

    const crearRetroalimentacion = async () => {
        if (profesor == null || tareaEntrega == null) return;
        const json = {
            idTareaEntrega: tareaEntrega.id,
            idProfesor: profesor.id
        }
        await axios.post("/tareas/agregarRetroalimentacion", json);
        await getRetroalimentaciones();
    }

    React.useEffect(() => {
        getRetroalimentaciones().catch();
    }, [profesor])

    React.useEffect(() => {
        getData().catch();
        getRetroalimentaciones().catch();
    }, [tareaEntrega]);

    if (tareaEntrega == null) return <></>;

    const necesitaVistoBueno = tareaEntrega.tarea.necesitaVistoBueno;

    if (retroalimentaciones.length === 0) {
        return (
            <Box sx={{display: "grid", gridAutoColumns: "1fr", gap: 1, marginBottom: 5}}>
                <Stack sx={{gridColumn: "span 12", gridRow: 1}} direction="row" spacing={2} justifyContent="flex-start" alignItems="center">
                    <Typography variant="h5">
                        Retroalimentaciones
                    </Typography>
                    {(["profesor", "jurado", "asesor"].includes(user.rolActual)) &&
                        (!necesitaVistoBueno || (necesitaVistoBueno && tareaEntrega.vistoBueno && user.rolActual !== "asesor")) && (
                        <Button onClick={crearRetroalimentacion}>Agregar Retroalimentacion</Button>
                    )}
                </Stack>
                <Typography sx={{gridColumn: "span 12", gridRow: 2}}>
                    {(!necesitaVistoBueno || (necesitaVistoBueno && tareaEntrega.vistoBueno)) && "No hay retroalimentaciones"}
                    {(necesitaVistoBueno && !tareaEntrega.vistoBueno) && "Es necesario el visto bueno del asesor para hacer una retroalimentacion"}
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{display: "grid", gridAutoColumns: "1fr", gap: 1, marginBottom: 5}}>
            <Stack sx={{gridColumn: "span 12", gridRow: 1}} direction="row" spacing={2} justifyContent="flex-start" alignItems="center">
                <Typography variant="h5">
                    Retroalimentaciones
                </Typography>
                {!calificado && (!necesitaVistoBueno || (necesitaVistoBueno && tareaEntrega.vistoBueno && user.rolActual !== "asesor")) && (
                    <Button onClick={crearRetroalimentacion}>Agregar Retroalimentacion</Button>
                )}
            </Stack>
            <Box sx={{display: "grid", gridColumn: "span 12", gridRow: 2, gap: 2, marginBottom: 4}}>
                {
                    retroalimentaciones.map((retro, index) => {
                        const prof = retro.profesor;
                        const nombre = `${prof.usuario.nombre} ${prof.usuario.apellido}`;
                        const dt = dayjs(retro.fechaCreacion)
                        const enableEditing = prof["usuario"]["idUsuario"] === user["idUsuario"];
                        return (
                            <Card sx={{gridColumn: "span 12", gridRow: index + 1}} key={retro["id"]}>
                                <CardHeader
                                    avatar={
                                        <Avatar alt={nombre} src={prof["usuario"]["picture"]}/>
                                    }
                                    title={nombre}
                                    subheader={`Fecha de creacion: ${dt.format("DD-MM-YYYY hh:mm A")}`}
                                />
                                <CardContent>
                                    
                                    <Typography variant="body1" gutterBottom>
                                        Nota final: {retro["notaFinal"]}
                                    </Typography>
                                    <Typography variant="body1">
                                        Rubrica:
                                    </Typography>
                                    <Typography variant="caption" gutterBottom>
                                        Recuerde darle un 'Enter' después de colocar el puntaje en los criterios
                                    </Typography>
                                    <DataGrid
                                        rows={criterios.get(retro["id"]) ?? []}
                                        columns={columns}
                                        disableSelectionOnClick={true}
                                        experimentalFeatures={{ newEditingApi: enableEditing }}
                                        autoHeight
                                        getRowHeight={() => 'auto'}
                                        hideFooter
                                        processRowUpdate={(newRow, oldRow) => processRowUpdate(newRow, oldRow, retro["id"])}
                                        onProcessRowUpdateError={onProcessRowUpdateError}
                                        disableColumnSelector
                                        disableColumnMenu
                                        disableColumnFilter
                                        disableIgnoreModificationsIfProcessingProps
                                    />
                                </CardContent>
                                {enableEditing && (
                                    <CardActions sx={{justifyContent: "flex-end"}}>
                                        <Button
                                            onClick={() => handleModificarRetroalimentacion(retro["id"])}>Guardar</Button>
                                    </CardActions>
                                )}
                            </Card>
                        )
                    })
                }
            </Box>
            <Box sx={{gridColumn: "span 12", gridRow: 3, display: "grid", gridAutoColumns: "1fr", gap: 1}}>
                <Typography variant="h5">
                    Comentarios
                </Typography>
                <CommentBox hiloUUID={tareaEntrega.hilo.uuid} enableDocs={true}/>
            </Box>
        </Box>
    )
}

export default DetalleRetroalimentacion;
