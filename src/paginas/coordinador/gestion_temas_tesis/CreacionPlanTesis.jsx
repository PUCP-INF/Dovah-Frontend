// @flow
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import * as React from "react";
import axios from "axios";
import {useAuth} from "../../../componentes/Context";
import MenuItem from "@mui/material/MenuItem";
import {useNavigate} from "react-router-dom";
import { useSnackbar } from 'notistack';
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from '@mui/icons-material/Check';

const CreacionPlanTesis = (): React.Node => {
    const {user} = useAuth();
    const navigate = useNavigate();
    /*ESTILOS */
    const [loading, setLoading] = React.useState(false);
    const [formState, setFormState] = React.useState({
        codigoPUCP: user["codigoPUCP"],
        idAreaEsp: "",
        descripcion: "",
        detallesAdicionales: "",
        titulo: ""
    });
    const [areas, setAreas] = React.useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const handleGuardarTesis = async () => {
        setLoading(true);
        const response = await axios.post("/planTesis/", formState);
        setLoading(false);
        enqueueSnackbar("Se ha mandado tu propuesta de tesis", {variant: "success"});
        navigate("../planTesis/detalle", {state: {id: response.data["id"]}})
    };

    const handleChange = (event: SyntheticInputEvent<>) => {
        setFormState({...formState, [event.target.name]: event.target.value});
    }

    React.useEffect(() => {
        const idEspecialidad = user["especialidad"]["idEspecialidad"];
        axios.get(`/planTesis/areas/${idEspecialidad}`)
            .then(response => setAreas(response.data));
    }, []);

    return (
        <>
            <Box sx={{
                display: 'grid',
                gridAutoColumns: '1fr',
                gap: 1,
                gridAutoRows: '20px',
                marginTop: 5
            }}>
                <Box sx={{gridRow: '1', gridColumn: 'span 1'}}></Box>
                <Box sx={{ gridRow: '1', gridColumn: 'span 6', display: "grid", gridAutoColumns: '1fr', gap: 1, justifyContent: "center" }}>
                    <Typography variant={"h5"} sx={{gridRow: '1', gridColumn: 'span 9', mt:'5'}}>
                        Detalle de Propuesta de Tesis
                    </Typography>

                    <LoadingButton
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<CheckIcon/>}
                                component="label"
                                variant="contained"
                                onClick={handleGuardarTesis}
                                sx={{ gridRow: "1", gridColumn: "span 3", justifySelf: "end" }}
                    >
                    Guardar Cambios
                    </LoadingButton>

                    <TextField
                        label="Titulo"
                        variant="outlined"
                        name="titulo"
                        fullWidth={true}
                        size={"small"}
                        value={formState.titulo}
                        onChange={handleChange}
                        sx={{gridRow: '2', gridColumn: 'span 8'}}
                    />
                    <TextField
                        label="Area"
                        name="idAreaEsp"
                        variant="outlined"
                        fullWidth
                        select
                        size={"small"}
                        value={formState.idAreaEsp}
                        onChange={handleChange}
                        sx={{gridRow: '2', gridColumn: 'span 4'}}
                    >
                        {
                            areas.map(area => {
                                return (
                                    <MenuItem key={area["id"]} value={area["id"]}>
                                        {area["nombre"]}
                                    </MenuItem>
                                )
                            })
                        }
                    </TextField>
                    <TextField
                        label="Descripcion"
                        variant="outlined"
                        name="descripcion"
                        fullWidth={true}
                        multiline={true}
                        rows="10"
                        size={"small"}
                        value={formState.descripcion}
                        onChange={handleChange}
                        sx={{gridRow: '3', gridColumn: 'span 12'}}
                    />
                    <TextField
                        label="Detalle Adicional"
                        variant="outlined"
                        name="detallesAdicionales"
                        fullWidth={true}
                        multiline={true}
                        rows="5"
                        size={"small"}
                        value={formState.detallesAdicionales}
                        onChange={handleChange}
                        sx={{gridRow: '4', gridColumn: 'span 12'}}
                    />
                </Box>
                <Box sx={{gridRow: '1', gridColumn: 'span 1'}}></Box>
            </Box>
        </>
    )
}

export default CreacionPlanTesis;