import * as React from "react";
import {useLocation} from "react-router-dom";
import GestionRubricas from "../gestion_rubricas/GestionRubricas";
import axios from "axios";
import {DateTimePicker} from "@mui/x-date-pickers";
import {Box, Button, Checkbox, InputAdornment, TextField} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import dayjs from "dayjs"
import {useSnackbar} from 'notistack';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import type {Rubrica, Tarea} from "../../general/DovahTypes";

const GestionTareaDetalle = (): JSX.Element => {
    const location = useLocation();
    const [tarea, setTarea] = React.useState<Tarea>({
        fechaLimite: dayjs.utc().format(),
        nombre: "",
        descripcion: "",
        peso: 0,
        esExposicion: false,
        ...location.state
    });
    const [rolesEncargados, setRolesEncargados] = React.useState(new Set<string>());
    const [fechaLimite, setFechaLimite] = React.useState(dayjs.utc(tarea.fechaLimite));
    const [rubrica, setRubrica] = React.useState<Rubrica>({
        id: 0,
        notaMaximaTotal: 0,
        criterios: []
    });
    const { enqueueSnackbar } = useSnackbar();

    let titulo = "Detalle tarea";
    if (tarea["id"] === 0) titulo = "Nueva tarea";

    const handleTareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTarea({...tarea, [event.target.name]: event.target.value});
    }

    const handleEncargadosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rol = event.target.name;
        let tmp = new Set(rolesEncargados);
        if (!tmp.delete(rol)) {
            tmp.add(rol);
        }
        setRolesEncargados(tmp);
    }

    const validarPeso = () => {
        //linea que solo acepta numero mayores a 0
        let regex = new RegExp("^[1-9][0-9]*$");
        let cadena = tarea.peso.toString().trim();

        if (cadena === "") {
            enqueueSnackbar("El peso ingresado no debe ser vacio.", {variant: "error"});
            return false;
        } else if (!regex.test(tarea.peso.toString())) {
            enqueueSnackbar("El peso ingresado no debe ser 0", {variant: "error"});
            return false;
        } else {
            return true;
        }
    }

    const handleTareaSave = async () => {
        const val = validarPeso();
        if(!val) return;

        let response;
        tarea.rolesEncargados = Array.from(rolesEncargados);
        if (typeof tarea["id"] !== "undefined") {
            response = await axios.post("/tareas/modificar", tarea);
            enqueueSnackbar("Se ha modificado la tarea "+tarea.nombre+" correctamente", {variant: "success"});
        } else {
            response = await axios.post("/tareas", tarea);
            enqueueSnackbar("Se ha guardado "+tarea.nombre, {variant: "success"});
        }
        setRubrica(response.data["rubrica"]);
        setTarea(response.data);
    }

    React.useEffect(() => {
        if (typeof tarea["id"] !== "undefined") {
            axios.get<Tarea>(`/tareas/with_rubrica/${tarea["id"]}`)
                .then(response => {
                    if (typeof response.data["rubrica"] !== "undefined") setRubrica(response.data["rubrica"]);
                    if (response.data["rolesEncargados"] != null) {
                        const tmp = new Set<string>();
                        response.data["rolesEncargados"].forEach(e => {
                            if (typeof e != "string") tmp.add(e["nombre"]);
                        });
                        setRolesEncargados(tmp);
                    }
                    setTarea({...tarea, ...response.data});
                });
        }
    }, []);

    React.useEffect(() => {
        setTarea({...tarea, rubrica, rolesEncargados: Array.from(rolesEncargados), fechaLimite: fechaLimite.format()});
    }, [rubrica, rolesEncargados, fechaLimite]);

    return (
        <Box sx={{display: "grid", gridAutoColumns: "1fr", gap: 1, marginTop: 3}}>
            <Box sx={{display: "grid", gridColumn: "span 12", gridRow: 1, gridAutoColumns: "1fr", alignItems: "center"}}>
                <Typography variant="h5" sx={{gridColumn: "span 8", gridRow: 1}}>
                    {titulo}
                </Typography>
                <Button variant="contained"
                        onClick={handleTareaSave}
                        sx={{gridColumn: "span 4", gridRow: 1, justifySelf: "flex-end"}}>
                    Guardar cambios
                </Button>
            </Box>
            <Box sx={{display: "grid", gridColumn: "span 6", gridRow: 2, gridAutoRows: "10px"}}>
                <Stack direction="row" sx={{gridRow: "span 6"}} spacing={2}>
                    <TextField
                        value={tarea.nombre}
                        onChange={handleTareaChange}
                        name="nombre"
                        fullWidth
                        InputLabelProps={{ shrink: tarea["id"] !== 0 }}
                        size="small"
                        label="Nombre"/>
                    <FormGroup>
                        <FormControlLabel control={
                            <Checkbox
                                checked={tarea.esExposicion}
                                onChange={event => {
                                    setTarea({...tarea, esExposicion: event.target.checked});
                                }}
                                inputProps={{ 'aria-label': 'controlled'}}/>
                        } label="Exposicion"/>
                    </FormGroup>
                </Stack>
                <DateTimePicker
                    label={tarea.esExposicion ? "Fecha Exposicion": "Fecha Limite"}
                    onChange={event => {
                        if (event != null) setFechaLimite(event.utc());
                    }}
                    value={fechaLimite.local()}
                    renderInput={(params) => <TextField {...params} size="small" sx={{gridRow: "span 6"}}/>}
                />
                <TextField
                    value={tarea.descripcion}
                    onChange={handleTareaChange}
                    name="descripcion"
                    multiline
                    minRows={4}
                    InputLabelProps={{ shrink: tarea["id"] !== 0 }}
                    size="small"
                    sx={{gridRow: "span 12"}}
                    label="Descripcion"/>
                <Typography variant="h5" sx={{gridRow: "span 4"}}>
                    Peso de la tarea
                </Typography>
                <TextField
                    value={tarea.peso}
                    onChange={handleTareaChange}
                    type="number"
                    name="peso"
                    InputLabelProps={{ shrink: tarea["id"] !== 0, }}
                    InputProps={{
                        inputMode: 'numeric',
                        inputProps: { min: 0, max: 100},
                    }}
                    size="small"
                    sx={{gridRow: "span 6"}}
                    label="Peso"/>
                <Typography variant="h5" sx={{gridRow: "span 4"}}>
                    Roles encargados de corregir
                </Typography>
                <FormGroup sx={{gridRow: "span 5"}}>
                    <Stack direction="row">
                        <FormControlLabel control={
                            <Checkbox
                                checked={rolesEncargados.has("PROFESOR")}
                                onChange={handleEncargadosChange}
                                inputProps={{ 'aria-label': 'controlled'}}
                                name="PROFESOR" />
                        } label="Profesor"/>
                        <FormControlLabel control={
                            <Checkbox
                                checked={rolesEncargados.has("ASESOR")}
                                onChange={handleEncargadosChange}
                                inputProps={{ 'aria-label': 'controlled'}}
                                name="ASESOR" />
                        } label="Asesor"/>
                        <FormControlLabel control={
                            <Checkbox
                                checked={rolesEncargados.has("JURADO")}
                                onChange={handleEncargadosChange}
                                inputProps={{ 'aria-label': 'controlled'}}
                                name="JURADO" />
                        } label="Jurado"/>
                    </Stack>
                </FormGroup>
            </Box>
            <Box sx={{gridColumn: "span 6", gridRow: 2}}>
                <GestionRubricas rubrica={rubrica} setRubrica={setRubrica}/>
            </Box>
        </Box>
    )
}

export default GestionTareaDetalle;