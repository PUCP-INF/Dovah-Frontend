// @flow
import * as React from 'react';
import {Box, Button, TextField} from "@mui/material";
import axios from "axios";
import { useSnackbar } from 'notistack'
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import type {Rubrica} from "../../general/DovahTypes";

const GestionRubricas = ({rubrica, setRubrica}: {rubrica: Rubrica, setRubrica: Function}) : React.Node => {
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = () => {
        const newCrit = {
            id: 0,
            titulo: "",
            descripcion: "",
            notaMaxima: 0
        }
        const criterios = [...rubrica.criterios, newCrit];
        setRubrica({...rubrica, criterios: criterios});
    }

    const handleCriteriosChange = (event: SyntheticInputEvent<>, index: number) => {
        let items = [...rubrica.criterios];
        let values = {...items[index]};
        let value: number | string = event.target.value;
        if (event.target.name === "notaMaxima") value = Number.parseFloat(event.target.value)
        values = {...values, [event.target.name]: value}
        items[index] = values;
        setRubrica({...rubrica, criterios: items});
    }

    const handleRemove = async (index: number) => {
        const crit = rubrica.criterios.find((value, i) => i === index);
        if (typeof crit === "undefined") return;
        if (crit.id !== 0) {
            const response = await axios.delete(`/tareas/eliminar/rubricaCriterio/${crit.id}`);
            if (response.data === "") {
                enqueueSnackbar("No se puede eliminar criterio.\nTiene informacion asociada.",
                    {variant: "error", style: { whiteSpace: 'pre-line' }});
                return;
            }
        }
        const criterios = [...rubrica.criterios].filter((value, i) => i !== index);
        setRubrica({...rubrica, criterios: criterios});
        enqueueSnackbar("Criterio eliminado correctamente.", {variant: "success"});
    }

    React.useEffect(() => {
        let notaMaximaTotal = 0;
        rubrica.criterios.forEach(e => {
            if (!isNaN(e.notaMaxima)) notaMaximaTotal += e.notaMaxima;
        });
        setRubrica({...rubrica, notaMaximaTotal: notaMaximaTotal});
    }, [rubrica.criterios])

    return (
        <Box sx={{display: "grid", gridAutoRows: "10px"}}>
            <Typography sx={{gridRow: "span 4"}} variant="h5">
                Rubrica
            </Typography>
            <Typography sx={{gridRow: "span 2"}} variant="body1">
                Nota maxima total: {rubrica.notaMaximaTotal}
            </Typography>
            <Box sx={{gridRow: "span 4", display: "grid", gridAutoColumns: "1fr", alignItems: "center"}}>
                <Typography  variant="h6" sx={{gridRow: "1", gridColumn: "span 1"}}>
                    Lista de criterios
                </Typography>
                <Button onClick={handleClick} sx={{gridRow: "1", gridColumn: "span 1", justifySelf: "flex-end"}}>Agregar Criterio</Button>
            </Box>
            {rubrica.criterios.map((criterio, index) => {
                return (
                    <Box key={index} sx={{gridRow: "span 22", display: "grid", gridAutoRows: "10px"}}>
                        <Box sx={{gridRow: "span 6", display: "grid", gridAutoColumns: "1fr", alignItems: "center", gap: 1}}>
                            <TextField
                                id="titulo"
                                label="Titulo"
                                variant="outlined"
                                fullWidth={true}
                                name="titulo"
                                size="small"
                                value={criterio.titulo}
                                sx={{gridRow: 1, gridColumn: "span 9"}}
                                onChange={(event) => handleCriteriosChange(event, index)}
                            />
                            <TextField
                                id="notaMaxima"
                                label="Nota"
                                variant="outlined"
                                fullWidth={true}
                                name="notaMaxima"
                                size="small"
                                type="number"
                                sx={{gridRow: 1, gridColumn: "span 2"}}
                                value={(!isNaN(criterio.notaMaxima)) ? criterio.notaMaxima:"" }
                                onChange={(event) => handleCriteriosChange(event, index)}
                            />
                            <IconButton sx={{gridRow: 1, gridColumn: "span 1", justifySelf: "flex-end"}} color="error"
                                        onClick={() => handleRemove(index)}>
                                <DeleteIcon/>
                            </IconButton>
                        </Box>
                        <TextField
                            id="descripcion"
                            label="Descripcion"
                            variant="outlined"
                            fullWidth={true}
                            name="descripcion"
                            multiline={true}
                            rows={6}
                            size="small"
                            value={criterio.descripcion}
                            sx={{gridRow: "span 12"}}
                            onChange={(event) => handleCriteriosChange(event, index)}
                        />
                    </Box>
                )
            })}
        </Box>
    )
}

export default GestionRubricas;